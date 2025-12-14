
  # Multiplayer Heads Up Game

  This is a code bundle for Multiplayer Heads Up Game. The original project is available at https://www.figma.com/design/AGjceXxO9RLAL8s7j6ojZ5/Multiplayer-Heads-Up-Game.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

    ## Hosting on GitHub Pages

    This project is configured to deploy automatically to GitHub Pages via GitHub Actions.

    Steps:
    1. Push this repo to GitHub (branch `main`).
    2. In GitHub: **Settings → Pages**
      - **Build and deployment** → **Source**: select **GitHub Actions**.
    3. Push to `main` (or run the workflow manually). The site will be published.

    Notes:
    - The Vite output folder is `build/` (see `vite.config.ts`).
    - The Vite `base` is set to `./` so it works from `https://<user>.github.io/<repo>/`.
  