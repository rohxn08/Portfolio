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
        const slider = byId('projects-slider');
        const detailContainer = byId('project-detail');
        if (!slider || !detailContainer) return;

        // Clear existing
        slider.innerHTML = '';

        d.projects.forEach((p, index) => {
            const card = create('article', { class: 'slider-card' });

            // Image (Top)
            if (p.image) {
                // Use the standardized avatars
                const img = create('img', {
                    src: p.image,
                    alt: p.title,
                    class: 'slider-card-img',
                    loading: 'lazy'
                });
                card.appendChild(img);
            }

            // Content Container
            const content = create('div', { class: 'slider-card-content' });

            // Title
            content.appendChild(create('h3', {}, [p.title]));

            // Tags (Tech Stack) only
            const tags = create('div', { class: 'tags' });
            if (p.tech && p.tech.length > 0) {
                // Limit to 3 tags to prevent overflow
                const limit = 3;
                const showTags = p.tech.slice(0, limit);
                showTags.forEach(t => tags.appendChild(create('span', { class: 'tag' }, [t])));

                if (p.tech.length > limit) {
                    tags.appendChild(create('span', { class: 'tag', style: 'background: var(--brand); color: #fff; border:none;' }, [`+${p.tech.length - limit}`]));
                }
            }
            content.appendChild(tags);

            card.appendChild(content);

            // Click Handler
            card.onclick = () => {
                // Formatting active state
                Array.from(slider.children).forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                showProjectDetail(index);
            };

            slider.appendChild(card);
        });
    }

    function showProjectDetail(index) {
        const p = d.projects[index];
        const container = byId('project-detail');

        // Reveal container
        container.classList.remove('projects-hidden');
        container.innerHTML = ''; // Clear prev

        // Reset animation
        container.style.animation = 'none';
        container.offsetHeight; /* trigger reflow */
        container.style.animation = 'fadeIn 0.5s ease';

        // Left: Avatar
        const leftCol = create('div', { class: 'detail-avatar-wrapper' });
        // Use the large avatar. 
        // Note: p.image points to assets/images/avatar_XX.png usually
        if (p.image) {
            const img = create('img', {
                src: p.image,
                alt: p.title,
                class: 'detail-avatar',
                loading: 'lazy'
            });
            leftCol.appendChild(img);
        }
        container.appendChild(leftCol);

        // Right: Content
        const rightCol = create('div', { class: 'detail-content' });

        const header = create('div', { class: 'detail-header' });
        header.appendChild(create('h3', { class: 'detail-title' }, [p.title]));

        // Links
        const linkContainer = create('div', { class: 'detail-links' });
        if (p.link) {
            const btn = create('a', {
                href: p.link,
                target: '_blank',
                class: 'button primary',
                style: 'margin-right: 16px'
            }, ['View Project']);
            linkContainer.appendChild(btn);
        }
        header.appendChild(linkContainer);
        rightCol.appendChild(header);

        // Summary
        // User requested "detailed 5 line summary". 
        // We use p.summary for now. Ideally data.js should have longer text if needed.
        // Summary
        // Use html prop to render <br> tags
        const desc = create('div', { class: 'detail-desc', html: p.summary });
        rightCol.appendChild(desc);

        // Full Tech Stack in detail view?
        const techList = create('div', { style: 'margin-top: 20px' });
        techList.appendChild(create('h4', { style: 'margin-bottom:10px; color:var(--text); text-transform:uppercase; font-size:0.9rem;' }, ['Technology Stack']));
        const tags = create('div', { class: 'tags' });
        if (p.tech) {
            p.tech.forEach(t => tags.appendChild(create('span', { class: 'tag' }, [t])));
        }
        techList.appendChild(tags);
        rightCol.appendChild(techList);

        container.appendChild(rightCol);

        // Scroll to detail view slightly if on mobile? 
        // container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

        // Close project detail when clicking outside
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
                Array.from(slider.children).forEach(c => c.classList.remove('active'));
            }
        });
    });
})();
