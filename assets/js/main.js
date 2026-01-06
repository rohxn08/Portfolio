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
            card.appendChild(create('h3', {}, [p.title]));

            // Description section
            const descLabel = create('div', { class: 'project-label' }, ['Description:']);
            card.appendChild(descLabel);
            card.appendChild(create('p', { class: 'project-description' }, [p.summary || p.description || 'No description available.']));

            // Tech Stack section
            const techLabel = create('div', { class: 'project-label' }, ['Tech Stack:']);
            card.appendChild(techLabel);
            const tags = create('div', { class: 'tags' });
            if (p.tech && p.tech.length > 0) {
                p.tech.forEach(t => tags.appendChild(create('span', { class: 'tag' }, [t])));
            } else {
                tags.appendChild(create('span', { class: 'tag', style: 'opacity: 0.6' }, ['Not specified']));
            }
            card.appendChild(tags);

            if (p.link) {
                const a = create('a', { href: p.link, target: '_blank', rel: 'noopener', class: 'button' }, ['View on GitHub']);
                card.appendChild(a);
            }
            grid.appendChild(card);
        });
    }

    function renderEducation() {
        const list = byId('education-list');
        d.education.forEach(e => {
            const item = create('div', { class: 'timeline-item' });
            item.appendChild(create('strong', {}, [e.degree]));
            item.appendChild(create('div', { class: 'meta' }, [`${e.institution} • ${e.location}`]));
            item.appendChild(create('div', { class: 'meta' }, [`${e.timeline}${e.gpa ? ' • GPA: ' + e.gpa : ''}`]));
            if (e.coursework?.length) {
                const cw = create('div', { class: 'meta' }, ['Relevant: ' + e.coursework.join(', ')]);
                item.appendChild(cw);
            }
            list.appendChild(item);
        });
    }

    function renderCerts() {
        const ul = byId('certs-list');
        d.certifications.forEach(c => ul.appendChild(create('li', {}, [c])));
    }

    function renderContact() {
        const ul = byId('contact-list');
        const rows = [];
        rows.forEach(([k, v]) => {
            const li = create('li');
            li.appendChild(create('span', { class: 'muted' }, [k]));
            li.appendChild(typeof v === 'string' ? create('span', {}, [v]) : v);
            ul.appendChild(li);
        });
        if (!ul.children.length && ul.parentElement) {
            ul.parentElement.style.display = 'none';
        }
    }

    function handleTheme() {
        const key = 'theme';
        const saved = localStorage.getItem(key);
        if (saved === 'light') document.body.classList.add('light');
        const btn = byId('theme-toggle');
        btn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light');
            localStorage.setItem(key, isLight ? 'light' : 'dark');
            btn.textContent = isLight ? '☀️' : '🌙';
        });
        btn.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
    }

    function handleMenu() {
        const menu = byId('menu-toggle');
        const nav = document.getElementById('nav');
        menu.addEventListener('click', () => {
            const open = nav.style.display === 'flex';
            nav.style.display = open ? 'none' : 'flex';
            menu.setAttribute('aria-expanded', String(!open));
        });
    }

    function handleContactForm() {
        const form = byId('contact-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = byId('name').value.trim();
            const email = byId('email').value.trim();
            const message = byId('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            const subject = encodeURIComponent(`Portfolio message from ${name}`);
            const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
            const mailtoLink = `mailto:${d.contact.email}?subject=${subject}&body=${body}`;

            try {
                window.location.href = mailtoLink;
                form.reset();
                setTimeout(() => {
                    alert('Your email client should open. If it doesn\'t, please email: ' + d.contact.email);
                }, 500);
            } catch (err) {
                alert('Unable to open email client. Please email directly at: ' + d.contact.email);
            }
        });
    }

    function hydrate() {
        setText('brand-name', d.name);
        setText('hero-name', d.name);
        setText('objective', d.objective);
        setText('footer-name', d.name);
        byId('year').textContent = new Date().getFullYear();

        const resumeUrl = d.resume?.url;
        if (resumeUrl) {
            const resumeLink = document.getElementById('resume-link');
            const cta = document.getElementById('cta-resume');
            const fileNameFromUrl = resumeUrl.split('/').pop() || 'resume.pdf';
            if (resumeLink) {
                resumeLink.href = resumeUrl;
                resumeLink.setAttribute('download', fileNameFromUrl);
            }
            if (cta) {
                cta.href = resumeUrl;
                cta.setAttribute('download', fileNameFromUrl);
            }
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
    });
})();


