"use client"

import { useId, useMemo, useState } from "react"
import { ConceptLab, type LabInsight } from "@/components/blog/visuals/ConceptLab"
import { SegmentedChoice } from "@/components/blog/visuals/VisualPrimitives"
import { Chart, ChartTable, Legend, XAxis, YAxis } from "@/components/blog/visuals/chart/Chart"
import { Slider } from "@/components/blog/visuals/chart/Slider"
import {
  GRID,
  LAMBDA_MAX,
  MAX_ROUNDS,
  MAX_TREES,
  N_TRAIN,
  N_VALID,
  PLOT_RANGE,
  TRAIN_RANGE,
  countLeaves,
  fitForest,
  fitOls,
  fitRegressionTree,
  makeDataset,
  predictForest,
  predictOls,
  predictTree,
  rangeRmse,
  rmse,
  runBoosting,
  targets,
  trueFunction,
} from "@/lib/viz/boosting"
import { linePath, linear, formatNumber } from "@/lib/viz/scale"

type ModelId = "linear" | "tree" | "forest" | "boosting"

const MODELS = [
  { id: "linear", label: "Linear" },
  { id: "tree", label: "Tree" },
  { id: "forest", label: "Forest" },
  { id: "boosting", label: "Boosting" },
] as const

const MODEL_NAMES: Record<ModelId, string> = {
  linear: "linear model (least squares)",
  tree: "single regression tree",
  forest: "random forest",
  boosting: "gradient boosting",
}

const SHORT_NAMES: Record<ModelId, string> = {
  linear: "line",
  tree: "tree",
  forest: "forest",
  boosting: "boosting",
}

const LEGEND_NAMES: Record<ModelId, string> = {
  linear: "Linear fit",
  tree: "Single tree",
  forest: "Random forest",
  boosting: "Boosting model F",
}

const SEEDS = [11, 42, 7, 21, 99, 5] as const
const Y_DOMAIN: readonly [number, number] = [-4.5, 4.5]
const halo = {
  paintOrder: "stroke",
  stroke: "var(--viz-surface)",
  strokeWidth: 3,
  strokeLinejoin: "round",
} as const

const fix = (v: number, d = 2) => v.toFixed(d)

/**
 * Round pixel coordinates to 0.01 px. Math.sin / Math.log can differ in the last bit between the
 * server's and the browser's JS engine; unrounded attributes would then trigger a hydration mismatch.
 */
const snap = (scale: (v: number) => number) => (v: number) => Math.round(scale(v) * 100) / 100
const r2 = (v: number) => Math.round(v * 100) / 100

export default function BoostingPlaygroundVisual() {
  const clipId = `plot-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const [model, setModel] = useState<ModelId>("boosting")
  const [sigma, setSigma] = useState(0.35)
  const [sampleIndex, setSampleIndex] = useState(0)
  const [treeDepth, setTreeDepth] = useState(4)
  const [forestSize, setForestSize] = useState(30)
  const [rounds, setRounds] = useState(30)
  const [eta, setEta] = useState(0.2)
  const [boostDepth, setBoostDepth] = useState(3)
  const [lambda, setLambda] = useState(0)

  const seed = SEEDS[sampleIndex % SEEDS.length]
  const train = useMemo(() => makeDataset(seed, N_TRAIN), [seed])
  const valid = useMemo(() => makeDataset(seed + 1000, N_VALID), [seed])
  const y = useMemo(() => targets(train, sigma), [train, sigma])
  const vy = useMemo(() => targets(valid, sigma), [valid, sigma])

  const linearFit = useMemo(() => fitOls(train.x, y), [train, y])
  const treeFit = useMemo(
    () => (model === "tree" ? fitRegressionTree(train.x, y, { maxDepth: treeDepth }) : null),
    [model, train, y, treeDepth],
  )
  const forestFit = useMemo(
    () => (model === "forest" ? fitForest(train.x, y, { trees: MAX_TREES, maxDepth: treeDepth, seed: seed + 5000 }) : null),
    [model, train, y, treeDepth, seed],
  )
  const boostRun = useMemo(
    () =>
      model === "boosting"
        ? runBoosting({ x: train.x, y }, { x: valid.x, y: vy }, { rounds: MAX_ROUNDS, eta, maxDepth: boostDepth, lambda })
        : null,
    [model, train, valid, y, vy, eta, boostDepth, lambda],
  )

  const view = useMemo(() => {
    const evalAt = (f: (x: number) => number) => ({
      train: train.x.map(f),
      valid: valid.x.map(f),
      grid: GRID.map(f),
    })
    if (model === "linear") return { ...evalAt((x) => predictOls(linearFit, x)), prev: null as ArrayLike<number> | null }
    if (model === "tree" && treeFit) return { ...evalAt((x) => predictTree(treeFit, x)), prev: null }
    if (model === "forest" && forestFit) return { ...evalAt((x) => predictForest(forestFit, x, forestSize)), prev: null }
    if (boostRun) {
      const m = Math.min(rounds, MAX_ROUNDS)
      return {
        train: boostRun.train[m],
        valid: boostRun.valid[m],
        grid: boostRun.grid[m],
        prev: m > 0 ? boostRun.grid[m - 1] : null,
      }
    }
    return { ...evalAt(() => 0), prev: null }
  }, [model, linearFit, treeFit, forestFit, boostRun, forestSize, rounds, train, valid])

  const trainRmse = rmse(view.train, y)
  const validRmse = rmse(view.valid, vy)
  const zone = rangeRmse(view.grid, GRID)

  const leafCount = treeFit ? countLeaves(treeFit) : 0
  const bestRound = boostRun?.bestRound ?? 0
  const bestValid = boostRun ? boostRun.validRmse[bestRound] : 0
  const m = Math.min(rounds, MAX_ROUNDS)

  const summary =
    `${MODEL_NAMES[model]}${model === "boosting" ? `, ${m} rounds` : model === "forest" ? `, ${forestSize} trees` : model === "tree" ? `, depth ${treeDepth}` : ""}: ` +
    `training RMSE ${fix(trainRmse)}, validation RMSE ${fix(validRmse)}. ` +
    `Error against the true function: ${fix(zone.inside)} inside the training range, ${fix(zone.outside)} outside.` +
    (model === "boosting" ? ` Validation RMSE is lowest at round ${bestRound}.` : "")

  const tableRows = useMemo(() => {
    const rows: (string | number)[][] = []
    for (let i = 0; i < GRID.length; i += 20) {
      rows.push([formatNumber(GRID[i], 1), fix(trueFunction(GRID[i])), fix(view.grid[i])])
    }
    return rows
  }, [view])

  const insights = buildInsights({
    model,
    lambda,
    leafCount,
    rounds: m,
    bestRound,
    bestValid,
    trainNow: boostRun ? boostRun.trainRmse[m] : 0,
    validNow: boostRun ? boostRun.validRmse[m] : 0,
    validEnd: boostRun ? boostRun.validRmse[MAX_ROUNDS] : 0,
  })

  const chartLabel =
    `Scatter plot of ${N_TRAIN} training points and ${N_VALID} validation points over x from ${PLOT_RANGE[0]} to ${PLOT_RANGE[1]}, ` +
    `with the ${MODEL_NAMES[model]} prediction and the dashed true function. ` +
    `Error against the true function is ${fix(zone.inside)} inside the training range 0 to 10 and ${fix(zone.outside)} outside it.`

  return (
    <ConceptLab
      title="Boosting playground"
      description="Fit four models to the same noisy data. Then turn the boosting knobs and watch where validation error stops improving."
      methodology="Toy data · computed live"
      headerActions={<SegmentedChoice label="Model" choices={MODELS} value={model} onChange={setModel} />}
      insights={insights}
      caption={
        <>
          Synthetic data: {N_TRAIN} training and {N_VALID} validation points from y = 1.2 sin x + 0.5·[x &gt; 6.5] + 0.25x − 1
          plus Gaussian noise. The models are a from-scratch one-feature implementation. Boosting here is plain gradient
          boosting for squared error with XGBoost-style regularised leaf weights (λ). It is not the full XGBoost system: no
          histogram splits, no column sampling, no sparsity handling, no distributed training. A forest in one dimension has no
          feature subsampling, so its only randomness is the bootstrap resample. Training and validation RMSE include the
          noise, so they cannot fall below σ; the in-range and out-of-range RMSE compare to the noiseless true function.
        </>
      }
    >
      <div className="space-y-5">
        <Legend
          items={[
            { label: "Training data", series: "ink", kind: "dot" },
            { label: "Validation data", series: "muted", kind: "dot" },
            { label: "True function", series: "ink", kind: "dash" },
            { label: LEGEND_NAMES[model], series: 1, kind: "line" },
            ...(model === "boosting"
              ? ([
                  { label: "Residual: point to model", series: "muted", kind: "line" },
                  { label: "Model one round earlier", series: 2, kind: "line" },
                ] as const)
              : []),
          ]}
        />

        <Chart
          label={chartLabel}
          height={320}
          margin={{ right: 56, left: 44 }}
        >
          {({ width, height }) => {
            const xScale = linear(PLOT_RANGE, [0, width])
            const yScale = linear(Y_DOMAIN, [height, 0])
            const xs = snap(xScale)
            const ys = snap(yScale)
            const showResiduals = model === "boosting"
            let worst = 0
            if (showResiduals) {
              train.x.forEach((_, i) => {
                if (Math.abs(y[i] - view.train[i]) > Math.abs(y[worst] - view.train[worst])) worst = i
              })
            }
            const worstX = xs(train.x[worst])
            const worstMid = (ys(y[worst]) + ys(view.train[worst])) / 2
            const flip = worstX > width * 0.55
            const last = GRID.length - 1
            let modelLabelY = ys(view.grid[last])
            let truthLabelY = ys(trueFunction(GRID[last]))
            if (Math.abs(modelLabelY - truthLabelY) < 14) {
              const mid = (modelLabelY + truthLabelY) / 2
              if (modelLabelY <= truthLabelY) {
                modelLabelY = mid - 8
                truthLabelY = mid + 8
              } else {
                modelLabelY = mid + 8
                truthLabelY = mid - 8
              }
            }
            const clampY = (v: number) => r2(Math.max(8, Math.min(height - 8, v)))

            return (
              <>
                <defs>
                  <clipPath id={clipId}>
                    <rect x={0} y={0} width={width} height={height} />
                  </clipPath>
                </defs>
                <rect x={0} y={0} width={xs(TRAIN_RANGE[0])} height={height} className="viz-fill-muted viz-wash" />
                <rect
                  x={xs(TRAIN_RANGE[1])}
                  y={0}
                  width={width - xs(TRAIN_RANGE[1])}
                  height={height}
                  className="viz-fill-muted viz-wash"
                />
                <YAxis scale={yScale} grid gridWidth={width} label="y" />
                <XAxis scale={xScale} y={height} ticks={[-1, 0, 2, 4, 6, 8, 10, 12]} label="x" />
                <text
                  className="viz-text"
                  style={halo}
                  transform={`translate(${xs(PLOT_RANGE[0]) + (xs(TRAIN_RANGE[0]) - xs(PLOT_RANGE[0])) / 2 + 4},6) rotate(90)`}
                  aria-hidden="true"
                >
                  outside training range
                </text>
                <text
                  className="viz-text"
                  style={halo}
                  transform={`translate(${xs(TRAIN_RANGE[1]) + (width - xs(TRAIN_RANGE[1])) / 2 + 4},6) rotate(90)`}
                  aria-hidden="true"
                >
                  outside training range
                </text>

                <g clipPath={`url(#${clipId})`}>
                  {showResiduals
                    ? train.x.map((x, i) => (
                        <line
                          key={i}
                          x1={xs(x)}
                          x2={xs(x)}
                          y1={ys(y[i])}
                          y2={ys(view.train[i])}
                          className="viz-stroke-muted"
                          strokeWidth={1.5}
                          opacity={0.85}
                        />
                      ))
                    : null}
                  <path
                    d={linePath(GRID.map((x) => [xs(x), ys(trueFunction(x))] as const))}
                    className="viz-line viz-stroke-ink"
                    strokeWidth={1.25}
                    strokeDasharray="5 4"
                  />
                  {view.prev ? (
                    <path
                      d={linePath(GRID.map((x, i) => [xs(x), ys(view.prev![i])] as const))}
                      className="viz-line viz-stroke-2"
                      strokeWidth={1.5}
                      opacity={0.75}
                    />
                  ) : null}
                  <path
                    d={linePath(GRID.map((x, i) => [xs(x), ys(view.grid[i])] as const))}
                    className="viz-line viz-stroke-1"
                  />
                  {valid.x.map((x, i) => (
                    <circle
                      key={`v${i}`}
                      cx={xs(x)}
                      cy={ys(vy[i])}
                      r={3}
                      fill="none"
                      className="viz-stroke-muted"
                      strokeWidth={1.25}
                    />
                  ))}
                  {train.x.map((x, i) => (
                    <circle key={`t${i}`} cx={xs(x)} cy={ys(y[i])} r={4} className="viz-dot viz-fill-ink" />
                  ))}
                </g>

                {showResiduals ? (
                  <text
                    className="viz-text-strong"
                    style={halo}
                    x={worstX + (flip ? -7 : 7)}
                    y={clampY(worstMid)}
                    dy="0.32em"
                    textAnchor={flip ? "end" : "start"}
                  >
                    what the next tree must fix
                  </text>
                ) : null}
                <text className="viz-text-strong" x={width + 6} y={clampY(modelLabelY)} dy="0.32em">
                  {SHORT_NAMES[model]}
                </text>
                <text className="viz-text-strong" x={width + 6} y={clampY(truthLabelY)} dy="0.32em">
                  true f
                </text>
              </>
            )
          }}
        </Chart>

        {boostRun ? (
          <>
            <Chart
              label={`Training and validation RMSE for each boosting round from 0 to ${MAX_ROUNDS}. Training RMSE falls steadily to ${fix(boostRun.trainRmse[MAX_ROUNDS])}. Validation RMSE is lowest at round ${bestRound} (${fix(bestValid)}) and ends at ${fix(boostRun.validRmse[MAX_ROUNDS])}. The current round is ${m}.`}
              height={150}
              margin={{ top: 14, bottom: 32, right: 74, left: 44 }}
            >
              {({ width, height }) => {
                const xScale = linear([0, MAX_ROUNDS], [0, width])
                const top = Math.max(boostRun.trainRmse[0], boostRun.validRmse[0]) * 1.05
                const yScale = linear([0, top], [height, 0])
                const xs = snap(xScale)
                const ys = snap(yScale)
                const trainPts = boostRun.trainRmse.map((v, i) => [xs(i), ys(v)] as const)
                const validPts = boostRun.validRmse.map((v, i) => [xs(i), ys(v)] as const)
                const bx = xs(bestRound)
                const by = ys(bestValid)
                const anchorEnd = bx > width * 0.6
                return (
                  <>
                    <YAxis scale={yScale} ticks={yScale.ticks(3)} grid gridWidth={width} label="RMSE" />
                    <XAxis scale={xScale} y={height} ticks={[0, 50, 100, 150, 200]} label="boosting round" />
                    <path d={linePath(trainPts)} className="viz-line viz-stroke-1" />
                    <path d={linePath(validPts)} className="viz-line viz-stroke-2" strokeDasharray="6 3" />
                    <line x1={xs(m)} x2={xs(m)} y1={0} y2={height} className="viz-stroke-ink" strokeWidth={1} />
                    <circle cx={xs(m)} cy={ys(boostRun.trainRmse[m])} r={4} className="viz-dot viz-fill-1" />
                    <circle cx={xs(m)} cy={ys(boostRun.validRmse[m])} r={4} className="viz-dot viz-fill-2" />
                    <circle cx={bx} cy={by} r={7} fill="none" className="viz-stroke-ink" strokeWidth={1.5} />
                    <text
                      className="viz-text-strong"
                      style={halo}
                      x={bx + (anchorEnd ? -10 : 10)}
                      y={Math.max(10, by - 22)}
                      textAnchor={anchorEnd ? "end" : "start"}
                    >
                      early-stopping point (round {bestRound})
                    </text>
                    <text className="viz-text" x={Math.min(Math.max(xs(m), 18), width - 18)} y={-4} textAnchor="middle">
                      round {m}
                    </text>
                    <text className="viz-text-strong" x={width + 6} y={ys(boostRun.trainRmse[MAX_ROUNDS])} dy="0.32em">
                      train
                    </text>
                    <text className="viz-text-strong" x={width + 6} y={ys(boostRun.validRmse[MAX_ROUNDS]) - 2} dy="0.32em">
                      validation
                    </text>
                  </>
                )
              }}
            </Chart>
          </>
        ) : null}

        <dl className="lab-readout">
          <div>
            <dt>Train RMSE</dt>
            <dd>{fix(trainRmse)}</dd>
          </div>
          <div>
            <dt>Validation RMSE</dt>
            <dd>{fix(validRmse)}</dd>
          </div>
          <div>
            <dt>RMSE inside range</dt>
            <dd>{fix(zone.inside)}</dd>
          </div>
          <div>
            <dt>RMSE outside range</dt>
            <dd>{fix(zone.outside)}</dd>
          </div>
        </dl>

        <div className="lab-controls">
          <Slider
            label="Noise (sigma)"
            value={sigma}
            min={0}
            max={1.2}
            step={0.05}
            onChange={setSigma}
            format={(v) => fix(v)}
          />
          {model === "tree" || model === "forest" ? (
            <Slider label="Max tree depth" value={treeDepth} min={1} max={6} onChange={setTreeDepth} />
          ) : null}
          {model === "forest" ? (
            <Slider label="Trees in forest (B)" value={forestSize} min={1} max={MAX_TREES} onChange={setForestSize} />
          ) : null}
          {model === "boosting" ? (
            <>
              <Slider label="Boosting rounds M" value={rounds} min={0} max={MAX_ROUNDS} onChange={setRounds} />
              <Slider
                label="Learning rate (eta)"
                hint="η: how much of each tree is added."
                value={eta}
                min={0.02}
                max={1}
                step={0.01}
                onChange={setEta}
                format={(v) => fix(v)}
              />
              <Slider label="Max tree depth" value={boostDepth} min={1} max={4} onChange={setBoostDepth} />
              <Slider
                label="Leaf regularisation"
                hint="XGBoost’s λ: leaf weight = −ΣG / (n + λ)."
                value={lambda}
                min={0}
                max={LAMBDA_MAX}
                step={0.5}
                onChange={setLambda}
                format={(v) => fix(v, 1)}
              />
            </>
          ) : null}
          <div className="flex items-end pb-1">
            <button
              type="button"
              className="rounded border px-3 text-[0.8rem]"
              style={{ borderColor: "var(--lab-rule)", color: "var(--lab-muted)" }}
              onClick={() => setSampleIndex((i) => i + 1)}
            >
              Draw a new sample
            </button>
          </div>
        </div>

        <ChartTable
          caption={`True function and ${MODEL_NAMES[model]} prediction every 0.5 in x`}
          columns={["x", "True f(x)", "Model prediction"]}
          rows={tableRows}
        />

        <p className="sr-only" aria-live="polite">
          {summary}
        </p>
      </div>
    </ConceptLab>
  )
}

function buildInsights(args: {
  model: ModelId
  lambda: number
  leafCount: number
  rounds: number
  bestRound: number
  bestValid: number
  trainNow: number
  validNow: number
  validEnd: number
}): LabInsight[] {
  const { model, lambda, leafCount, rounds, bestRound, bestValid, trainNow, validNow, validEnd } = args
  if (model === "linear") {
    return [
      {
        label: "What it assumes",
        body: <>y is a straight line in x. Least squares picks the slope and intercept with the smallest squared error.</>,
      },
      {
        label: "What to notice",
        body: (
          <>
            One line cannot follow the wiggle or the jump at x = 6.5, so error inside the range stays high. Outside the data it
            simply keeps going, which only helps if the real trend is straight. Here the sine wiggle also continues, so compare
            the outside-range RMSE with the tree models.
          </>
        ),
        tone: "accent",
      },
    ]
  }
  if (model === "tree") {
    return [
      {
        label: "What it assumes",
        body: <>y is constant on intervals of x. Each split asks “is x below t?”; a leaf predicts the mean of its training points. Every leaf keeps at least 3 points.</>,
      },
      {
        label: "What to notice",
        body: (
          <>
            The prediction is a staircase, now {leafCount} {leafCount === 1 ? "step" : "steps"}. Depth caps the count at 2
            <sup>depth</sup>. Deep trees start fitting single noisy points: training RMSE falls, validation RMSE does not follow.
            Beyond the data the first and last steps just continue flat.
          </>
        ),
        tone: "accent",
      },
    ]
  }
  if (model === "forest") {
    return [
      {
        label: "What it assumes",
        body: (
          <>
            The same piecewise-constant shape, but averaged over B trees, each fit to a bootstrap resample (n points drawn with
            replacement). With one feature there is no feature subsampling.
          </>
        ),
      },
      {
        label: "What to notice",
        body: (
          <>
            Set B to 1 to see one noisy deep tree, then add trees. The steps blur into a smoother curve: averaging lowers
            variance without needing shallow trees. Every tree is flat outside the data, so the forest is flat there too.
          </>
        ),
        tone: "accent",
      },
    ]
  }
  const position =
    rounds === bestRound
      ? "You are at the early-stopping point."
      : rounds < bestRound
        ? `Validation RMSE is still improving: the minimum is further right, at round ${bestRound}.`
        : `Past the minimum (round ${bestRound}): training RMSE is ${fix(trainNow)} but validation RMSE is ${fix(validNow)}, above the best ${fix(bestValid)}.`
  const small = 3 / (3 + lambda)
  const large = 20 / (20 + lambda)
  return [
    {
      label: "What it assumes",
      body: (
        <>
          A sum of small trees: F<sub>m</sub> = mean(y) + η·(tree<sub>1</sub> + … + tree<sub>m</sub>). Each new tree is fit to the
          residuals y − F<sub>m−1</sub>, the negative gradient of squared error.
        </>
      ),
    },
    {
      label: "What to notice",
      body: (
        <>
          Each round is a small correction (η scales it). The grey segments are what the next tree will try to fix. {position}{" "}
          {validEnd > bestValid + 0.005
            ? `By round ${MAX_ROUNDS} validation RMSE is ${fix(validEnd)}.`
            : `By round ${MAX_ROUNDS} validation RMSE has barely moved off its minimum; a larger η or depth would turn it up sooner.`}
        </>
      ),
      tone: "accent",
    },
    {
      label: "What XGBoost adds",
      body: (
        <>
          A leaf weight w = −ΣG / (n + λ). A leaf with n points keeps the fraction n/(n+λ) of its mean residual. With λ ={" "}
          {fix(lambda, 1)}, a 3-point leaf keeps {Math.round(small * 100)}% and a 20-point leaf {Math.round(large * 100)}%, so
          the small leaves that chase noise are shrunk most. Trees are flat outside the data, so the sum is too.
        </>
      ),
      tone: "intervention",
    },
  ]
}
