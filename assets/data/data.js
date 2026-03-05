// Dynamic portfolio data for Rohan R
const PORTFOLIO_DATA = {
    name: "Rohan R",
    objective: "Aspiring AI and Data Science Engineer specializing in OCR, Computer Vision, and Generative AI. Passionate about building intelligent systems and solving real-world problems through innovation.",
    aboutHtml: `
    <ul style="list-style-type: none; padding: 0;">
        <li style="margin-bottom: 0.5rem;">🎓 <strong>AI & Data Science student</strong> at <strong>Global Academy of Technology</strong> (GPA: 9.48/10)</li>
        <li style="margin-bottom: 0.5rem;">🔭 Specialized in <strong>OCR, Computer Vision</strong>, and <strong>Generative AI</strong></li>
        <li style="margin-bottom: 0.5rem;">🌱 <strong>Currently Interning</strong> at <strong>ABB India</strong></li>
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
        github: "https://github.com/rohxn08"
    },
    resume: {
        url: "rohan_resume.pdf" // points to PDF placed in project root
    },
    skills: {
        languages: ["Python", "C++", "C", "SQL", "Dart"],
        ai_ml: ["TensorFlow", "Keras", "Scikit-Learn", "Pandas", "NumPy", "OpenCV", "PaddleOCR"],
        genai_nlp: ["Hugging Face", "LangChain", "Prompt Engineering", "PaddleOCR", "LLMs", "FAISS", "SentenceTransformers"],
        tools: ["MLflow", "FastAPI", "Docker", "Git", "Streamlit", "Linux", "Tableau", "Power Bi"]
    },
    projects: [
        {
            title: "ZipRoute",
            summary: "• <strong>AI-Powered Smart Route Optimization</strong> for delivery drivers with >10% route reduction and 87% ETA accuracy.<br>• Full-stack solution combining a <strong>FastAPI Python backend</strong> with a responsive <strong>Flutter Mobile App</strong>.<br>• Features intelligent <strong>OCR Address Extraction</strong> to automatically parse delivery destinations from images.<br>• delivers high reliability (98.5%) and low latency (<1.2s) for real-time logistics management.<br>• Comprehensive <strong>implementation documentation</strong> covering system architecture, testing suites, and performance metrics.",
            tech: ["Python", "FastAPI", "Flutter", "OCR", "Machine Learning"],
            link: "https://github.com/rohxn08/ZipRoute",
            image: "assets/images/avatar_44.png"
        },
        {
            title: "BrainBolt",
            summary: "• <strong>Multimodal RAG System</strong> capable of ingesting PDFs, images, web links, and YouTube videos.<br>• Powered by <strong>Google Gemini 1.5 Pro</strong> for high-fidelity summarization and reasoning.<br>• Features a <strong>Quiz Generator</strong> that creates interactive assessments from any uploaded content.<br>• Built with a futuristic <strong>Neural Grid UI</strong> using custom HTML/CSS and a <strong>FastAPI</strong> backend.<br>• Implements <strong>FAISS vector search</strong> for millisecond-latency information retrieval.",
            tech: ["Python", "FastAPI", "LangChain", "FAISS"],
            link: "https://rohxn08-brain-bolt.hf.space",
            github: "https://github.com/rohxn08/BrainBolt",
            image: "assets/images/avatar_33.png",
            iframeDemo: "https://rohxn08-brain-bolt.hf.space/?portfolio=true"
        },
        {
            title: "Face Anti-Spoofing System",
            summary: "• <strong>Hybrid biometric security system</strong> combining classical LBP+SVM texture analysis and modern <strong>MobileNetV2 CNN</strong>.<br>• Features <strong>real-time webcam protection</strong> with temporal voting to stabilize predictions and eliminate flickering.<br>• Includes <strong>smart scene detection</strong> that resets logic on subject changes for instant, snappy response.<br>• Supports <strong>dual-mode analysis</strong>: high-fidelity static image verification and low-latency live video streaming.<br>• Polished <strong>Streamlit interface</strong> with visual feedback, bounding boxes, and real-time confidence scoring.",
            tech: ["Python", "OpenCV", "TensorFlow", "Scikit-Learn", "Streamlit"],
            link: "https://github.com/rohxn08/Face-anti-spoofing-system",
            image: "assets/images/avatar_11.png"
        },
        {
            title: "AI-Powered Document Search (RAG)",
            summary: "• Full-stack <strong>Retrieval-Augmented Generation (RAG)</strong> system enabling natural language Q&A from uploaded documents.<br>• Features robust ingestion for PDFs, DOCX, TXT, and URLs with <strong>automatic text extraction</strong> and intelligent chunking.<br>• Integrates <strong>FAISS vector database</strong> and Sentence-Transformers for high-speed, accurate similarity search.<br>• Powered by <strong>Google Gemini API/OpenAI</strong> for generating context-aware answers with precise source citations.<br>• User-friendly Streamlit interface with <strong>conversation history tracking</strong> and dockerized deployment support.",
            tech: ["Python", "RAG", "FAISS", "Streamlit", "Google Gemini API"],
            link: "https://github.com/rohxn08/AI-powered-Document-search-using-RAG",
            image: "assets/images/avatar_22.png"
        },
        {
            title: "Sign Language Translator",
            summary: "• <strong>Real-time sign language detection</strong> system leveraging OpenCV and MediaPipe for accurate gesture tracking and inference.<br>• Includes a comprehensive pipeline for <strong>dataset creation</strong>: capturing webcam images, structuring data, and training custom classifiers.<br>• Features a <strong>browser-based user interface</strong> for accessible live detection and testing.<br>• Generates detailed <strong>performance metrics</strong> including accuracy scores, classification reports, and confusion matrices.<br>• Incorporates model explainability tools (<strong>LIME & SHAP</strong>) and text-to-speech output to vocalize recognized signs.",
            tech: ["Python", "OpenCV", "MediaPipe", "HTML/CSS"],
            link: "https://github.com/rohxn08/sign-language-translator",
            image: "assets/images/avatar_33.png"
        },
        {
            title: "Automatic Image Enhancer",
            summary: "• <strong>Automatic image enhancement</strong> tool that intelligently adjusts brightness and contrast using the <strong>CLAHE algorithm</strong>.<br>• Features a modern, user-friendly web interface built with <strong>Streamlit</strong> for easy uploading and real-time preview.<br>• Includes a robust <strong>CLI mode</strong> for quick batch processing and scripting integration.<br>• Supports all standard image formats (JPG, PNG) with <strong>automatic result saving</strong>.<br>• Built on a high-performance stack of <strong>OpenCV and NumPy</strong> for rapid image processing.",
            tech: ["Python", "NumPy", "OpenCV"],
            link: "https://github.com/rohxn08/Automatic-Image-Enhancer",
            image: "assets/images/avatar_44.png"
        },
        {
            title: "Comparative Score Visualization",
            summary: "• Analytic visualization tool for tracking <strong>comparative user wellness scores</strong> over time using Python and Plotly.<br>• Supports <strong>dual data modes</strong>: generating synthetic dummy scenarios and processing real collected datasets (activity, sleep, weight).<br>• Features a dynamic, <strong>interactive web-based interface</strong> with hover-over details for precise trend analysis.<br>• Implements clear <strong>color-coded legends</strong> and distinct user identification for multi-user comparison.<br>• Generates immediate <strong>HTML output</strong> viewable directly in browsers or via Live Server.",
            tech: ["Python", "Plotly", "Pandas", "NumPy", "HTML"],
            link: "https://github.com/rohxn08/Comparative-Score-Visualization-of-wellness-scores",
            image: "assets/images/avatar_55.png"
        },
        {
            title: "Binance Futures Order Bot",
            summary: "• <strong>CLI-based high-frequency trading bot</strong> for Binance USDT-M Futures with robust error validation.<br>• Supports advanced order strategies including <strong>Stop-WLimit, OCO (emulated)</strong>, TWAP, and Grid trading.<br>• Features centralized <strong>logging system</strong> with error tracing for reliable production monitoring.<br>• Includes a simulation mode ('mock_demo') to <strong>test strategies risk-free</strong> without API keys.<br>• Configurable for both Testnet and Mainnet environments with <strong>secure environment variable management</strong>.",
            tech: ["Python", "CLI"],
            link: "https://github.com/rohxn08/Rohan-Binance_bot",
            image: "assets/images/avatar_66.png"
        },
        {
            title: "MNIST Digit Prediction",
            summary: "• Interactive <strong>desktop GUI application</strong> for handwritten digit recognition built with Python and Tkinter.<br>• Features a <strong>real-time drawing canvas</strong> allowing users to sketch digits (0-9) using a mouse input.<br>• Powered by a pre-trained <strong>Convolutional Neural Network (CNN)</strong> model (Keras/TensorFlow) for high-accuracy classification.<br>• Delivers instant <strong>feedback with prediction results</strong> and confidence scores upon clicking 'Predict'.<br>• Lightweight and easy to deploy with utility functions for <strong>canvas clearing</strong> and image preprocessing.",
            tech: ["Python", "Deep Learning"],
            link: "https://github.com/rohxn08/MNIST-digit-prediction",
            image: "assets/images/avatar_11.png"
        },
        {
            title: "Chatting Via Bluetooth",
            summary: "• Python-based chat system enabling reliable <strong>device-to-device communication</strong> via Bluetooth RFCOMM sockets.<br>• Wrapped in a modern <strong>Flask web interface</strong> for easy browser-based control and message visualization.<br>• Supports <strong>dual operating modes</strong> (Server/Host and Client/Connector) configurable via the UI.<br>• Implements real-time message piping using <strong>Python threading</strong> and subprocess management.<br>• Eliminates complex terminal usage by offering a clean, <strong>unified dashboard</strong> for connection management.",
            tech: ["Python", "Sockets", "Flask", "HTML", "CSS", "JavaScript"],
            link: "https://github.com/rohxn08/Chatting-Via-Bluetooth",
            image: "assets/images/avatar_22.png"
        }
    ],
    experience: [
        {
            role: "Software Engineer Intern",
            company: "ABB India",
            location: "Bangalore, India",
            timeline: "Feb 2026 – Current",
            description: "<strong>OCR-based Invoice Extraction</strong> (Feb 2026 – Current)<br>• Built a robust OCR pipeline with PaddleOCR and OpenCV to extract structured text from bilingual invoices.<br>• Implemented ROI-based preprocessing, logo and barcode detection, and production-ready JSON formatting with confidence scores.<br>• Optimized speed and accuracy, handling both Chinese and English templates with automated null value filtering.<br>• Achieved an average processing time of ~2.8 seconds on CPU.<br>• Converted the solution into a standalone executable (.exe) and successfully deployed it for the Chinese ABB team.<br><br><strong>AI-based Defect Detection</strong> (In Progress)<br>• <strong>Designing</strong> a computer vision framework to automate quality control and surface defect detection on manufacturing components.<br>• <strong>Evaluating</strong> state-of-the-art object detection architectures (e.g., YOLOv8, EfficientDet) to identify anomalies with high precision.<br>• <strong>Architecting</strong> a scalable data pipeline to preprocess production line images for model training and real-time inference."
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
        },
        {
            degree: "Pre-University Course (PCMB)",
            institution: "MES PU College",
            location: "Bengaluru, Karnataka",
            timeline: "Completed 2022",
            gpa: "90%",
            coursework: ["Physics", "Chemistry", "Mathematics", "Biology"]
        },
        {
            degree: "Secondary School Leaving Certificate (Class X)",
            institution: "St. Mary's High School",
            location: "Bengaluru, Karnataka",
            timeline: "Completed 2020",
            gpa: "97.25%"
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
