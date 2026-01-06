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
        const grid = byId('projects-grid');
        d.projects.forEach(p => {
            const card = create('article', { class: 'card' });

            // Image wrapper
            const imgWrapper = create('div', { class: 'card-image-wrapper' });
            if (p.image) {
                const img = create('img', { src: p.image, alt: p.title, class: 'card-image', loading: 'lazy' });
                imgWrapper.appendChild(img);
            }
            card.appendChild(imgWrapper);

            // Content overlay
            const content = create('div', { class: 'card-content' });

            content.appendChild(create('h3', {}, [p.title]));
            content.appendChild(create('p', { class: 'project-description' }, [p.summary || p.description || '']));

            const tags = create('div', { class: 'tags' });
            if (p.tech && p.tech.length > 0) {
                p.tech.forEach(t => tags.appendChild(create('span', { class: 'tag' }, [t])));
            }
            content.appendChild(tags);

            card.appendChild(content);

            if (p.link) {
                // Make whole card clickable usually, but here we can just wrap or add listener
                card.style.cursor = 'pointer';
                card.onclick = () => window.open(p.link, '_blank');
            }
            grid.appendChild(card);
        });

        // GSAP Animations for Projects
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.card', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
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
        // Removed hero-name text set since it's hardcoded as Mega Title now
        setText('objective', d.objective);
        setText('footer-name', d.name);
        byId('year').textContent = new Date().getFullYear();

        const resumeUrl = d.resume?.url;
        if (resumeUrl) {
            const resumeLink = document.getElementById('resume-link');
            // Check if cta-resume exists (we changed it to stat-box in HTML, so this might be null)
            // But if user didn't change HTML structure completely, keeping safety check
            const cta = document.getElementById('cta-resume');
            const fileNameFromUrl = resumeUrl.split('/').pop() || 'resume.pdf';
            if (resumeLink) {
                resumeLink.href = resumeUrl;
                resumeLink.setAttribute('download', fileNameFromUrl);
            }
        }

        // Populate stats if they exist
        const statNums = document.querySelectorAll('.stat-num');
        if (statNums.length >= 2) {
            statNums[0].textContent = d.projects.length < 10 ? `0${d.projects.length}` : d.projects.length;
            // second stat is resume, keep as 02 or whatever
        }

        // hide header quick contacts (moved to footer)
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

    document.addEventListener('DOMContentLoaded', function () {
        hydrate();
        handleTheme();
        handleMenu();
        handleContactForm();
        // Initialize animations after a brief delay to ensure DOM is ready
        setTimeout(initAnimations, 100);
    });
})();


