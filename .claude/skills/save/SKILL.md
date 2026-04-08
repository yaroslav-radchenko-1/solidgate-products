---
name: save
description: Save all changes and upload them to GitHub
---

# Save to GitHub

When the user invokes this skill, do everything automatically without asking any questions:

## Step 1 — Quality checks (mandatory)

Run the `/lint` skill first. This includes backend lint, frontend lint, format, and type-check. Fix ALL errors before proceeding. Do not skip this step under any circumstances.

## Step 2 — Stage and check

1. Stage all changes:
   ```
   git add -A
   ```

2. Check if there is anything to commit:
   ```
   git status --porcelain
   ```
   - If nothing changed, tell the user "Everything is already saved." and stop.

## Step 3 — Commit

3. Generate a short commit message in English that describes what changed (e.g. "add contact form", "fix login button", "update homepage text"). Look at the diff to decide — do not ask the user.

4. Commit:
   ```
   git commit -m "<generated message>"
   ```

## Step 4 — Push

5. Push to main:
   ```
   git push origin main
   ```
   If the branch has no upstream yet, use `git push -u origin main`.

6. Tell the user: "Saved! Your changes are on GitHub."
