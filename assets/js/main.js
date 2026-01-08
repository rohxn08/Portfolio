/* global PORTFOLIO_DATA */
(function () {
    const d = PORTFOLIO_DATA;

    function byId(id) { return document.getElementById(id); }

    function setText(id, text) { const el = byId(id); if (el) el.textContent = text; }

    function create(el, attrs, children) {
        const node = document.createElement(el);
        if (attrs) {
            Object.entries(attrs).forEach(([k, v]) => {
                if (k === 'class') node.className = v; else if (k === 'html') node.innerHTML = v; else node.setAttribute(k, v);
            });
        }
        (children || []).forEach(c => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
        return node;
    }

    function renderChips(containerId, items) {
        const container = byId(containerId); if (!container) return;
        items.forEach(t => container.appendChild(create('span', { class: 'chip' }, [t])));
    }

    function renderProjects() {
        const sliderContainer = byId('projects-slider');
        const detailContainer = byId('project-detail');
        if (!sliderContainer || !detailContainer) return;

        // Clear existing
        sliderContainer.innerHTML = '';

        // Setup Infinite Slider Structure
        const track = create('div', { class: 'project-track-infinite' });
        sliderContainer.appendChild(track);

        // Function to create a card
        const createCard = (p) => {
            const card = create('div', { class: 'slider-card' });

            // Image
            if (p.image) {
                const img = create('img', { src: p.image, class: 'slider-card-img', alt: p.title, loading: 'lazy' });
                card.appendChild(img);
            }

            // Content
            const content = create('div', { class: 'slider-card-content' });
            content.appendChild(create('h3', {}, [p.title]));

            const tags = create('div', { class: 'slider-tags' });
            if (p.tech) {
                p.tech.slice(0, 3).forEach(t => tags.appendChild(create('span', { class: 'slider-tag' }, [t])));
            }
            content.appendChild(tags);
            card.appendChild(content);

            // Click event
            card.onclick = (e) => {
                // Remove active class from all cards (even duplicates)
                Array.from(track.children).forEach(c => c.classList.remove('active'));

                // Add active class to clicked card
                card.classList.add('active');

                // Show details (this pauses animation via CSS hover on track, 
                // but user must keep mouse over or we need JS pause?)
                // Actually, clicking selects it. User reads details below.

                showProjectDetails(p);
                e.stopPropagation();
            };

            return card;
        };

        // Render original set
        d.projects.forEach(p => track.appendChild(createCard(p)));
        // Render duplicate set for infinite loop (double up to ensure smoothness)
        d.projects.forEach(p => track.appendChild(createCard(p)));
    }

    function showProjectDetails(p) {
        const detail = byId('project-detail');
        if (!detail) return;

        // Show detail view inline
        detail.classList.remove('projects-hidden');

        detail.innerHTML = '';

        // Create Left Col (Avatar)
        const leftCol = create('div', { class: 'detail-avatar-wrapper' });
        if (p.image) {
            const img = create('img', { src: p.image, class: 'detail-avatar', alt: p.title });
            leftCol.appendChild(img);
        }
        detail.appendChild(leftCol);

        // Create Right Col (Content)
        const rightCol = create('div', { class: 'detail-content' });

        const header = create('div', { class: 'detail-header' });
        header.appendChild(create('h3', { class: 'detail-title' }, [p.title]));

        // Links
        const linkContainer = create('div', { class: 'detail-links' });

        // Smart Link Detection
        let githubUrl = p.github;
        let demoUrl = p.link;

        // If no explicit github key, but link is github, treat as github
        if (!githubUrl && demoUrl && demoUrl.includes('github.com')) {
            githubUrl = demoUrl;
            demoUrl = null; // Don't duplicate as demo
        }

        // Primary Action: GitHub
        if (githubUrl) {
            const btn = create('button', { class: 'button primary' }, ['GitHub Repository']);
            btn.onclick = () => window.open(githubUrl, '_blank');
            linkContainer.appendChild(btn);
        }

        // Secondary: Live Demo
        if (demoUrl) {
            const btn = create('button', { class: 'button' }, ['Live Demo']);
            btn.onclick = () => window.open(demoUrl, '_blank');
            linkContainer.appendChild(btn);
        }

        header.appendChild(linkContainer);
        rightCol.appendChild(header);

        const desc = create('div', { class: 'detail-desc', html: p.summary || p.description || '' });
        rightCol.appendChild(desc);

        // Tech (if needed detailed list)
        if (p.tech) {
            const techHeader = create('h4', { style: 'margin-top:20px; font-size:0.9rem; text-transform:uppercase; color:var(--text);' }, ['Tech Stack']);
            rightCol.appendChild(techHeader);

            const chips = create('div', { class: 'chips', style: 'margin-top:10px;' });
            p.tech.forEach(t => chips.appendChild(create('span', { class: 'chip' }, [t])));
            rightCol.appendChild(chips);
        }

        detail.appendChild(rightCol);

        // Scroll to details
        setTimeout(() => {
            detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    function renderEducation() {
        const list = byId('education-list');
        if (!list) return;
        d.education.forEach(e => {
            const item = create('div', { class: 'timeline-item' });
            item.appendChild(create('h3', {}, [e.degree]));
            item.appendChild(create('div', { class: 'meta' }, [`${e.institution}, ${e.location} | ${e.timeline}`]));
            if (e.gpa) item.appendChild(create('div', { class: 'meta' }, [`GPA: ${e.gpa}`]));
            if (e.coursework) {
                const cw = create('div', { style: 'margin-top:8px; font-size:0.85rem; color:var(--text-sec);' }, ['Coursework: ' + e.coursework.join(', ')]);
                item.appendChild(cw);
            }
            list.appendChild(item);
        });
    }

    function renderCerts() {
        const list = byId('certs-list');
        if (!list) return;
        d.certifications.forEach(c => {
            list.appendChild(create('li', {}, [c]));
        });
    }

    function renderContact() {
        // Dynamically update footer email/phone from data.js
        const footerEmail = document.querySelector('.footer-email');
        if (footerEmail) {
            footerEmail.textContent = d.contact.email;
            footerEmail.href = `mailto:${d.contact.email}`;
        }

        const footerPhone = document.querySelector('.footer-phone');
        if (footerPhone) {
            footerPhone.textContent = d.contact.phone;
            footerPhone.href = `tel:${d.contact.phone}`;
        }
    }

    function initAnimations() {
        // Hero Animations
        const tl = gsap.timeline();

        tl.from('.mega-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.2
        })
            .from('.hero-img', {
                scale: 1.2,
                filter: 'grayscale(0%) blur(10px)',
                duration: 1.5,
                ease: 'power2.out'
            }, '-=1')
            .from('.hero-details', {
                opacity: 0,
                y: 20,
                duration: 0.8
            }, '-=0.5');

        // Text reveal for sections
        gsap.utils.toArray('h2').forEach(h2 => {
            gsap.from(h2, {
                scrollTrigger: {
                    trigger: h2,
                    start: 'top 85%',
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }

    function hydrate() {
        setText('brand-name', d.name);
        setText('objective', d.objective);
        setText('footer-name', d.name);
        byId('year').textContent = new Date().getFullYear();

        const resumeUrl = d.resume?.url;
        if (resumeUrl) {
            const resumeLink = document.getElementById('resume-link');
            const fileNameFromUrl = resumeUrl.split('/').pop() || 'resume.pdf';
            if (resumeLink) {
                resumeLink.href = resumeUrl;
                resumeLink.setAttribute('download', fileNameFromUrl);
            }
        }

        const statNums = document.querySelectorAll('.stat-num');
        if (statNums.length >= 2) {
            statNums[0].textContent = d.projects.length < 10 ? `0${d.projects.length}` : d.projects.length;
        }

        const hc = byId('header-contacts');
        if (hc) { hc.style.display = 'none'; hc.innerHTML = ''; }

        const about = byId('about-text');
        if (d.aboutHtml) about.innerHTML = d.aboutHtml;

        renderChips('skills-languages', d.skills.languages);
        renderChips('skills-ai-ml', d.skills.ai_ml);
        renderChips('skills-genai-nlp', d.skills.genai_nlp);
        renderChips('skills-tools', d.skills.tools);
        renderProjects();
        renderEducation();
        renderCerts();
        renderContact();

        const socials = byId('socials');
        if (d.social.github) socials.appendChild(create('a', { href: d.social.github, target: '_blank', rel: 'noopener' }, ['GitHub']));
        if (d.contact.email) socials.appendChild(create('a', { href: `mailto:${d.contact.email}` }, [d.contact.email]));
        if (d.contact.phone) socials.appendChild(create('a', { href: `tel:${d.contact.phone}` }, [d.contact.phone]));
        if (d.social.linkedin) socials.appendChild(create('a', { href: d.social.linkedin, target: '_blank', rel: 'noopener' }, ['LinkedIn']));
    }

    function handleMenu() {
        const btn = byId('menu-toggle');
        const nav = byId('nav');
        if (!btn || !nav) return;
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            nav.style.display = isExpanded ? 'none' : 'flex';
            if (!isExpanded) {
                nav.style.position = 'absolute';
                nav.style.top = '100%';
                nav.style.right = '0';
                nav.style.background = 'var(--bg)';
                nav.style.flexDirection = 'column';
                nav.style.padding = '20px';
                nav.style.border = '1px solid var(--border)';
            } else {
                nav.style = ''; // reset inline styles
            }
        });
    }

    function handleContactForm() {
        const form = byId('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you! This is a demo form.');
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        hydrate();
        handleMenu();
        handleContactForm();
        setTimeout(initAnimations, 100);

        // ... click handler ...
    });
    document.addEventListener('click', (e) => {
        const slider = byId('projects-slider');
        const detail = byId('project-detail');

        // If click is NOT inside a card AND NOT inside the detail view
        if (slider && detail &&
            !e.target.closest('.slider-card') &&
            !e.target.closest('.project-detail') &&
            !detail.classList.contains('projects-hidden')) {

            // Hide detail view
            detail.classList.add('projects-hidden');

            // Remove active state from all cards
            // Remove active state from all cards
            const allCards = slider.querySelectorAll('.slider-card');
            allCards.forEach(c => c.classList.remove('active'));
        }
    });

    initParticles();

    function initParticles() {
        const canvas = document.getElementById('neural-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        // Configuration
        const particleCount = 60; // Slightly more dense
        const connectionDistance = 140;
        const mouseDistance = 200;

        // Resize handler
        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Mouse tracking
        let mouse = { x: null, y: null };
        canvas.parentElement.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.parentElement.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (repulse)
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        const directionX = forceDirectionX * force * 5; // Strength
                        const directionY = forceDirectionY * force * 5;
                        this.vx -= directionX * 0.05;
                        this.vy -= directionY * 0.05;
                    }
                }
            }

            draw() {
                ctx.fillStyle = '#FE3D00'; // Brand color dots
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Init particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connect particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        // Opacity based on distance
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(254, 61, 0, ${opacity * 0.4})`; // Brand color lines
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        animate();
    }
})();
