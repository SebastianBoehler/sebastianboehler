"""Plot helpers for prompt_duplication_effect.py."""

from __future__ import annotations

from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def render_figure(conditions: dict, base_tokens: list[str], candidate_labels: list[str], png_path: Path, svg_path: Path) -> None:
    plt.rcParams.update({"axes.spines.top": False, "axes.spines.right": False, "font.size": 9})
    fig, axes = plt.subplot_mosaic([["path", "probs"], ["path", "attention"]], figsize=(11.5, 6.4), constrained_layout=True)
    draw_paths(axes["path"], conditions, base_tokens)
    draw_probabilities(axes["probs"], conditions, candidate_labels)
    draw_attention(axes["attention"], conditions["duplicated"], base_tokens)
    fig.suptitle("Prompt duplication: second-pass context changes the final readout", fontsize=13)
    fig.savefig(png_path, dpi=220, bbox_inches="tight", facecolor="white")
    fig.savefig(svg_path, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def draw_paths(ax: plt.Axes, conditions: dict, base_tokens: list[str]) -> None:
    all_states = np.vstack([result.states for result in conditions.values()])
    projected = project_2d(all_states)
    offset = 0
    colors = {"single": "#2563eb", "duplicated": "#dc2626", "padding": "#64748b"}

    for label, result in conditions.items():
        path = projected[offset : offset + len(result.states)]
        offset += len(result.states)
        ax.plot(path[:, 0], path[:, 1], color=colors[label], linewidth=2, alpha=0.85, label=label)
        ax.scatter(path[-1, 0], path[-1, 1], color=colors[label], s=55, zorder=4)
        if label == "duplicated":
            boundary = len(base_tokens)
            ax.scatter(path[boundary, 0], path[boundary, 1], color="#f97316", s=42, zorder=4)
            ax.annotate(
                "copy 2 starts",
                xy=path[boundary],
                xytext=(path[boundary, 0] + 0.8, path[boundary, 1] + 0.5),
                arrowprops={"arrowstyle": "->", "color": "#64748b"},
                color="#334155",
            )

    ax.set_title("Hidden-state trajectory proxy")
    ax.set_xlabel("PC1")
    ax.set_ylabel("PC2")
    ax.grid(alpha=0.16)
    ax.legend(frameon=False, loc="best")


def draw_probabilities(ax: plt.Axes, conditions: dict, candidate_labels: list[str]) -> None:
    x = np.arange(len(candidate_labels))
    width = 0.24
    colors = {"single": "#2563eb", "duplicated": "#dc2626", "padding": "#64748b"}

    for index, condition in enumerate(["single", "duplicated", "padding"]):
        values = [conditions[condition].probabilities[label] for label in candidate_labels]
        ax.bar(x + (index - 1) * width, values, width=width, color=colors[condition], label=condition)

    ax.set_title("Toy next-token distribution")
    ax.set_xticks(x)
    ax.set_xticklabels(candidate_labels)
    ax.set_ylim(0, 1)
    ax.set_ylabel("probability")
    ax.legend(frameon=False)


def draw_attention(ax: plt.Axes, duplicated, base_tokens: list[str]) -> None:
    weights = duplicated.attention[-1]
    masses = [
        weights[: len(base_tokens)].sum(),
        weights[len(base_tokens) : 2 * len(base_tokens)].sum(),
        weights[-1],
    ]
    ax.bar(["copy 1", "copy 2", "answer"], masses, color=["#f59e0b", "#dc2626", "#111827"])
    ax.set_ylim(0, 1)
    ax.set_ylabel("attention mass")
    ax.set_title("Duplicated prompt readout attention")


def project_2d(values: np.ndarray) -> np.ndarray:
    centered = values - values.mean(axis=0, keepdims=True)
    _, _, vt = np.linalg.svd(centered, full_matrices=False)
    return centered @ vt[:2].T
