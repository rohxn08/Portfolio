// Dynamic portfolio data for Rohan R
const PORTFOLIO_DATA = {
    name: "Rohan R",
    objective: "Aspiring AI and Data Science Engineer specializing in OCR, Computer Vision, and Generative AI. Passionate about building intelligent systems and solving real-world problems through innovation.",
    aboutHtml: `
    <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 0.5rem;">🎓 <strong>AI & Data Science student</strong> at <strong>Global Academy of Technology</strong> (GPA: 9.48/10)</li>
        <li style="margin-bottom: 0.5rem;">🔭 Specialized in <strong>OCR, Computer Vision</strong>, and <strong>Generative AI</strong></li>
        <li style="margin-bottom: 0.5rem;">🌱 Currently mastering <strong>Vector DB</strong> and <strong>Orchestration Frameworks</strong></li>
        <li style="margin-bottom: 0.5rem;">🤝 Open to collaborating on <strong>Machine Learning, Agentic Systems</strong>, and <strong>Vision AI</strong></li>
        <li style="margin-bottom: 0.5rem;">🎮 Passionate about <strong>Technological Innovation, Video Games</strong>, and <strong>Music</strong></li>
        <li style="margin-bottom: 0.5rem;">📍 Based in <strong>Bangalore, India</strong></li>
    </ul>
    `,
    contact: {
        address: "No.332, Sri Rama Nilaya, 9th Cross, 1st Block, Peenya 1st Stage, Bengaluru North, 560058",
        phone: "+91 7411969633",
        email: "rohanramaswamy12@gmail.com"
    },
    social: {
        github: "https://github.com/rohxn08",
        linkedin: "https://www.linkedin.com/in/rohan-r-63b1a62aa/"
    },
    resume: {
        url: "rohan resume.pdf" // points to PDF placed in project root
    },
    skills: {
        languages: ["Python", "C++", "SQL", "HTML5", "CSS3"],
        ai_ml: ["TensorFlow", "Keras", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "MLflow", "WandB"],
        genai_nlp: ["Generative AI", "Hugging Face", "Prompt Engineering", "NLP", "PaddleOCR"],
        tools: ["FastAPI", "Docker", "Git", "Streamlit", "Linux", "Tableau", "Power Bi"]
    },
    projects: [
        {
            title: "Face Anti-Spoofing System",
            summary: "Dual-approach system using LBP+SVM and lightweight CNN to detect spoofed faces. Features robust preprocessing and real-time webcam testing.",
            tech: ["Python", "OpenCV", "TensorFlow", "Scikit-Learn", "Streamlit"],
            link: "https://github.com/rohxn08/Face-anti-spoofing-system",
            image: "assets/images/p1_security.png"
        },
        {
            title: "AI-Powered Document Search (RAG)",
            summary: "Intelligent document search and QA system using RAG with Google Gemini API, FAISS vector search, and Sentence-Transformers.",
            tech: ["Python", "RAG", "Google Gemini API", "FAISS", "Streamlit"],
            link: "https://github.com/rohxn08/AI-powered-Document-search-using-RAG",
            image: "assets/images/p2_ai_rag.png"
        },
        {
            title: "Sign Language Translator",
            summary: "Real-time sign language detection system using OpenCV and MediaPipe with custom classifier training and a web interface.",
            tech: ["Python", "OpenCV", "MediaPipe", "HTML/CSS"],
            link: "https://github.com/rohxn08/sign-language-translator",
            image: "assets/images/p3_vision_ai.png"
        },
        {
            title: "Automatic Image Enhancer",
            summary: "Enhances images using CLAHE for brightness/contrast improvement with real-time side-by-side visualization.",
            tech: ["Python", "NumPy", "OpenCV"],
            link: "https://github.com/rohxn08/Automatic-Image-Enhancer",
            image: "assets/images/p3_vision_ai.png"
        },
        {
            title: "Comparative Score Visualization",
            summary: "Plot wellness scores using dummy and original data with a clean UI.",
            tech: ["Python", "Plotly", "Pandas", "NumPy", "HTML"],
            link: "https://github.com/rohxn08/Comparative-Score-Visualization-of-wellness-scores",
            image: "assets/images/p2_ai_rag.png"
        },
        {
            title: "Binance Futures Order Bot",
            summary: "CLI trading bot for Binance USDT-M Futures with strategies (TWAP, Grid, OCO emulation).",
            tech: ["Python", "CLI"],
            link: "https://github.com/rohxn08/Rohan-Binance_bot",
            image: "assets/images/p1_security.png"
        },
        {
            title: "MNIST Digit Prediction",
            summary: "Handwritten digit classifier trained on MNIST dataset.",
            tech: ["Python", "Deep Learning"],
            link: "https://github.com/rohxn08/MNIST-digit-prediction",
            image: "assets/images/p3_vision_ai.png"
        },
        {
            title: "Chatting Via Bluetooth",
            summary: "Web interface enabling real‑time Bluetooth communication between two devices.",
            tech: ["Python", "Sockets", "Flask", "HTML", "CSS", "JavaScript"],
            link: "https://github.com/rohxn08/Chatting-Via-Bluetooth",
            image: "assets/images/p2_ai_rag.png"
        }
    ],
    education: [
        {
            degree: "B.E. in Artificial Intelligence and Data Science",
            institution: "Global Academy of Technology",
            location: "Bengaluru, Karnataka",
            timeline: "Expected 2026",
            gpa: "9.48/10",
            coursework: [
                "Machine Learning", "Data Structures in C", "Python for Data Science", "Big Data", "SQL", "Deep Learning", "DBMS"
            ]
        }
    ],
    certifications: [
        "NPTEL: Python for Data Science",
        "NPTEL: Data Science for Engineers",
        "Infosys Springboard: NLP and Web Technology",
        "Infosys Springboard: Python Foundation",
        "Infosys Springboard: Front-End Web Developer"
    ],
    extracurricular: [
        "Participant: Hack A League 3.0 (Global Academy of Technology)"
    ]
};
