/* ============================================================
   RASTY C. ESPARTERO — portfolio engine
   Vanilla JS, no dependencies. All motion respects
   prefers-reduced-motion. Content lives in the DATA block below.
   ============================================================ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = window.matchMedia("(pointer: fine)").matches;
  const raf = window.requestAnimationFrame.bind(window);

  const EMAIL = "rcannuespartero@gmail.com";

  /* ============================================================
     ░░ DATA — edit everything about the site from here ░░

     PROJECTS are ordered by scale, biggest first — the 01..09 index
     on each card reflects that curated ranking.

     Per-project fields:
       featured  wide hero tile at the top of the grid
       ai        "model" (trained by me) or "agent" (LLM integration)
       metric    the one number or fact worth reading at a glance
     ============================================================ */
  const PROJECTS = [
    {
      abbr: "IF", title: "IntelliForm — Intelligent PDF Form Understanding",
      cat: "AI & ML", year: "2025", role: "Lead Author & ML Engineer — Undergraduate Thesis",
      featured: true, ai: "model", metric: "LayoutLMv3 + GNN + T5",
      summary: "A multimodal deep-learning system that reads a PDF form the way a person does — text, layout and spatial structure at once — then labels every field and rewrites it as a plain-language prompt.",
      highlights: [
        "Trained a three-stage architecture: LayoutLMv3 for layout-aware embeddings, a Graph Neural Network over token positions to disambiguate fields that look identical in flat text, and a T5 head that summarizes each field into readable guidance.",
        "Built the pipeline end to end — annotation, training and inference — against FUNSD/XFUND-style datasets, with the trained classifier weights served directly from the app.",
        "Evaluated at three levels: token-level precision, recall and F1; field-level IoU span matching; and ROUGE-L with METEOR for summary quality.",
        "Served through FastAPI behind an interactive PDF.js workspace that overlays predicted fields and confidence onto the source document.",
        "First author on the resulting undergraduate thesis at the Polytechnic University of the Philippines.",
      ],
      tech: ["PyTorch", "LayoutLMv3", "Graph Neural Networks", "T5", "FastAPI", "HuggingFace", "PDF.js"], link: "https://github.com/RastyFullStaxx/IntelliForm",
    },
    {
      abbr: "BBS", title: "Balik-Bayan Scientist Program System",
      cat: "Government", year: "2025", role: "DevOps Intern — CGI",
      metric: "DOST national program",
      summary: "Programme management platform for the Department of Science and Technology's Balik-Bayan Scientist Program, delivered during my DevOps internship at CGI.",
      highlights: [
        "Built the platform on Laravel against the program's operational workflow.",
        "Supported CI/CD across build, test and deployment environments so releases stayed reliable.",
        "Managed branches and reviewed changes to keep a clean, traceable commit history.",
        "Set up and troubleshot Linux environments, resolving configuration and dependency issues.",
        "Documented runbooks and operational procedures that cut repeat manual work and improved handoffs.",
      ],
      tech: ["Laravel", "PHP", "MySQL", "CI/CD", "Git", "Linux"], link: "",
    },
    {
      abbr: "CR", title: "CureRays — Clinical Workflow System",
      cat: "Healthcare", year: "2026", role: "Full-Stack Developer",
      metric: "17 clinic documents automated",
      summary: "A patient-course-centred workspace for a radiation oncology clinic, replacing a manual spreadsheet, Drive and Word workflow with one auditable record of treatment readiness.",
      highlights: [
        "Automated the clinic's fractionation log — cumulative dose, skin dose, isodose and days-on-treatment compute per fraction, and a record that diverges from the prescription raises a review flag automatically.",
        "Generates the clinic's own seventeen documents straight from structured forms: DOCX through docxtemplater, XLSX fraction logs through exceljs. Nobody retypes a Word template again.",
        "Split persistence across two PostgreSQL databases — tokenized operational data and PHI — so protected health information never reaches client bundles, query strings, logs or browser storage.",
        "Readiness is derived from evidence and approvals rather than manually asserted, and a pre-authorisation state machine blocks the Planning → On Treatment transition until it clears.",
        "Built to WCAG 2.1 AA on Next.js 16 App Router, React 19 and Prisma, with write-through persistence that survives restart.",
      ],
      tech: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Tailwind"], link: "https://github.com/RastyFullStaxx/CureRays-CRMS",
    },
    {
      abbr: "AE", title: "AgilaEye — Explainable AI-Video Detection",
      cat: "AI & ML", year: "2025", role: "ML Engineer & Desktop Developer",
      ai: "model", metric: "F1 0.82 · sub-millisecond inference",
      summary: "A lightweight, explainable detector that flags AI-generated video while you scroll a social feed — and names the visual signal that triggered the warning instead of just scoring it.",
      highlights: [
        "Trained and tuned two classifiers on a 100-video pilot corpus: a shallow MLP and a weighted k-NN, both over seven video-level features — luminance mean and deviation, color deltas, temporal deltas and edge energy — sampled across eight frames per video at 224×224.",
        "Ran a 65,340-candidate hyperparameter sweep across k, distance power and per-feature weights, selecting on the validation split only and never touching the held-out test set.",
        "Best model reaches 0.80 accuracy, 0.90 recall and 0.82 F1 on the held-out test split at roughly 0.013 ms average inference.",
        "Implemented both classifiers from scratch in the Python standard library — no ML framework in the inference path — which is what keeps the sidecar dependency-free and the latency sub-millisecond.",
        "Explains each verdict through Grad-CAM and deterministic anomaly categories: object inconsistency, texture jitter, interaction anomaly and movement anomaly.",
        "Ships as a Tauri and Svelte desktop app, with a documented upgrade path to a MobileNetV3-Small backbone under temporal pooling.",
      ],
      tech: ["Python", "Grad-CAM", "Tauri", "Svelte", "TypeScript", "ffmpeg"], link: "https://github.com/RastyFullStaxx/AgilaEye",
    },
    {
      abbr: "LIS", title: "FNB — Audit-Grade Inventory Platform",
      cat: "Enterprise", year: "2026", role: "Full-Stack Developer",
      ai: "agent", metric: "Ships an LLM assistant",
      summary: "A ground-up rebuild of a legacy inventory-audit system for bars and kitchens, built around the one number the client trusts absolutely: the variance between what should have been used and what actually was.",
      highlights: [
        "Shipped Stocky, a read-only assistant on the Anthropic SDK that explains variances, finds records and teaches the reconciliation formulas with links to the underlying data — six read-only tools behind a hard architectural rule that AI never mutates inventory.",
        "Reconciliation maths is load-bearing, so it is pinned to hand-computed golden fixtures and guarded by a throwaway-database harness that migrates, seeds and asserts 43 coverage checks — a seeder change cannot silently move the answer key.",
        "Committed records are immutable: corrections are void-and-chain, and every mutation writes an activity-log row inside the same transaction.",
        "Offline-first by design — browser and desktop both write, reconciled through an append-dominant schema with globally unique IDs and a deliberately small enumerated mutation surface, proven by a 30-check sync harness.",
        "TypeScript monorepo: React 19 and Tailwind v4 on Vite, Hono and Prisma on the server, and a pure-domain core package with no I/O.",
      ],
      tech: ["TypeScript", "React 19", "Anthropic SDK", "Hono", "Prisma", "Tailwind v4"], link: "https://github.com/RastyFullStaxx/fnb-lis",
    },
    {
      abbr: "AMK", title: "Amkor IMS — Internal Management System",
      cat: "Enterprise", year: "2026", role: "Full-Stack Developer",
      metric: "20 modules · 17 roles",
      summary: "A private internal management system for a travel and tours company, covering twenty business modules across two branches — from accounts payable and BIR compliance through attendance, leave and visa processing.",
      highlights: [
        "Twenty modules — accounts payable and receivable, disbursement, bills monitoring, BIR compliance, IATA payments, cashbond, credit-card monitoring, reservations, visa, marketing and sales summary — isolated behind a modular Laravel architecture.",
        "Seventeen canonical login roles enforced through role-based access control, with a full activity-log audit trail behind every record.",
        "Real-time notifications over Laravel Reverb, media-library attachments, and scheduled database backups.",
        "Laravel 12 with React and Inertia.js on PostgreSQL.",
      ],
      tech: ["Laravel 12", "React", "Inertia.js", "PostgreSQL", "Laravel Reverb"], link: "",
    },
    {
      abbr: "SL", title: "StockLedger — Event-Sourced Inventory Ledger",
      cat: "Enterprise", year: "2025", role: "Full-Stack Developer",
      metric: "Immutable event ledger",
      summary: "A distributed inventory system where stock is never stored, only derived. Every change is an immutable event, so any historical state can be reconstructed exactly.",
      highlights: [
        "Fully immutable event ledger — no edits, no deletions — with event replay as the single source of truth.",
        "Offline-first operation through a device-local event queue and strict atomic batch synchronization.",
        "Multi-tenant isolation with a separate database per client.",
        "Built for audit-grade traceability across multiple locations, where every manual adjustment carries accountability.",
      ],
      tech: ["TypeScript", "Node.js", "Event Sourcing", "SQLite"], link: "https://github.com/RastyFullStaxx/StockLedger",
    },
    {
      abbr: "ENC", title: "ENC BGC One — Shared Services Portal",
      cat: "Enterprise", year: "2025", role: "Lead Developer & Technical Adviser",
      metric: "Thesis-backed delivery",
      summary: "A smart booking and shared-services portal for Every Nation Campus BGC. I led development end to end, and the build doubled as the thesis study for an undergraduate group at the University of Makati.",
      highlights: [
        "Acted as lead developer and technical adviser across the full delivery, from requirements through deployment.",
        "Built on Laravel 12 with Blade and Vite, including a documented deployment path for shared hosting.",
        "Handed over with architecture, deployment, security-hardening and operations documentation so the team could maintain it without me.",
        "Mentored the student team through version control and delivery practice.",
      ],
      tech: ["Laravel 12", "PHP 8.2", "Blade", "Vite", "MySQL"], link: "https://github.com/RastyFullStaxx/ENC-BGC-One",
    },
    {
      abbr: "DPB", title: "DigiPhoto — Event Booth Platform",
      cat: "Systems & Tools", year: "2025", role: "Full-Stack Developer",
      metric: "Multi-tenant · .NET",
      summary: "A self-service event photo booth platform that turns capture, layout, payment, printing and private phone delivery into one durable workflow — one that survives interruption.",
      highlights: [
        "Touch-first guest session designed for people who have never seen the system, standing in mixed event lighting, often in groups.",
        "Separate surfaces for the guest, the operator monitoring camera and printer readiness, and the owner configuring packages, templates, staff, devices and retention.",
        "The Windows booth engine stays the hardware authority while the UI renders as responsive web surfaces in a WebView2 host and in owner browsers.",
        "Session recovery so an interrupted booth session resumes instead of being lost.",
      ],
      tech: [".NET", "C#", "WebView2", "TypeScript"], link: "https://github.com/RastyFullStaxx/digiphoto-booth-system",
    },

    /* ---- language, games and the wider archive ---- */
    {
      abbr: "PRSM", title: "Prismatic — Programming Language",
      cat: "Systems & Tools", year: "2025", role: "Language Designer & Implementer",
      metric: "Language built from scratch",
      summary: "A programming language of my own design and implementation, built from first principles — lexer, token specification, parser and symbol table — with a syntax that borrows readability from Python and structure from C++.",
      highlights: [
        "Designed the full token specification and wrote the lexical analyzer that turns raw source into a token stream.",
        "Implemented tokenization and parsing, with comprehensive symbol table generation behind it.",
        "Free-field formatting inspired by C, plus reserved words and noise words chosen to keep programs readable aloud.",
        "Built-in fundamental types — integer, float, boolean, char — and the control structures a real language needs: if-else, for and while.",
        "Written in C, as an exercise in applying compiler-construction theory end to end rather than consuming someone else's runtime.",
      ],
      tech: ["C", "Compiler Design", "Lexical Analysis", "Parsing"], link: "https://github.com/RastyFullStaxx/CompilerDesign",
    },
    {
      abbr: "PHRM", title: "PharmaSynth — Unity Simulation",
      cat: "Games", year: "2026", role: "Unity Developer",
      metric: "Full client production",
      summary: "A Unity 3D pharmaceutical simulation delivered as a full client production, documented from storyboard through on-device testing and sign-off.",
      highlights: [
        "Built in Unity with a documented systems reference and gameplay flow rather than ad-hoc scene wiring.",
        "Maintained an asset production specification so art and engineering could work in parallel against one contract.",
        "Carried a formal on-device test plan and a client sign-off process to close the engagement.",
        "Kept a manuscript reconciliation trail so the simulation stayed faithful to the source material it teaches.",
      ],
      tech: ["Unity", "C#", "3D Simulation"], link: "",
    },
    {
      abbr: "QUE", title: "Barangay Queuing & Kiosk System",
      cat: "Government", year: "2026", role: "Full-Stack Developer",
      metric: "3 client apps · 1 backend",
      summary: "An automated kiosk and application queuing system for Barangay San Miguel, Pasig City — replacing a paper queue for residents applying for local government services.",
      highlights: [
        "Three separate front-ends against one PHP backend: a resident portal, a thin kiosk UI for walk-ins, and a public queue monitor for the waiting area.",
        "Each surface is scoped to its audience — residents self-serve, the kiosk stays deliberately minimal, the monitor is read-only.",
        "Shipped with its own infrastructure and documentation directories for handover to barangay staff.",
      ],
      tech: ["Vue", "PHP", "MySQL"], link: "https://github.com/RastyFullStaxx/QUEUING-SYSTEM",
    },
    {
      abbr: "4PH", title: "4PH Pag-IBIG Housing System",
      cat: "Government", year: "2024", role: "Full-Stack Developer",
      metric: "National housing program",
      summary: "A desktop records system for the Philippine government's 4PH housing program under Pag-IBIG, covering beneficiary records and housing unit administration.",
      highlights: [
        "Built as a .NET desktop application for office staff working against a central database.",
        "Modelled beneficiary and unit records around the program's actual eligibility and allocation rules.",
        "Paired with a dedicated SQL database design for loan and housing management.",
      ],
      tech: ["C#", ".NET", "SQL Server"], link: "https://github.com/RastyFullStaxx/4PH_PAGIBIG_HOUSING",
    },
    {
      abbr: "HLM", title: "Housing Loan Management",
      cat: "Government", year: "2025", role: "Database Developer",
      metric: "Relational schema design",
      summary: "The database layer behind 4PH housing administration — schema design and query work for loan records, amortization and beneficiary tracking.",
      highlights: [
        "Designed the relational schema for loan accounts, payments and beneficiary linkage.",
        "Wrote the query and reporting layer staff rely on for account status.",
        "Built in Java against a normalized SQL back end.",
      ],
      tech: ["Java", "SQL", "JDBC"], link: "https://github.com/RastyFullStaxx/Housing_Loan_Management",
    },
    {
      abbr: "MERC", title: "MERC Airline Ticketing System",
      cat: "Enterprise", year: "2025", role: "Full-Stack Developer",
      metric: "Booking to boarding",
      summary: "A desktop airline ticketing system covering flight scheduling, seat selection, booking and ticket issuance.",
      highlights: [
        "Seat-level inventory so two agents cannot sell the same seat.",
        "Booking flow that carries a passenger from flight search through to an issued ticket.",
        "Built as a .NET desktop application for counter staff.",
      ],
      tech: ["C#", ".NET", "SQL Server"], link: "https://github.com/RastyFullStaxx/MERC-AIRLINE-TICKETING-SYSTEM",
    },
    {
      abbr: "ADV", title: "Adventure Land Rentals",
      cat: "Enterprise", year: "2025", role: "Full-Stack Developer",
      metric: "Catalog + order tracking",
      summary: "A Laravel web application managing a catalog of inflatable rentals for children's events — categorized listings, detailed product views, order tracking and role-based access.",
      highlights: [
        "Categorized product catalog with detail views built for browsing by parents, not by SKU.",
        "Order tracking through the rental lifecycle, from enquiry to return.",
        "Role-based access control separating customer, staff and administrator capability.",
        "Front-end themed deliberately for the audience — the joy of children's events, not a generic commerce grid.",
      ],
      tech: ["Laravel", "PHP", "Blade", "MySQL"], link: "https://github.com/RastyFullStaxx/ADVENTURE-LAND",
    },
    {
      abbr: "DBP", title: "Digital Boot Photo Shop",
      cat: "Systems & Tools", year: "2026", role: "Full-Stack Developer",
      metric: "Offline-first",
      summary: "An offline-first photobooth platform covering capture ingest, guest media selection, editing, branded print generation and QR-based digital delivery.",
      highlights: [
        "Built for event venues where internet reliability cannot be assumed — the booth keeps working when the network does not.",
        "Guests pick and edit their own shots, then receive them by QR without handing over a phone or an email address.",
        "Branded print generation so the operator's templates apply consistently across a whole event.",
      ],
      tech: ["TypeScript", "Node.js", "Canvas API"], link: "https://github.com/RastyFullStaxx/Digital-Boot-Photo-Shop-System",
    },
    {
      abbr: "TRSH", title: "Trashketball",
      cat: "Games", year: "2025", role: "Game Developer",
      metric: "Unity · 4 levels",
      summary: "A Unity game that turns waste segregation into a basketball shot — throw the right rubbish into the right bin, across escalating levels.",
      highlights: [
        "Four progressive levels behind a shared base level manager, so difficulty scales without duplicating logic.",
        "Physics-driven throwing with per-item handling for different waste types.",
        "Full game shell — main menu, pause, audio management — and a packaged Windows build.",
      ],
      tech: ["Unity", "C#", "Game Physics"], link: "https://github.com/RastyFullStaxx/TRASHKETBALL",
    },
    {
      abbr: "RICO", title: "Ricochet Rival",
      cat: "Games", year: "2025", role: "Game & AI Developer",
      metric: "Monte Carlo AI",
      summary: "A shooting game whose opponent aims using a Monte Carlo algorithm — sampling possible ricochet paths rather than following a scripted rule.",
      highlights: [
        "Monte Carlo sampling drives opponent targeting, so its behaviour emerges from simulation instead of hand-written cases.",
        "Ricochet geometry makes the search space non-trivial, which is what makes the sampling approach worth it.",
        "Built as an applied exercise in probabilistic algorithms inside a real-time loop.",
      ],
      tech: ["C#", "Monte Carlo Methods", "Game AI"], link: "https://github.com/RastyFullStaxx/Ricochet_Rival",
    },
    {
      abbr: "UNBK", title: "UnBroke — Student Finance App",
      cat: "Systems & Tools", year: "2024", role: "Mobile Developer",
      metric: "Financial literacy",
      summary: "A mobile application built to combat student financial mismanagement, offering budgeting, expense tracking and goal setting.",
      highlights: [
        "Budgeting and expense tracking aimed at students with irregular, small-sum income.",
        "Goal setting designed to make saving visible rather than abstract.",
        "Built to reduce financial stress and support informed decisions, not to gamify spending.",
      ],
      tech: ["C#", "Mobile UI"], link: "https://github.com/RastyFullStaxx/UNBROKE_GUI",
    },
    {
      abbr: "SMPL", title: "SmartPlate",
      cat: "Systems & Tools", year: "2024", role: "Full-Stack Developer",
      metric: "Meal planning",
      summary: "A meal planning application for students living away from home, built around the constraints of a small budget and a small kitchen.",
      highlights: [
        "Meal plans generated for students who cook for one, on a fixed weekly budget.",
        "Built in Java as a full application rather than a coursework prototype.",
      ],
      tech: ["Java", "SQL"], link: "https://github.com/RastyFullStaxx/SmartPlate",
    },
    {
      abbr: "KFD", title: "Kofidence — R Analytics",
      cat: "Web & Data", year: "2026", role: "Data Developer",
      metric: "R Shiny",
      summary: "An interactive analytics application built in R Shiny, turning a statistical workflow into something a non-statistician can operate.",
      highlights: [
        "Reactive Shiny interface over an R analysis pipeline.",
        "Built so the underlying statistics stay inspectable rather than hidden behind a dashboard.",
      ],
      tech: ["R", "Shiny", "Statistics"], link: "https://github.com/RastyFullStaxx/kofidence-shiny",
    },
    {
      abbr: "CQ", title: "CodeQuest — 30 Days of Backend",
      cat: "Web & Data", year: "2024", role: "Backend Developer — AWS Cloud Club",
      metric: "AWS Cloud Club PH",
      summary: "The backend track I built and shipped for CodeQuest, the AWS Cloud Club Philippines' 30-day backend programme.",
      highlights: [
        "Python and Flask backend built as the reference implementation for participants.",
        "Produced for the AWS Cloud Club community I helped found, as teaching material rather than a demo.",
      ],
      tech: ["Python", "Flask", "REST APIs"], link: "https://github.com/RastyFullStaxx/AWSCC-CodeQuest-Backend",
    },
    {
      abbr: "LTR", title: "Personal Letter Websites",
      cat: "Web & Data", year: "2025 — 2026", role: "Designer & Developer",
      metric: "8 bespoke sites",
      summary: "A running series of one-off websites built as personal letters — a way for someone to say something to a specific person, in a form more considered than a message.",
      highlights: [
        "Eight bespoke sites, each designed around one recipient and one occasion — birthdays, Christmas, thank-yous, farewells.",
        "Every one is hand-built rather than templated, because the point is that it was made for that person.",
        "Hosted individually so each can be handed over as its own link.",
      ],
      tech: ["HTML", "CSS", "JavaScript"], link: "https://github.com/RastyFullStaxx?tab=repositories&q=letter",
    },
    {
      abbr: "PKMN", title: "Pokémon Quiz Platform",
      cat: "Web & Data", year: "2025", role: "Full-Stack Developer",
      metric: "Scored quiz engine",
      summary: "An interactive quiz platform built around Pokémon identification, with scoring, progression and a responsive game-show presentation.",
      highlights: [
        "Question engine with scoring and progression rather than a static form.",
        "Presentation designed to feel like a game show, not a survey.",
      ],
      tech: ["JavaScript", "CSS", "HTML"], link: "https://github.com/RastyFullStaxx/Pokemon-Quiz-Website",
    },
    {
      abbr: "MNM", title: "Manam Restaurant Site",
      cat: "Web & Data", year: "2025", role: "Front-End Developer",
      metric: "Fully responsive",
      summary: "A responsive restaurant website covering menu presentation, story and reservations, built to hold up from phone to desktop.",
      highlights: [
        "Menu presentation designed to be read on a phone at a table, not just on a laptop.",
        "Fully responsive layout with no separate mobile site to maintain.",
      ],
      tech: ["HTML", "CSS", "JavaScript"], link: "https://github.com/RastyFullStaxx/Manam-Restaurant",
    },
  ];

  /* ============================================================
     BEYOND THE CODE — trainings, seminars, community, recognition.

     TO ADD PHOTOS: drop image files into  assets/beyond/
     then list the filenames in that entry's `photos` array, e.g.
       photos: [
         { src: "assets/beyond/aws-bootcamp-01.jpg", cap: "Cloud bootcamp, PUP Manila" },
         { src: "assets/beyond/aws-bootcamp-02.jpg", cap: "Mentoring session" },
       ]
     One photo or many — the gallery and lightbox handle both.
     ============================================================ */
  const BEYOND = [
    {
      abbr: "AWS", title: "AWS Cloud Club — PUP",
      cat: "Community", year: "2022 — 2025", role: "Founding Core Member & Cloud Practitioner",
      summary: "Helped establish the AWS Cloud Club at the Polytechnic University of the Philippines to promote cloud literacy and developer collaboration across the PUP network.",
      highlights: [
        "Initiated the club's establishment and its first cohort of members.",
        "Facilitated technical bootcamps and mentoring sessions for peers.",
        "Served as a founding member recognized in the 2023 charter.",
      ],
      photos: [],
    },
    {
      abbr: "CSC", title: "Cisco NetConnect — PUP",
      cat: "Community", year: "2024 — 2025", role: "Programming Lead",
      summary: "Directed a multidisciplinary programming team specializing in batch scripting, Python and JavaScript, overseeing workflow automation and backend optimization.",
      highlights: [
        "Designed modular coding exercises to train members in professional version control.",
        "Mentored on algorithmic thinking and project scalability.",
        "Held code integrity and maintainability standards across deployments.",
      ],
      photos: [],
    },
    {
      abbr: "DOST", title: "DOST-SEI Scholar Program",
      cat: "Scholarship", year: "2025", role: "Intern & National Scholar",
      summary: "Recognized as a national government scholar for academic performance and innovation potential in computer science, with capacity-building work alongside it.",
      highlights: [
        "Engaged in programs promoting scientific research, digital transformation and public service technology.",
        "Contributed to seminars and workshops on AI literacy, open data practices and ethical computing.",
        "Aligned project work with DOST's national development goals.",
      ],
      photos: [],
    },
    {
      abbr: "CGI", title: "CGI DevOps Internship",
      cat: "Training", year: "2025", role: "DevOps Intern",
      summary: "Internship at Canadian Technology Company Incorporated (CGI) supporting release engineering across development environments.",
      highlights: [
        "Assisted build, test and deployment workflows for reliable releases.",
        "Managed branches and reviewed changes under Git-based version control.",
        "Set up and troubleshot Linux environments, resolving configuration and dependency issues.",
        "Documented runbooks that improved handoffs and team readiness.",
      ],
      photos: [],
    },
    {
      abbr: "AI", title: "Meta & Microsoft AI Programmes",
      cat: "Training", year: "2026", role: "Selected Participant",
      summary: "Selected for AI training programs run by Meta and Microsoft, covering applied AI practice alongside my engineering work.",
      highlights: [
        "Selected on merit for both programs.",
        "Applied AI techniques that carry directly into the analytics and detection work in my projects.",
      ],
      photos: [],
    },
    {
      abbr: "FE", title: "Front-End Development Bootcamp",
      cat: "Training", year: "—", role: "Certified",
      summary: "Intensive front-end program covering layout, component architecture and interactive interfaces.",
      highlights: ["CSS and Bootstrap layout systems.", "jQuery and modern JavaScript.", "React component architecture."],
      photos: [],
    },
    {
      abbr: "DS", title: "Data Science & Machine Learning Foundations",
      cat: "Training", year: "—", role: "Certified",
      summary: "Foundations program across the Python data stack and applied machine learning.",
      highlights: ["Pandas and NumPy for data handling.", "scikit-learn for classical modelling.", "PyTorch and TensorFlow fundamentals."],
      photos: [],
    },
    {
      abbr: "SEC", title: "Nexus Technologies Cybersecurity Training",
      cat: "Training", year: "—", role: "Certified",
      summary: "Security training covering threat models, defensive practice and secure development habits.",
      highlights: ["Common attack surfaces in web systems.", "Defensive configuration and hardening.", "Secure handling of credentials and data."],
      photos: [],
    },
    {
      abbr: "AWD", title: "Academic Distinctions",
      cat: "Awards", year: "2020 — 2025", role: "Recognition",
      summary: "Academic and professional recognition across university, senior high school and industry training.",
      highlights: [
        "Consistent President's Lister, Polytechnic University of the Philippines (2022–2025).",
        "Overall Best Capstone Project and Capstone Project Champion, University of Makati (2022).",
        "Graduated with High Honors, Senior High School (2022).",
        "Most Excellent Trainee, Sutherland BGC (2022).",
        "Dean's Lister and President's Lister, Fort Bonifacio High School (2020).",
      ],
      photos: [],
    },
    {
      abbr: "SCH", title: "Scholarship Grants",
      cat: "Scholarship", year: "2022 — 2025", role: "Grantee",
      summary: "Competitive scholarship grants and academic selections across government and private foundations.",
      highlights: [
        "Department of Science and Technology–SEI Undergraduate Scholarship.",
        "Real LIFE Foundation Private Scholarship — the program behind the Leadership, Integrity, Faith and Excellence principle I still work by.",
        "LANI Scholarship, Taguig City local government.",
        "NEON Foundation Private Scholarship.",
        "Qualified for admission in Computer Science at RTU, UMak and PLM.",
        "Regional Journalism in English — Sportswriting Qualifier.",
      ],
      photos: [],
    },
  ];

  /* Tiers are grounded in the CV: "specialized in" → core,
     "(basic)" → basic, everything listed → working. */
  const STACK = [
    {
      name: "Languages", items: [
        ["Python", "core"], ["JavaScript", "core"], ["PHP", "core"], ["SQL", "core"],
        ["TypeScript", "working"], ["Java", "working"], ["C", "working"], ["C++", "working"],
        ["C#", "working"], ["Bash", "working"],
      ],
    },
    {
      name: "Frameworks", items: [
        ["Laravel", "core"], ["React", "core"], ["Node.js", "working"], ["Express.js", "working"],
        ["Vue.js", "working"], ["Django", "working"], ["Flask", "working"], ["Bootstrap", "working"],
        ["Tailwind CSS", "working"], ["HTML5 / CSS3", "core"],
      ],
    },
    {
      name: "Data & ML", items: [
        ["MySQL", "core"], ["PostgreSQL", "working"], ["SQLite", "working"], ["MongoDB", "working"],
        ["Firebase", "working"], ["Pandas", "working"], ["NumPy", "working"],
        ["scikit-learn", "working"], ["PyTorch", "basic"], ["TensorFlow", "basic"],
      ],
    },
    {
      name: "Cloud & DevOps", items: [
        ["Git / GitHub", "core"], ["Docker", "working"], ["CI/CD pipelines", "working"],
        ["AWS EC2", "working"], ["AWS S3", "working"], ["AWS RDS", "working"],
        ["AWS IAM", "working"], ["AWS Lambda", "basic"], ["Linux", "working"], ["Apache", "working"],
      ],
    },
    {
      name: "Practice", items: [
        ["REST API design", "core"], ["Responsive design", "core"], ["Agile / Scrum", "working"],
        ["Modular architecture", "working"], ["Shell scripting", "working"], ["Build automation", "working"],
        ["JSON", "core"], ["Cross-browser support", "working"], ["Technical documentation", "working"],
        ["GraphQL", "basic"],
      ],
    },
  ];

  const TIMELINE = [
    {
      dates: "2025", role: "DevOps Intern", org: "Canadian Technology Company Incorporated (CGI)", now: false,
      points: [
        "Supported CI/CD operations across build, test and deployment workflows.",
        "Managed branches and reviewed changes under Git-based version control.",
        "Set up and troubleshot Linux environments, resolving configuration and dependency issues.",
        "Built the Balik-Bayan Scientist Program System using Laravel and specialized frameworks.",
      ],
    },
    {
      dates: "2025", role: "Intern & Scholar", org: "Department of Science and Technology — SEI", now: false,
      points: [
        "Recognized as a national government scholar for academic performance and innovation potential.",
        "Engaged in capacity-building programs across research, digital transformation and public service technology.",
        "Contributed to seminars on AI literacy, open data practices and ethical computing.",
      ],
    },
    {
      dates: "2025", role: "Technical Adviser & Project Manager", org: "ENC — University of Makati", now: false,
      points: [
        "Lead developer for the Every Nation BGC One Shared Services system.",
        "The build also served as the thesis study for an undergraduate group at the University of Makati.",
      ],
    },
    {
      dates: "2024 — 2025", role: "Programming Lead", org: "Cisco NetConnect PUP", now: false,
      points: [
        "Directed a multidisciplinary team across batch scripting, Python and JavaScript.",
        "Designed modular coding exercises and Git-based collaboration practice.",
        "Mentored on algorithmic thinking, scalability and code integrity.",
      ],
    },
    {
      dates: "2022 — 2025", role: "Founding Core Member & Cloud Practitioner", org: "AWS Cloud Club — PUP", now: false,
      points: [
        "Initiated the club's establishment to promote cloud literacy across the PUP network.",
        "Facilitated technical bootcamps and mentoring sessions for peers.",
      ],
    },
    {
      dates: "2022 — NOW", role: "Full-Stack Developer", org: "Freelance", now: true,
      points: [
        "Delivered end-to-end web applications spanning front-end, back-end and database architecture.",
        "Specialized in Python, JavaScript, Laravel, React and SQL.",
        "Implemented modular architecture and scalable deployment strategies.",
        "Collaborated with clients across sectors, translating requirements into maintainable systems.",
      ],
    },
    {
      dates: "2022 — NOW", role: "Legal Assistant", org: "Melba Cawit Law Firm", now: true,
      points: [
        "Developed cross-cultural competencies through Western legal processes and business correspondence.",
        "Supported documentation, scheduling and client coordination under strict confidentiality.",
      ],
    },
    {
      dates: "2022 — 2023", role: "Technical Care Expert", org: "Sutherland Global Philippines BGC", now: false,
      points: [
        "Delivered technical support across network, software and hardware troubleshooting.",
        "Achieved top performance metrics among peers in a high-pressure environment.",
        "Named Most Excellent Trainee.",
      ],
    },
  ];

  const EDUCATION = [
    {
      dates: "2022 — 2026", role: "BS Computer Science — Magna Cum Laude", org: "Polytechnic University of the Philippines, Manila", now: false,
      points: [
        "Graduated Magna Cum Laude from one of the Philippines' premier national universities.",
        "Awarded Consistent President's Lister across the full program.",
        "Studied on merit scholarships from DOST-SEI, the Real LIFE Foundation, Taguig City's LANI program and the NEON Foundation.",
      ],
    },
    {
      dates: "2020 — 2022", role: "STEM Strand", org: "Higher School of the University of Makati", now: false,
      points: ["Graduated with High Honors.", "Awarded Overall Champion in Capstone Project."],
    },
  ];

  const MARQUEE = ["PYTHON", "JAVASCRIPT", "PHP", "LARAVEL", "REACT", "MYSQL", "AWS", "DOCKER", "NODE.JS", "TYPESCRIPT", "GIT", "LINUX", "POSTGRESQL", "TENSORFLOW"];

  /* ============================================================
     BOOT SEQUENCE — progress is real, tied to actual asset loads
     ============================================================ */
  function boot() {
    const el = $("#boot");
    const fill = $("#boot-fill");
    const pct = $("#boot-pct");
    const stageEl = $("#boot-stage");
    const wipe = $("#boot-wipe");

    $$(".boot__slats i").forEach((s, i) => s.style.setProperty("--n", i));

    if (RM) {
      el.remove();
      document.body.classList.remove("is-locked");
      return Promise.resolve();
    }

    document.body.classList.add("is-locked");

    const STAGES = [
      [0.00, "establishing link"],
      [0.30, "loading typefaces"],
      [0.55, "decoding assets"],
      [0.78, "compiling particle field"],
      [0.96, "ready"],
    ];

    /* every signal is a real load, not a fake timer */
    const img = new Image();
    img.src = "assets/rasty.jpg";
    const signals = [
      document.fonts ? document.fonts.ready : Promise.resolve(),
      img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
      new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r, { once: true }))),
    ];

    let done = 0;
    signals.forEach((p) => Promise.resolve(p).finally(() => done++));

    const t0 = performance.now();
    const MIN_MS = 1400;   /* never flash past faster than this */
    const MAX_MS = 6000;   /* never trap the visitor, whatever stalls */

    return new Promise((resolve) => {
      let cur = 0;
      let last = t0;

      function finish() {
        fill.style.transform = "scaleX(1)";
        pct.textContent = "100";
        wipe.setAttribute("width", "460");
        stageEl.textContent = "ready";
        el.classList.add("is-out");
        document.body.classList.remove("is-locked");
        window.setTimeout(() => { el.remove(); resolve(); }, 620);
      }

      function tick(now) {
        const elapsed = now - t0;
        const dt = Math.max(0, now - last);
        last = now;

        /* target blends real completion with a time floor so the bar always moves */
        const real = done / signals.length;
        const floor = Math.min(0.9, elapsed / MIN_MS);
        const target = Math.max(real, floor) * (done === signals.length ? 1 : 0.92);

        /* ease on a time constant, not a per-frame fraction — a throttled or
           low-FPS tab would otherwise crawl toward the target and sit at 99% */
        cur += (target - cur) * (1 - Math.exp(-dt / 160));
        const p = Math.min(cur, 1);

        fill.style.transform = `scaleX(${p})`;
        pct.textContent = String(Math.round(p * 100)).padStart(2, "0");
        wipe.setAttribute("width", String(460 * p));
        const stage = STAGES.filter((s) => p >= s[0]).pop();
        if (stage && stageEl.textContent !== stage[1]) stageEl.textContent = stage[1];

        const settled = done === signals.length && (p > 0.99 || elapsed > MIN_MS + 800);
        if ((settled && elapsed > MIN_MS) || elapsed > MAX_MS) { finish(); return; }
        raf(tick);
      }
      raf(tick);
    });
  }

  /* ============================================================
     VORTEX — simplex-noise flow field on canvas 2D
     ============================================================ */
  function createNoise3D(random = Math.random) {
    const F3 = 1 / 3, G3 = 1 / 6;
    const grad3 = [1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1];
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 0; i < 255; i++) {
      const r = i + ~~(random() * (256 - i));
      const t = p[i]; p[i] = p[r]; p[r] = t;
    }
    for (let i = 256; i < 512; i++) p[i] = p[i - 256];

    return (xin, yin, zin) => {
      const s = (xin + yin + zin) * F3;
      const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
      const t = (i + j + k) * G3;
      const x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0)      { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else               { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0)       { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0)  { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else               { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
      const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
      const ii = i & 255, jj = j & 255, kk = k & 255;
      let n = 0, t0, gi;
      t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 > 0) { gi = (p[ii + p[jj + p[kk]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x0 + grad3[gi + 1] * y0 + grad3[gi + 2] * z0); }
      t0 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t0 > 0) { gi = (p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x1 + grad3[gi + 1] * y1 + grad3[gi + 2] * z1); }
      t0 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t0 > 0) { gi = (p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x2 + grad3[gi + 1] * y2 + grad3[gi + 2] * z2); }
      t0 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t0 > 0) { gi = (p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12) * 3; t0 *= t0; n += t0 * t0 * (grad3[gi] * x3 + grad3[gi + 1] * y3 + grad3[gi + 2] * z3); }
      return 32 * n;
    };
  }

  function initVortex() {
    const canvas = $("#vortex");
    const stage = canvas.parentElement;
    const toggle = $("#vortex-toggle");
    const ctx = canvas.getContext("2d");
    const noise3D = createNoise3D();

    const COUNT = window.innerWidth < 640 ? 150 : window.innerWidth < 1024 ? 400 : 600;
    const PROPS = 9, LEN = COUNT * PROPS;
    const RANGE_Y = 130, BASE_TTL = 50, RANGE_TTL = 150;
    const BASE_SPEED = 0.1, RANGE_SPEED = 1.5;
    const BASE_RADIUS = 1, RANGE_RADIUS = 2;
    const BASE_HUE = 200, RANGE_HUE = 80;
    const NOISE_STEPS = 3, X_OFF = 0.00125, Y_OFF = 0.00125, Z_OFF = 0.0005;
    const TAU = Math.PI * 2;

    const props = new Float32Array(LEN);
    const center = [0, 0];
    let tick = 0, id = 0, running = false, paused = false, inView = true;

    const rand = (n) => n * Math.random();
    const randRange = (n) => n - rand(2 * n);
    const lerp = (a, b, t) => (1 - t) * a + t * b;
    const fade = (t, m) => { const h = 0.5 * m; return Math.abs(((t + h) % m) - h) / h; };

    function resize() {
      canvas.width = stage.clientWidth;
      canvas.height = stage.clientHeight;
      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
    }

    function initParticle(i) {
      props.set([
        rand(canvas.width),
        center[1] + randRange(RANGE_Y),
        0, 0, 0,
        BASE_TTL + rand(RANGE_TTL),
        BASE_SPEED + rand(RANGE_SPEED),
        BASE_RADIUS + rand(RANGE_RADIUS),
        BASE_HUE + rand(RANGE_HUE),
      ], i);
    }

    function step() {
      for (let i = 0; i < LEN; i += PROPS) {
        const x = props[i], y = props[i + 1];
        const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
        const vx = lerp(props[i + 2], Math.cos(n), 0.5);
        const vy = lerp(props[i + 3], Math.sin(n), 0.5);
        const speed = props[i + 6];
        const x2 = x + vx * speed, y2 = y + vy * speed;
        const life = props[i + 4], ttl = props[i + 5];

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineWidth = props[i + 7];
        ctx.strokeStyle = `hsla(${props[i + 8]}, 100%, 62%, ${fade(life, ttl)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();

        props[i] = x2; props[i + 1] = y2;
        props[i + 2] = vx; props[i + 3] = vy;
        props[i + 4] = life + 1;
        if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) initParticle(i);
      }
    }

    /* the canvas stays transparent — the stage's CSS paints the navy.
       Filling it here would get amplified by the lighter+brightness glow. */
    function glow() {
      ctx.save();
      ctx.filter = "blur(8px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.filter = "blur(4px) brightness(200%)";
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }

    function frame() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step();
      glow();
      id = raf(frame);
    }

    function start() { if (running || paused || !inView) return; running = true; id = raf(frame); }
    function stop() { running = false; window.cancelAnimationFrame(id); }

    function staticFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let f = 0; f < 90; f++) { tick++; step(); }
      glow();
    }

    resize();
    for (let i = 0; i < LEN; i += PROPS) initParticle(i);

    new ResizeObserver(() => {
      if (canvas.width === stage.clientWidth && canvas.height === stage.clientHeight) return;
      resize();
      if (RM || paused) staticFrame();
    }).observe(stage);

    if (RM) { staticFrame(); toggle.hidden = true; return; }

    /* battery-friendly: only animate while the hero is on screen */
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.05 }).observe(stage);

    toggle.addEventListener("click", () => {
      paused = !paused;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", paused ? "Resume background animation" : "Pause background animation");
      if (paused) { stop(); staticFrame(); } else start();
    });

    start();
  }

  /* ============================================================
     TEXT REVEAL ENGINE — scramble / typewriter / word stagger
     ============================================================ */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*+-";

  function prepareText() {
    /* glyphs are grouped inside word wrappers — inline-block spans would
       otherwise let the browser break a line between any two letters */
    $$('[data-reveal="scramble"]').forEach((el) => {
      const text = el.textContent;
      el.textContent = "";
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (!part.trim()) { el.appendChild(document.createTextNode(part)); return; }
        const word = document.createElement("span");
        word.className = "gword";
        [...part].forEach((ch) => {
          const s = document.createElement("span");
          s.className = "glyph";
          s.dataset.ch = ch;
          s.textContent = ch;
          word.appendChild(s);
        });
        el.appendChild(word);
      });
      el.dataset.text = text;
    });

    /* walks text nodes rather than reading textContent, so inline markup
       (<b>, <em>) inside a paragraph survives the word wrapping */
    $$('[data-reveal="words"]').forEach((el) => {
      let i = 0;
      (function wrap(node) {
        [...node.childNodes].forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
              const s = document.createElement("span");
              s.className = "word";
              s.style.setProperty("--i", i++);
              s.textContent = part;
              frag.appendChild(s);
            });
            child.replaceWith(frag);
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            wrap(child);
          }
        });
      })(el);
    });

    $$('[data-reveal="type"]').forEach((el) => {
      el.dataset.text = el.textContent;
      el.textContent = "";
    });
  }

  function runScramble(el) {
    const glyphs = $$(".glyph", el);
    if (RM) { glyphs.forEach((g) => g.classList.add("is-on")); return; }
    const LOCK_STEP = 34;       /* ms between each glyph locking */
    const SPIN = 260;           /* ms a glyph spends cycling */
    const t0 = performance.now();

    function frame(now) {
      const t = now - t0;
      let live = false;
      glyphs.forEach((g, i) => {
        const ch = g.dataset.ch;
        if (ch === " ") { g.classList.add("is-on"); return; }
        const startAt = i * LOCK_STEP;
        if (t < startAt) { live = true; g.textContent = ""; return; }
        if (t > startAt + SPIN) {
          if (!g.classList.contains("is-on")) {
            g.classList.remove("is-scrambling");
            g.classList.add("is-on");
            g.textContent = ch;
          }
          return;
        }
        live = true;
        g.classList.add("is-scrambling");
        g.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      });
      if (live) raf(frame);
    }
    raf(frame);
  }

  function runType(el) {
    const text = el.dataset.text || "";
    if (RM) { el.textContent = text; return; }
    el.classList.add("caret");
    let i = 0;
    const step = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) window.setTimeout(step, 26);
      else window.setTimeout(() => el.classList.remove("caret"), 900);
    };
    step();
  }

  function initReveals() {
    $$("[data-stagger]").forEach((group) => {
      $$(".reveal", group).forEach((el, i) => el.style.setProperty("--i", i));
    });

    const targets = $$(".reveal, [data-reveal]");
    if (RM) {
      targets.forEach((el) => {
        el.classList.add("is-in");
        if (el.dataset.reveal === "scramble") runScramble(el);
        if (el.dataset.reveal === "type") el.textContent = el.dataset.text || "";
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        io.unobserve(el);
        el.classList.add("is-in");
        if (el.dataset.reveal === "scramble") runScramble(el);
        else if (el.dataset.reveal === "type") runType(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    targets.forEach((el) => io.observe(el));
  }

  /* ============================================================
     RENDER
     ============================================================ */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* "model" = trained by Rasty, "agent" = LLM integration. Different claims,
     so they get different labels rather than one blanket "AI" badge. */
  const AI_LABEL = { model: "Trained model", agent: "LLM agent" };

  function cardHTML(item, i, kind) {
    const photoBadge = kind === "beyond" && item.photos.length
      ? `<span class="card__photos">
           <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
           ${item.photos.length}
         </span>` : "";

    const chips = kind === "beyond" ? [item.role] : (item.tech || []).slice(0, 4);
    const aiBadge = item.ai
      ? `<span class="card__ai" data-ai="${esc(item.ai)}">
           <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>
           ${esc(AI_LABEL[item.ai] || "AI")}
         </span>` : "";
    const metric = item.metric ? `<span class="card__metric">${esc(item.metric)}</span>` : "";

    return `
      <button class="card${item.featured ? " card--featured" : ""}" type="button"
              data-cat="${esc(item.cat)}" data-i="${i}" data-kind="${kind}"
              aria-label="${esc(item.title)} — open details">
        <span class="card__thumb">
          <span class="card__kind">${esc(item.cat)}</span>
          <span class="card__year">${esc(item.year)}</span>
          <span class="card__abbr">${esc(item.abbr)}</span>
          ${kind === "work" ? `<span class="card__index">${String(i + 1).padStart(2, "0")}</span>` : ""}
        </span>
        <span class="card__body">
          <span class="card__meta">${aiBadge}${metric}</span>
          <span class="card__title">${esc(item.title)}</span>
          <span class="card__desc">${esc(item.summary)}</span>
          <span class="card__tags">${chips.map((t) => `<span class="card__tag">${esc(t)}</span>`).join("")}</span>
          <span class="card__more">View detail ${photoBadge}</span>
        </span>
      </button>`;
  }

  function filtersHTML(list) {
    const cats = ["All", ...[...new Set(list.map((p) => p.cat))]];
    return cats.map((c, i) => {
      const n = c === "All" ? list.length : list.filter((p) => p.cat === c).length;
      return `<button class="filter" type="button" role="tab" data-cat="${esc(c)}" aria-selected="${i === 0}">${esc(c)}<span class="filter__n">${n}</span></button>`;
    }).join("");
  }

  function render() {
    $("#work-grid").innerHTML = PROJECTS.map((p, i) => cardHTML(p, i, "work")).join("");
    $("#work-filters").innerHTML = filtersHTML(PROJECTS);
    $("#beyond-grid").innerHTML = BEYOND.map((p, i) => cardHTML(p, i, "beyond")).join("");
    $("#beyond-filters").innerHTML = filtersHTML(BEYOND);

    const tl = (list) => list.map((t) => `
      <li class="tl-item${t.now ? " tl-item--now" : ""} reveal">
        <p class="tl-item__dates">${esc(t.dates)}</p>
        <h4 class="tl-item__role">${esc(t.role)}</h4>
        <p class="tl-item__org">${esc(t.org)}</p>
        <ul class="tl-item__desc">${t.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </li>`).join("");

    $("#timeline").innerHTML = tl(TIMELINE);
    $("#timeline").setAttribute("data-stagger", "");
    $("#education").innerHTML = tl(EDUCATION);
    $("#education").setAttribute("data-stagger", "");
    $("#exp-count").textContent = `${TIMELINE.length} roles`;

    $("#stack-rail").innerHTML = STACK.map((g, i) => `
      <button class="matrix__cat" type="button" role="tab" data-i="${i}" aria-selected="${i === 0}">
        ${esc(g.name)}<b>${g.items.length}</b>
      </button>`).join("");
    renderStack(0);

    $("#marquee-track").innerHTML = [...MARQUEE, ...MARQUEE]
      .map((m) => `<span class="marquee__item">${esc(m)}</span>`).join("");
  }

  function renderStack(idx) {
    const g = STACK[idx];
    $("#stack-panel").innerHTML = `<div class="matrix__grid">${g.items.map(([name, tier], i) => `
      <div class="skill skill--${tier}" style="--i:${i}">
        <span class="skill__name">${esc(name)}</span>
        <span class="skill__meter" role="img" aria-label="${tier}"><i></i><i></i><i></i></span>
      </div>`).join("")}</div>`;
  }

  function initStack() {
    const rail = $("#stack-rail");
    rail.addEventListener("click", (e) => {
      const btn = e.target.closest(".matrix__cat");
      if (!btn) return;
      $$(".matrix__cat", rail).forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      renderStack(+btn.dataset.i);
    });
    /* arrow keys move between categories — standard tablist behavior */
    rail.addEventListener("keydown", (e) => {
      const btns = $$(".matrix__cat", rail);
      const cur = btns.indexOf(document.activeElement);
      if (cur < 0) return;
      const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const next = btns[(cur + dir + btns.length) % btns.length];
      next.focus();
      next.click();
    });
  }

  /* ============================================================
     GALLERY FILTERS — FLIP so surviving cards glide to new slots
     ============================================================ */
  function initFilters(filterId, gridId, emptyId) {
    const bar = $(filterId), grid = $(gridId), empty = $(emptyId);

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;
      const cat = btn.dataset.cat;
      $$(".filter", bar).forEach((b) => b.setAttribute("aria-selected", String(b === btn)));

      const cards = $$(".card", grid);
      const first = new Map(cards.map((c) => [c, c.getBoundingClientRect()]));
      const wasHidden = new Set(cards.filter((c) => c.classList.contains("is-hidden")));

      let shown = 0;
      cards.forEach((c) => {
        const match = cat === "All" || c.dataset.cat === cat;
        c.classList.toggle("is-hidden", !match);
        if (match) shown++;
      });
      empty.hidden = shown > 0;

      if (RM) return;
      cards.forEach((c) => {
        if (c.classList.contains("is-hidden")) return;
        if (wasHidden.has(c)) { c.classList.remove("is-enter"); void c.offsetWidth; c.classList.add("is-enter"); return; }
        const f = first.get(c), l = c.getBoundingClientRect();
        const dx = f.left - l.left, dy = f.top - l.top;
        if (!dx && !dy) return;
        c.classList.add("is-flip");
        c.style.transform = `translate(${dx}px, ${dy}px)`;
        raf(() => { c.classList.remove("is-flip"); c.style.transform = ""; });
      });
    });
  }

  /* ============================================================
     DETAIL OVERLAY — shared by Work and Beyond.
     Uses the View Transitions API for a real shared-element morph
     where supported, and a blur-scale enter everywhere else.
     ============================================================ */
  const detail = {
    el: $("#detail"), body: $("#detail-body"), pos: $("#detail-pos"),
    prev: $("#detail-prev"), next: $("#detail-next"),
    list: [], index: 0, kind: "work", origin: null, lastFocus: null,
  };

  function detailHTML(item, kind) {
    const gallery = kind === "beyond"
      ? (item.photos.length
        ? `<section>
             <h4 class="detail__sub">Photos</h4>
             <div class="detail__gallery">${item.photos.map((p, i) => `
               <button class="detail__shot" type="button" data-photo="${i}">
                 <img src="${esc(p.src)}" alt="${esc(p.cap || item.title)}" loading="lazy" />
               </button>`).join("")}</div>
           </section>`
        : `<p class="detail__note">No photos attached yet. Drop images into <b>assets/beyond/</b> and list them in this entry's <b>photos</b> array in app.js &mdash; they will appear here in a lightbox.</p>`)
      : "";

    const tags = item.tech
      ? `<section>
           <h4 class="detail__sub">Built with</h4>
           <div class="detail__tags">${item.tech.map((t) => `<span class="card__tag">${esc(t)}</span>`).join("")}</div>
         </section>` : "";

    /* the label has to match where the link actually goes */
    const isRepo = /github\.com/.test(item.link || "");
    const link = item.link
      ? `<a class="btn btn--primary" href="${esc(item.link)}" target="_blank" rel="noopener">
           ${isRepo ? "View the source" : "Visit the live system"}
           <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>
         </a>` : "";

    const aiLine = item.ai
      ? `<span class="detail__ai">${esc(AI_LABEL[item.ai] || "AI")}</span>` : "";

    return `
      <div class="detail__hero" style="view-transition-name:detail-hero">
        <span class="detail__abbr">${esc(item.abbr)}</span>
        ${item.metric ? `<span class="detail__metric">${esc(item.metric)}</span>` : ""}
      </div>
      <header class="detail__head">
        <p class="detail__meta"><span>${esc(item.cat)}</span><span>${esc(item.year)}</span>${aiLine}</p>
        <h3 class="detail__title" id="detail-title">${esc(item.title)}</h3>
        <p class="detail__role">${esc(item.role)}</p>
      </header>
      <div class="detail__body">
        <p>${esc(item.summary)}</p>
        <section>
          <h4 class="detail__sub">${kind === "beyond" ? "What it involved" : "Highlights"}</h4>
          <ul class="detail__list">${item.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
        </section>
        ${tags}
        ${gallery}
        ${link}
      </div>`;
  }

  function paintDetail() {
    const item = detail.list[detail.index];
    detail.body.innerHTML = detailHTML(item, detail.kind);
    detail.body.scrollTop = 0;
    detail.pos.textContent = `${String(detail.index + 1).padStart(2, "0")} / ${String(detail.list.length).padStart(2, "0")}`;
    detail.prev.disabled = detail.index === 0;
    detail.next.disabled = detail.index === detail.list.length - 1;
  }

  /* run a DOM update inside a shared-element view transition when available */
  function withVT(originEl, fn) {
    if (!document.startViewTransition || RM) { fn(); return; }
    if (originEl) originEl.style.viewTransitionName = "detail-hero";
    const t = document.startViewTransition(() => {
      if (originEl) originEl.style.viewTransitionName = "";
      fn();
    });
    t.finished.catch(() => {}).finally(() => { if (originEl) originEl.style.viewTransitionName = ""; });
  }

  function openDetail(kind, index, originCard) {
    detail.kind = kind;
    detail.list = kind === "work" ? PROJECTS : BEYOND;
    detail.index = index;
    detail.origin = originCard || null;
    detail.lastFocus = document.activeElement;

    const thumb = originCard ? $(".card__thumb", originCard) : null;
    withVT(thumb, () => {
      paintDetail();
      detail.el.hidden = false;
      document.body.classList.add("is-locked");
    });
    window.setTimeout(() => $(".detail__close").focus(), 60);
  }

  function closeDetail() {
    const card = detail.origin;
    const thumb = card ? $(".card__thumb", card) : null;
    const hero = $(".detail__hero", detail.body);
    if (hero && document.startViewTransition && !RM) hero.style.viewTransitionName = "detail-hero";

    const run = () => {
      detail.el.hidden = true;
      detail.body.innerHTML = "";
      document.body.classList.remove("is-locked");
      if (thumb) thumb.style.viewTransitionName = "detail-hero";
    };

    if (!document.startViewTransition || RM) { run(); if (thumb) thumb.style.viewTransitionName = ""; }
    else {
      const t = document.startViewTransition(run);
      t.finished.catch(() => {}).finally(() => { if (thumb) thumb.style.viewTransitionName = ""; });
    }
    if (detail.lastFocus) detail.lastFocus.focus();
  }

  function stepDetail(dir) {
    const next = detail.index + dir;
    if (next < 0 || next >= detail.list.length) return;
    detail.index = next;
    detail.origin = null;                 /* no origin card for keyboard stepping */
    paintDetail();
  }

  function initDetail() {
    $$(".gallery").forEach((grid) => {
      grid.addEventListener("click", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;
        openDetail(card.dataset.kind, +card.dataset.i, card);
      });
    });

    $$("[data-detail-close]").forEach((b) => b.addEventListener("click", closeDetail));
    detail.prev.addEventListener("click", () => stepDetail(-1));
    detail.next.addEventListener("click", () => stepDetail(1));

    detail.body.addEventListener("click", (e) => {
      const shot = e.target.closest("[data-photo]");
      if (!shot) return;
      openLightbox(detail.list[detail.index].photos, +shot.dataset.photo);
    });
  }

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lb = { el: $("#lightbox"), fig: $("#lb-figure"), cap: $("#lb-cap"), img: null, photos: [], index: 0 };

  function paintLightbox() {
    const p = lb.photos[lb.index];
    if (!lb.img) {
      lb.img = document.createElement("img");
      lb.img.decoding = "async";
      lb.fig.insertBefore(lb.img, lb.cap);
    }
    lb.img.src = p.src;
    lb.img.alt = p.cap || "";
    lb.cap.textContent = `${p.cap || ""}  ${lb.index + 1} / ${lb.photos.length}`.trim();
    $("#lb-prev").hidden = lb.photos.length < 2;
    $("#lb-next").hidden = lb.photos.length < 2;
  }

  function openLightbox(photos, index) {
    if (!photos || !photos.length) return;
    lb.photos = photos;
    lb.index = index;
    paintLightbox();
    lb.el.hidden = false;
  }

  function closeLightbox() { lb.el.hidden = true; }

  function stepLightbox(dir) {
    lb.index = (lb.index + dir + lb.photos.length) % lb.photos.length;
    paintLightbox();
  }

  function initLightbox() {
    $$("[data-lb-close]").forEach((b) => b.addEventListener("click", closeLightbox));
    $("#lb-prev").addEventListener("click", () => stepLightbox(-1));
    $("#lb-next").addEventListener("click", () => stepLightbox(1));
  }

  /* ============================================================
     NAV — scrolled state, progress hairline, scrollspy, rail
     ============================================================ */
  const SECTIONS = ["about", "work", "stack", "experience", "beyond", "contact"];

  function initNav() {
    const nav = $("#nav");
    const progress = $("#progress");
    const fab = $("#fab");
    const rail = $("#rail");
    fab.hidden = false;
    let queued = false;

    function onScroll() {
      if (queued) return;
      queued = true;
      raf(() => {
        queued = false;
        const y = window.scrollY;
        nav.classList.toggle("is-scrolled", y > 8);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        fab.classList.toggle("is-visible", y > 600);
        fab.style.pointerEvents = y > 600 ? "auto" : "none";
        rail.classList.toggle("is-visible", y > 300);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const links = $$("[data-spy]");
    const rails = $$("[data-rail]");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
        rails.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    SECTIONS.forEach((id) => spy.observe(document.getElementById(id)));

    fab.addEventListener("click", () => window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }));

    const burger = $("#burger");
    const menu = $("#mobile-menu");
    function setMenu(open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
      document.body.classList.toggle("is-locked", open);
    }
    burger.addEventListener("click", () => setMenu(menu.hidden));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  }

  /* ============================================================
     COUNTERS
     ============================================================ */
  const fmt = (n) => n.toLocaleString("en-US");

  let counterIO = null;
  function initCounters() {
    counterIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        counterIO.unobserve(el);
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        if (RM) { el.textContent = fmt(target) + suffix; return; }
        const t0 = performance.now(), DUR = 1100;
        const step = (now) => {
          const t = Math.min((now - t0) / DUR, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - t, 3)))) + suffix;
          if (t < 1) raf(step);
        };
        raf(step);
      });
    }, { threshold: 0.6 });
    observeCounters(document);
  }

  /* stat tiles arrive after the GitHub fetch, so they need observing too */
  function observeCounters(root) {
    if (!counterIO) return;
    $$("[data-count]", root).forEach((el) => counterIO.observe(el));
  }

  /* ============================================================
     GITHUB ACTIVITY — live contribution graph.

     Contributions come from a public, CORS-enabled, no-auth mirror
     of the GitHub contribution calendar; the repo count comes from
     the GitHub REST API. If either is unreachable the tiles fall
     back to the dated snapshot below and the graph is hidden rather
     than faked.
     ============================================================ */
  const GH_USER = "RastyFullStaxx";
  const GH_SNAPSHOT = { total: 1308, active: 252, longest: 55, repos: 61, asOf: "31 Jul 2026" };
  const GH_LEVELS = 5;

  function statTile(value, label, suffix = "") {
    return `<div class="stat reveal">
      <span class="stat__num" data-count="${value}" data-suffix="${suffix}">0</span>
      <span class="stat__label">${label}</span>
    </div>`;
  }

  function renderStats(s) {
    $("#about-stats").innerHTML =
      statTile(s.total, "contributions · 1 yr") +
      statTile(s.active, "active days") +
      statTile(s.longest, "longest streak") +
      statTile(s.repos, "public repos");
    $$("#about-stats .reveal").forEach((el, i) => {
      el.style.setProperty("--i", i);
      el.classList.add("is-in");
    });
    observeCounters($("#about-stats"));
  }

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* The upstream `level` field buckets this account almost entirely into
     level 1 (227 of 252 active days), which renders as a flat wall. Levels
     are recomputed here from quartiles of the account's own non-zero days,
     which is what makes the intensity readable. */
  function levelizer(days) {
    const nz = days.filter((d) => d.count > 0).map((d) => d.count).sort((a, b) => a - b);
    if (!nz.length) return () => 0;
    const q = (p) => nz[Math.floor(p * (nz.length - 1))];
    const t1 = q(0.25), t2 = q(0.5), t3 = q(0.75);
    return (n) => (n === 0 ? 0 : n <= t1 ? 1 : n <= t2 ? 2 : n <= t3 ? 3 : 4);
  }

  function buildHeatmap(days) {
    const CELL = 12, GAP = 3, PITCH = CELL + GAP;
    const PAD_L = 30, PAD_T = 18;
    const levelOf = levelizer(days);

    /* pad the head so the first column starts on a Sunday, like GitHub */
    const lead = new Date(days[0].date + "T00:00:00").getDay();
    const cells = Array(lead).fill(null).concat(days);
    const weeks = Math.ceil(cells.length / 7);
    const w = PAD_L + weeks * PITCH;
    const h = PAD_T + 7 * PITCH;

    let rects = "";
    let months = "";
    let lastMonth = -1;

    cells.forEach((d, i) => {
      const col = (i / 7) | 0, row = i % 7;
      const x = PAD_L + col * PITCH, y = PAD_T + row * PITCH;
      if (!d) return;

      const date = new Date(d.date + "T00:00:00");
      if (date.getMonth() !== lastMonth && date.getDate() <= 7) {
        lastMonth = date.getMonth();
        months += `<text class="gh__mon" x="${x}" y="10">${MONTHS[lastMonth]}</text>`;
      }
      const label = `${d.count} contribution${d.count === 1 ? "" : "s"} on ${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
      rects += `<rect class="gh__cell" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5"
        data-lv="${levelOf(d.count)}" style="--c:${col}" data-tip="${esc(label)}"><title>${esc(label)}</title></rect>`;
    });

    const dayLabels = [1, 3, 5].map((r) =>
      `<text class="gh__day" x="0" y="${PAD_T + r * PITCH + CELL - 2}">${DAYS[r]}</text>`).join("");

    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img"
      aria-label="GitHub contribution graph for the last year">${months}${dayLabels}${rects}</svg>`;
  }

  function computeStats(days) {
    let total = 0, active = 0, longest = 0, run = 0;
    days.forEach((d) => {
      total += d.count;
      if (d.count > 0) { active++; run++; longest = Math.max(longest, run); } else run = 0;
    });
    return { total, active, longest };
  }

  async function loadGitHub() {
    const graph = $("#gh-graph");
    const note = $("#gh-note");
    const win = $("#gh-window");

    try {
      const [cRes, uRes] = await Promise.all([
        fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`),
        fetch(`https://api.github.com/users/${GH_USER}`),
      ]);
      if (!cRes.ok) throw new Error("contributions unavailable");

      const data = await cRes.json();
      const today = new Date().toISOString().slice(0, 10);
      const days = data.contributions.filter((d) => d.date <= today).slice(-371);
      if (!days.length) throw new Error("no contribution data");

      const s = computeStats(days);
      s.repos = uRes.ok ? (await uRes.json()).public_repos : GH_SNAPSHOT.repos;
      renderStats(s);

      graph.innerHTML = buildHeatmap(days);
      const from = new Date(days[0].date + "T00:00:00");
      const to = new Date(days[days.length - 1].date + "T00:00:00");
      const span = (d) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      win.textContent = `${span(from)} — ${span(to)}`;
      note.textContent = `${fmt(s.total)} contributions across ${fmt(days.length)} days`;
      if (!RM) graph.classList.add("is-drawn");
      initHeatmapTip();
    } catch {
      /* honest degradation: dated snapshot, and no invented graph */
      renderStats(GH_SNAPSHOT);
      win.textContent = `snapshot · ${GH_SNAPSHOT.asOf}`;
      note.innerHTML = `Live graph unavailable right now — figures above are a snapshot from ${esc(GH_SNAPSHOT.asOf)}.`;
      $(".gh__scroll").hidden = true;
      $(".gh__legend").hidden = true;
    }
  }

  function initHeatmapTip() {
    const tip = $("#gh-tip");
    const graph = $("#gh-graph");
    if (!FINE) return;

    graph.addEventListener("pointerover", (e) => {
      const cell = e.target.closest(".gh__cell");
      if (!cell) return;
      tip.textContent = cell.dataset.tip;
      tip.hidden = false;                       /* unhide before measuring */
      const r = cell.getBoundingClientRect();
      const host = graph.closest(".gh").getBoundingClientRect();
      /* keep the bubble inside the panel — cells near either edge would clip */
      const half = tip.offsetWidth / 2;
      const x = r.left - host.left + r.width / 2;
      tip.style.left = `${Math.max(half + 8, Math.min(x, host.width - half - 8))}px`;
      tip.style.top = `${r.top - host.top - 10}px`;
    });
    graph.addEventListener("pointerleave", () => { tip.hidden = true; });
  }

  /* ============================================================
     TILT + SPOTLIGHT + MAGNETS + CURSOR (desktop, motion allowed)
     ============================================================ */
  function initPointerFX() {
    if (!FINE || RM) return;

    $$(".gallery").forEach((grid) => {
      let active = null, pending = 0;
      grid.addEventListener("pointermove", (e) => {
        const card = e.target.closest(".card");
        if (!card) return;
        active = card;
        if (pending) return;
        pending = raf(() => {
          pending = 0;
          if (!active) return;
          const r = active.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          active.style.transform = `rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 8}deg)`;
          active.style.setProperty("--mx", `${px * 100}%`);
          active.style.setProperty("--my", `${py * 100}%`);
        });
      });
      grid.addEventListener("pointerout", (e) => {
        const card = e.target.closest(".card");
        if (card && !card.contains(e.relatedTarget)) { card.style.transform = ""; active = null; }
      });
    });

    $$("[data-magnet]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        el.style.transform = `translate(${Math.max(-10, Math.min(10, dx))}px, ${Math.max(-8, Math.min(8, dy))}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });

    const root = $("#cursor");
    const dot = $(".cursor__dot", root);
    const ring = $(".cursor__ring", root);
    let mx = -100, my = -100, rx = -100, ry = -100, live = false;

    window.addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (!live) { live = true; loop(); }
    }, { passive: true });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(var(--cur-s))`;
      raf(loop);
    }

    document.addEventListener("mouseover", (e) => {
      root.classList.toggle("is-hover", !!e.target.closest("a, button, [data-cursor], .card"));
    });
  }

  /* ============================================================
     COMMAND PALETTE — sections, projects, involvement, actions
     ============================================================ */
  function initPalette() {
    const overlay = $("#palette");
    const input = $("#palette-input");
    const list = $("#palette-list");
    let selected = 0, lastFocus = null, filtered = [];

    const goTo = (sel) => $(sel).scrollIntoView({ behavior: RM ? "auto" : "smooth", block: "start" });

    const ACTIONS = [
      ...SECTIONS.map((id) => ({
        label: `Go to ${id[0].toUpperCase()}${id.slice(1)}`, hint: "section",
        keywords: id, run: () => goTo("#" + id),
      })),
      ...PROJECTS.map((p, i) => ({
        label: p.title, hint: "project",
        keywords: `${p.cat} ${(p.tech || []).join(" ")} project work`,
        run: () => { goTo("#work"); window.setTimeout(() => openDetail("work", i, null), 420); },
      })),
      ...BEYOND.map((p, i) => ({
        label: p.title, hint: "involvement",
        keywords: `${p.cat} ${p.role} training seminar community award`,
        run: () => { goTo("#beyond"); window.setTimeout(() => openDetail("beyond", i, null), 420); },
      })),
      { label: "Copy email address", hint: "action", keywords: "copy email clipboard contact", run: copyEmail },
      { label: "Email me", hint: "action", keywords: "email send message mail contact", run: () => { window.location.href = `mailto:${EMAIL}`; } },
      { label: "Download CV", hint: "action", keywords: "cv resume download pdf", run: () => { window.location.href = "assets/Rasty-Espartero-CV.pdf"; } },
      { label: "Open GitHub", hint: "external", keywords: "github code repo", run: () => window.open("https://github.com/RastyFullStaxx", "_blank", "noopener") },
      { label: "Open LinkedIn", hint: "external", keywords: "linkedin profile network", run: () => window.open("https://www.linkedin.com/in/rastyespartero/", "_blank", "noopener") },
    ];

    function renderList(q = "") {
      const query = q.trim().toLowerCase();
      filtered = ACTIONS.filter((a) => !query || (a.label + " " + a.keywords).toLowerCase().includes(query));
      selected = 0;
      if (!filtered.length) {
        list.innerHTML = `<li class="palette__empty">No matches. Try &ldquo;laravel&rdquo;, &ldquo;award&rdquo; or &ldquo;email&rdquo;.</li>`;
        input.setAttribute("aria-activedescendant", "");
        return;
      }
      list.innerHTML = filtered.map((a, i) => `
        <li class="palette__item" id="cmd-${i}" role="option" aria-selected="${i === 0}">
          <span>${esc(a.label)}</span><span class="palette__item-hint">${a.hint}</span>
        </li>`).join("");
      input.setAttribute("aria-activedescendant", "cmd-0");
      $$(".palette__item", list).forEach((li, i) => {
        li.addEventListener("mouseenter", () => select(i));
        li.addEventListener("click", () => runAction(i));
      });
    }

    function select(i) {
      selected = i;
      $$(".palette__item", list).forEach((li, j) => li.setAttribute("aria-selected", String(j === i)));
      input.setAttribute("aria-activedescendant", `cmd-${i}`);
      const li = $(`#cmd-${i}`);
      if (li) li.scrollIntoView({ block: "nearest" });
    }

    function runAction(i) {
      const a = filtered[i];
      if (!a) return;
      close();
      a.run();
    }

    function open() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      document.body.classList.add("is-locked");
      input.value = "";
      renderList();
      input.focus();
    }
    function close() {
      overlay.hidden = true;
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    }

    input.addEventListener("input", () => renderList(input.value));
    $("[data-close]", overlay).addEventListener("click", close);
    $("#cmdk-hint").addEventListener("click", open);

    /* one keyboard authority for every layer, innermost first */
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        overlay.hidden ? open() : close();
        return;
      }

      if (!lb.el.hidden) {
        if (e.key === "Escape") { e.preventDefault(); closeLightbox(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); stepLightbox(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); stepLightbox(-1); }
        return;
      }

      if (!overlay.hidden) {
        if (e.key === "Escape") { e.preventDefault(); close(); }
        else if (e.key === "ArrowDown") { e.preventDefault(); select(Math.min(selected + 1, filtered.length - 1)); }
        else if (e.key === "ArrowUp") { e.preventDefault(); select(Math.max(selected - 1, 0)); }
        else if (e.key === "Enter") { e.preventDefault(); runAction(selected); }
        else if (e.key === "Tab") e.preventDefault();
        return;
      }

      if (!detail.el.hidden) {
        if (e.key === "Escape") { e.preventDefault(); closeDetail(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); stepDetail(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); stepDetail(-1); }
        return;
      }

      const menu = $("#mobile-menu");
      if (e.key === "Escape" && !menu.hidden) $("#burger").click();
    });
  }

  /* ============================================================
     TOAST + COPY
     ============================================================ */
  let toastTimer = 0;
  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function copyEmail() {
    const done = () => showToast("Email copied — talk soon.");
    const fail = () => showToast(`Copy failed — it's ${EMAIL}`);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(EMAIL).then(done, fail);
    } else {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? done() : fail(); } catch { fail(); }
      ta.remove();
    }
  }

  function initClock() {
    const el = $("#clock");
    const fmt = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const update = () => { el.textContent = fmt.format(new Date()); };
    update();
    window.setInterval(update, 1000);
  }

  /* ============================================================
     BOOT ORDER
     ============================================================ */
  render();
  prepareText();
  initVortex();
  initNav();
  initStack();
  initFilters("#work-filters", "#work-grid", "#work-empty");
  initFilters("#beyond-filters", "#beyond-grid", "#beyond-empty");
  initDetail();
  initLightbox();
  initPointerFX();
  initPalette();
  initClock();
  $("#copy-email").addEventListener("click", copyEmail);

  /* reveals only start once the shutter is open, so nothing plays unseen */
  boot().then(() => {
    initReveals();
    initCounters();
    loadGitHub();
  });
})();
