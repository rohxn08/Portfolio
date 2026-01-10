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

    function renderProjects(filter = 'all') {
        const sliderContainer = byId('projects-slider');
        const detailContainer = byId('project-detail');
        if (!sliderContainer || !detailContainer) return;

        // Clear existing
        sliderContainer.innerHTML = '';
        sliderContainer.className = 'projects-slider'; // Reset class

        // Filter Data
        const filtered = filter === 'all'
            ? d.projects
            : d.projects.filter(p => p.category === filter);

        if (filter === 'all') {
            // INFINITE SLIDER MODE
            const track = create('div', { class: 'project-track-infinite' });
            sliderContainer.appendChild(track);

            // Render double set for loop
            filtered.forEach(p => track.appendChild(createCard(p, track, true))); // true = isSlider
            filtered.forEach(p => track.appendChild(createCard(p, track, true)));
        } else {
            // STATIC GRID MODE
            sliderContainer.className = 'projects-grid'; // Switch to grid layout
            filtered.forEach(p => sliderContainer.appendChild(createCard(p, sliderContainer, false)));
        }
    }

    // Extracted Card Creation to reused function
    function createCard(p, container, isSlider) {
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
            // Remove active class from neighbors
            // If slider, it's container.children. If grid, same.
            const siblings = isSlider ? container.children : container.parentElement.querySelectorAll('.slider-card');
            Array.from(siblings).forEach(c => c.classList.remove('active'));

            // Add active class
            card.classList.add('active');
            showProjectDetails(p);
            e.stopPropagation();
        };

        return card;
    }

    function showProjectDetails(p) {
        const detail = byId('project-detail');
        if (!detail) return;
        detail.classList.remove('projects-hidden');
        detail.innerHTML = '';

        const leftCol = create('div', { class: 'detail-avatar-wrapper' });
        if (p.image) {
            leftCol.appendChild(create('img', { src: p.image, class: 'detail-avatar', alt: p.title }));
        }
        detail.appendChild(leftCol);

        const rightCol = create('div', { class: 'detail-content' });

        const header = create('div', { class: 'detail-header' });
        header.appendChild(create('h3', { class: 'detail-title' }, [p.title]));

        const linkContainer = create('div', { class: 'detail-links' });
        let githubUrl = p.github;
        let demoUrl = p.link;

        if (!githubUrl && demoUrl && demoUrl.includes('github.com')) {
            githubUrl = demoUrl; demoUrl = null;
        }

        if (githubUrl) {
            const btn = create('button', { class: 'button primary' }, ['GitHub Repository']);
            btn.onclick = () => window.open(githubUrl, '_blank');
            linkContainer.appendChild(btn);
        }
        if (demoUrl) {
            const btn = create('button', { class: 'button' }, ['Live Demo']);
            btn.onclick = () => window.open(demoUrl, '_blank');
            linkContainer.appendChild(btn);
        }
        header.appendChild(linkContainer);
        rightCol.appendChild(header);

        const desc = create('div', { class: 'detail-desc', html: p.summary || p.description || '' });
        rightCol.appendChild(desc);

        if (p.tech) {
            rightCol.appendChild(create('h4', { style: 'margin-top:20px; font-size:0.9rem; text-transform:uppercase; color:var(--text);' }, ['Tech Stack']));
            const chips = create('div', { class: 'chips', style: 'margin-top:10px;' });
            p.tech.forEach(t => chips.appendChild(create('span', { class: 'chip' }, [t])));
            rightCol.appendChild(chips);
        }
        detail.appendChild(rightCol);

        setTimeout(() => {
            detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    // ... existing render functions ...

    function initCursor() {
        const cursor = byId('custom-cursor');
        if (!cursor) return;

        // Move cursor
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect
        const clickables = document.querySelectorAll('a, button, .slider-card, .chip, input, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });

        // Re-attach listeners for dynamic content? Simple global delegation is better actually
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .slider-card, .chip, input, textarea')) {
                cursor.classList.add('hovered');
            } else {
                cursor.classList.remove('hovered');
            }
        });
    }


    function renderEducation() {
        const container = byId('education-list');
        if (!container) return;
        d.education.forEach(edu => {
            const item = create('div', { class: 'timeline-item' });

            // Degree
            item.appendChild(create('h3', { style: 'font-size: 1.1rem; color: var(--text); margin: 0;' }, [edu.degree]));

            // Institution
            item.appendChild(create('h4', { style: 'font-size: 0.9rem; color: var(--text-sec); margin: 0; font-weight: 500;' }, [`${edu.institution}, ${edu.location}`]));

            // Meta
            const meta = create('div', { class: 'meta' });
            meta.appendChild(create('div', {}, [edu.timeline]));
            meta.appendChild(create('div', { style: 'color: var(--brand); font-weight: 700; margin-top: 4px;' }, [`GPA: ${edu.gpa}`]));

            if (edu.coursework) {
                const cw = create('div', { style: 'margin-top: 8px; font-size: 0.85rem; line-height: 1.4;' }, [`Relevant Coursework: ${edu.coursework.join(', ')}`]);
                meta.appendChild(cw);
            }

            item.appendChild(meta);
            container.appendChild(item);
        });
    }

    function renderCerts() {
        const container = byId('certs-list');
        if (!container) return;
        d.certifications.forEach(c => {
            container.appendChild(create('li', {}, [c]));
        });
    }

    function hydrate() {
        // ... existing hydrate code ...
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

        const about = byId('about-text');
        if (d.aboutHtml) about.innerHTML = d.aboutHtml;

        renderChips('skills-languages', d.skills.languages);
        renderChips('skills-ai-ml', d.skills.ai_ml);
        renderChips('skills-genai-nlp', d.skills.genai_nlp);
        renderChips('skills-tools', d.skills.tools);
        // Initial Render
        renderProjects('all');

        // Filter Listeners
        const filters = document.querySelectorAll('.filter-btn');
        filters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Hide details if open
                const detail = byId('project-detail');
                if (detail) detail.classList.add('projects-hidden');

                // Re-render
                renderProjects(btn.getAttribute('data-filter'));
            });
        });

        renderEducation();
        renderCerts();
        renderContact();

        const socials = byId('socials');
        if (d.social.github) socials.appendChild(create('a', { href: d.social.github, target: '_blank', rel: 'noopener' }, ['GitHub']));
        if (d.contact.email) socials.appendChild(create('a', { href: `mailto:${d.contact.email}` }, [d.contact.email]));
        if (d.contact.phone) socials.appendChild(create('a', { href: `tel:${d.contact.phone}` }, [d.contact.phone]));
        if (d.social.linkedin) socials.appendChild(create('a', { href: d.social.linkedin, target: '_blank', rel: 'noopener' }, ['LinkedIn']));
    }

    // ... handleMenu ...
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
        initCursor(); // Start cursor
        setTimeout(initAnimations, 100);
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
