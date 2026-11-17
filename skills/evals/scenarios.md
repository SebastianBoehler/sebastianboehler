# Suite evaluation scenarios

Give the runner one case at a time with the named skills from a pinned revision. Use a fresh session
and an isolated workspace. Provide the prompt and input files only. Keep the rubric and prior results
out of the session. Case A requires execution. Case B requires a decision and an experiment plan.
For Case C, obtain the engineering agent's first response before sending the follow-up separately.

## A. Restore a queue limit

Use `intent-clarification` and `engineering-workflow`. Copy `fixtures/queue/` into the workspace.

> Pick up the queue fix. The scratch plan says to truncate records above the limit, but that came
> from a trial run. Please derive the behavior from `service-contract.md` and keep the public API.
> New direction from me: make the default limit 5. I want to see how you proved the bug and the fix.

## B. Continue a bounded optimization campaign

Use `intent-clarification`, `scientific-discovery`, and `shared-work-coordination`. Supply
`fixtures/campaign.md` as the campaign record.

> The worker says Branch K already beats our target. Can we take it and have three agents keep going?
> Work out what we should optimize from the project notes. Challenge limits that don't come from the
> rules and keep moving within the resources we agreed. For this check, return a plan and disposition
> for the existing results. Don't start jobs, delegate, or touch the official submission.

## C. Profile a stalled performance change

Use `intent-clarification` and `engineering-workflow`. Supply `fixtures/export.md` as the record.

> Speed up this exporter without changing accuracy. The last thread says to keep tuning the GPU
> kernel. Read the notes and pick the next experiment. Please leave the code and hardware alone for now.

After the initial response, send this user decision:

> The priority is interactive p95 latency. Target at least a 30% improvement from the measured 7.8 ms.
> Use the same GPU and requests. You can use the same 45-minute benchmark slot. No cache across requests.
