# Arnaud Jouan Portfolio

A personal portfolio website built with plain HTML, CSS, and JavaScript. It presents my profile, selected projects, internship experience, certifications, and contact links in a responsive one-page layout with a separate detailed profile page.

## Features

- Responsive landing page with hero section, project highlights, experience timeline, and contact section
- Detailed profile page with education, internships, certifications, and additional background
- Animated reveal effects and a custom interactive globe on the profile page
- Direct links to GitHub, LinkedIn, and the portfolio site
- No build step required: the site runs directly in the browser

## Project Structure

- `index.html` - main portfolio landing page
- `profile.html` - detailed profile page
- `styles.css` - shared styling for both pages
- `script.js` - year update, scroll reveals, and globe interaction
- `assets/` - CV files and logos used in the portfolio

## How to Run

1. Open `index.html` in a browser, or
2. Serve the folder with a local web server if you prefer, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Notes

- The design uses Google Fonts loaded from the web.
- The globe visualization on `profile.html` improves when the browser can load the remote geometry data, but it still works with the built-in fallback shapes.
- You can customize the content directly by editing the HTML files.

## Author

Arnaud Jouan
