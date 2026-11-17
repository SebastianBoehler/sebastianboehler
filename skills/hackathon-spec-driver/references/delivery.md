# Scope, delivery, and proof

Use when uncertain dependencies or a shrinking deadline require explicit prioritization.

Estimate short cycles of specifying a result, editing, checking, and correcting. Separate generation,
integration/convergence, and proof time. AI can generate quickly; live dependencies and misunderstood
intent still take time. Size work from actual dependencies and available tools, not developer-days.

Known, reversible work may need one cycle. Unfamiliar integrations need an early check of the critical
boundary. Hardware, providers, wallets, or deployment may need a bounded feasibility probe. Use the
observed result to revise the plan rather than treating these categories as delivery guarantees.

Keep the committed core runnable before admitting optional improvements. Prefer a real state change,
visible consequence, required platform proof, and stable deployment before presentation extras.
A second case using the same primitive can prove extensibility without creating a second product.
If work repeatedly fails to converge, simplify or cut it unless essential to the agreed result.

Choose proof by consequence: essential invariants, critical integration, and a smoke/rehearsal of the
actual path. Test-first work helps when false behavior would undermine correctness. Presentation
changes can usually be checked directly. Stop expanding tests when the acceptance evidence is enough.

Reserve a rehearsal and submission buffer suited to the event. Set a feature freeze when useful;
near the deadline, favor blockers, required compliance, and corrections over optional breadth.
Include deployment, required fields and links, timed presentation, and backup evidence where needed.
Keep contingency behavior explicit and faithful to the product rather than presenting mock results
as live functionality.

For delegated work, use the existing coordination workflow: bounded scope, acceptance check,
exclusions, stop condition, and evidence. Report adjacent discoveries; fix them within the assignment
only when they block its outcome. Verify the requested user experience before accepting integration.
