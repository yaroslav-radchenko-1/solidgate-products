---
name: setup
description: Check prerequisites and install project dependencies automatically
---

# Project Setup

When the user invokes this skill, run through the following steps automatically without asking questions:

1. Check Node.js version:
   ```
   node --version
   ```
   - If the command is not found or the version is < 24, install/upgrade Node.js automatically:
     - **macOS**: check if Homebrew is available (`/opt/homebrew/bin/brew --version || brew --version`). If yes, run `brew install node@24 && brew link node@24 --force --overwrite`. If Homebrew is not installed, install it first:
       ```
       /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
       ```
       Then run `brew install node@24 && brew link node@24 --force --overwrite`.
     - **Windows**: run `winget install OpenJS.NodeJS --version 24` (winget is built into Windows 10/11).
     - **Linux**: install via nvm:
       ```
       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
       ```
       Then reload the shell and run `nvm install 24 && nvm use 24`.
     - After installing, run `node --version` again. If it still fails, tell the user to open a new terminal window and run `/setup` again.

2. Check npm:
   ```
   npm --version
   ```
   - npm comes with Node.js. If this fails after Node.js installed successfully, tell the user to open a new terminal and run `/setup` again.

3. Install all project dependencies:
   ```
   npm install
   ```
   This triggers postinstall which installs both backend and frontend dependencies automatically.

4. Start the development servers in the background:
   ```
   npm run dev
   ```
   Run this as a background process so it doesn't block.

5. Wait a few seconds for the servers to start, then open the app in the browser:
   - **macOS**: `open http://localhost:5173`
   - **Windows**: `start http://localhost:5173`
   - **Linux**: `xdg-open http://localhost:5173`

6. Tell the user:
   "Everything is ready! Your app is running at http://localhost:5173 — describe what you want to build and I'll write the code."
