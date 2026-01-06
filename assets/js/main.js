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
        // Contact details are now handled in the new footer structure directly via HTML/CSS usually, 
        // but if we need to hydrate the old section or new placeholders:
        // Current design uses hardcoded footer contact.
        // We will keep this function blank or use it if we want to dynamically inject footer email/phone.

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

    function handleTheme() {
        // Theme toggle removed as per brutalist design
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
        handleTheme();
        handleMenu();
        handleContactForm();
    });
})();


