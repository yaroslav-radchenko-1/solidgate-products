---
name: sync
description: Download the latest changes from GitHub
---

# Sync from GitHub

When the user invokes this skill, do everything automatically without asking any questions:

1. Check for uncommitted changes:
   ```
   git status --porcelain
   ```
   - If there are local changes, commit them first with a message that describes what was uncommitted (e.g. `chore: save local changes before sync`)

2. Pull latest from main:
   ```
   git pull origin main
   ```
   - If there are merge conflicts, resolve them automatically: keep incoming changes for files that conflict unless the local change is clearly intentional (e.g. local config files like `.env`)

3. Tell the user what was updated, or "Already up to date." if nothing changed.
