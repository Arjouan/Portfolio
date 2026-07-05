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
    "meta.description.portfolio": "Arnaud Jouan portfolio - software engineering projects, internships, and contact.",
    "meta.title.portfolio": "Arnaud Jouan | Portfolio",
    "meta.description.profile": "Detailed profile of Arnaud Jouan: education, internships, certifications, and career goals.",
    "meta.title.profile": "Arnaud Jouan | Detailed Profile",
    "nav.detailedProfile": "Detailed Profile",
    "nav.profile": "Profile",
    "nav.projects": "Projects",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "hero.eyebrow": "Computer Science Engineer Student",
    "hero.subtitle": "Singapore-born, bilingual in English and French, and currently in my 3rd year at EPITECH. I am building a career at the intersection of management, commerce, and information technology.",
    "hero.ctaProfile": "Read Full Profile",
    "hero.ctaGithub": "GitHub",
    "hero.ctaLinkedin": "LinkedIn",
    "profile.kicker": "Who I Am",
    "profile.title": "Profile",
    "about.title": "About Me",
    "about.body": "I am targeting roles that combine management, technology, and commercial impact. My objective is to lead projects where business strategy, client value, and software execution are perfectly aligned. Having lived across four continents, I bring a highly adaptable, cross-cultural mindset to my work. My experience bridges both sides of the tech-business equation: I build secure, scalable solutions as a Software Engineer (currently at REACTIS Group), while also driving B2B sales, managing cross-functional teams, and building regional strategies as a Business Manager. Ultimately, I am passionate about bridging the gap between complex IT capabilities and tangible commercial growth.",
    "work.title": "Work Experience",
    "work.item1": "<strong>REACTIS Group</strong> - Software Developer Intern (Mar 2026 - Present)",
    "work.item2": "<strong>BARJANE</strong> - Internal IT Referent Intern (Sep 2025 - Feb 2026)",
    "work.item3": "<strong>CPAM</strong> - Java Developer Intern (Sep 2024 - Dec 2024)",
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
    "project1.title": "EPITECH Year 1 Projects",
    "project1.body": "Foundational C projects focused on algorithms, Unix programming, and clean software structure.",
    "project1.stack": "Stack: C, Makefile, Linux",
    "project1.details": "Project Details",
    "project1.repo": "Repository",
    "project2.title": "EPITECH Year 2 Projects",
    "project2.body": "Intermediate projects covering software engineering practices, architecture, and application development.",
    "project2.stack": "Stack: C, C++, Networking, Systems",
    "project2.details": "Project Details",
    "project2.repo": "Repository",
    "project3.title": "EPITECH Year 3 Projects",
    "project3.body": "Advanced projects emphasizing scalable solutions, collaboration, and production-oriented delivery.",
    "project3.stack": "Stack: Java, Web, Cloud, DevOps",
    "project3.details": "Project Details",
    "project3.repo": "Repository",
    "experience.kicker": "Professional Path",
    "experience.title": "Internship Highlights",
    "experience.kicker.profile": "Experience",
    "experience.title.profile": "Internship Details",
    "exp1.meta": "Software Developer Intern | Mar 2026 - Present",
    "exp1.body": "Working as a developer on an aeronautical maintenance application, developing and maintaining Java features for production, writing clean and testable code, and supporting sprint delivery through code reviews and bug fixing.",
    "exp1.tools": "Languages: Java, SQL, Neo4j, Python",
    "exp2.meta": "Internal IT Referent Intern | Sep 2025 - Feb 2026",
    "exp2.body": "Managed internal IT operations, improved infrastructure reliability, automated recurring support tasks, and contributed to website modernization projects to improve user experience and reduce manual interventions.",
    "exp2.tools": "Languages & tools: JavaScript, HTML, CSS, SQL, Excel, WordPress",
    "exp3.meta": "Java Developer Intern | Sep 2024 - Dec 2024",
    "exp3.body": "Participated in migrating legacy Java components to a more maintainable architecture, improved code quality through refactoring and documentation, and helped stabilize the application with targeted fixes and validation testing.",
    "exp3.tools": "Languages & Tools: Java, SQL, Python, Git, SonarQube, SoapUI",
    "contact.kicker": "Open To Opportunities",
    "contact.title": "Let us build something useful.",
    "contact.body": "I am currently looking for internships and engineering opportunities with international teams.",
    "contact.email": "Email Me",
    "contact.github": "View GitHub",
    "contact.linkedin": "LinkedIn",
    "footer.text": "<span id=\"year\"></span> Arnaud Jouan. Built with HTML, CSS, and JavaScript.",
    "profile.eyebrow": "Detailed Profile",
    "profile.heroText": "<p><strong>What I Am Building Toward</strong></p><p>I am targeting roles that combine management responsibilities with technology and commercial impact. My objective is to lead projects where business strategy, client value, and software execution are perfectly aligned.</p><p>Born in Singapore with French nationality, I am a true global citizen. Having lived across four continents - in Singapore, Vietnam, Australia, and France - and with upcoming studies in Canada, I am fully bilingual in English and French. This international journey has given me a highly adaptable mindset and a deep appreciation for cross-cultural collaboration.</p><p>My professional journey is rooted in solving complex technical challenges and optimizing infrastructures. From modernizing legacy Java systems at CPAM des Bouches-du-Rhone to acting as the sole internal IT referent at BARJANE, I thrive on building secure, efficient, and scalable tech solutions. Currently, I am further honing my development skills as a Software Engineer at REACTIS Group.</p><p>Beyond the code, I know that technology is most powerful when aligned with business strategy. As Regional Director and Business Manager for Junior Conseil Taker, I built the Marseille branch from the ground up, managing cross-functional teams, driving B2B sales, and managing end-to-end client projects. Whether I am defining regional strategies or modeling business solutions at hackathons, I am passionate about bridging the gap between technical execution and commercial growth.</p>",
    "profile.ctaDownload": "Download CV",
    "profile.ctaBack": "Back to Portfolio",
    "profile.ctaLinkedin": "LinkedIn",
    "career.kicker": "Career Goal",
    "career.title": "What I Am Building Toward",
    "career.body": "I am targeting roles that combine management responsibilities with technology and commercial impact. My objective is to lead projects where business strategy, client value, and software execution are aligned.",
    "education.kicker": "Education",
    "education.title": "Academic Path",
    "education.epitech.location": "Marseille, France",
    "education.epitech.program": "Diplome d'Etablissement - Expert en Technologies de l'information (Bac +5)",
    "education.epitech.expected": "Expected in 2028",
    "education.mcgill.location": "Montreal, Canada",
    "education.mcgill.program": "Certificate in Management (Bachelor Degree track)",
    "education.mcgill.expected": "Expected in 2027",
    "education.hec.location": "Paris, France",
    "education.hec.program": "AI Entrepreneurship Certificate",
    "education.hec.status": "Obtained in 2026",
    "education.earlier": "Earlier Education",
    "experience.reactis.body": "Working on an aeronautical maintenance application, developing production Java features, and contributing to code quality and sprint delivery with the engineering team.",
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
    "community.title": "Volunteering Experience",
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
    "community.planete.title": "Volunteer - Planete Perles (Les Perles de la Cote Bleue)",
    "community.planete.meta": "Sep 2018 - Present · Environment",
    "community.planete.detail1": "Participated in recurring beach and natural-area cleanup operations.",
    "community.planete.detail2": "Guided children groups and raised awareness on environmental issues.",
    "community.planete.impact1": "Contributed directly to preserving natural spaces along the Cote Bleue.",
    "community.planete.impact2": "Helped educate dozens of children on environmental respect.",
    "community.planete.impact3": "Strengthened links between local community actions and ecology efforts.",
    "community.planete.support": "Supporting activity: Beach cleanup collaboration with Bootcamp Cote Bleue",
    "community.bootcamp.title": "Volunteer - Bootcamp Cote Bleue",
    "community.bootcamp.meta": "Sep 2018 - Present · Health",
    "community.bootcamp.detail1": "Moderated and edited YouTube videos to promote bootcamp sessions.",
    "community.bootcamp.detail2": "Managed community communication across social platforms.",
    "community.bootcamp.detail3": "Developed a modern website to improve online visibility.",
    "community.bootcamp.detail4": "Participated in bootcamp sessions to support members and engagement.",
    "community.bootcamp.impact1": "Increased digital visibility and participant growth.",
    "community.bootcamp.impact2": "Built a stronger and more active social community.",
    "community.bootcamp.impact3": "Improved group cohesion during sessions through active support.",
    "community.bootcamp.support": "Supporting activity: Bootcamp Cote Bleue session highlights",
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
    "projects.jeb.support": "Supporting material: Project presentation, main website page",
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
    "skills.technical.item1": "Java, SQL, Python",
    "skills.technical.item2": "Web: HTML, CSS, JavaScript",
    "skills.technical.item3": "Git workflow and code quality tools",
    "skills.professional": "Professional",
    "skills.professional.item1": "Agile teamwork and sprint delivery",
    "skills.professional.item2": "Cross-functional communication",
    "skills.professional.item3": "Process optimization and automation",
    "skills.languages": "Languages",
    "skills.languages.item1": "English (bilingual)",
    "skills.languages.item2": "French (bilingual)",
    "skills.languages.item3": "Spanish (limited working proficiency)",
    "skills.languages.item4": "Chinese (elementary proficiency)",
    "skills.kicker": "Core Strengths",
    "skills.title": "Skills Snapshot",
    "footer.profile": "<span id=\"year\"></span> Arnaud Jouan. Detailed profile page.",
    "meta.title.projects": "Arnaud Jouan | Projects",
    "meta.description.projects": "A detailed look at Arnaud Jouan's EPITECH projects across all three years.",
    "projectsPage.kicker": "Selected Work",
    "projectsPage.title": "Project Details",
    "projectsPage.intro": "A closer look at the projects I built during each year at EPITECH — the goals, the tech, and what I took away from them.",
    "projectsPage.whatIBuilt": "What I built",
    "projectsPage.outcome": "Outcome & skills",
    "projectsPage.viewRepo": "View Repository",
    "projectsPage.placeholder": "These projects haven't been uploaded yet — detailed write-ups are coming soon. In the meantime, the code is available in the repository below.",
    "footer.projects": "<span id=\"year\"></span> Arnaud Jouan. Projects page.",
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
  },
  fr: {
    "meta.description.portfolio": "Portfolio d'Arnaud Jouan - projets d'ingénierie logicielle, stages et contact.",
    "meta.title.portfolio": "Arnaud Jouan | Portfolio",
    "meta.description.profile": "Profil détaillé d'Arnaud Jouan : formation, stages, certifications et objectifs.",
    "meta.title.profile": "Arnaud Jouan | Profil détaillé",
    "nav.detailedProfile": "Profil détaillé",
    "nav.profile": "Profil",
    "nav.projects": "Projets",
    "nav.experience": "Expérience",
    "nav.contact": "Contact",
    "hero.eyebrow": "Étudiant ingénieur en informatique",
    "hero.subtitle": "Né à Singapour, bilingue anglais et français, et actuellement en 3e année à EPITECH. Je construis ma carrière à l'intersection du management, du commerce et des technologies de l'information.",
    "hero.ctaProfile": "Voir le profil complet",
    "hero.ctaGithub": "GitHub",
    "hero.ctaLinkedin": "LinkedIn",
    "profile.kicker": "Qui je suis",
    "profile.title": "Profil",
    "about.title": "À propos de moi",
    "about.body": "Je vise des rôles qui combinent management, technologie et impact commercial. Mon objectif est de diriger des projets où stratégie, valeur client et exécution logicielle sont parfaitement alignées. Ayant vécu sur quatre continents, j'apporte un esprit très adaptable et interculturel. Mon expérience relie les deux faces du tech-business : je construis des solutions sécurisées et scalables comme Software Engineer (actuellement chez REACTIS Group), tout en développant le B2B, en gérant des équipes transverses et en construisant des stratégies régionales en tant que Business Manager. Au final, je suis passionné par le lien entre capacités IT complexes et croissance commerciale tangible.",
    "work.title": "Expérience professionnelle",
    "work.item1": "<strong>REACTIS Group</strong> - Stagiaire développeur logiciel (mars 2026 - aujourd'hui)",
    "work.item2": "<strong>BARJANE</strong> - Stagiaire référent IT interne (sept 2025 - fév 2026)",
    "work.item3": "<strong>CPAM</strong> - Stagiaire développeur Java (sept 2024 - déc 2024)",
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
    "project1.title": "Projets EPITECH année 1",
    "project1.body": "Projets C fondamentaux axés sur les algorithmes, Unix et une structure logicielle propre.",
    "project1.stack": "Stack : C, Makefile, Linux",
    "project1.details": "Détails du projet",
    "project1.repo": "Dépôt",
    "project2.title": "Projets EPITECH année 2",
    "project2.body": "Projets intermédiaires couvrant les pratiques d'ingénierie, l'architecture et le développement d'applications.",
    "project2.stack": "Stack : C, C++, Réseaux, Systèmes",
    "project2.details": "Détails du projet",
    "project2.repo": "Dépôt",
    "project3.title": "Projets EPITECH année 3",
    "project3.body": "Projets avancés mettant l'accent sur la scalabilité, la collaboration et la mise en production.",
    "project3.stack": "Stack : Java, Web, Cloud, DevOps",
    "project3.details": "Détails du projet",
    "project3.repo": "Dépôt",
    "experience.kicker": "Parcours professionnel",
    "experience.title": "Temps forts des stages",
    "experience.kicker.profile": "Expérience",
    "experience.title.profile": "Détails des stages",
    "exp1.meta": "Stagiaire développeur logiciel | mars 2026 - aujourd'hui",
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
    "contact.body": "Je recherche actuellement des stages et des opportunités d'ingénierie avec des équipes internationales.",
    "contact.email": "M'écrire",
    "contact.github": "Voir GitHub",
    "contact.linkedin": "LinkedIn",
    "footer.text": "<span id=\"year\"></span> Arnaud Jouan. Construit avec HTML, CSS et JavaScript.",
    "profile.eyebrow": "Profil détaillé",
    "profile.heroText": "<p><strong>Ce que je construis</strong></p><p>Je vise des rôles qui combinent responsabilités de management, technologie et impact commercial. Mon objectif est de diriger des projets où stratégie, valeur client et exécution logicielle sont parfaitement alignées.</p><p>Né à Singapour avec la nationalité française, je suis un citoyen du monde. Ayant vécu sur quatre continents - à Singapour, au Vietnam, en Australie et en France - et avec des études à venir au Canada, je suis pleinement bilingue en anglais et en français. Ce parcours international m'a donné un esprit très adaptable et une forte appréciation de la collaboration interculturelle.</p><p>Mon parcours professionnel repose sur la résolution de défis techniques complexes et l'optimisation des infrastructures. De la modernisation de systèmes Java legacy à la CPAM des Bouches-du-Rhône au rôle d'unique référent IT interne chez BARJANE, je m'épanouis en construisant des solutions tech sécurisées, efficaces et scalables. Aujourd'hui, je renforce encore mes compétences de développement en tant que Software Engineer chez REACTIS Group.</p><p>Au-delà du code, je sais que la technologie est la plus puissante lorsqu'elle est alignée à la stratégie business. En tant que Directeur Régional et Business Manager pour Junior Conseil Taker, j'ai construit l'antenne de Marseille de zéro, en manageant des équipes transverses, en développant le B2B et en pilotant des projets client de bout en bout. Que je définisse des stratégies régionales ou modèle des solutions business en hackathons, je suis passionné par le lien entre exécution technique et croissance commerciale.</p>",
    "profile.ctaDownload": "Télécharger le CV",
    "profile.ctaBack": "Retour au portfolio",
    "profile.ctaLinkedin": "LinkedIn",
    "career.kicker": "Objectif",
    "career.title": "Ce que je construis",
    "career.body": "Je vise des rôles combinant management, technologie et impact commercial. Mon objectif est de diriger des projets alignant stratégie, valeur client et exécution logicielle.",
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
    "education.earlier": "Études précédentes",
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
    "community.title": "Expérience bénévole",
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
    "projects.jeb.support": "Support : présentation du projet, page principale du site",
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
    "skills.technical.item1": "Java, SQL, Python",
    "skills.technical.item2": "Web : HTML, CSS, JavaScript",
    "skills.technical.item3": "Workflow Git et outils de qualité code",
    "skills.professional": "Professionnel",
    "skills.professional.item1": "Travail agile et livraison de sprint",
    "skills.professional.item2": "Communication transverse",
    "skills.professional.item3": "Optimisation et automatisation des processus",
    "skills.languages": "Langues",
    "skills.languages.item1": "Anglais (bilingue)",
    "skills.languages.item2": "Français (bilingue)",
    "skills.languages.item3": "Espagnol (niveau professionnel limité)",
    "skills.languages.item4": "Chinois (niveau débutant)",
    "skills.kicker": "Forces clés",
    "skills.title": "Aperçu des compétences",
    "footer.profile": "<span id=\"year\"></span> Arnaud Jouan. Page de profil détaillée.",
    "meta.title.projects": "Arnaud Jouan | Projets",
    "meta.description.projects": "Un aperçu détaillé des projets EPITECH d'Arnaud Jouan sur les trois années.",
    "projectsPage.kicker": "Travaux sélectionnés",
    "projectsPage.title": "Détails des projets",
    "projectsPage.intro": "Un aperçu plus détaillé des projets réalisés chaque année à EPITECH — les objectifs, les technologies et ce que j'en ai retiré.",
    "projectsPage.whatIBuilt": "Ce que j'ai réalisé",
    "projectsPage.outcome": "Résultats et compétences",
    "projectsPage.viewRepo": "Voir le dépôt",
    "projectsPage.placeholder": "Ces projets ne sont pas encore en ligne — les descriptions détaillées arrivent bientôt. En attendant, le code est disponible dans le dépôt ci-dessous.",
    "footer.projects": "<span id=\"year\"></span> Arnaud Jouan. Page des projets.",
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
  { threshold: 0.1 }
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
            '" target="_blank" rel="noreferrer">' + tr("project1.repo", "Repository") + "</a></div>" +
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
