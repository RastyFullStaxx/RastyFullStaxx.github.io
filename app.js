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
        "First author on the resulting undergraduate thesis at the Polytechnic University of the Philippines — Manila.",
      ],
      tech: ["PyTorch", "LayoutLMv3", "Graph Neural Networks", "T5", "FastAPI", "HuggingFace", "PDF.js"], link: "https://github.com/RastyFullStaxx/IntelliForm",
    },
    {
      abbr: "BBS", title: "Balik-Bayan Scientist Program System",
      cat: "Government", year: "2025", role: "DevOps Intern — CGI",
      metric: "DOST national program",
      summary: "Program management platform for the Department of Science and Technology's Balik-Bayan Scientist Program, delivered during my DevOps internship at CGI.",
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
      abbr: "CR", title: "Clinical Workflow System",
      cat: "Healthcare", year: "2026", role: "Lead Full-Stack Developer",
      metric: "17 clinic documents automated",
      summary: "A patient-course-centred workspace for a radiation oncology clinic, replacing a manual spreadsheet, Drive and Word workflow with one auditable record of treatment readiness.",
      highlights: [
        "Automated the clinic's fractionation log — cumulative dose, skin dose, isodose and days-on-treatment compute per fraction, and a record that diverges from the prescription raises a review flag automatically.",
        "Generates the clinic's own seventeen documents straight from structured forms: DOCX through docxtemplater, XLSX fraction logs through exceljs. Nobody retypes a Word template again.",
        "Split persistence across two PostgreSQL databases — tokenized operational data and PHI — so protected health information never reaches client bundles, query strings, logs or browser storage.",
        "Readiness is derived from evidence and approvals rather than manually asserted, and a pre-authorisation state machine blocks the Planning → On Treatment transition until it clears.",
        "Built to WCAG 2.1 AA on Next.js 16 App Router, React 19 and Prisma, with write-through persistence that survives restart.",
      ],
      tech: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Prisma", "Tailwind"], link: "",
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
      abbr: "DSP", title: "Dataset Construction Pipeline — PH Government Forms",
      cat: "AI & ML", year: "2025", role: "ML Engineer",
      ai: "model", metric: "Reproducible training data",
      summary: "The data pipeline behind IntelliForm — a reproducible process that converts annotated Philippine government PDF forms into structured JSON datasets ready for LayoutLMv3 training and evaluation.",
      highlights: [
        "Automated bounding-box extraction and OCR alignment so annotations stay anchored to the right region of the page.",
        "BIO tagging and canonical ID generation, giving every field a stable identity across documents.",
        "Dataset traceability built in, so any training run can be reproduced from the same source annotations.",
        "Handled the messy reality of government forms: inconsistent layouts, scans of varying quality, and no two agencies formatting alike.",
      ],
      tech: ["Python", "OCR", "Pandas", "NumPy", "JSON", "BIO Tagging"], link: "",
    },
    {
      abbr: "LIS", title: "FNB — Audit-Grade Inventory Platform",
      cat: "Enterprise", year: "2026", role: "Lead Full-Stack Developer",
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
      cat: "Enterprise", year: "2026", role: "Lead Full-Stack Developer",
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
      cat: "Enterprise", year: "2025", role: "Architect & Full-Stack Developer",
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
      cat: "Enterprise", year: "2025", role: "Technical Adviser & Project Manager",
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

    /* ---- independent AI/ML builds: no framework, no tutorial scaffolding ---- */
    {
      abbr: "AGT", title: "AI Agent from Scratch — Claude API",
      cat: "AI & ML", year: "2026", role: "Independent Build — Agent Engineering",
      ai: "agent", metric: "Hand-written agent loop",
      summary: "A working AI agent built directly on the Anthropic Messages API — the full tool-use loop written by hand rather than handed to a framework, so every step of the cycle is mine to reason about.",
      highlights: [
        "Implements the agentic loop end to end: send the conversation, inspect the stop reason, execute any requested tools, feed the results back, repeat until the model finishes its turn.",
        "Handles tool-use correctly at the protocol level — every result carries the matching tool-use id, and parallel calls all return together in a single turn rather than being split across messages.",
        "Tool schemas defined explicitly, with error results returned as errors so the model can recover instead of stalling.",
        "Built from scratch specifically to understand what agent frameworks abstract away — the loop, the state, and the failure modes.",
      ],
      tech: ["Python", "Claude API", "Tool Use", "JSON Schema"], link: "",
    },
    {
      abbr: "GPT", title: "Training an LLM with nanoGPT",
      cat: "AI & ML", year: "2026", role: "Independent Build — Model Training",
      ai: "model", metric: "Transformer trained from scratch",
      summary: "Trained my own language model on the nanoGPT architecture — tokenizer through training loop through sampling, on hardware I actually have.",
      highlights: [
        "Worked through the full transformer stack: tokenization, embeddings, multi-head self-attention, and the causal decoder blocks that make generation work.",
        "Ran the training loop end to end — batching, loss curves, checkpointing — and sampled from the result to see what it had learned.",
        "Tuned the practical levers that decide whether a run converges: learning rate, batch size, context length, and model depth against available compute.",
        "The point was understanding what a language model is at the tensor level, not producing a competitive model.",
      ],
      tech: ["Python", "PyTorch", "Transformers", "CUDA"], link: "",
    },
    {
      abbr: "DIF", title: "Diffusion Model from Scratch",
      cat: "AI & ML", year: "2026", role: "Independent Build — Generative Modeling",
      ai: "model", metric: "Forward + reverse process",
      summary: "A denoising diffusion model implemented from first principles in PyTorch — the forward noising process, the reverse denoiser, and the sampling loop that turns noise into an image.",
      highlights: [
        "Implemented the forward process that progressively adds Gaussian noise across a fixed schedule, and the reverse process that learns to undo it step by step.",
        "Built the U-Net denoiser with timestep conditioning so one network handles every noise level.",
        "Wrote the sampling loop that walks pure noise back to a coherent image, and watched the intermediate steps to verify the schedule was behaving.",
        "Generative modelling built from the maths up rather than by calling a pretrained pipeline.",
      ],
      tech: ["Python", "PyTorch", "U-Net", "Diffusion"], link: "",
    },
    {
      abbr: "MLP", title: "Event-Driven ML Pipelines",
      cat: "AI & ML", year: "2026", role: "Independent Build — ML Infrastructure",
      metric: "Kafka + feature store",
      summary: "A streaming machine-learning pipeline built on Kafka and a feature store — the infrastructure problem of getting features to a model consistently, in real time and in training.",
      highlights: [
        "Event-driven architecture on Kafka, so features are computed as events arrive instead of on a batch schedule.",
        "A feature store as the shared source of truth, which is what stops training and serving from silently drifting apart.",
        "Designed around the failure mode that actually breaks ML in production: not the model, but the data reaching it late, twice, or in a different shape than it was trained on.",
      ],
      tech: ["Python", "Apache Kafka", "Feature Store", "Streaming"], link: "",
    },
    {
      abbr: "RAG", title: "Agentic RAG — LangGraph & Qdrant",
      cat: "AI & ML", year: "2026", role: "Independent Build — Retrieval Systems",
      ai: "agent", metric: "Graph-orchestrated retrieval",
      summary: "A retrieval-augmented generation system where the agent decides how to retrieve — built on LangGraph for orchestration and Qdrant as the vector store.",
      highlights: [
        "LangGraph models the workflow as an explicit graph of nodes and edges, so retrieval can loop, branch, and re-query instead of running one fixed pass.",
        "Qdrant handles vector search over embedded documents, with filtering so retrieval can be scoped rather than purely semantic.",
        "Agentic rather than static: the system can judge whether what it retrieved is good enough and go back for more before answering.",
        "Built to understand where naive RAG breaks — one-shot retrieval answering the wrong question confidently.",
      ],
      tech: ["Python", "LangGraph", "Qdrant", "Embeddings", "RAG"], link: "",
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
      cat: "Government", year: "2026", role: "Project Lead & Full-Stack Developer",
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
      cat: "Government", year: "2024", role: "Full-Stack Developer & Database Designer",
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
      abbr: "RLS", title: "Real LIFE Scholarship Application Portal",
      cat: "Enterprise", year: "2025", role: "Full-Stack Developer",
      metric: "Applicant to award",
      summary: "A Laravel portal for the Real LIFE Foundation covering the full scholarship lifecycle — applicant registration, submission, administrative review and award management.",
      highlights: [
        "Applicant registration and submission built for students applying without help, often on a phone.",
        "Administrative review workflow so reviewers see a queue and a decision trail rather than a shared inbox.",
        "Scholarship-management workflows connecting an application to the grant it becomes.",
        "Built for the foundation whose scholarship I hold — the same program behind the Leadership, Integrity, Faith and Excellence principle I work by.",
      ],
      tech: ["Laravel", "PHP", "MySQL", "Blade"], link: "",
    },
    {
      abbr: "PLR", title: "Real LIFE PILLAR — Scholar Care System",
      cat: "Enterprise", year: "2025", role: "Full-Stack Developer",
      metric: "Centralized scholar care",
      summary: "A centralized care system for processing scholar requirements and issues, replacing scattered follow-ups with one tracked record per scholar.",
      highlights: [
        "One place to file, route and resolve a scholar's requirement or issue, instead of chasing it across messages.",
        "Requirement tracking so both the scholar and the coordinator can see what is outstanding.",
        "Designed around how the foundation actually supports its scholars, not around a generic ticket queue.",
      ],
      tech: ["Laravel", "PHP", "MySQL"], link: "",
    },
    {
      abbr: "DBP", title: "Digital Boot Photo Shop",
      cat: "Systems & Tools", year: "2026", role: "Lead Full-Stack Developer",
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
      cat: "Web & Data", year: "2024", role: "Backend Resident — AWS Cloud Club Philippines",
      metric: "30 days, 30 builds",
      summary: "Thirty consecutive days of backend engineering as a resident in the backend department of CodeQuest, the AWS Cloud Club Philippines' intensive program.",
      highlights: [
        "Shipped backend work every single day of the program in Python and Flask — real briefs, not tutorial follow-alongs.",
        "Designed REST endpoints, handled validation and persistence, and kept the whole run in version control from day one.",
        "The result is a public repository of thirty days of consecutive work, which is the kind of consistency that is hard to fake and easy to check.",
      ],
      tech: ["Python", "Flask", "REST APIs"], link: "https://github.com/RastyFullStaxx/AWSCC-CodeQuest-Backend",
    },
    {
      abbr: "PWS", title: "Personal Websites",
      cat: "Web & Data", year: "2025 — 2026", role: "Designer, Developer & Client Consultant",
      metric: "9 bespoke sites",
      summary: "A running series of one-off websites built for a single person and a single purpose — some as personal letters, others commissioned by clients who wanted a site of their own rather than a social media post.",
      highlights: [
        "Personal letter sites designed around one recipient and one occasion — birthdays, Christmas, thank-yous, farewells — as a more considered form than a message.",
        "Client commissions for private use, including an online exhibit built to showcase someone's own collection.",
        "Every one is hand-built rather than templated, because the point is that it was made for that person.",
        "Each is hosted independently so it can be handed over as its own link.",
      ],
      tech: ["HTML", "CSS", "JavaScript"], link: "https://github.com/RastyFullStaxx?tab=repositories",
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
      summary: "Helped establish the AWS Cloud Club at the Polytechnic University of the Philippines — Manila, to promote cloud literacy and developer collaboration across the PUP network.",
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
      abbr: "FF", title: "Real LIFE Future Forward Program",
      cat: "Training", year: "2026", role: "Graduate — Direct Executive Mentorship",
      summary: "A Real LIFE Foundation program that puts scholars in the room with senior industry leaders. I was mentored one-to-one by chief executives working in my own field.",
      highlights: [
        "Mentored directly by Shad Roi and Josef Werker — both chief executives, in person, not a lecture series or a recorded course.",
        "Josef Werker leads Penbrothers, one of the Philippines' foremost talent companies, alongside Humble Technology and Longevity Labs.",
        "The value was watching how senior operators actually reason — the thinking behind a decision, which is the part you cannot get from a book.",
        "A continuation of the same foundation whose scholarship I hold, and the Leadership, Integrity, Faith and Excellence principle I work by.",
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
      abbr: "AI", title: "Meta & Microsoft AI Programs",
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
        "Consistent President's Lister, Polytechnic University of the Philippines — Manila (2022–2025).",
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
  /* Skills come from the resume's Technical Skills section. Tiers stay
     defensible: "core" is what the CV names as specialised in; everything
     else listed is "working". A third `m` entry overrides how a skill is
     matched against project tech lists when the plain name is ambiguous
     (C would otherwise substring-match half the stack). */
  const STACK = [
    {
      name: "Languages", icon: "code", items: [
        ["PHP", "core"], ["Python", "core"], ["JavaScript", "core"], ["SQL", "core"],
        ["TypeScript", "working"], ["Java", "working"], ["C#", "working", /^C#$/i],
        ["C", "working", /^C$/i], ["Bash", "working"],
      ],
    },
    {
      name: "Backend & APIs", icon: "server", items: [
        ["Laravel", "core"], ["REST APIs", "core", /REST/i], ["FastAPI", "working"],
        ["Node / Fastify", "working", /node|fastify|hono/i], ["Auth & RBAC", "working", /auth|rbac/i],
        ["Reporting workflows", "working", /report/i],
      ],
    },
    {
      name: "Frontend", icon: "layout", items: [
        ["React", "core"], ["Next.js", "working"], ["Vue", "working"], ["Blade", "working"],
        ["Tailwind CSS", "working", /tailwind/i], ["Bootstrap", "working"], ["Vite", "working"],
        ["Responsive UI", "working", /responsive/i],
      ],
    },
    {
      name: "AI & Data", icon: "brain", items: [
        ["PyTorch", "core"], ["LayoutLMv3", "core"], ["Hugging Face", "working", /hugging/i],
        ["T5 summarization", "working", /^T5/i], ["Graph-based modeling", "working", /graph/i],
        ["OCR / PDF extraction", "working", /ocr|pdf/i], ["Pandas", "working"], ["NumPy", "working"],
        ["Evaluation metrics", "working", /grad-cam|monte carlo|metric/i],
      ],
    },
    {
      name: "Databases", icon: "database", items: [
        ["MySQL", "core"], ["PostgreSQL", "working"], ["SQLite", "working"],
        ["Prisma / Eloquent", "working", /prisma|eloquent/i], ["Schema design", "working", /schema|event sourcing/i],
      ],
    },
    {
      name: "Infrastructure & DevOps", icon: "cloud", items: [
        ["Git / GitHub", "core", /^git/i], ["CI/CD", "core", /ci\/cd/i], ["Linux", "working"],
        ["Docker", "working"], ["Kubernetes", "working"], ["AWS S3", "working", /s3/i],
        ["AWS CloudFront", "working", /cloudfront/i], ["AWS Lambda", "working", /lambda/i],
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
    {
      dates: "JUL — AUG 2022", role: "Community Service", org: "Department of Labor and Employment", now: false,
      points: [
        "Served the public directly through the department's frontline labor and employment programs.",
        "Worked with citizens navigating government processes, which shaped how I now design systems — for the person at the counter, not the administrator behind it.",
      ],
    },
  ];

  const EDUCATION = [
    {
      dates: "2022 — 2025", role: "BS Computer Science — Magna Cum Laude",
      org: "Polytechnic University of the Philippines — Manila", gwa: "GWA 1.14", now: false,
      points: [
        "Graduated Magna Cum Laude from one of the Philippines' premier national universities.",
        "Consistent President's Lister across every semester of the program.",
        "Studied on merit scholarships from DOST-SEI, the Real LIFE Foundation, Taguig City's LANI program and the NEON Foundation.",
      ],
    },
    {
      dates: "2020 — 2022", role: "STEM Strand — With High Honors",
      org: "Higher School of the University of Makati", gwa: "GWA 96.93%", now: false,
      points: [
        "Graduated with High Honors.",
        "Overall Champion, Capstone Project.",
        "Consistent Dean's Lister across every semester.",
      ],
    },
    {
      dates: "2016 — 2020", role: "Secondary Education",
      org: "Fort Bonifacio High School", gwa: "GWA 94.34%", now: false,
      points: [
        "Trained craft and creativity through the school's Art Club.",
        "Deepened mathematical ability under the school's Math Club.",
        "Facilitated community programs with the YMCA Club.",
      ],
    },
    {
      dates: "2009 — 2016", role: "Primary Education — With Honors",
      org: "West Rembo Elementary School", gwa: "GWA 93.25%", now: false,
      points: [
        "Reached regional level in English journalism, sports writing.",
        "First runner-up, MADAC division-level quiz bee.",
        "Represented the school at the division-level science quiz bee.",
        "First runner-up, district-level track and field, 100m dash.",
        "President, Eco-Savers Club.",
        "Graduated with Honors.",
      ],
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

    /* The hero field runs at full intensity on every device, deliberately —
       it is the site's signature and iOS Low Power Mode reports
       prefers-reduced-motion, which was freezing it for people who never asked.
       Accessibility is served by the always-visible pause control (WCAG 2.2.2),
       which remembers the visitor's choice; the field itself is ambient and
       low-amplitude, with no parallax, zoom or scroll coupling. Every other
       animation on the page still honours reduced motion. */
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

    /* `draw` is separate from the position update: advancing the simulation
       without drawing lets a still frame warm up without chaining every
       intermediate segment into one long streak across the canvas. */
    function step(draw) {
      for (let i = 0; i < LEN; i += PROPS) {
        const x = props[i], y = props[i + 1];
        const n = noise3D(x * X_OFF, y * Y_OFF, tick * Z_OFF) * NOISE_STEPS * TAU;
        const vx = lerp(props[i + 2], Math.cos(n), 0.5);
        const vy = lerp(props[i + 3], Math.sin(n), 0.5);
        const speed = props[i + 6];
        const x2 = x + vx * speed, y2 = y + vy * speed;
        const life = props[i + 4], ttl = props[i + 5];

        if (draw) {
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineWidth = props[i + 7];
          ctx.strokeStyle = `hsla(${props[i + 8]}, 100%, 62%, ${fade(life, ttl)})`;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
        }

        props[i] = x2; props[i + 1] = y2;
        props[i + 2] = vx; props[i + 3] = vy;
        props[i + 4] = life + 1;
        if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) initParticle(i);
      }
    }

    /* the canvas stays transparent — the stage's CSS paints the navy.
       Filling it here would get amplified by the lighter+brightness glow. */
    /* Compositing a canvas onto itself is only safe when ctx.filter forces an
       intermediate buffer. Safari's filter support is patchy, so the GPU ends up
       reading and writing one texture at once and the particles smear into long
       streaks. Bouncing through an offscreen buffer makes the source and
       destination different surfaces, which is correct on every engine. */
    const buf = document.createElement("canvas");
    const bctx = buf.getContext("2d");

    const SUPPORTS_FILTER = (() => {
      const probe = document.createElement("canvas").getContext("2d");
      probe.filter = "blur(1px)";
      return probe.filter === "blur(1px)";
    })();

    function glow() {
      if (buf.width !== canvas.width || buf.height !== canvas.height) {
        buf.width = canvas.width;
        buf.height = canvas.height;
      }
      bctx.clearRect(0, 0, buf.width, buf.height);
      bctx.drawImage(canvas, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      if (SUPPORTS_FILTER) {
        ctx.filter = "blur(8px) brightness(200%)";
        ctx.drawImage(buf, 0, 0);
        ctx.filter = "blur(4px) brightness(200%)";
        ctx.drawImage(buf, 0, 0);
        ctx.filter = "none";
      }
      /* without a real blur, three additive copies just blow out the highlights —
         one pass keeps the field readable */
      ctx.drawImage(buf, 0, 0);
      ctx.restore();
    }

    function frame() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step(true);
      glow();
      id = raf(frame);
    }

    function start() { if (running || paused || !inView) return; running = true; id = raf(frame); }
    function stop() { running = false; window.cancelAnimationFrame(id); }

    /* one honest frame: settle the field first, then draw exactly once */
    function staticFrame() {
      for (let f = 0; f < 90; f++) { tick++; step(false); }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;
      step(true);
      glow();
    }

    resize();
    for (let i = 0; i < LEN; i += PROPS) initParticle(i);

    new ResizeObserver(() => {
      if (canvas.width === stage.clientWidth && canvas.height === stage.clientHeight) return;
      resize();
      if (RM || paused) staticFrame();
    }).observe(stage);

    /* a visitor who pauses stays paused on their next visit */
    const PAUSE_KEY = "vortex-paused";
    const store = {
      get() { try { return localStorage.getItem(PAUSE_KEY) === "1"; } catch { return false; } },
      set(v) { try { localStorage.setItem(PAUSE_KEY, v ? "1" : "0"); } catch { /* private mode */ } },
    };

    function setPaused(next) {
      paused = next;
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", paused ? "Resume background animation" : "Pause background animation");
      if (paused) { stop(); staticFrame(); } else start();
    }

    /* battery-friendly: only animate while the hero is on screen */
    new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start(); else stop();
    }, { threshold: 0.05 }).observe(stage);

    toggle.addEventListener("click", () => { setPaused(!paused); store.set(paused); });

    setPaused(store.get());
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
          <span class="card__role">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>
            ${esc(item.role)}
          </span>
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
        <p class="tl-item__dates">${esc(t.dates)}${t.gwa ? `<span class="tl-item__gwa">${esc(t.gwa)}</span>` : ""}</p>
        <h4 class="tl-item__role">${esc(t.role)}</h4>
        <p class="tl-item__org">${esc(t.org)}</p>
        <ul class="tl-item__desc">${t.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </li>`).join("");

    $("#timeline").innerHTML = tl(TIMELINE);
    $("#timeline").setAttribute("data-stagger", "");
    $("#education").innerHTML = tl(EDUCATION);
    $("#education").setAttribute("data-stagger", "");
    $("#exp-count").textContent = `${TIMELINE.length} roles`;

    renderStack();

    $("#marquee-track").innerHTML = [...MARQUEE, ...MARQUEE]
      .map((m) => `<span class="marquee__item">${esc(m)}</span>`).join("");
  }

  /* Brand marks are Simple Icons paths (single-path, 24x24, filled); concept
     skills get stroked glyphs. Both inherit the chip's color via currentColor,
     so the icons sit inside the theme rather than on top of it. */
  const BRAND_PATHS = {"php": "M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z", "python": "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z", "javascript": "M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z", "typescript": "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z", "java": "M11.915 0 11.7.215C9.515 2.4 7.47 6.39 6.046 10.483c-1.064 1.024-3.633 2.81-3.711 3.551-.093.87 1.746 2.611 1.55 3.235-.198.625-1.304 1.408-1.014 1.939.1.188.823.011 1.277-.491a13.389 13.389 0 0 0-.017 2.14c.076.906.27 1.668.643 2.232.372.563.956.911 1.667.911.397 0 .727-.114 1.024-.264.298-.149.571-.33.91-.5.68-.34 1.634-.666 3.53-.604 1.903.062 2.872.39 3.559.704.687.314 1.15.664 1.925.664.767 0 1.395-.336 1.807-.9.412-.563.631-1.33.72-2.24.06-.623.055-1.32 0-2.066.454.45 1.117.604 1.213.424.29-.53-.816-1.314-1.013-1.937-.198-.624 1.642-2.366 1.549-3.236-.08-.748-2.707-2.568-3.748-3.586C16.428 6.374 14.308 2.394 12.13.215zm.175 6.038a2.95 2.95 0 0 1 2.943 2.942 2.95 2.95 0 0 1-2.943 2.943A2.95 2.95 0 0 1 9.148 8.98a2.95 2.95 0 0 1 2.942-2.942zM8.685 7.983a3.515 3.515 0 0 0-.145.997c0 1.951 1.6 3.55 3.55 3.55 1.95 0 3.55-1.598 3.55-3.55 0-.329-.046-.648-.132-.951.334.095.64.208.915.336a42.699 42.699 0 0 1 2.042 5.829c.678 2.545 1.01 4.92.846 6.607-.082.844-.29 1.51-.606 1.94-.315.431-.713.651-1.315.651-.593 0-.932-.27-1.673-.61-.741-.338-1.825-.694-3.792-.758-1.974-.064-3.073.293-3.821.669-.375.188-.659.373-.911.5s-.466.2-.752.2c-.53 0-.876-.209-1.16-.64-.285-.43-.474-1.101-.545-1.948-.141-1.693.176-4.069.823-6.614a43.155 43.155 0 0 1 1.934-5.783c.348-.167.749-.31 1.192-.425zm-3.382 4.362a.216.216 0 0 1 .13.031c-.166.56-.323 1.116-.463 1.665a33.849 33.849 0 0 0-.547 2.555 3.9 3.9 0 0 0-.2-.39c-.58-1.012-.914-1.642-1.16-2.08.315-.24 1.679-1.755 2.24-1.781zm13.394.01c.562.027 1.926 1.543 2.24 1.783-.246.438-.58 1.068-1.16 2.08a4.428 4.428 0 0 0-.163.309 32.354 32.354 0 0 0-.562-2.49 40.579 40.579 0 0 0-.482-1.652.216.216 0 0 1 .127-.03z", "c": "M16.5921 9.1962s-.354-3.298-3.627-3.39c-3.2741-.09-4.9552 2.474-4.9552 6.14 0 3.6651 1.858 6.5972 5.0451 6.5972 3.184 0 3.5381-3.665 3.5381-3.665l6.1041.365s.36 3.31-2.196 5.836c-2.552 2.5241-5.6901 2.9371-7.8762 2.9201-2.19-.017-5.2261.034-8.1602-2.97-2.938-3.0101-3.436-5.9302-3.436-8.8002 0-2.8701.556-6.6702 4.047-9.5502C7.444.72 9.849 0 12.254 0c10.0422 0 10.7172 9.2602 10.7172 9.2602z", "bash": "M21.038,4.9l-7.577-4.498C13.009,0.134,12.505,0,12,0c-0.505,0-1.009,0.134-1.462,0.403L2.961,4.9 C2.057,5.437,1.5,6.429,1.5,7.503v8.995c0,1.073,0.557,2.066,1.462,2.603l7.577,4.497C10.991,23.866,11.495,24,12,24 c0.505,0,1.009-0.134,1.461-0.402l7.577-4.497c0.904-0.537,1.462-1.529,1.462-2.603V7.503C22.5,6.429,21.943,5.437,21.038,4.9z M15.17,18.946l0.013,0.646c0.001,0.078-0.05,0.167-0.111,0.198l-0.383,0.22c-0.061,0.031-0.111-0.007-0.112-0.085L14.57,19.29 c-0.328,0.136-0.66,0.169-0.872,0.084c-0.04-0.016-0.057-0.075-0.041-0.142l0.139-0.584c0.011-0.046,0.036-0.092,0.069-0.121 c0.012-0.011,0.024-0.02,0.036-0.026c0.022-0.011,0.043-0.014,0.062-0.006c0.229,0.077,0.521,0.041,0.802-0.101 c0.357-0.181,0.596-0.545,0.592-0.907c-0.003-0.328-0.181-0.465-0.613-0.468c-0.55,0.001-1.064-0.107-1.072-0.917 c-0.007-0.667,0.34-1.361,0.889-1.8l-0.007-0.652c-0.001-0.08,0.048-0.168,0.111-0.2l0.37-0.236 c0.061-0.031,0.111,0.007,0.112,0.087l0.006,0.653c0.273-0.109,0.511-0.138,0.726-0.088c0.047,0.012,0.067,0.076,0.048,0.151 l-0.144,0.578c-0.011,0.044-0.036,0.088-0.065,0.116c-0.012,0.012-0.025,0.021-0.038,0.028c-0.019,0.01-0.038,0.013-0.057,0.009 c-0.098-0.022-0.332-0.073-0.699,0.113c-0.385,0.195-0.52,0.53-0.517,0.778c0.003,0.297,0.155,0.387,0.681,0.396 c0.7,0.012,1.003,0.318,1.01,1.023C16.105,17.747,15.736,18.491,15.17,18.946z M19.143,17.859c0,0.06-0.008,0.116-0.058,0.145 l-1.916,1.164c-0.05,0.029-0.09,0.004-0.09-0.056v-0.494c0-0.06,0.037-0.093,0.087-0.122l1.887-1.129 c0.05-0.029,0.09-0.004,0.09,0.056V17.859z M20.459,6.797l-7.168,4.427c-0.894,0.523-1.553,1.109-1.553,2.187v8.833 c0,0.645,0.26,1.063,0.66,1.184c-0.131,0.023-0.264,0.039-0.398,0.039c-0.42,0-0.833-0.114-1.197-0.33L3.226,18.64 c-0.741-0.44-1.201-1.261-1.201-2.142V7.503c0-0.881,0.46-1.702,1.201-2.142l7.577-4.498c0.363-0.216,0.777-0.33,1.197-0.33 c0.419,0,0.833,0.114,1.197,0.33l7.577,4.498c0.624,0.371,1.046,1.013,1.164,1.732C21.686,6.557,21.12,6.411,20.459,6.797z", "laravel": "M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.316.316 0 01-.066.027c-.008.002-.016.008-.024.01a.348.348 0 01-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 01.023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034H.53L5.043.05a.375.375 0 01.375 0L9.93 2.647h.002c.015.01.027.021.04.033l.038.027c.013.014.02.03.033.045.008.011.02.021.025.033.01.02.017.038.024.058.003.011.01.021.013.032.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098.003-.01.01-.02.013-.032a.487.487 0 01.024-.059c.007-.012.018-.02.025-.033.012-.015.021-.03.033-.043.012-.012.025-.02.037-.028.014-.01.026-.023.041-.032h.001l4.513-2.598a.375.375 0 01.375 0l4.513 2.598c.016.01.027.021.042.031.012.01.025.018.036.028.013.014.022.03.034.044.008.012.019.021.024.033.011.02.018.04.024.06.006.01.012.021.015.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.51 7.75v-4.287l-2.147 1.225-6.126 3.498v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445-.002-.003H5.04c-.014-.01-.025-.021-.04-.031-.011-.01-.024-.018-.035-.027l-.001-.002c-.013-.012-.021-.025-.031-.04-.01-.011-.021-.022-.028-.036h-.002c-.008-.014-.013-.031-.02-.047-.006-.016-.014-.027-.018-.043a.49.49 0 01-.008-.057c-.002-.014-.006-.027-.006-.041V5.789l-2.18-1.257zM5.23.81L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-1.58.91-2.182 1.255v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978L16.21 7.087 14.63 6.18v4.283l2.182 1.256 1.58.908zm-8.65 9.654l5.514-3.148 2.756-1.572-3.757-2.163-4.323 2.489-3.941 2.27z", "fastapi": "M12 .0387C5.3729.0384.0003 5.3931 0 11.9988c-.001 6.6066 5.372 11.9628 12 11.9625 6.628.0003 12.001-5.3559 12-11.9625-.0003-6.6057-5.3729-11.9604-12-11.96m-.829 5.4153h7.55l-7.5805 5.3284h5.1828L5.279 18.5436q2.9466-6.5444 5.892-13.0896", "node": "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z", "fastify": "M23.245 6.49L24 4.533l-.031-.121-7.473 1.967c.797-1.153.523-2.078.523-2.078s-2.387 1.524-4.193 1.485c-1.804-.04-2.387-.52-5.155.362-2.768.882-3.551 3.59-4.351 4.173-.804.583-3.32 2.477-3.32 2.477l.006.034 2.27-.724s-.622.585-1.945 2.37l-.062-.057.002.011s1.064 1.626 2.107 1.324a2.14 2.14 0 0 0 .353-.147c.419.234.967.463 1.572.525 0 0-.41-.475-.752-1.017l.238-.154.865.318-.096-.812c.003-.003.006-.003.008-.006l.849.311-.105-.738a5.65 5.65 0 0 1 .322-.158l.885-3.345 3.662-2.497-.291.733c-.741 1.826-2.135 2.256-2.135 2.256l-.582.22c-.433.512-.614.637-.764 2.353.348-.088.682-.107.984-.028 1.564.421 2.107 2.307 1.685 2.827-.104.13-.356.354-.673.617H7.77l-.008.514-.065.051h-.645l-.009.504-.17.127c-.607.011-1.373-.518-1.373-.518 0 .481.401 1.225.401 1.225l.07-.034-.061.045s1.625 1.083 2.646.681c.91-.356 3.263-2.213 5.296-3.093l6.15-1.62.811-2.1-4.688 1.235v-1.889l5.5-1.448.811-2.1-6.31 1.662V8.367zm-11.163 4l1.459-.384.02.074-.455 1.179-1.513.398zm.503 2.526l-1.512.398.489-1.266 1.459-.385.02.074zm1.971-.424l-1.513.398.49-1.266 1.459-.385.02.073Z", "react": "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z", "next": "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z", "vue": "M24,1.61H14.06L12,5.16,9.94,1.61H0L12,22.39ZM12,14.08,5.16,2.23H9.59L12,6.41l2.41-4.18h4.43Z", "tailwind": "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z", "bootstrap": "M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z", "vite": "m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z", "pytorch": "M12.005 0L4.952 7.053a9.865 9.865 0 000 14.022 9.866 9.866 0 0014.022 0c3.984-3.9 3.986-10.205.085-14.023l-1.744 1.743c2.904 2.905 2.904 7.634 0 10.538s-7.634 2.904-10.538 0-2.904-7.634 0-10.538l4.647-4.646.582-.665zm3.568 3.899a1.327 1.327 0 00-1.327 1.327 1.327 1.327 0 001.327 1.328A1.327 1.327 0 0016.9 5.226 1.327 1.327 0 0015.573 3.9z", "hugging": "M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z", "pandas": "M16.922 0h2.623v18.104h-2.623zm-4.126 12.94h2.623v2.57h-2.623zm0-7.037h2.623v5.446h-2.623zm0 11.197h2.623v5.446h-2.623zM4.456 5.896h2.622V24H4.455zm4.213 2.559h2.623v2.57H8.67zm0 4.151h2.623v5.447H8.67zm0-11.187h2.623v5.446H8.67Z", "numpy": "M10.315 4.876L6.3048 2.8517l-4.401 2.1965 4.1186 2.0683zm1.8381.9277l4.2045 2.1223-4.3622 2.1906-4.125-2.0718zm5.6153-2.9213l4.3193 2.1658-3.863 1.9402-4.2131-2.1252zm-1.859-.9329L12.021 0 8.1742 1.9193l4.0068 2.0208zm-3.0401 16.7443V24l4.7107-2.3507-.0053-5.3085zm4.7037-4.2057l-.0052-5.2528-4.6985 2.3356v5.2546zm5.6553-.9845v5.327l-4.0178 2.0052-.0029-5.3028zm0-1.8626V6.4214l-4.0253 2.001.0034 5.2633zM11.2062 11.571L8.0333 9.9756v6.895s-3.8804-8.2564-4.2399-8.998c-.0463-.0957-.2371-.2007-.2858-.2262C2.8118 7.2812.773 6.2485.773 6.2485V18.43l2.8204 1.5076v-6.3674s3.8392 7.3775 3.878 7.458c.0389.0807.4245.8582.8362 1.1314.5485.363 2.8992 1.7766 2.8992 1.7766z", "mysql": "M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z", "postgres": "M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772a.0569.0569 0 0 0 .0004.0041 11.0312 11.0312 0 0 0-.2472.3054c-.3389.4302-.4094.5197-1.5002.7443-.3102.064-1.1344.2339-1.1464.8115-.0025.1224.0329.2309.0919.3268.2269.4231.9216.6097 1.015.6331 1.3345.3335 2.5044.092 3.3714-.6787-.017 2.231.0775 4.4174.3454 5.0874.2212.5529.7618 1.9045 2.4692 1.9043.2505 0 .5263-.0291.8296-.0941 1.7819-.3821 2.5557-1.1696 2.855-2.9059.1503-.8707.4016-2.8753.5388-4.1012.0169-.0703.0357-.1207.057-.1362.0007-.0005.0697-.0471.4272.0307a.3673.3673 0 0 0 .0443.0068l.2539.0223.0149.001c.8468.0384 1.9114-.1426 2.5312-.4308.6438-.2988 1.8057-1.0323 1.5951-1.6698zM2.371 11.8765c-.7435-2.4358-1.1779-4.8851-1.2123-5.5719-.1086-2.1714.4171-3.6829 1.5623-4.4927 1.8367-1.2986 4.8398-.5408 6.108-.13-.0032.0032-.0066.0061-.0098.0094-2.0238 2.044-1.9758 5.536-1.9708 5.7495-.0002.0823.0066.1989.0162.3593.0348.5873.0996 1.6804-.0735 2.9184-.1609 1.1504.1937 2.2764.9728 3.0892.0806.0841.1648.1631.2518.2374-.3468.3714-1.1004 1.1926-1.9025 2.1576-.5677.6825-.9597.5517-1.0886.5087-.3919-.1307-.813-.5871-1.2381-1.3223-.4796-.839-.9635-2.0317-1.4155-3.5126zm6.0072 5.0871c-.1711-.0428-.3271-.1132-.4322-.1772.0889-.0394.2374-.0902.4833-.1409 1.2833-.2641 1.4815-.4506 1.9143-1.0002.0992-.126.2116-.2687.3673-.4426a.3549.3549 0 0 0 .0737-.1298c.1708-.1513.2724-.1099.4369-.0417.156.0646.3078.26.3695.4752.0291.1016.0619.2945-.0452.4444-.9043 1.2658-2.2216 1.2494-3.1676 1.0128zm2.094-3.988-.0525.141c-.133.3566-.2567.6881-.3334 1.003-.6674-.0021-1.3168-.2872-1.8105-.8024-.6279-.6551-.9131-1.5664-.7825-2.5004.1828-1.3079.1153-2.4468.079-3.0586-.005-.0857-.0095-.1607-.0122-.2199.2957-.2621 1.6659-.9962 2.6429-.7724.4459.1022.7176.4057.8305.928.5846 2.7038.0774 3.8307-.3302 4.7363-.084.1866-.1633.3629-.2311.5454zm7.3637 4.5725c-.0169.1768-.0358.376-.0618.5959l-.146.4383a.3547.3547 0 0 0-.0182.1077c-.0059.4747-.054.6489-.115.8693-.0634.2292-.1353.4891-.1794 1.0575-.11 1.4143-.8782 2.2267-2.4172 2.5565-1.5155.3251-1.7843-.4968-2.0212-1.2217a6.5824 6.5824 0 0 0-.0769-.2266c-.2154-.5858-.1911-1.4119-.1574-2.5551.0165-.5612-.0249-1.9013-.3302-2.6462.0044-.2932.0106-.5909.019-.8918a.3529.3529 0 0 0-.0153-.1126 1.4927 1.4927 0 0 0-.0439-.208c-.1226-.4283-.4213-.7866-.7797-.9351-.1424-.059-.4038-.1672-.7178-.0869.067-.276.1831-.5875.309-.9249l.0529-.142c.0595-.16.134-.3257.213-.5012.4265-.9476 1.0106-2.2453.3766-5.1772-.2374-1.0981-1.0304-1.6343-2.2324-1.5098-.7207.0746-1.3799.3654-1.7088.5321a5.6716 5.6716 0 0 0-.1958.1041c.0918-1.1064.4386-3.1741 1.7357-4.4823a4.0306 4.0306 0 0 1 .3033-.276.3532.3532 0 0 0 .1447-.0644c.7524-.5706 1.6945-.8506 2.802-.8325.4091.0067.8017.0339 1.1742.081 1.939.3544 3.2439 1.4468 4.0359 2.3827.8143.9623 1.2552 1.9315 1.4312 2.4543-1.3232-.1346-2.2234.1268-2.6797.779-.9926 1.4189.543 4.1729 1.2811 5.4964.1353.2426.2522.4522.2889.5413.2403.5825.5515.9713.7787 1.2552.0696.087.1372.1714.1885.245-.4008.1155-1.1208.3825-1.0552 1.717-.0123.1563-.0423.4469-.0834.8148-.0461.2077-.0702.4603-.0994.7662zm.8905-1.6211c-.0405-.8316.2691-.9185.5967-1.0105a2.8566 2.8566 0 0 0 .135-.0406 1.202 1.202 0 0 0 .1342.103c.5703.3765 1.5823.4213 3.0068.1344-.2016.1769-.5189.3994-.9533.6011-.4098.1903-1.0957.333-1.7473.3636-.7197.0336-1.0859-.0807-1.1721-.151zm.5695-9.2712c-.0059.3508-.0542.6692-.1054 1.0017-.055.3576-.112.7274-.1264 1.1762-.0142.4368.0404.8909.0932 1.3301.1066.887.216 1.8003-.2075 2.7014a3.5272 3.5272 0 0 1-.1876-.3856c-.0527-.1276-.1669-.3326-.3251-.6162-.6156-1.1041-2.0574-3.6896-1.3193-4.7446.3795-.5427 1.3408-.5661 2.1781-.463zm.2284 7.0137a12.3762 12.3762 0 0 0-.0853-.1074l-.0355-.0444c.7262-1.1995.5842-2.3862.4578-3.4385-.0519-.4318-.1009-.8396-.0885-1.2226.0129-.4061.0666-.7543.1185-1.0911.0639-.415.1288-.8443.1109-1.3505.0134-.0531.0188-.1158.0118-.1902-.0457-.4855-.5999-1.938-1.7294-3.253-.6076-.7073-1.4896-1.4972-2.6889-2.0395.5251-.1066 1.2328-.2035 2.0244-.1859 2.0515.0456 3.6746.8135 4.8242 2.2824a.908.908 0 0 1 .0667.1002c.7231 1.3556-.2762 6.2751-2.9867 10.5405zm-8.8166-6.1162c-.025.1794-.3089.4225-.6211.4225a.5821.5821 0 0 1-.0809-.0056c-.1873-.026-.3765-.144-.5059-.3156-.0458-.0605-.1203-.178-.1055-.2844.0055-.0401.0261-.0985.0925-.1488.1182-.0894.3518-.1226.6096-.0867.3163.0441.6426.1938.6113.4186zm7.9305-.4114c.0111.0792-.049.201-.1531.3102-.0683.0717-.212.1961-.4079.2232a.5456.5456 0 0 1-.075.0052c-.2935 0-.5414-.2344-.5607-.3717-.024-.1765.2641-.3106.5611-.352.297-.0414.6111.0088.6356.1851z", "sqlite": "M21.678.521c-1.032-.92-2.28-.55-3.513.544a8.71 8.71 0 0 0-.547.535c-2.109 2.237-4.066 6.38-4.674 9.544.237.48.422 1.093.544 1.561a13.044 13.044 0 0 1 .164.703s-.019-.071-.096-.296l-.05-.146a1.689 1.689 0 0 0-.033-.08c-.138-.32-.518-.995-.686-1.289-.143.423-.27.818-.376 1.176.484.884.778 2.4.778 2.4s-.025-.099-.147-.442c-.107-.303-.644-1.244-.772-1.464-.217.804-.304 1.346-.226 1.478.152.256.296.698.422 1.186.286 1.1.485 2.44.485 2.44l.017.224a22.41 22.41 0 0 0 .056 2.748c.095 1.146.273 2.13.5 2.657l.155-.084c-.334-1.038-.47-2.399-.41-3.967.09-2.398.642-5.29 1.661-8.304 1.723-4.55 4.113-8.201 6.3-9.945-1.993 1.8-4.692 7.63-5.5 9.788-.904 2.416-1.545 4.684-1.931 6.857.666-2.037 2.821-2.912 2.821-2.912s1.057-1.304 2.292-3.166c-.74.169-1.955.458-2.362.629-.6.251-.762.337-.762.337s1.945-1.184 3.613-1.72C21.695 7.9 24.195 2.767 21.678.521m-18.573.543A1.842 1.842 0 0 0 1.27 2.9v16.608a1.84 1.84 0 0 0 1.835 1.834h9.418a22.953 22.953 0 0 1-.052-2.707c-.006-.062-.011-.141-.016-.2a27.01 27.01 0 0 0-.473-2.378c-.121-.47-.275-.898-.369-1.057-.116-.197-.098-.31-.097-.432 0-.12.015-.245.037-.386a9.98 9.98 0 0 1 .234-1.045l.217-.028c-.017-.035-.014-.065-.031-.097l-.041-.381a32.8 32.8 0 0 1 .382-1.194l.2-.019c-.008-.016-.01-.038-.018-.053l-.043-.316c.63-3.28 2.587-7.443 4.8-9.791.066-.069.133-.128.198-.194Z", "prisma": "M21.8068 18.2848L13.5528.7565c-.207-.4382-.639-.7273-1.1286-.7541-.5023-.0293-.9523.213-1.2062.6253L2.266 15.1271c-.2773.4518-.2718 1.0091.0158 1.4555l4.3759 6.7786c.2608.4046.7127.6388 1.1823.6388.1332 0 .267-.0188.3987-.0577l12.7019-3.7568c.3891-.1151.7072-.3904.8737-.7553s.1633-.7828-.0075-1.1454zm-1.8481.7519L9.1814 22.2242c-.3292.0975-.6448-.1873-.5756-.5194l3.8501-18.4386c.072-.3448.5486-.3996.699-.0803l7.1288 15.138c.1344.2856-.019.6224-.325.7128z", "git": "M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187", "github": "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12", "linux": "M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z", "docker": "M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z", "k8s": "M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 0 1-2.075-2.597l2.578-.437.004.005a.44.44 0 0 1 .484.606zm-.833-2.129a.44.44 0 0 0 .173-.756l.002-.011L7.585 9.7a5.143 5.143 0 0 0-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 0 0 .699-.337l.01-.005.15-2.62a5.144 5.144 0 0 0-3.01 1.442l2.147 1.523.004-.002zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.779zm1.5-3.095a.44.44 0 0 0 .7.336l.008.003 2.134-1.513a5.188 5.188 0 0 0-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 0 1-1.248.594l-9.261.003a1.6 1.6 0 0 1-1.247-.596l-5.776-7.18a1.583 1.583 0 0 1-.307-1.34L2.1 5.573c.108-.47.425-.864.863-1.073L11.305.513a1.606 1.606 0 0 1 1.385 0l8.345 3.985c.438.209.755.604.863 1.073l2.062 8.955c.108.47-.005.963-.308 1.34zm-3.289-2.057c-.042-.01-.103-.026-.145-.034-.174-.033-.315-.025-.479-.038-.35-.037-.638-.067-.895-.148-.105-.04-.18-.165-.216-.216l-.201-.059a6.45 6.45 0 0 0-.105-2.332 6.465 6.465 0 0 0-.936-2.163c.052-.047.15-.133.177-.159.008-.09.001-.183.094-.282.197-.185.444-.338.743-.522.142-.084.273-.137.415-.242.032-.024.076-.062.11-.089.24-.191.295-.52.123-.736-.172-.216-.506-.236-.745-.045-.034.027-.08.062-.111.088-.134.116-.217.23-.33.35-.246.25-.45.458-.673.609-.097.056-.239.037-.303.033l-.19.135a6.545 6.545 0 0 0-4.146-2.003l-.012-.223c-.065-.062-.143-.115-.163-.25-.022-.268.015-.557.057-.905.023-.163.061-.298.068-.475.001-.04-.001-.099-.001-.142 0-.306-.224-.555-.5-.555-.275 0-.499.249-.499.555l.001.014c0 .041-.002.092 0 .128.006.177.044.312.067.475.042.348.078.637.056.906a.545.545 0 0 1-.162.258l-.012.211a6.424 6.424 0 0 0-4.166 2.003 8.373 8.373 0 0 1-.18-.128c-.09.012-.18.04-.297-.029-.223-.15-.427-.358-.673-.608-.113-.12-.195-.234-.329-.349-.03-.026-.077-.062-.111-.088a.594.594 0 0 0-.348-.132.481.481 0 0 0-.398.176c-.172.216-.117.546.123.737l.007.005.104.083c.142.105.272.159.414.242.299.185.546.338.743.522.076.082.09.226.1.288l.16.143a6.462 6.462 0 0 0-1.02 4.506l-.208.06c-.055.072-.133.184-.215.217-.257.081-.546.11-.895.147-.164.014-.305.006-.48.039-.037.007-.09.02-.133.03l-.004.002-.007.002c-.295.071-.484.342-.423.608.061.267.349.429.645.365l.007-.001.01-.003.129-.029c.17-.046.294-.113.448-.172.33-.118.604-.217.87-.256.112-.009.23.069.288.101l.217-.037a6.5 6.5 0 0 0 2.88 3.596l-.09.218c.033.084.069.199.044.282-.097.252-.263.517-.452.813-.091.136-.185.242-.268.399-.02.037-.045.095-.064.134-.128.275-.034.591.213.71.248.12.556-.007.69-.282v-.002c.02-.039.046-.09.062-.127.07-.162.094-.301.144-.458.132-.332.205-.68.387-.897.05-.06.13-.082.215-.105l.113-.205a6.453 6.453 0 0 0 4.609.012l.106.192c.086.028.18.042.256.155.136.232.229.507.342.84.05.156.074.295.145.457.016.037.043.09.062.129.133.276.442.402.69.282.247-.118.341-.435.213-.71-.02-.039-.045-.096-.065-.134-.083-.156-.177-.261-.268-.398-.19-.296-.346-.541-.443-.793-.04-.13.007-.21.038-.294-.018-.022-.059-.144-.083-.202a6.499 6.499 0 0 0 2.88-3.622c.064.01.176.03.213.038.075-.05.144-.114.28-.104.266.039.54.138.87.256.154.06.277.128.448.173.036.01.088.019.13.028l.009.003.007.001c.297.064.584-.098.645-.365.06-.266-.128-.537-.423-.608zM16.4 9.701l-1.95 1.746v.005a.44.44 0 0 0 .173.757l.003.01 2.526.728a5.199 5.199 0 0 0-.108-1.674A5.208 5.208 0 0 0 16.4 9.7zm-4.013 5.325a.437.437 0 0 0-.404-.232.44.44 0 0 0-.372.233h-.002l-1.268 2.292a5.164 5.164 0 0 0 3.326.003l-1.27-2.296h-.01zm1.888-1.293a.44.44 0 0 0-.27.036.44.44 0 0 0-.214.572l-.003.004 1.01 2.438a5.15 5.15 0 0 0 2.081-2.615l-2.6-.44-.004.005z", "s3": "M20.913 13.147l.12-.895c.947.576 1.258.922 1.354 1.071-.16.031-.562.046-1.474-.176zm-2.174 7.988a.547.547 0 0 0-.005.073c0 .084-.207.405-1.124.768a10.28 10.28 0 0 1-1.438.432c-1.405.325-3.128.504-4.853.504-4.612 0-7.412-1.184-7.412-1.704a.547.547 0 0 0-.005-.073L1.81 5.602c.135.078.28.154.432.227.042.02.086.038.128.057.134.062.272.122.417.18l.179.069c.154.058.314.114.478.168.043.013.084.029.13.043.207.065.423.127.646.187l.176.044c.175.044.353.087.534.127a23.414 23.414 0 0 0 .843.17l.121.023c.252.045.508.085.768.122.071.011.144.02.216.03.2.027.4.053.604.077l.24.027c.245.026.49.05.74.07l.081.009c.275.022.552.04.83.056l.233.012c.21.01.422.018.633.025a33.088 33.088 0 0 0 2.795-.026l.232-.011c.278-.016.555-.034.83-.056l.08-.008c.25-.02.497-.045.742-.072l.238-.026c.205-.024.408-.05.609-.077.07-.01.141-.019.211-.03.261-.037.519-.078.772-.122l.111-.02c.215-.04.427-.082.634-.125l.212-.047c.186-.041.368-.085.546-.13l.166-.042c.225-.06.444-.122.654-.189.04-.012.077-.026.115-.038a10.6 10.6 0 0 0 .493-.173c.058-.021.114-.044.17-.066.15-.06.293-.12.43-.185.038-.017.079-.034.116-.052.153-.073.3-.15.436-.228l-.976 7.245c-2.488-.78-5.805-2.292-7.311-3a1.09 1.09 0 0 0-1.088-1.085c-.6 0-1.088.489-1.088 1.088 0 .6.488 1.089 1.088 1.089.196 0 .378-.056.537-.148 1.72.812 5.144 2.367 7.715 3.15zm-7.42-20.047c5.677 0 9.676 1.759 9.75 2.736l-.014.113c-.01.033-.031.067-.048.101-.015.028-.026.057-.047.087-.024.033-.058.068-.09.102-.028.03-.051.06-.084.09-.038.035-.087.07-.133.105-.04.03-.074.06-.119.091-.053.036-.116.071-.177.107-.05.03-.095.06-.15.09-.068.036-.147.073-.222.11-.059.028-.114.057-.177.085-.084.038-.177.074-.268.111-.068.027-.13.054-.203.082-.097.036-.205.072-.31.107-.075.026-.148.053-.228.079-.111.035-.233.069-.35.103-.085.024-.165.05-.253.073-.124.034-.258.065-.389.098-.093.022-.181.046-.278.068-.139.032-.287.061-.433.091-.098.02-.191.041-.293.06-.155.03-.32.057-.482.084-.1.018-.198.036-.302.052-.166.026-.342.048-.515.072-.11.014-.213.03-.325.044-.181.023-.372.041-.56.06-.11.012-.218.025-.332.036-.188.016-.386.029-.58.043-.122.009-.24.02-.364.028-.207.012-.422.02-.635.028-.12.005-.234.012-.354.016a35.605 35.605 0 0 1-2.069 0c-.12-.004-.234-.011-.352-.016-.214-.008-.43-.016-.637-.028-.122-.008-.238-.02-.36-.027-.195-.015-.394-.028-.584-.044-.11-.01-.215-.024-.324-.035-.19-.02-.384-.038-.568-.06l-.315-.044c-.176-.024-.355-.046-.525-.073-.1-.015-.192-.033-.29-.05-.167-.028-.335-.055-.494-.086-.096-.018-.183-.038-.276-.056-.151-.032-.305-.062-.45-.095-.09-.02-.173-.043-.26-.064-.138-.034-.277-.067-.407-.102-.082-.022-.157-.046-.235-.069a11.75 11.75 0 0 1-.368-.108c-.075-.024-.141-.049-.213-.073-.11-.037-.223-.075-.325-.113-.067-.025-.125-.051-.188-.077-.096-.038-.195-.076-.282-.115-.06-.027-.11-.054-.166-.08-.08-.039-.162-.077-.233-.116-.052-.028-.094-.055-.142-.084-.063-.038-.13-.075-.185-.113-.043-.029-.075-.058-.113-.086-.048-.037-.098-.073-.139-.11-.032-.029-.054-.057-.08-.087-.033-.035-.069-.07-.093-.104-.02-.03-.031-.058-.046-.086-.018-.035-.039-.068-.049-.102l-.015-.113c.076-.977 4.074-2.736 9.748-2.736zm12.182 12.124c-.118-.628-.84-1.291-2.31-2.128l.963-7.16a.531.531 0 0 0 .005-.073C22.16 1.581 16.447 0 11.32 0 6.194 0 .482 1.581.482 3.851a.58.58 0 0 0 .005.072L2.819 21.25c.071 2.002 5.236 2.75 8.5 2.75 1.805 0 3.615-.188 5.098-.531.598-.138 1.133-.3 1.592-.48 1.18-.467 1.789-1.053 1.813-1.739l.945-7.018c.557.131 1.016.197 1.389.197.54 0 .902-.137 1.134-.413a.956.956 0 0 0 .21-.804Z", "lambda": "M4.9855 0c-.2941.0031-.5335.2466-.534.5482L4.446 5.456c0 .1451.06.2835.159.3891a.5322.5322 0 0 0 .3806.1562h3.4282l8.197 17.6805a.5365.5365 0 0 0 .4885.3181h5.811c.2969 0 .5426-.2448.5426-.5482V18.544c0-.3035-.2392-.5482-.5425-.5482h-2.0138L12.7394.3153C12.647.124 12.4564 0 12.2452 0h-7.254Zm.5397 1.0907h6.3678l8.16 17.6804a.5365.5365 0 0 0 .4885.3181h1.8178v3.8173H17.437L9.2402 5.226a.536.536 0 0 0-.4885-.318H5.5223Zm2.0137 8.2366c-.2098.0011-.3937.1193-.4857.3096L.6002 23.2133a.5506.5506 0 0 0 .0313.5282.5334.5334 0 0 0 .4544.25h6.169a.5468.5468 0 0 0 .497-.3096l3.38-7.166a.5405.5405 0 0 0-.0029-.4686L8.036 9.637a.5468.5468 0 0 0-.4942-.3096Zm.0057 1.8036 2.488 5.1522-3.1214 6.6206H1.9465Z", "cicd": "M10.984 13.836a.5.5 0 0 1-.353-.146l-.745-.743a.5.5 0 1 1 .706-.708l.392.391 1.181-1.18a.5.5 0 0 1 .708.707l-1.535 1.533a.504.504 0 0 1-.354.146zm9.353-.147l1.534-1.532a.5.5 0 0 0-.707-.707l-1.181 1.18-.392-.391a.5.5 0 1 0-.706.708l.746.743a.497.497 0 0 0 .706-.001zM4.527 7.452l2.557-1.585A1 1 0 0 0 7.09 4.17L4.533 2.56A1 1 0 0 0 3 3.406v3.196a1.001 1.001 0 0 0 1.527.85zm2.03-2.436L4 6.602V3.406l2.557 1.61zM24 12.5c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3h-2.08a3.503 3.503 0 0 1-3.46 3 3.502 3.502 0 0 1-3.46-3h-.558c-.972 0-1.85-.399-2.482-1.042V17c0 1.654 1.346 3 3 3h.04c.244-1.693 1.7-3 3.46-3 1.93 0 3.5 1.57 3.5 3.5S13.43 24 11.5 24a3.502 3.502 0 0 1-3.46-3H8c-2.206 0-4-1.794-4-4V9.899A5.008 5.008 0 0 1 0 5c0-2.757 2.243-5 5-5s5 2.243 5 5a5.005 5.005 0 0 1-4.952 4.998A2.482 2.482 0 0 0 7.482 12h.558c.244-1.693 1.7-3 3.46-3a3.502 3.502 0 0 1 3.46 3h2.08a3.503 3.503 0 0 1 3.46-3c1.93 0 3.5 1.57 3.5 3.5zm-15 8c0 1.378 1.122 2.5 2.5 2.5s2.5-1.122 2.5-2.5-1.122-2.5-2.5-2.5S9 19.122 9 20.5zM5 9c2.206 0 4-1.794 4-4S7.206 1 5 1 1 2.794 1 5s1.794 4 4 4zm9 3.5c0-1.378-1.122-2.5-2.5-2.5S9 11.122 9 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm9 0c0-1.378-1.122-2.5-2.5-2.5S18 11.122 18 12.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5zm-13 8a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0zm12 0c0 1.93-1.57 3.5-3.5 3.5a3.503 3.503 0 0 1-3.46-3.002c-.007.001-.013.005-.021.005l-.506.017h-.017a.5.5 0 0 1-.016-.999l.506-.017c.018-.002.035.006.052.007A3.503 3.503 0 0 1 20.5 17c1.93 0 3.5 1.57 3.5 3.5zm-1 0c0-1.378-1.122-2.5-2.5-2.5S18 19.122 18 20.5s1.122 2.5 2.5 2.5 2.5-1.122 2.5-2.5z", "aws": "M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"};
  const GLYPH_PATHS = {"db": "<ellipse cx=\"12\" cy=\"5\" rx=\"8\" ry=\"3\"/><path d=\"M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3\"/>", "csharp": "<path d=\"M9 8.5A4 4 0 1 0 9 15.5\"/><path d=\"M15 9v6M18 9v6M14 11h5M14 13.5h5\"/>", "api": "<path d=\"M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2\"/>", "lock": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/>", "chart": "<path d=\"M4 20V10M10 20V4M16 20v-7M22 20H2\"/>", "devices": "<rect x=\"2\" y=\"4\" width=\"14\" height=\"10\" rx=\"1.5\"/><path d=\"M6 18h6\"/><rect x=\"17\" y=\"9\" width=\"5\" height=\"11\" rx=\"1.5\"/>", "docscan": "<path d=\"M5 8V5a1 1 0 0 1 1-1h3M19 8V5a1 1 0 0 0-1-1h-3M5 16v3a1 1 0 0 0 1 1h3M19 16v3a1 1 0 0 1-1 1h-3M8 12h8\"/>", "text": "<path d=\"M4 6h16M4 11h12M4 16h8\"/>", "graph": "<circle cx=\"6\" cy=\"7\" r=\"2.4\"/><circle cx=\"18\" cy=\"6\" r=\"2.4\"/><circle cx=\"12\" cy=\"17\" r=\"2.4\"/><path d=\"M8 8.4 10.5 15M16.4 8 13.6 15M8.2 6.6 15.6 6.3\"/>", "scan": "<path d=\"M3 7V5a2 2 0 0 1 2-2h2M21 7V5a2 2 0 0 0-2-2h-2M3 17v2a2 2 0 0 0 2 2h2M21 17v2a2 2 0 0 1-2 2h-2M3 12h18\"/>", "schema": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"6\" rx=\"1.2\"/><rect x=\"14\" y=\"15\" width=\"7\" height=\"6\" rx=\"1.2\"/><path d=\"M6.5 9v5a2 2 0 0 0 2 2H14\"/>"};
  const SKILL_ICON = {"PHP": ["f", "php"], "Python": ["f", "python"], "JavaScript": ["f", "javascript"], "SQL": ["s", "db"], "TypeScript": ["f", "typescript"], "Java": ["f", "java"], "C#": ["s", "csharp"], "C": ["f", "c"], "Bash": ["f", "bash"], "Laravel": ["f", "laravel"], "REST APIs": ["s", "api"], "FastAPI": ["f", "fastapi"], "Node / Fastify": ["f", "node"], "Auth & RBAC": ["s", "lock"], "Reporting workflows": ["s", "chart"], "React": ["f", "react"], "Next.js": ["f", "next"], "Vue": ["f", "vue"], "Blade": ["f", "laravel"], "Tailwind CSS": ["f", "tailwind"], "Bootstrap": ["f", "bootstrap"], "Vite": ["f", "vite"], "Responsive UI": ["s", "devices"], "PyTorch": ["f", "pytorch"], "LayoutLMv3": ["s", "docscan"], "Hugging Face": ["f", "hugging"], "T5 summarization": ["s", "text"], "Graph-based modeling": ["s", "graph"], "OCR / PDF extraction": ["s", "scan"], "Pandas": ["f", "pandas"], "NumPy": ["f", "numpy"], "Evaluation metrics": ["s", "chart"], "MySQL": ["f", "mysql"], "PostgreSQL": ["f", "postgres"], "SQLite": ["f", "sqlite"], "Prisma / Eloquent": ["f", "prisma"], "Schema design": ["s", "schema"], "Git / GitHub": ["f", "github"], "CI/CD": ["f", "cicd"], "Linux": ["f", "linux"], "Docker": ["f", "docker"], "Kubernetes": ["f", "k8s"], "AWS S3": ["f", "s3"], "AWS CloudFront": ["f", "aws"], "AWS Lambda": ["f", "lambda"]};

  function skillIcon(name) {
    const spec = SKILL_ICON[name];
    if (!spec) return "";
    const kind = spec[0];
    const path = kind === "f" ? BRAND_PATHS[spec[1]] : GLYPH_PATHS[spec[1]];
    if (!path) return "";
    return kind === "f"
      ? '<svg class="chip__ico" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="' + path + '"/></svg>'
      : '<svg class="chip__ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }

  const STACK_ICONS = {
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    server: '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    brain: '<path d="M12 5a3 3 0 1 0-5.9.8A3 3 0 0 0 4 12a3 3 0 0 0 2.1 5.2A3 3 0 0 0 12 19zM12 5a3 3 0 1 1 5.9.8A3 3 0 0 1 20 12a3 3 0 0 1-2.1 5.2A3 3 0 0 1 12 19z"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.2 9.2 4 4 0 0 0 7 19z"/>',
  };

  function renderStack() {
    const grid = $("#stack-grid");
    grid.innerHTML = STACK.map((g) => {
      const chips = g.items.map(([name, tier]) =>
        `<li class="chip chip--${tier}">${skillIcon(name)}<span>${esc(name)}</span></li>`).join("");
      return `
        <article class="sgroup reveal">
          <header class="sgroup__head">
            <svg class="sgroup__icon" viewBox="0 0 24 24" width="15" height="15" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                 aria-hidden="true">${STACK_ICONS[g.icon] || ""}</svg>
            <h3>${esc(g.name)}</h3>
            <span class="sgroup__n">${String(g.items.length).padStart(2, "0")}</span>
          </header>
          <ul class="sgroup__chips">${chips}</ul>
        </article>`;
    }).join("");
    grid.setAttribute("data-stagger", "");
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
