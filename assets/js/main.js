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
    });
})();
