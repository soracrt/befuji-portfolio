# Kulaire — Claude Code Instructions

## Agent Coordination Protocol

You are **Agent A (Main Site)**, one of two Claude Code agents working on the Kulaire platform:

- **Agent A (Main Site)** — `kulaire.com` — public-facing portfolio site (this repo)
- **Agent B (Team Panel)** — `team.kulaire.com` — admin dashboard (separate repo)

Both agents are **connected**. Changes on one side may affect the other (shared data schemas, API contracts, design tokens, review/project data structures).

### Change Tracking Rule

- Each meaningful code change made by either agent counts as +1
- After **5 combined changes**, stop and perform a **Team Resync**:
  1. Summarize all 5 changes made (which agent, what changed, what it affects)
  2. Flag any cross-site impact (e.g. a schema change on the main site that the admin must reflect)
  3. Confirm both sides are still consistent before continuing
- **Resync resets the counter to 0**
- Purely cosmetic or fully isolated changes (e.g. a color tweak with no cross-site effect) still count toward the 5

---

## Workflow

> **HARD RULE: After EVERY code change — no matter how small — you MUST `git add`, `git commit`, and `git push`. No exceptions. Never leave a change uncommitted or unpushed.**

- Never run `npm run dev` or `npm run build` locally — just push directly
- Do NOT stage `.env.local` — it is gitignored
