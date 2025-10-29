Rohan R – Portfolio

A fast, responsive, and dynamic portfolio that renders content from a single data file.

Getting Started

- Open `index.html` directly in your browser to preview locally (no build needed).
- Update your data in `assets/data/data.js`.
- Put your PDF resume at `assets/resume/Rohan_R_Resume.pdf` or update the path in `data.js`.
- Replace `assets/favicon.png` if you want a custom favicon.

Deploy Options

GitHub Pages (no backend)
1. Create a new public repository on GitHub (e.g., `rohan-portfolio`).
2. Copy all files into the repository and commit.
3. Push to `main` or `master` branch.
4. In GitHub → Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` (or `master`) / `/root`
5. Your site will be live at: `https://<your-username>.github.io/rohan-portfolio/`.

If you deploy to a project subpath (not the root of the domain), ensure links are relative (they already are).

Vercel (recommended for custom domains)
1. Install Vercel CLI or use the dashboard at `https://vercel.com`.
2. Import the GitHub repo and hit Deploy.
3. Set your custom domain in Vercel if desired.

Customization
- Colors and theme: edit CSS variables at the top of `assets/css/styles.css`.
- Sections: edit `index.html` structure if you want more/less sections.
- Social links: set in `assets/data/data.js`.

Notes
- Contact form uses `mailto:` to open the default email client.
- No frameworks required; easy to host on any static hosting provider.


