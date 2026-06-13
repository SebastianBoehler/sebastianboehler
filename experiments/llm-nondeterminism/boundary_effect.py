"""Toy experiment for the blog claim: nondeterminism is a boundary effect.

The model here is intentionally small. A prompt state receives tiny numeric
perturbations. If the perturbed state crosses a decision boundary, the first
token branches. This backs the visual claim without pretending to inspect a real
LLM's hidden state.
"""

from __future__ import annotations

import argparse
import json
import math
from dataclasses import asdict, dataclass
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt


@dataclass(frozen=True)
class ExperimentConfig:
    runs: int
    margin: float
    noise: float
    seed: int
    out: str


def main() -> None:
    config = parse_args()
    output_dir = Path(config.out)
    output_dir.mkdir(parents=True, exist_ok=True)

    points = simulate_runs(config)
    branch_rate = float(points["branch"].mean())
    analytic_rate = gaussian_tail_probability(config.margin, config.noise)
    summary = {
        **asdict(config),
        "stable_runs": int((~points["branch"]).sum()),
        "branched_runs": int(points["branch"].sum()),
        "observed_branch_rate": branch_rate,
        "analytic_branch_rate": analytic_rate,
        "interpretation": "branches appear when perturbations cross the decision boundary",
    }

    figure_path = output_dir / "boundary-effect.png"
    svg_path = output_dir / "boundary-effect.svg"
    summary_path = output_dir / "summary.json"

    render_figure(points, config, figure_path, svg_path)
    summary_path.write_text(json.dumps(summary, indent=2) + "\n")

    print(json.dumps(summary, indent=2))
    print(f"wrote {figure_path}")
    print(f"wrote {svg_path}")
    print(f"wrote {summary_path}")


def parse_args() -> ExperimentConfig:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runs", type=int, default=600, help="number of repeated same-prompt runs")
    parser.add_argument("--margin", type=float, default=0.75, help="distance from prompt state to decision boundary")
    parser.add_argument("--noise", type=float, default=0.55, help="standard deviation of implementation perturbation")
    parser.add_argument("--seed", type=int, default=7, help="random seed for reproducible toy runs")
    parser.add_argument("--out", default="experiments/llm-nondeterminism/runs/boundary-effect", help="output directory")
    args = parser.parse_args()

    if args.runs < 1:
        parser.error("--runs must be positive")
    if args.noise < 0:
        parser.error("--noise must be non-negative")

    return ExperimentConfig(runs=args.runs, margin=args.margin, noise=args.noise, seed=args.seed, out=args.out)


def simulate_runs(config: ExperimentConfig) -> np.ndarray:
    rng = np.random.default_rng(config.seed)
    perturbation = rng.normal(loc=0.0, scale=config.noise, size=(config.runs, 2))
    dtype = [("x", "f8"), ("y", "f8"), ("branch", "?")]
    points = np.empty(config.runs, dtype=dtype)
    points["x"] = perturbation[:, 0]
    points["y"] = perturbation[:, 1] * 0.72
    points["branch"] = points["x"] > config.margin
    return points


def gaussian_tail_probability(margin: float, noise: float) -> float:
    if noise == 0:
        return 1.0 if margin < 0 else 0.0
    z = margin / (noise * math.sqrt(2.0))
    return 0.5 * math.erfc(z)


def render_figure(points: np.ndarray, config: ExperimentConfig, png_path: Path, svg_path: Path) -> None:
    plt.rcParams.update({
        "axes.spines.top": False,
        "axes.spines.right": False,
        "font.size": 10,
    })
    fig, axes = plt.subplots(1, 2, figsize=(11, 4.6), constrained_layout=True)
    draw_cloud(axes[0], points, config)
    draw_heatmap(axes[1])
    fig.suptitle("Boundary effect: tiny perturbations matter near near-tied continuations", fontsize=13)
    fig.savefig(png_path, dpi=220, bbox_inches="tight", facecolor="white")
    fig.savefig(svg_path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def draw_cloud(ax: plt.Axes, points: np.ndarray, config: ExperimentConfig) -> None:
    stable = points[~points["branch"]]
    branched = points[points["branch"]]
    ax.axvline(config.margin, color="#111827", linestyle=(0, (4, 4)), linewidth=1.4, label="decision boundary")
    ax.scatter(stable["x"], stable["y"], s=20, color="#2563eb", alpha=0.55, label="same first token")
    ax.scatter(branched["x"], branched["y"], s=24, color="#f59e0b", alpha=0.72, label="alternate first token")
    ax.scatter([0], [0], s=90, color="#111827", label="prompt state", zorder=5)
    ax.annotate("small serving perturbation cloud", xy=(0, 0), xytext=(-2.4, 1.6), arrowprops={"arrowstyle": "->", "color": "#64748b"}, color="#334155")
    ax.annotate("branch only after crossing", xy=(config.margin, 0.35), xytext=(config.margin + 0.35, 1.9), arrowprops={"arrowstyle": "->", "color": "#64748b"}, color="#334155")
    ax.set_title("One prompt, many repeated runs")
    ax.set_xlabel("logit-margin direction")
    ax.set_ylabel("irrelevant hidden direction")
    ax.set_xlim(-3.0, 3.0)
    ax.set_ylim(-2.2, 2.2)
    ax.grid(alpha=0.18)
    ax.legend(loc="lower left", frameon=False)


def draw_heatmap(ax: plt.Axes) -> None:
    margins = np.linspace(0.0, 2.5, 120)
    noises = np.linspace(0.02, 1.6, 120)
    grid = np.array([[gaussian_tail_probability(margin, noise) for margin in margins] for noise in noises])
    image = ax.imshow(grid, origin="lower", aspect="auto", extent=[margins.min(), margins.max(), noises.min(), noises.max()], cmap="magma", vmin=0, vmax=0.5)
    contour = ax.contour(margins, noises, grid, levels=[0.01, 0.05, 0.15, 0.3], colors="white", linewidths=0.8, alpha=0.85)
    ax.clabel(contour, fmt=lambda value: f"{value:.0%}", fontsize=8)
    ax.set_title("Branch rate is noise divided by margin")
    ax.set_xlabel("top-2 logit margin")
    ax.set_ylabel("perturbation scale")
    colorbar = plt.colorbar(image, ax=ax, fraction=0.046, pad=0.04)
    colorbar.set_label("probability of first-token branch")


if __name__ == "__main__":
    main()
