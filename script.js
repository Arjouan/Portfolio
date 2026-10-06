/**
 * script.js — all client-side behaviour for the portfolio.
 * Shared by index.html, profile.html, and projects.html (loaded with `defer`).
 *
 * Sections, in order:
 *   1. Loading overlay        — first-visit branded splash
 *   2. Translations (EN / FR) — the `translations` dictionary + tr() helper
 *   3. i18n engine            — applyTranslations(), tech chips, year, language toggle
 *   4. Navigation             — mobile menu toggle, reveal-on-scroll, scroll-spy
 *   5. Earth globe            — canvas renderer (profile.html only)
 *   6. Enhancements           — scroll progress bar, theme toggle, live GitHub feed,
 *                               contact form, copy-email, service-worker (PWA)
 */

// Branded loading overlay: shown only on a visitor's first arrival, then
// remembered so it never appears again (including on internal navigation).
(function hidePageLoader() {
  const loader = document.querySelector(".page-loader");
  if (!loader) {
    return;
  }
  // Returning visitor: the overlay was never displayed (CSS .intro-seen gate).
  if (document.documentElement.classList.contains("intro-seen")) {
    return;
  }
  // First visit: remember it for next time.
  try {
    localStorage.setItem("introSeen", "1");
  } catch (e) {}

  // Start the intro at the top of the page (unless a deep link with #anchor
  // was used). Prevents the browser from restoring a mid-page scroll behind
  // the splash on reload.
  if (!window.location.hash) {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }

  const MIN_SHOW = 600; // keep the splash on screen for at least 0.6s
  let done = false;
  const hide = () => {
    if (done) {
      return;
    }
    done = true;
    loader.classList.add("is-hidden");
  };
  const hideAfterMinimum = () => {
    const remaining = Math.max(0, MIN_SHOW - performance.now());
    window.setTimeout(hide, remaining);
  };

  if (document.readyState === "complete") {
    hideAfterMinimum();
  } else {
    window.addEventListener("load", hideAfterMinimum);
    window.setTimeout(hide, 4000); // absolute safety cap
  }
})();

const LANGUAGE_KEY = "siteLang";

const translations = {
  en: {
    "meta.description.portfolio": "Arnaud Jouan - engineering student moving into product ownership: internships, projects, leadership and contact.",
    "meta.title.portfolio": "Arnaud Jouan | Portfolio",
    "meta.description.profile": "Detailed profile of Arnaud Jouan: education, internships, certifications, and career goals.",
    "meta.title.profile": "Arnaud Jouan | Detailed Profile",
    "nav.detailedProfile": "Detailed Profile",
    "nav.profile": "Profile",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "hero.eyebrow": "Aspiring Product Owner · Engineering background",
    "hero.subtitle": "4th-year engineering student at EPITECH, on a one-year management exchange at McGill University. Three tech internships showed me how software gets built; launching the Marseille branch of Junior Conseil Taker showed me how it gets sold. I am now moving into product ownership: turning client needs into a backlog a development team can deliver.",
    "hero.ctaProfile": "Read Full Profile",
    "hero.ctaGithub": "GitHub",
    "hero.ctaLinkedin": "LinkedIn",
    "profile.kicker": "Who I Am",
    "profile.title": "Profile",
    "about.title": "About Me",
    "about.body": "I am aiming for Product Owner and tech project management roles. I am the Product Owner of Nexum, a five-person Epitech innovation project, and I know the developer side first-hand: I developed production Java at REACTIS Group and CPAM, and was the sole internal IT referent at BARJANE. On the business side, I founded the Marseille branch of Junior Conseil Taker and grew it to 11 members as Regional Director, and served as Vice President of the EPITECH Marseille student union (BDE). I have lived in Singapore, Vietnam, Australia, France and now Canada, and I work in English and French. I am particularly drawn to AI and cybersecurity products.",
    "cert.title": "Certificates",
    "cert.item1": "<strong>EPITECH</strong> - Institutional Degree in Information Technology (Bac +5) - Expected 2028",
    "cert.item2": "<strong>MCGILL UNIVERSITY</strong> - Certificate in Management (Bachelor Degree) - Expected 2027",
    "cert.item3": "<strong>HEC</strong> - AI Entrepreneurship Certificate - Issued 2026",
    "cert.item4": "<strong>MANTU</strong> - The Mantu Manager Program (Business Acquisition) - Issued Nov 2025",
    "cert.item5": "<strong>OXFORD ROYALE ACADEMY</strong> - Academy certificate - Issued Jul 2022",
    "projects.kicker": "Selected Work",
    "projects.title": "Featured Projects",
    "projects.kicker.profile": "Projects",
    "projects.title.profile": "Additional Initiatives",
    "proj.rtype.title": "R-Type",
    "proj.rtype.oneliner": "Authoritative C++20 multiplayer remake of the 1987 arcade classic, built with a custom ECS and a UDP-first binary protocol.",
    "proj.rtype.about": "R-Type splits gameplay from presentation: a headless server runs the real, authoritative simulation while a thin SFML client only renders and captures input. The two talk over a custom binary UDP protocol with explicit headers and bounds-checked serialization, and all gameplay logic runs on a lightweight custom ECS (rtype_engine) shared by both binaries, so the simulation stays deterministic and in sync across every connected player.",
    "proj.rtype.role": "Shipped client-side gameplay features — enemy variety, projectile and collision behavior, visual polish — and kept the architecture doc, API reference, and README technically accurate.",
    "proj.rtype.stack": "Stack: C++20, SFML, ECS, UDP, CMake",
    "proj.area.title": "AREA",
    "proj.area.oneliner": "Action-Reaction automation platform (IFTTT-style) connecting GitHub, Microsoft 365, Steam, and more through OAuth-driven workflows.",
    "proj.area.about": "AREA lets a user connect third-party services through OAuth, then chain an Action on one service to a Reaction on another — the same idea as IFTTT or Zapier. A FastAPI backend owns users, OAuth credentials, webhooks, and background schedulers; a Vue 3 web app and an Android companion app give two ways to build and monitor automations, with the whole stack running behind Docker Compose and a PostgreSQL database.",
    "proj.area.role": "Authored the system architecture diagrams and the CONTRIBUTING guide the team built from, built frontend views (services catalog, dashboard), and kept the README technically accurate.",
    "proj.area.stack": "Stack: FastAPI, Vue 3, PostgreSQL, Docker, Android",
    "proj.zappy.title": "Zappy",
    "proj.zappy.oneliner": "Multiplayer network game where teams compete on a resource-tile map — server, AI client, and 2D GUI over a custom protocol.",
    "proj.zappy.about": "Zappy is a real-time strategy game where several AI-controlled teams compete on a shared tile map, gathering resources and performing elevation rituals to win. The project is split into three pieces that only ever agree on a text protocol: a C server that owns the authoritative game state, an AI client written in any language, and a 2D GUI that visualizes the match live.",
    "proj.zappy.role": "Wrote end-to-end Doxygen documentation across the server, AI client, and GUI — reading and accurately documenting three subsystems across two languages — and started the README.",
    "proj.zappy.stack": "Stack: C, C++, Doxygen",
    "proj.arcade.title": "Arcade",
    "proj.arcade.oneliner": "Game engine with dynamically loaded graphics and game modules — swap SDL2, SFML, or ncurses, and Snake, Nibbler, or Solar Fox, at runtime.",
    "proj.arcade.about": "Arcade is built around runtime plugin-loading in C++: the core loads graphics libraries (SDL2, SFML, ncurses) and games (Snake, Nibbler, Solar Fox) as shared libraries via dlopen, so either one can be swapped live without recompiling. A shared IGraphics/IGame interface keeps every graphics backend and every game fully decoupled from the core — the main architectural challenge of the project.",
    "proj.arcade.role": "Implemented the Nibbler game module and kept the codebase documented end-to-end: inline function docs, the README, and the published documentation site.",
    "proj.arcade.stack": "Stack: C++, dlopen, SDL2, SFML, ncurses",
    "projectsPage.about": "About the project",
    "proj.raytracer.title": "Raytracer",
    "proj.raytracer.oneliner": "Configurable raytracer rendering spheres and planes with directional and ambient lighting, driven by a scene description file.",
    "proj.raytracer.stack": "Stack: C++17, libconfig",
    "proj.jetpack.title": "Jetpack",
    "proj.jetpack.oneliner": "Multiplayer platformer inspired by Jetpack Joyride, with a custom TCP protocol synchronizing client and server in real time.",
    "proj.jetpack.stack": "Stack: C++, TCP",
    "proj.panoramix.title": "Panoramix",
    "proj.panoramix.oneliner": "Concurrent programming simulation modeling villagers and a druid with threads, mutexes, and semaphores (solo project).",
    "proj.panoramix.stack": "Stack: C, pthreads",
    "projectsPage.docs": "Documentation",
    "projectsPage.moreProjects": "More Projects",
    "projectsPage.fullIndex.title": "Full Coursework Index",
    "projectsPage.fullIndex.body": "Looking for the full trail? Every project I built at EPITECH — including the smaller Year 1 fundamentals — is indexed by year, each entry linking to its own repository.",
    "experience.kicker": "Professional Path",
    "experience.title": "Internship Highlights",
    "experience.kicker.profile": "Experience",
    "experience.title.profile": "Internship Details",
    "exp1.meta": "Software Developer Intern | Mar 2026 - Aug 2026 · 6 mos",
    "exp1.body": "Worked as a developer on an aeronautical maintenance application, developing and maintaining Java features for production, writing clean and testable code, and supporting sprint delivery through code reviews and bug fixing.",
    "exp1.tools": "Languages: Java, SQL, Neo4j, Python",
    "exp2.meta": "Internal IT Referent Intern | Sep 2025 - Feb 2026",
    "exp2.body": "Managed internal IT operations, improved infrastructure reliability, automated recurring support tasks, and contributed to website modernization projects to improve user experience and reduce manual interventions.",
    "exp2.tools": "Languages & tools: JavaScript, HTML, CSS, SQL, Excel, WordPress",
    "exp3.meta": "Java Developer Intern | Sep 2024 - Dec 2024",
    "exp3.body": "Participated in migrating legacy Java components to a more maintainable architecture, improved code quality through refactoring and documentation, and helped stabilize the application with targeted fixes and validation testing.",
    "exp3.tools": "Languages & Tools: Java, SQL, Python, Git, SonarQube, SoapUI",
    "contact.kicker": "Open To Opportunities",
    "contact.title": "Let's build something useful.",
    "contact.body": "I am looking for internships and junior roles in product ownership and tech project management, ideally with international teams.",
    "contact.email": "Email Me",
    "contact.github": "View GitHub",
    "contact.linkedin": "LinkedIn",
    "footer.text": "© <span id=\"year\"></span> Arnaud Jouan. Built with HTML, CSS, and JavaScript.",
    "profile.eyebrow": "Detailed Profile",
    "profile.heroText": "<p><strong>What I Am Building Toward</strong></p><p>I want to work as a Product Owner: the person who turns business and client needs into priorities a development team can deliver. I already do this on Nexum, a five-person Epitech innovation project, and my background covers both halves of the job.</p><p>Born in Singapore with French nationality, I have lived in Singapore, Vietnam, Australia and France, and I am now studying in Canada. I work fluently in English and French.</p><p>On the tech side, I have spent three internships inside development teams: migrating legacy Java components at CPAM des Bouches-du-Rhône, acting as the sole internal IT referent at BARJANE, and developing production Java features for an aeronautical maintenance application at REACTIS Group. I know what sprints, code reviews and technical debt look like from the developer's chair.</p><p>On the business side, as Regional Director and Business Manager for Junior Conseil Taker, I built the Marseille branch from scratch and grew it to 11 members, selling B2B projects and managing client projects end to end. In 2026 the branch won the Best Engineering Study award, presented by ALTEN, at the CNJE's national summer congress. As Vice President of the EPITECH Marseille BDE, I led weekly meetings, tracked the budget and set up local company partnerships.</p>",
    "profile.ctaDownload": "Download CV",
    "profile.ctaBack": "Back to Portfolio",
    "profile.ctaLinkedin": "LinkedIn",
    "education.kicker": "Education",
    "education.title": "Academic Path",
    "education.epitech.location": "Marseille, France",
    "education.epitech.program": "Diplôme d'Établissement - Expert en Technologies de l'information (Bac +5)",
    "education.epitech.expected": "Expected in 2028",
    "education.mcgill.location": "Montreal, Canada",
    "education.mcgill.program": "Certificate in Management (Bachelor Degree track)",
    "education.mcgill.expected": "Expected in 2027",
    "education.hec.location": "Paris, France",
    "education.hec.program": "AI Entrepreneurship Certificate",
    "education.hec.status": "Obtained in 2026",
    "education.earlier": "Earlier schooling in Singapore, Australia and France.",
    "experience.reactis.body": "Worked on an aeronautical maintenance application, developing production Java features, and contributing to code quality and sprint delivery with the engineering team.",
    "experience.reactis.tools": "Languages: Java, SQL, Neo4j, Python",
    "experience.barjane.body": "Managed IT support operations, improved infrastructure reliability, automated recurring processes, and supported website modernization initiatives.",
    "experience.barjane.tools": "Languages and tools: JavaScript, HTML, CSS, SQL, Excel, WordPress",
    "experience.cpam.body": "Contributed to legacy-to-modern Java migration, refactoring, documentation, and stabilization with targeted fixes and testing support.",
    "experience.cpam.tools": "Languages and tools: Java, SQL, Python, Git, SonarQube, SoapUI",
    "cert.kicker": "Certificates",
    "cert.title": "Certifications and Test Scores",
    "cert.mantu.meta": "Mantu · Issued Nov 2025",
    "cert.oxford.meta": "University of Oxford · Issued Jul 2022",
    "cert.ielts.meta": "IELTS Official · Issued Jan 2023 · Expired Jan 2025",
    "cert.toefl.meta": "TOEFL · Issued Jun 2025",
    "community.kicker": "Community",
    "community.title": "Leadership and Volunteering",
    "community.bde.title": "Vice President of the BDE - EPITECH Marseille",
    "community.bde.meta": "EPITECH - European Institute of Technology · May 2025 - Mar 2026 (11 months) · Education",
    "community.bde.detail1": "Organized student events (parties, integrations, LAN events) to strengthen campus cohesion.",
    "community.bde.detail2": "Managed the BDE office, led weekly meetings, and coordinated with administration.",
    "community.bde.detail3": "Planned annual priorities, budget tracking, and local partnerships.",
    "community.bde.detail4": "Managed social media communication and visual content for student life updates.",
    "community.bde.impact1": "Higher participation in BDE events over the year.",
    "community.bde.impact2": "Established local company partnerships to support activities.",
    "community.bde.impact3": "Improved internal and external communication for the BDE.",
    "community.cobra.title": "Cobra Keeper",
    "community.cobra.meta": "EPITECH - European Institute of Technology · Jan 2025 - Present · Education",
    "community.cobra.detail1": "Led the Coding Club and Camp through workshops, programming challenges, and events.",
    "community.cobra.detail2": "Coordinated the Cobras team and supported group motivation and execution.",
    "community.cobra.detail3": "Organized open-day activities for prospective students and families.",
    "community.cobra.impact1": "Increased participation in Coding Club and Camp activities.",
    "community.cobra.impact2": "Reinforced team engagement and group dynamics.",
    "community.planete.title": "Volunteer - Planète Perles (Les Perles de la Côte Bleue)",
    "community.planete.meta": "Sep 2018 - Present · Environment",
    "community.planete.detail1": "Participated in recurring beach and natural-area cleanup operations.",
    "community.planete.detail2": "Guided children groups and raised awareness on environmental issues.",
    "community.planete.impact1": "Contributed directly to preserving natural spaces along the Côte Bleue.",
    "community.planete.impact2": "Helped educate dozens of children on environmental respect.",
    "community.planete.impact3": "Strengthened links between local community actions and ecology efforts.",
    "community.planete.support": "Supporting activity: Beach cleanup collaboration with Bootcamp Côte Bleue",
    "community.bootcamp.title": "Volunteer - Bootcamp Côte Bleue",
    "community.bootcamp.meta": "Sep 2018 - Present · Health",
    "community.bootcamp.detail1": "Moderated and edited YouTube videos to promote bootcamp sessions.",
    "community.bootcamp.detail2": "Managed community communication across social platforms.",
    "community.bootcamp.detail3": "Developed a modern website to improve online visibility.",
    "community.bootcamp.detail4": "Participated in bootcamp sessions to support members and engagement.",
    "community.bootcamp.impact1": "Increased digital visibility and participant growth.",
    "community.bootcamp.impact2": "Built a stronger and more active social community.",
    "community.bootcamp.impact3": "Improved group cohesion during sessions through active support.",
    "community.bootcamp.support": "Supporting activity: Bootcamp Côte Bleue session highlights",
    "projects.jeb.title": "JEB Incubator - Survivor Seminar EPITECH",
    "projects.jeb.meta": "Sep 2025 · Associated with EPITECH - European Institute of Technology",
    "projects.jeb.body": "Delivered in 21 days a web platform designed to showcase incubator projects and facilitate connections between startups, investors, and partners.",
    "projects.jeb.detail1": "Built project catalog pages, startup spaces, internal messaging, news, and event calendar features.",
    "projects.jeb.detail2": "Implemented a full backend with CRUD operations and synchronized database integration with an existing API.",
    "projects.jeb.detail3": "Developed a responsive, accessibility-focused frontend and an admin back-office for content, user, and statistics management.",
    "projects.jeb.detail4": "Worked in agile mode with continuous client feedback and evolving requirements on features, priorities, and design.",
    "projects.jeb.impact1": "Grade A for the project delivery.",
    "projects.jeb.impact2": "Functional solution delivered within a short timeline.",
    "projects.jeb.impact3": "Strengthened fullstack, UX/UI, client management, and agile collaboration skills.",
    "projects.jeb.stack": "Tech stack: Vite, Vue.js, Django, Python, Docker, GitHub Actions",
    "projects.hackathon.title": "Hackathon KEDGE Business School x EPITECH",
    "projects.hackathon.meta": "Mar 2025 - Apr 2025 · Associated with EPITECH - European Institute of Technology",
    "projects.hackathon.body": "Contributed to solving a real business challenge for Biotech One by combining technical perspective with market and strategic analysis.",
    "projects.hackathon.detail1": "Analyzed ingredient profitability to recommend the strongest economic option.",
    "projects.hackathon.detail2": "Performed market research and competitive analysis to identify trends, opportunities, and customer needs.",
    "projects.hackathon.detail3": "Collected Voice of Customer insights through interviews and field feedback.",
    "projects.hackathon.detail4": "Built a full business model including SWOT, value proposition, target markets, and cost estimations.",
    "projects.hackathon.impact1": "Delivered a complete strategic report to Biotech One at the end of the hackathon.",
    "projects.hackathon.impact2": "Developed stronger business analysis, marketing, and cross-school collaboration skills.",
    "projects.hackathon.impact3": "Gained practical experience solving a real enterprise problem.",
    "projects.hackathon.support": "Supporting material: Final presentation with KEDGE team (Biotech One hackathon)",
    "skills.technical": "Technical",
    "skills.technical.item1": "C, C++, Java, Python, SQL",
    "skills.technical.item2": "Web: JavaScript, Vue.js, FastAPI, Django",
    "skills.technical.item3": "Docker, Git, GitHub Actions, SonarQube",
    "skills.professional": "Professional",
    "skills.professional.item1": "Product ownership: roadmap, backlog, MoSCoW, acceptance criteria",
    "skills.professional.item2": "Team leadership and client relations",
    "skills.professional.item3": "Agile delivery with GitHub Projects, reviews and milestones",
    "skills.languages": "Languages",
    "skills.languages.item1": "English (bilingual)",
    "skills.languages.item2": "French (bilingual)",
    "skills.languages.item3": "Spanish (limited working proficiency)",
    "skills.languages.item4": "Chinese (elementary proficiency)",
    "skills.kicker": "Core Strengths",
    "skills.title": "Skills Snapshot",
    "footer.profile": "© <span id=\"year\"></span> Arnaud Jouan. Detailed profile page.",
    "meta.title.projects": "Arnaud Jouan | Projects",
    "meta.description.projects": "A detailed look at Arnaud Jouan's EPITECH projects across all three years.",
    "projectsPage.kicker": "Selected Work",
    "projectsPage.title": "Project Details",
    "projectsPage.intro": "A closer look at the products I have led and the projects I built at EPITECH: the problem, how we prioritised, and the parts I owned. Nexum and JEB Incubator show the product side; the technical projects below show the engineering background I bring to a development team.",
    "projectsPage.whatIBuilt": "My Role",
    "projectsPage.results": "Results",
    "projectsPage.clientKicker": "Client Project",
    "projectsPage.viewDetails": "Project Details",
    "projectsPage.viewRepo": "View Repository",
    "common.repoLink": "Repository",
    "footer.projects": "© <span id=\"year\"></span> Arnaud Jouan. Projects page.",
    "githubPage.kicker": "GitHub",
    "githubPage.title": "Latest on GitHub",
    "githubPage.loading": "Loading repositories…",
    "contact.formTitle": "Or send a message directly",
    "contact.copyEmail": "Copy email",
    "contact.copied": "Copied!",
    "contact.vcard": "Save contact",
    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send message",
    "form.sending": "Sending…",
    "form.success": "Thanks — your message has been sent!",
    "form.error": "Something went wrong. Please email me directly.",
    "notfound.eyebrow": "404",
    "notfound.title": "Page Not Found",
    "notfound.body": "The page you're looking for doesn't exist or has moved. Let's get you back on track.",
    "projectsPage.leadKicker": "Product Lead · Ongoing",
    "proj.nexum.title": "Nexum",
    "proj.nexum.oneliner": "A no-code control centre that switches your whole PC setup (volume, brightness, lights, apps, games) in one click. Epitech Innovative Project, built by a team of five from July 2026 to July 2027.",
    "proj.nexum.meta": "Product Owner and project lead · Jul 2026 - Jul 2027 (ongoing)",
    "proj.nexum.stack": "Stack: Rust, Tauri 2, React, TypeScript, SQLite, GitHub Projects",
    "projectsPage.problem": "The problem and who it's for",
    "proj.nexum.problem": "Switching from work to gaming, streaming or a quiet evening means adjusting a dozen things by hand, and every hardware brand ships its own app. Nexum is designed around three personas: Léo, a competitive gamer who wants zero setup time; Maxime, a streamer who wants to go live in one click; and Sarah, a remote developer who wants work and personal time clearly separated.",
    "proj.nexum.role": "I own the roadmap, the backlog and the milestones, run the mentor follow-ups, and split the work across the team. I also contribute code on the front end and on macOS compatibility, including a local voice-command prototype.",
    "projectsPage.prioritise": "How we prioritise",
    "proj.nexum.prio1": "Every beta feature is ranked with MoSCoW: a Must blocks the beta, a Could is dropped if time runs out.",
    "proj.nexum.prio2": "One scoping rule: 9 features that work 100% live beat 30 half-finished ones. The final jury demo has to run live, and video is not allowed.",
    "proj.nexum.prio3": "Deliberately cut from the beta: macOS support, real RGB peripherals, marketplace payments, the full mobile app and the Epic/GOG launchers. Philips Hue stays as the one real hardware effect in the demo.",
    "projectsPage.backlog": "From the backlog",
    "proj.nexum.story1": "<strong>As Sarah</strong>, I want to build a Chill mode without writing code, so my evening setup is one click away.",
    "proj.nexum.story1.ac": "Acceptance: a new user creates and saves a mode with 3+ steps in under 3 minutes · the mode survives an app restart · the editor only offers allowlisted actions, so no code can be injected.",
    "proj.nexum.story2": "<strong>As Maxime</strong>, I want my Live mode to switch my Philips Hue lights, so my stream scene is set in one click.",
    "proj.nexum.story2.ac": "Acceptance: activating the mode physically changes a real Hue lamp in front of the jury · without a Hue bridge the step is flagged as incompatible, with no crash · under 2 seconds between activation and the light change.",
    "proj.nexum.story3": "<strong>As Léo</strong>, I want to describe a session in one sentence and get a ready-to-use mode.",
    "proj.nexum.story3.ac": "Acceptance: “set me up for a quiet Valorant session tonight” produces a coherent mode with valid actions · the generated mode passes the allowlist check before it can run · no AI output runs without going through validation.",
    "projectsPage.teamWork": "How the team works",
    "proj.nexum.team1": "I set up the GitHub Projects board (To do, In progress, Review, Done) with four milestones that mirror the EIP phases. The backlog holds 109 issues, each with a named owner.",
    "proj.nexum.team2": "Every task gets its own branch, and nothing reaches main without a review and one approval from another teammate.",
    "proj.nexum.team3": "Clear ownership: one main front-end developer, two back-end developers, one business and KPI owner, and me as Product Owner.",
    "proj.nexum.team4": "Mentor follow-ups every six weeks, each one expected to show measurable progress.",
    "projectsPage.aiSecurity": "AI and security by design",
    "proj.nexum.ai1": "Mode-as-Code: users describe a mode in a sentence. The AI only returns declarative data, which is checked against an allowlist before anything runs. It never generates executable code.",
    "proj.nexum.ai2": "Modes shared on the marketplace go through static analysis and get a risk score before anyone can import them.",
    "proj.nexum.ai3": "For voice commands I chose local Whisper transcription: free, offline, and no audio ever leaves the user's computer.",
    "projectsPage.status": "Where it stands",
    "proj.nexum.status": "Phase 0 (foundations and market validation) runs until October 2026: the core app works and user interviews are starting. The first beta test plan is due in February 2027, and the live jury demo is in July 2027.",
    "projectsPage.website": "Website",
    "community.taker.title": "Regional Director - Junior Conseil Taker (Marseille)",
    "community.taker.meta": "Junior-Entreprise · Two terms · Business development, then regional leadership",
    "community.taker.detail1": "Founded Taker's Marseille branch from scratch and grew it to a team of 11 members.",
    "community.taker.detail2": "Started as Chargé d'Affaires (business developer) before becoming Regional Director, and also worked on the information-system side.",
    "community.taker.detail3": "Hosted and co-organised the JEM × Mantu prospecting contest on the Epitech Marseille campus (22 May 2026): mixed teams from the region's Junior-Entreprises and Mantu consultants, ending with a prize ceremony.",
    "community.taker.detail4": "Represented Taker in the regional Junior-Entreprise network, including at its board meeting on 6 April 2026.",
    "community.taker.detail5": "Trained the communication lead who took over after me.",
    "community.taker.impact1": "Taker won the Best Engineering Study award (Prix de la meilleure étude d'ingénierie), presented by ALTEN, at the CNJE's Congrès National d'Été 2026 (5-7 June, 1,200 students from more than 100 schools).",
    "community.taker.impact2": "Took part in the national congresses (CNE and CNH) with the Taker team.",
    "community.taker.impact3": "Left behind a team of 11 and a branch now established in Marseille's business and Junior-Entreprise landscape.",
    "stats.team": "people in the Nexum product team I lead",
    "stats.branch": "members in the Junior-Entreprise branch I founded",
    "stats.client": "to deliver a client platform, graded A",
    "stats.clientValue": "21 days",
    "stats.internships": "tech internships inside development teams",
  },
  fr: {
    "meta.description.portfolio": "Arnaud Jouan - étudiant ingénieur qui s'oriente vers le rôle de Product Owner : stages, projets, leadership et contact.",
    "meta.title.portfolio": "Arnaud Jouan | Portfolio",
    "meta.description.profile": "Profil détaillé d'Arnaud Jouan : formation, stages, certifications et objectifs.",
    "meta.title.profile": "Arnaud Jouan | Profil détaillé",
    "nav.detailedProfile": "Profil détaillé",
    "nav.profile": "Profil",
    "nav.projects": "Projets",
    "nav.experience": "Expérience",
    "nav.contact": "Contact",
    "hero.eyebrow": "Futur Product Owner · Profil ingénieur",
    "hero.subtitle": "Étudiant ingénieur en 4e année à EPITECH, en échange d'un an en management à McGill University. Trois stages tech m'ont appris comment un logiciel se construit ; lancer l'antenne marseillaise de Junior Conseil Taker m'a appris comment il se vend. Je m'oriente désormais vers le rôle de Product Owner : transformer les besoins client en un backlog qu'une équipe de développement peut livrer.",
    "hero.ctaProfile": "Voir le profil complet",
    "hero.ctaGithub": "GitHub",
    "hero.ctaLinkedin": "LinkedIn",
    "profile.kicker": "Qui je suis",
    "profile.title": "Profil",
    "about.title": "À propos de moi",
    "about.body": "Je vise des postes de Product Owner et de chef de projet tech. Je suis Product Owner de Nexum, un projet d'innovation Epitech de cinq personnes, et je connais le côté développeur de l'intérieur : j'ai développé du Java en production chez REACTIS Group et à la CPAM, et j'ai été l'unique référent IT interne chez BARJANE. Côté business, j'ai créé l'antenne marseillaise de Junior Conseil Taker et l'ai fait grandir jusqu'à 11 membres en tant que Directeur Régional, et j'ai été Vice-Président du BDE d'EPITECH Marseille. J'ai vécu à Singapour, au Vietnam, en Australie, en France et aujourd'hui au Canada, et je travaille en anglais comme en français. Les produits liés à l'IA et à la cybersécurité m'attirent particulièrement.",
    "cert.title": "Certificats",
    "cert.item1": "<strong>EPITECH</strong> - Diplôme d'établissement en technologies de l'information (Bac +5) - Prévu 2028",
    "cert.item2": "<strong>MCGILL UNIVERSITY</strong> - Certificat en management (Bachelor) - Prévu 2027",
    "cert.item3": "<strong>HEC</strong> - Certificat d'entrepreneuriat IA - Obtenu 2026",
    "cert.item4": "<strong>MANTU</strong> - Programme Manager Mantu (Business Acquisition) - Délivré nov 2025",
    "cert.item5": "<strong>OXFORD ROYALE ACADEMY</strong> - Certificat d'académie - Délivré juil 2022",
    "projects.kicker": "Travaux sélectionnés",
    "projects.title": "Projets en vedette",
    "projects.kicker.profile": "Projets",
    "projects.title.profile": "Initiatives additionnelles",
    "proj.rtype.title": "R-Type",
    "proj.rtype.oneliner": "Remake multijoueur autoritaire du classique d'arcade de 1987, développé en C++20 avec un ECS maison et un protocole binaire UDP.",
    "proj.rtype.about": "R-Type sépare la logique de jeu de l'affichage : un serveur headless fait tourner la simulation autoritaire réelle, tandis qu'un client SFML léger se contente d'afficher et de capter les entrées. Les deux communiquent via un protocole binaire UDP maison avec en-têtes explicites et sérialisation vérifiée, et toute la logique de jeu tourne sur un ECS maison (rtype_engine) partagé par les deux binaires, ce qui garde la simulation déterministe et synchronisée pour chaque joueur connecté.",
    "proj.rtype.role": "Livraison de fonctionnalités de gameplay côté client — variété des ennemis, comportement des projectiles et des collisions, finitions visuelles — et maintien technique du document d'architecture, de la référence API et du README.",
    "proj.rtype.stack": "Stack : C++20, SFML, ECS, UDP, CMake",
    "proj.area.title": "AREA",
    "proj.area.oneliner": "Plateforme d'automatisation Action-Réaction (façon IFTTT) connectant GitHub, Microsoft 365, Steam et plus via des workflows OAuth.",
    "proj.area.about": "AREA permet à un utilisateur de connecter des services tiers via OAuth, puis d'enchaîner une Action sur un service à une Réaction sur un autre — le même principe qu'IFTTT ou Zapier. Un backend FastAPI gère les utilisateurs, les identifiants OAuth, les webhooks et les planificateurs en arrière-plan ; une application web Vue 3 et une application Android compagnon offrent deux façons de créer et surveiller ces automatisations, le tout tournant derrière Docker Compose et une base PostgreSQL.",
    "proj.area.role": "Rédaction des diagrammes d'architecture système et du guide de contribution utilisés par l'équipe, développement de vues frontend (catalogue de services, tableau de bord), et maintien technique du README.",
    "proj.area.stack": "Stack : FastAPI, Vue 3, PostgreSQL, Docker, Android",
    "proj.zappy.title": "Zappy",
    "proj.zappy.oneliner": "Jeu en réseau multijoueur où des équipes s'affrontent sur une carte de ressources — serveur, IA client et interface 2D via un protocole maison.",
    "proj.zappy.about": "Zappy est un jeu de stratégie en temps réel où plusieurs équipes pilotées par IA s'affrontent sur une carte partagée, récoltant des ressources et effectuant des rituels d'élévation pour gagner. Le projet est découpé en trois parties qui ne s'accordent que sur un protocole texte : un serveur en C qui détient l'état de jeu autoritaire, un client IA écrit dans n'importe quel langage, et une interface 2D qui visualise la partie en direct.",
    "proj.zappy.role": "Rédaction d'une documentation Doxygen de bout en bout sur le serveur, le client IA et l'interface graphique — lecture et documentation précise de trois sous-systèmes dans deux langages — et démarrage du README.",
    "proj.zappy.stack": "Stack : C, C++, Doxygen",
    "proj.arcade.title": "Arcade",
    "proj.arcade.oneliner": "Moteur de jeu à chargement dynamique de bibliothèques graphiques et de jeux — SDL2, SFML ou ncurses, et Snake, Nibbler ou Solar Fox, au choix à l'exécution.",
    "proj.arcade.about": "Arcade repose sur le chargement dynamique de plugins en C++ : le cœur charge les bibliothèques graphiques (SDL2, SFML, ncurses) et les jeux (Snake, Nibbler, Solar Fox) comme bibliothèques partagées via dlopen, permettant de changer l'un ou l'autre à la volée sans recompiler. Une interface commune IGraphics/IGame garde chaque backend graphique et chaque jeu totalement découplé du cœur — le principal défi d'architecture du projet.",
    "proj.arcade.role": "Implémentation du module de jeu Nibbler et maintien d'une documentation de bout en bout : documentation des fonctions, README, et site de documentation publié.",
    "proj.arcade.stack": "Stack : C++, dlopen, SDL2, SFML, ncurses",
    "proj.raytracer.title": "Raytracer",
    "proj.raytracer.oneliner": "Raytracer configurable rendant sphères et plans avec éclairage directionnel et ambiant, piloté par un fichier de scène.",
    "proj.raytracer.stack": "Stack : C++17, libconfig",
    "proj.jetpack.title": "Jetpack",
    "proj.jetpack.oneliner": "Jeu de plateforme multijoueur inspiré de Jetpack Joyride, avec un protocole TCP maison synchronisant client et serveur en temps réel.",
    "proj.jetpack.stack": "Stack : C++, TCP",
    "proj.panoramix.title": "Panoramix",
    "proj.panoramix.oneliner": "Simulation de programmation concurrente modélisant des villageois et un druide avec threads, mutex et sémaphores (projet solo).",
    "proj.panoramix.stack": "Stack : C, pthreads",
    "projectsPage.docs": "Documentation",
    "projectsPage.about": "À propos du projet",
    "projectsPage.moreProjects": "Plus de projets",
    "projectsPage.fullIndex.title": "Index complet des projets EPITECH",
    "projectsPage.fullIndex.body": "Vous cherchez la trace complète ? Tous les projets réalisés à EPITECH — y compris les fondamentaux de première année — sont indexés par année, chaque entrée renvoyant vers son propre dépôt.",
    "experience.kicker": "Parcours professionnel",
    "experience.title": "Temps forts des stages",
    "experience.kicker.profile": "Expérience",
    "experience.title.profile": "Détails des stages",
    "exp1.meta": "Stagiaire développeur logiciel | mars 2026 - août 2026 · 6 mois",
    "exp1.body": "Développement d'une application de maintenance aéronautique, création de fonctionnalités Java en production et contribution à la qualité et aux sprints.",
    "exp1.tools": "Langages : Java, SQL, Neo4j, Python",
    "exp2.meta": "Stagiaire référent IT interne | sept 2025 - fév 2026",
    "exp2.body": "Gestion du support IT interne, amélioration de la fiabilité, automatisation des tâches et soutien à la modernisation du site.",
    "exp2.tools": "Langages et outils : JavaScript, HTML, CSS, SQL, Excel, WordPress",
    "exp3.meta": "Stagiaire développeur Java | sept 2024 - déc 2024",
    "exp3.body": "Migration de composants Java, refactorisation, documentation et stabilisation avec des correctifs ciblés.",
    "exp3.tools": "Langages et outils : Java, SQL, Python, Git, SonarQube, SoapUI",
    "contact.kicker": "Ouvert aux opportunités",
    "contact.title": "Construisons quelque chose d'utile.",
    "contact.body": "Je recherche des stages et des postes juniors en tant que Product Owner ou chef de projet tech, idéalement au sein d'équipes internationales.",
    "contact.email": "M'écrire",
    "contact.github": "Voir GitHub",
    "contact.linkedin": "LinkedIn",
    "footer.text": "© <span id=\"year\"></span> Arnaud Jouan. Construit avec HTML, CSS et JavaScript.",
    "profile.eyebrow": "Profil détaillé",
    "profile.heroText": "<p><strong>Ce que je construis</strong></p><p>Je veux devenir Product Owner : la personne qui transforme les besoins business et client en priorités qu'une équipe de développement peut livrer. Je le fais déjà sur Nexum, un projet d'innovation Epitech de cinq personnes, et mon parcours couvre les deux moitiés du métier.</p><p>Né à Singapour, de nationalité française, j'ai vécu à Singapour, au Vietnam, en Australie et en France, et j'étudie aujourd'hui au Canada. Je travaille couramment en anglais et en français.</p><p>Côté tech, j'ai passé trois stages au sein d'équipes de développement : migration de composants Java legacy à la CPAM des Bouches-du-Rhône, rôle d'unique référent IT interne chez BARJANE, et développement de fonctionnalités Java en production pour une application de maintenance aéronautique chez REACTIS Group. Je sais à quoi ressemblent les sprints, les revues de code et la dette technique côté développeur.</p><p>Côté business, en tant que Directeur Régional et Business Manager de Junior Conseil Taker, j'ai créé l'antenne de Marseille de zéro et l'ai fait grandir jusqu'à 11 membres, en vendant des projets B2B et en pilotant des projets client de bout en bout. En 2026, l'antenne a remporté le Prix de la meilleure étude d'ingénierie, remis par ALTEN, au Congrès National d'Été de la CNJE. En tant que Vice-Président du BDE d'EPITECH Marseille, j'ai animé les réunions hebdomadaires, suivi le budget et mis en place des partenariats avec des entreprises locales.</p>",
    "profile.ctaDownload": "Télécharger le CV",
    "profile.ctaBack": "Retour au portfolio",
    "profile.ctaLinkedin": "LinkedIn",
    "education.kicker": "Formation",
    "education.title": "Parcours académique",
    "education.epitech.location": "Marseille, France",
    "education.epitech.program": "Diplôme d'établissement - Expert en Technologies de l'information (Bac +5)",
    "education.epitech.expected": "Prévu en 2028",
    "education.mcgill.location": "Montréal, Canada",
    "education.mcgill.program": "Certificat en management (parcours Bachelor)",
    "education.mcgill.expected": "Prévu en 2027",
    "education.hec.location": "Paris, France",
    "education.hec.program": "Certificat d'entrepreneuriat IA",
    "education.hec.status": "Obtenu en 2026",
    "education.earlier": "Scolarité antérieure à Singapour, en Australie et en France.",
    "experience.reactis.body": "Travail sur une application de maintenance aéronautique, développement de fonctionnalités Java en production et contribution à la qualité et aux sprints.",
    "experience.reactis.tools": "Langages : Java, SQL, Neo4j, Python",
    "experience.barjane.body": "Gestion du support IT, amélioration de la fiabilité, automatisation des processus et soutien à la modernisation du site.",
    "experience.barjane.tools": "Langages et outils : JavaScript, HTML, CSS, SQL, Excel, WordPress",
    "experience.cpam.body": "Contribution à la migration Java, refactorisation, documentation et stabilisation avec des correctifs ciblés.",
    "experience.cpam.tools": "Langages et outils : Java, SQL, Python, Git, SonarQube, SoapUI",
    "cert.kicker": "Certificats",
    "cert.title": "Certifications et résultats",
    "cert.mantu.meta": "Mantu · Délivré nov 2025",
    "cert.oxford.meta": "Université d'Oxford · Délivré juil 2022",
    "cert.ielts.meta": "IELTS Official · Délivré jan 2023 · Expiré jan 2025",
    "cert.toefl.meta": "TOEFL · Délivré juin 2025",
    "community.kicker": "Communauté",
    "community.title": "Leadership et bénévolat",
    "community.bde.title": "Vice-président du BDE - EPITECH Marseille",
    "community.bde.meta": "EPITECH - Institut européen de technologie · mai 2025 - mars 2026 (11 mois) · Éducation",
    "community.bde.detail1": "Organisation d'événements étudiants (soirées, intégrations, LAN) pour renforcer la cohésion du campus.",
    "community.bde.detail2": "Gestion du bureau BDE, animation des réunions hebdomadaires et coordination avec l'administration.",
    "community.bde.detail3": "Planification des priorités annuelles, suivi budgétaire et partenariats locaux.",
    "community.bde.detail4": "Gestion de la communication et du contenu visuel pour la vie étudiante.",
    "community.bde.impact1": "Participation plus élevée aux événements du BDE.",
    "community.bde.impact2": "Mise en place de partenariats locaux.",
    "community.bde.impact3": "Amélioration de la communication interne et externe.",
    "community.cobra.title": "Cobra Keeper",
    "community.cobra.meta": "EPITECH - Institut européen de technologie · jan 2025 - aujourd'hui · Éducation",
    "community.cobra.detail1": "Animation du Coding Club et Camp via ateliers, challenges et événements.",
    "community.cobra.detail2": "Coordination de l'équipe Cobras et soutien à la motivation.",
    "community.cobra.detail3": "Organisation des journées portes ouvertes pour les futurs étudiants et leurs familles.",
    "community.cobra.impact1": "Participation accrue aux activités Coding Club et Camp.",
    "community.cobra.impact2": "Renforcement de l'engagement et de la cohésion d'équipe.",
    "community.planete.title": "Bénévole - Planète Perles (Les Perles de la Côte Bleue)",
    "community.planete.meta": "sept 2018 - aujourd'hui · Environnement",
    "community.planete.detail1": "Participation à des opérations récurrentes de nettoyage de plages et d'espaces naturels.",
    "community.planete.detail2": "Encadrement de groupes d'enfants et sensibilisation aux enjeux environnementaux.",
    "community.planete.impact1": "Contribution à la préservation des espaces naturels de la Côte Bleue.",
    "community.planete.impact2": "Sensibilisation de dizaines d'enfants au respect de l'environnement.",
    "community.planete.impact3": "Renforcement des liens entre actions communautaires et écologie.",
    "community.planete.support": "Activité associée : nettoyage de plage avec Bootcamp Côte Bleue",
    "community.bootcamp.title": "Bénévole - Bootcamp Côte Bleue",
    "community.bootcamp.meta": "sept 2018 - aujourd'hui · Santé",
    "community.bootcamp.detail1": "Modération et montage de vidéos YouTube pour promouvoir les sessions.",
    "community.bootcamp.detail2": "Gestion de la communication communautaire sur les réseaux sociaux.",
    "community.bootcamp.detail3": "Développement d'un site moderne pour améliorer la visibilité en ligne.",
    "community.bootcamp.detail4": "Participation aux sessions pour soutenir les membres et l'engagement.",
    "community.bootcamp.impact1": "Visibilité digitale accrue et croissance de la participation.",
    "community.bootcamp.impact2": "Communauté plus forte et plus active.",
    "community.bootcamp.impact3": "Cohésion de groupe améliorée pendant les sessions.",
    "community.bootcamp.support": "Activité associée : highlights des sessions Bootcamp Côte Bleue",
    "projects.jeb.title": "JEB Incubator - Survivor Seminar EPITECH",
    "projects.jeb.meta": "sept 2025 · Associé à EPITECH - Institut européen de technologie",
    "projects.jeb.body": "Livraison en 21 jours d'une plateforme web pour valoriser les projets d'incubateur et faciliter les connexions entre startups, investisseurs et partenaires.",
    "projects.jeb.detail1": "Création de pages catalogue, espaces startup, messagerie interne, actualités et calendrier d'événements.",
    "projects.jeb.detail2": "Implémentation d'un backend complet avec opérations CRUD et intégration base de données avec une API existante.",
    "projects.jeb.detail3": "Développement d'un frontend responsive et accessible, avec back-office admin pour contenu, utilisateurs et statistiques.",
    "projects.jeb.detail4": "Travail en mode agile avec retours client continus et évolution des exigences.",
    "projects.jeb.impact1": "Note A pour la livraison du projet.",
    "projects.jeb.impact2": "Solution fonctionnelle livrée dans un délai court.",
    "projects.jeb.impact3": "Renforcement des compétences fullstack, UX/UI, gestion client et collaboration agile.",
    "projects.jeb.stack": "Stack : Vite, Vue.js, Django, Python, Docker, GitHub Actions",
    "projects.hackathon.title": "Hackathon KEDGE Business School x EPITECH",
    "projects.hackathon.meta": "mars 2025 - avril 2025 · Associé à EPITECH - Institut européen de technologie",
    "projects.hackathon.body": "Contribution à la résolution d'un challenge business pour Biotech One en combinant technique, analyse de marché et stratégie.",
    "projects.hackathon.detail1": "Analyse de la rentabilité des ingrédients pour recommander la meilleure option économique.",
    "projects.hackathon.detail2": "Études de marché et analyse concurrentielle pour identifier tendances, opportunités et besoins clients.",
    "projects.hackathon.detail3": "Collecte de la Voix du Client via interviews et retours terrain.",
    "projects.hackathon.detail4": "Construction d'un modèle business complet incluant SWOT, proposition de valeur, cibles et estimations de coûts.",
    "projects.hackathon.impact1": "Remise d'un rapport stratégique complet à Biotech One en fin de hackathon.",
    "projects.hackathon.impact2": "Renforcement des compétences en analyse business, marketing et collaboration inter-écoles.",
    "projects.hackathon.impact3": "Expérience pratique sur un problème d'entreprise réel.",
    "projects.hackathon.support": "Support : présentation finale avec l'équipe KEDGE (hackathon Biotech One)",
    "skills.technical": "Technique",
    "skills.technical.item1": "C, C++, Java, Python, SQL",
    "skills.technical.item2": "Web : JavaScript, Vue.js, FastAPI, Django",
    "skills.technical.item3": "Docker, Git, GitHub Actions, SonarQube",
    "skills.professional": "Professionnel",
    "skills.professional.item1": "Product ownership : roadmap, backlog, MoSCoW, critères d'acceptation",
    "skills.professional.item2": "Management d'équipe et relation client",
    "skills.professional.item3": "Livraison agile avec GitHub Projects, revues et jalons",
    "skills.languages": "Langues",
    "skills.languages.item1": "Anglais (bilingue)",
    "skills.languages.item2": "Français (bilingue)",
    "skills.languages.item3": "Espagnol (niveau professionnel limité)",
    "skills.languages.item4": "Chinois (niveau débutant)",
    "skills.kicker": "Forces clés",
    "skills.title": "Aperçu des compétences",
    "footer.profile": "© <span id=\"year\"></span> Arnaud Jouan. Page de profil détaillée.",
    "meta.title.projects": "Arnaud Jouan | Projets",
    "meta.description.projects": "Un aperçu détaillé des projets EPITECH d'Arnaud Jouan sur les trois années.",
    "projectsPage.kicker": "Travaux sélectionnés",
    "projectsPage.title": "Détails des projets",
    "projectsPage.intro": "Un aperçu des produits que j'ai pilotés et des projets réalisés à EPITECH : le problème, nos priorités et la partie dont je me suis occupé. Nexum et JEB Incubator montrent le côté produit ; les projets techniques plus bas montrent le bagage d'ingénieur que j'apporte à une équipe de développement.",
    "projectsPage.whatIBuilt": "Mon rôle",
    "projectsPage.results": "Résultats",
    "projectsPage.clientKicker": "Projet client",
    "projectsPage.viewDetails": "Détails du projet",
    "projectsPage.viewRepo": "Voir le dépôt",
    "common.repoLink": "Dépôt",
    "footer.projects": "© <span id=\"year\"></span> Arnaud Jouan. Page des projets.",
    "githubPage.kicker": "GitHub",
    "githubPage.title": "Derniers dépôts GitHub",
    "githubPage.loading": "Chargement des dépôts…",
    "contact.formTitle": "Ou envoyez-moi un message directement",
    "contact.copyEmail": "Copier l'e-mail",
    "contact.copied": "Copié !",
    "contact.vcard": "Enregistrer le contact",
    "form.name": "Nom",
    "form.email": "E-mail",
    "form.message": "Message",
    "form.send": "Envoyer le message",
    "form.sending": "Envoi…",
    "form.success": "Merci — votre message a été envoyé !",
    "form.error": "Une erreur est survenue. Écrivez-moi directement par e-mail.",
    "notfound.eyebrow": "404",
    "notfound.title": "Page introuvable",
    "notfound.body": "La page que vous cherchez n'existe pas ou a été déplacée. Revenons sur la bonne voie.",
    "projectsPage.leadKicker": "Product Lead · En cours",
    "proj.nexum.title": "Nexum",
    "proj.nexum.oneliner": "Un centre de contrôle no-code qui bascule tout ton setup PC (volume, luminosité, lumières, applis, jeux) en un clic. Projet innovant Epitech (EIP), mené par une équipe de cinq de juillet 2026 à juillet 2027.",
    "proj.nexum.meta": "Product Owner et chef de projet · juil. 2026 - juil. 2027 (en cours)",
    "proj.nexum.stack": "Stack : Rust, Tauri 2, React, TypeScript, SQLite, GitHub Projects",
    "projectsPage.problem": "Le problème et pour qui",
    "proj.nexum.problem": "Passer du travail au jeu, au stream ou à une soirée calme oblige à régler une dizaine de choses à la main, et chaque marque impose sa propre appli. Nexum est conçu autour de trois personas : Léo, joueur compétitif qui veut zéro temps de préparation ; Maxime, streamer qui veut lancer son live en un clic ; et Sarah, développeuse en télétravail qui veut séparer nettement pro et perso.",
    "proj.nexum.role": "Je porte la roadmap, le backlog et les jalons, je mène les suivis avec le mentor et je répartis le travail dans l'équipe. Je contribue aussi au code côté front et compatibilité macOS, dont un prototype de commande vocale en local.",
    "projectsPage.prioritise": "Comment on priorise",
    "proj.nexum.prio1": "Chaque fonctionnalité de la bêta est classée en MoSCoW : un Must bloque la bêta, un Could saute si le temps manque.",
    "proj.nexum.prio2": "Une règle de cadrage : mieux vaut 9 fonctionnalités qui marchent à 100 % en live que 30 à moitié. La démo finale devant le jury se fait en direct, la vidéo est interdite.",
    "proj.nexum.prio3": "Volontairement sortis de la bêta : le support macOS, les vrais périphériques RGB, le paiement sur la marketplace, l'appli mobile complète et les launchers Epic/GOG. Philips Hue reste le seul effet matériel réel de la démo.",
    "projectsPage.backlog": "Extraits du backlog",
    "proj.nexum.story1": "<strong>En tant que Sarah</strong>, je veux créer un mode Chill sans écrire de code, pour retrouver mon setup du soir en un clic.",
    "proj.nexum.story1.ac": "Critères : un nouvel utilisateur crée et sauvegarde un mode de 3 étapes ou plus en moins de 3 minutes · le mode est toujours là après redémarrage · l'éditeur ne propose que des actions autorisées, aucune injection de code possible.",
    "proj.nexum.story2": "<strong>En tant que Maxime</strong>, je veux que mon mode Direct change mes lumières Philips Hue, pour installer ma scène de stream en un clic.",
    "proj.nexum.story2.ac": "Critères : activer le mode change physiquement une vraie lampe Hue devant le jury · sans pont Hue, l'étape est signalée incompatible, sans crash · moins de 2 secondes entre l'activation et le changement de lumière.",
    "proj.nexum.story3": "<strong>En tant que Léo</strong>, je veux décrire une session en une phrase et obtenir un mode prêt à l'emploi.",
    "proj.nexum.story3.ac": "Critères : « prépare-moi une session Valorant tranquille ce soir » produit un mode cohérent avec des actions valides · le mode généré passe le contrôle d'allowlist avant toute exécution · aucune sortie de l'IA ne s'exécute sans validation.",
    "projectsPage.teamWork": "Comment l'équipe travaille",
    "proj.nexum.team1": "J'ai mis en place le board GitHub Projects (À faire, En cours, Revue, Terminé) avec quatre jalons calqués sur les phases de l'EIP. Le backlog compte 109 issues, chacune avec un responsable nommé.",
    "proj.nexum.team2": "Chaque tâche a sa propre branche, et rien n'arrive sur main sans relecture et validation d'un autre membre.",
    "proj.nexum.team3": "Des rôles clairs : un développeur front principal, deux développeurs back, un responsable business et KPI, et moi en Product Owner.",
    "proj.nexum.team4": "Des suivis avec le mentor toutes les six semaines, chacun devant montrer une progression mesurable.",
    "projectsPage.aiSecurity": "IA et sécurité dès la conception",
    "proj.nexum.ai1": "Mode-as-Code : l'utilisateur décrit un mode en une phrase. L'IA ne renvoie que des données déclaratives, vérifiées contre une allowlist avant toute exécution. Elle ne génère jamais de code exécutable.",
    "proj.nexum.ai2": "Les modes partagés sur la marketplace passent par une analyse statique et reçoivent un score de risque avant de pouvoir être importés.",
    "proj.nexum.ai3": "Pour la commande vocale, j'ai choisi la transcription Whisper en local : gratuite, hors ligne, et aucun son ne quitte l'ordinateur de l'utilisateur.",
    "projectsPage.status": "Où en est le projet",
    "proj.nexum.status": "La phase 0 (fondations et validation marché) court jusqu'en octobre 2026 : le cœur de l'appli fonctionne et les entretiens utilisateurs démarrent. Le premier plan de bêta-test est attendu en février 2027 et la démo live devant le jury en juillet 2027.",
    "projectsPage.website": "Site web",
    "community.taker.title": "Directeur Régional - Junior Conseil Taker (Marseille)",
    "community.taker.meta": "Junior-Entreprise · Deux mandats · Développement commercial, puis direction régionale",
    "community.taker.detail1": "Création de l'antenne marseillaise de Taker à partir de zéro, jusqu'à une équipe de 11 membres.",
    "community.taker.detail2": "Débuts en tant que Chargé d'Affaires avant de devenir Directeur Régional, avec aussi un rôle sur le système d'information.",
    "community.taker.detail3": "Accueil et co-organisation du concours de prospection JEM × Mantu sur le campus d'Epitech Marseille (22 mai 2026) : équipes mixtes des Junior-Entreprises de la région et consultants Mantu, clôturé par une remise des prix.",
    "community.taker.detail4": "Représentation de Taker dans le réseau régional des Junior-Entreprises, notamment au conseil du 6 avril 2026.",
    "community.taker.detail5": "Formation du responsable communication qui a pris le relais après moi.",
    "community.taker.impact1": "Taker a remporté le Prix de la meilleure étude d'ingénierie, remis par ALTEN, au Congrès National d'Été 2026 de la CNJE (5-7 juin, 1 200 étudiants de plus de 100 écoles).",
    "community.taker.impact2": "Participation aux congrès nationaux (CNE et CNH) avec l'équipe Taker.",
    "community.taker.impact3": "Une équipe de 11 membres et une antenne désormais installée dans le paysage économique et Junior-Entreprise marseillais.",
    "stats.team": "personnes dans l'équipe produit Nexum que je dirige",
    "stats.branch": "membres dans l'antenne de Junior-Entreprise que j'ai créée",
    "stats.client": "pour livrer une plateforme client, notée A",
    "stats.clientValue": "21 jours",
    "stats.internships": "stages tech au sein d'équipes de développement",
  },
};

// Look up a translation for the language currently applied to <html>.
function tr(key, fallback) {
  const dict = translations[document.documentElement.lang] || translations.en;
  return dict[key] || fallback || key;
}

function updateYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Turn a "Label: A, B, C" string into a row of chip elements.
function renderTechChips() {
  document.querySelectorAll(".tech-chips").forEach((el) => {
    const text = el.textContent;
    if (!text) {
      return;
    }
    const colon = text.indexOf(":");
    const list = colon >= 0 ? text.slice(colon + 1) : text;
    const items = list
      .split(/[,·]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (!items.length) {
      return;
    }
    el.innerHTML = items
      .map((item) => {
        const safe = item
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<span class="chip">${safe}</span>`;
      })
      .join("");
  });
}

function applyTranslations(lang) {
  const dictionary = translations[lang] || translations.en;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (el.hasAttribute("data-i18n-attr")) {
      return; // these translate an attribute (e.g. placeholder), handled below
    }
    const key = el.dataset.i18n;
    const value = dictionary[key];
    if (value) {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    const value = dictionary[key];
    if (value) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr;
    const value = dictionary[key];
    if (value && attr) {
      el.setAttribute(attr, value);
    }
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  updateYear();
  renderTechChips();
}

function detectInitialLang() {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === "en" || stored === "fr") {
    return stored;
  }
  // No saved preference yet: fall back to the visitor's browser language.
  const browserLang =
    (navigator.languages && navigator.languages[0]) || navigator.language || "en";
  return browserLang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

const savedLang = detectInitialLang();
applyTranslations(savedLang);

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang || "en";
    localStorage.setItem(LANGUAGE_KEY, lang);
    applyTranslations(lang);
  });
});

const navEl = document.querySelector(".nav");
const navToggle = document.querySelector(".nav-toggle");
if (navEl && navToggle) {
  const setOpen = (open) => {
    navEl.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };

  navToggle.addEventListener("click", () => {
    setOpen(!navEl.classList.contains("is-open"));
  });

  const navLinks = document.getElementById("primary-nav");
  if (navLinks) {
    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });
  }
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0 }
);

revealElements.forEach((el) => observer.observe(el));

// Scroll-spy: highlight the nav link for the section currently in view.
// Matches the "#fragment" of any nav link (works for same-page "#x" links on
// the home page and cross-page "index.html#x" links on the profile page), then
// only observes sections whose id actually exists on the current page.
const spyLinks = document.querySelectorAll('.nav-links a[href*="#"]');
if (spyLinks.length) {
  const linkFor = {};
  spyLinks.forEach((link) => {
    const id = link.getAttribute("href").split("#")[1];
    if (id) {
      linkFor[id] = link;
    }
  });

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const link = linkFor[entry.target.id];
        if (!link) {
          return;
        }
        spyLinks.forEach((other) => other.classList.remove("is-current"));
        link.classList.add("is-current");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  Object.keys(linkFor).forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      spy.observe(section);
    }
  });
}

function initEarthGlobe() {
  const canvas = document.getElementById("earthGlobe");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let rotation = 0;
  let frameHandle = 0;
  const autoRotateSpeed = 0.0018;
  const dragSensitivity = 0.008;
  const tiltSensitivity = 0.004;
  const maxTilt = (75 * Math.PI) / 180;
  let isDragging = false;
  let activePointerId = null;
  let lastPointerX = 0;
  let lastPointerY = 0;

  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";

  let centerLat = (15 * Math.PI) / 180;

  const countries = [
    { name: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Vietnam", lat: 14.0583, lon: 108.2772 },
    { name: "Australia", lat: -35.2809, lon: 149.13 },
    { name: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Canada", lat: 45.4215, lon: -75.6972 },
  ];

  let worldFeatures = [];

  const fallbackContinents = [
    [
      [71, -156], [64, -110], [53, -95], [49, -125], [31, -117], [23, -103], [9, -86],
      [20, -74], [36, -83], [47, -67], [57, -63], [67, -90],
    ],
    [
      [59, -10], [56, 8], [52, 22], [48, 36], [43, 44], [41, 30], [38, 14], [45, 2],
    ],
    [
      [37, -17], [32, 4], [19, 17], [5, 10], [-14, 16], [-35, 18], [-27, 32], [5, 39],
      [20, 45], [33, 34],
    ],
    [
      [70, 40], [59, 78], [50, 116], [44, 141], [30, 120], [15, 105], [7, 77], [24, 58],
      [39, 55], [50, 62], [58, 52],
    ],
    [
      [-11, 114], [-24, 113], [-34, 132], [-28, 152], [-18, 147],
    ],
  ];

  function project(latDeg, lonDeg, radius) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const deltaLon = lon - rotation;
    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);
    const cosDeltaLon = Math.cos(deltaLon);
    const sinCenterLat = Math.sin(centerLat);
    const cosCenterLat = Math.cos(centerLat);
    const visibility = sinCenterLat * sinLat + cosCenterLat * cosLat * cosDeltaLon;

    if (visibility <= 0) {
      return null;
    }

    return {
      x: radius * cosLat * Math.sin(deltaLon),
      y: -radius * (cosCenterLat * sinLat - sinCenterLat * cosLat * cosDeltaLon),
      visibility,
    };
  }

  function drawGraticule(radius) {
    ctx.strokeStyle = "rgba(239, 247, 255, 0.14)";
    ctx.lineWidth = 1;

    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = project(lat, lon, radius);
        if (!p) {
          started = false;
          continue;
        }
        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -85; lat <= 85; lat += 3) {
        const p = project(lat, lon, radius);
        if (!p) {
          started = false;
          continue;
        }
        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
  }

  function drawVisibleRingPath(ring, radius) {
    let hasStroke = false;
    let segmentOpen = false;

    ring.forEach(([lon, lat]) => {
      const p = project(lat, lon, radius);
      if (!p || p.visibility <= 0) {
        segmentOpen = false;
        return;
      }

      const px = canvas.width / 2 + p.x;
      const py = canvas.height / 2 + p.y;
      if (!segmentOpen) {
        ctx.moveTo(px, py);
        segmentOpen = true;
        hasStroke = true;
      } else {
        ctx.lineTo(px, py);
      }
    });

    return hasStroke;
  }

  function drawRealCountryOutlines(radius) {
    if (!worldFeatures.length) {
      return false;
    }

    ctx.strokeStyle = "rgba(98, 208, 149, 0.9)";
    ctx.lineWidth = Math.max(0.8, canvas.width * 0.0028);

    worldFeatures.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry) {
        return;
      }

      if (geometry.type === "Polygon") {
        ctx.beginPath();
        let hasPath = false;
        geometry.coordinates.forEach((ring) => {
          if (drawVisibleRingPath(ring, radius)) {
            hasPath = true;
          }
        });
        if (hasPath) {
          ctx.stroke();
        }
        return;
      }

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          ctx.beginPath();
          let hasPath = false;
          polygon.forEach((ring) => {
            if (drawVisibleRingPath(ring, radius)) {
              hasPath = true;
            }
          });
          if (hasPath) {
            ctx.stroke();
          }
        });
      }
    });

    return true;
  }

  function drawFallbackContinents(radius) {
    ctx.fillStyle = "rgba(42, 139, 99, 0.82)";
    ctx.strokeStyle = "rgba(172, 234, 204, 0.3)";
    ctx.lineWidth = 1;

    fallbackContinents.forEach((shape) => {
      ctx.beginPath();
      let started = false;
      shape.forEach(([lat, lon]) => {
        const p = project(lat, lon, radius);
        if (!p) {
          return;
        }

        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      });

      if (started) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
  }

  function loadWorldGeometry() {
    // GeoJSON is bundled as a <script> (assets/world-geo.js) that sets
    // window.WORLD_GEOJSON. Loading it this way works both over http and
    // when the page is opened directly from disk (file://), unlike fetch().
    const data = window.WORLD_GEOJSON;
    if (data && Array.isArray(data.features)) {
      worldFeatures = data.features;
      drawGlobe();
    } else {
      // Keep fallback continent rendering if the geometry is unavailable.
      console.warn("World geometry unavailable, using fallback land shapes.");
    }
  }

  function drawCountryDots(radius) {
    countries.forEach((country) => {
      const p = project(country.lat, country.lon, radius);
      if (!p) {
        return;
      }

      const px = canvas.width / 2 + p.x;
      const py = canvas.height / 2 + p.y;

      ctx.beginPath();
      ctx.fillStyle = "rgba(253, 224, 71, 0.98)";
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(253, 224, 71, 0.45)";
      ctx.lineWidth = 2;
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.stroke();

      const labelOffset = p.x >= 0 ? 10 : -10;
      const labelX = px + labelOffset;
      const labelY = py - 10;

      ctx.font = `${Math.max(10, canvas.width * 0.028)}px "Sora", sans-serif`;
      ctx.textAlign = p.x >= 0 ? "left" : "right";
      ctx.textBaseline = "middle";

      const textWidth = ctx.measureText(country.name).width;
      const paddingX = 5;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = Math.max(14, canvas.width * 0.04);
      const boxLeft = p.x >= 0 ? labelX - paddingX : labelX - boxWidth + paddingX;
      const boxTop = labelY - boxHeight / 2;

      ctx.fillStyle = "rgba(6, 20, 33, 0.75)";
      ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

      ctx.fillStyle = "rgba(239, 247, 255, 0.95)";
      ctx.fillText(country.name, labelX, labelY);
    });
  }

  function drawGlobe() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const target = Math.max(1, Math.floor(size * dpr));

    if (canvas.width !== target || canvas.height !== target) {
      canvas.width = target;
      canvas.height = target;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = canvas.width * 0.46;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const oceanGradient = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.4,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    oceanGradient.addColorStop(0, "#5ec4ff");
    oceanGradient.addColorStop(0.5, "#1178b6");
    oceanGradient.addColorStop(1, "#0a2f4d");

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGradient;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    drawGraticule(radius);
    const hasRealOutlines = drawRealCountryOutlines(radius);
    if (!hasRealOutlines) {
      drawFallbackContinents(radius);
    }
    drawCountryDots(radius);

    const shadeGradient = ctx.createRadialGradient(
      cx + radius * 0.55,
      cy - radius * 0.2,
      radius * 0.25,
      cx,
      cy,
      radius * 1.2
    );
    shadeGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    shadeGradient.addColorStop(1, "rgba(0, 0, 0, 0.44)");
    ctx.fillStyle = shadeGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(239, 247, 255, 0.34)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.006);
    ctx.stroke();
  }

  let running = false;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 30; // cap the globe at ~30fps to save CPU

  function renderFrame(now) {
    if (!running) {
      return;
    }
    frameHandle = window.requestAnimationFrame(renderFrame);

    if (!lastFrameTime) {
      lastFrameTime = now;
    }
    const elapsed = now - lastFrameTime;
    if (elapsed < frameInterval) {
      return;
    }
    lastFrameTime = now - (elapsed % frameInterval);

    if (!isDragging) {
      // Advance by real elapsed time so speed is independent of frame rate.
      rotation += autoRotateSpeed * (elapsed / 16.6667);
    }
    drawGlobe();
  }

  function startGlobe() {
    if (running || prefersReducedMotion) {
      return;
    }
    running = true;
    lastFrameTime = 0;
    frameHandle = window.requestAnimationFrame(renderFrame);
  }

  function stopGlobe() {
    running = false;
    if (frameHandle) {
      window.cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  }

  function onPointerDown(event) {
    isDragging = true;
    activePointerId = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    rotation -= deltaX * dragSensitivity;
    centerLat += deltaY * tiltSensitivity;
    centerLat = Math.max(-maxTilt, Math.min(maxTilt, centerLat));

    if (prefersReducedMotion) {
      drawGlobe();
    }
  }

  function endPointerDrag(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    isDragging = false;
    activePointerId = null;
    canvas.style.cursor = "grab";
    canvas.releasePointerCapture(event.pointerId);
  }

  drawGlobe();
  loadWorldGeometry();

  // Only animate while the globe is actually visible on screen — this stops
  // the per-frame world redraw from burning CPU while reading the rest of the page.
  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startGlobe();
        } else {
          stopGlobe();
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(canvas);
  } else {
    startGlobe();
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endPointerDrag);
  canvas.addEventListener("pointercancel", endPointerDrag);

  window.addEventListener("resize", drawGlobe);
  window.addEventListener("pagehide", () => {
    stopGlobe();

    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", endPointerDrag);
    canvas.removeEventListener("pointercancel", endPointerDrag);
  });
}

initEarthGlobe();

// --- Scroll progress bar ---
(function () {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
})();

// --- Light/dark theme toggle (button injected next to the language toggle) ---
(function () {
  const root = document.documentElement;
  const host = document.querySelector(".lang-toggle");
  if (!host) {
    return;
  }
  const moon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  const sun =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-btn";
  btn.setAttribute("aria-label", "Toggle light or dark theme");
  const sync = () => {
    const isLight = root.getAttribute("data-theme") === "light";
    btn.innerHTML = isLight ? sun : moon;
    btn.setAttribute("aria-pressed", String(isLight));
  };
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    sync();
  });
  sync();
  host.appendChild(btn);
})();

// --- Live GitHub repositories (only where a #github-repos container exists) ---
(function () {
  const container = document.getElementById("github-repos");
  if (!container) {
    return;
  }
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  fetch("https://api.github.com/users/Arjouan/repos?sort=updated&per_page=6")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((repos) => {
      if (!Array.isArray(repos) || !repos.length) {
        container.innerHTML = '<p class="muted">No public repositories to show yet.</p>';
        return;
      }
      container.innerHTML = repos
        .map((repo) => {
          const desc = repo.description ? "<p>" + esc(repo.description) + "</p>" : "";
          const lang = repo.language ? esc(repo.language) : "";
          const stars = repo.stargazers_count ? " · ★ " + repo.stargazers_count : "";
          return (
            '<article class="card">' +
            "<h3>" + esc(repo.name) + "</h3>" +
            desc +
            '<p class="meta">' + lang + stars + "</p>" +
            '<div class="card-links"><a href="' + repo.html_url +
            '" target="_blank" rel="noreferrer">' + tr("common.repoLink", "Repository") + "</a></div>" +
            "</article>"
          );
        })
        .join("");
    })
    .catch(() => {
      container.innerHTML =
        '<p class="muted">Couldn\'t load repositories right now — visit <a href="https://github.com/Arjouan" target="_blank" rel="noreferrer">github.com/Arjouan</a>.</p>';
    });
})();

// --- Contact form (Web3Forms) ---
(function () {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = tr("form.sending", "Sending…");
    const data = Object.fromEntries(new FormData(form).entries());
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          status.textContent = tr("form.success", "Thanks — your message has been sent!");
          status.classList.add("is-success");
          form.reset();
        } else {
          status.textContent = tr("form.error", "Something went wrong. Please email me directly.");
          status.classList.add("is-error");
        }
      })
      .catch(() => {
        status.textContent = tr("form.error", "Something went wrong. Please email me directly.");
        status.classList.add("is-error");
      });
  });
})();

// --- Copy-to-clipboard email ---
(function () {
  const btn = document.querySelector(".copy-email");
  if (!btn) {
    return;
  }
  const label = btn.querySelector(".copy-email-label");
  const email = btn.dataset.email || "";
  let timer;
  const confirm = () => {
    if (label) {
      label.textContent = tr("contact.copied", "Copied!");
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (label) {
        label.textContent = tr("contact.copyEmail", "Copy email");
      }
    }, 2000);
  };
  const legacyCopy = () => {
    const ta = document.createElement("textarea");
    ta.value = email;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    confirm();
  };
  btn.addEventListener("click", () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(confirm).catch(legacyCopy);
    } else {
      legacyCopy();
    }
  });
})();

// --- Plane transition into the detailed profile (once per session) ---
(function () {
  const links = document.querySelectorAll('a[href="profile.html"]');
  if (!links.length) {
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return; // respect reduced motion — navigate normally
  }
  let alreadyFlown = false;
  try {
    alreadyFlown = sessionStorage.getItem("planeShown") === "1";
  } catch (e) {}
  if (alreadyFlown) {
    return; // only play once per browsing session
  }

  const planeSvg =
    '<div class="plane-fly">' +
    '<div class="plane3d">' +
    '<span class="wing wing-l"></span>' +
    '<span class="wing wing-r"></span>' +
    '</div></div>';

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      // Let modified clicks (open in new tab, etc.) behave normally.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        return;
      }
      event.preventDefault();
      const href = link.getAttribute("href");
      try {
        sessionStorage.setItem("planeShown", "1");
      } catch (e) {}

      const overlay = document.createElement("div");
      overlay.className = "plane-transition";
      overlay.setAttribute("aria-hidden", "true");
      overlay.innerHTML = planeSvg;
      document.body.appendChild(overlay);
      window.requestAnimationFrame(() => overlay.classList.add("is-active"));

      window.setTimeout(() => {
        window.location.href = href;
      }, 1750);
    });
  });
})();

// --- Service worker (PWA). Only registers in a secure context (https/localhost). ---
(function () {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    return;
  }
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
})();
