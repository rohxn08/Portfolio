/* global PORTFOLIO_DATA */
(function () {
    'use strict';

    const d = PORTFOLIO_DATA;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ---------------------------------------------------------------- utils
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function el(tag, attrs, children) {
        const node = document.createElement(tag);
        if (attrs) {
            Object.entries(attrs).forEach(([k, v]) => {
                if (v === undefined || v === null || v === false) return;
                if (k === 'class') node.className = v;
                else if (k === 'html') node.innerHTML = v;
                else if (k === 'text') node.textContent = v;
                else if (k === 'style') node.style.cssText = v;
                else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
                else node.setAttribute(k, v === true ? '' : v);
            });
        }
        (children || []).forEach(c => c != null && node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
        return node;
    }

    const stripTags = html => { const t = document.createElement('div'); t.innerHTML = html; return t.textContent.trim(); };

    // "• a<br>• b" -> ["a", "b"] (keeps inline <strong> markup)
    const bullets = html => html.split(/<br\s*\/?>/i)
        .map(s => s.trim().replace(/^•\s*/, ''))
        .filter(Boolean);

    function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
    function rng(seed) { return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

    const ICONS = {
        github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M3 5.5h18v13H3z M3 6l9 7 9-7"/></svg>',
        phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>',
        file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M6 2.5h8l4 4v15H6z M14 2.5v4h4 M9 12h6 M9 16h6"/></svg>',
        copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M8 8h12v12H8z M4 16V4h12"/></svg>',
        arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M7 17 17 7M8 7h9v9"/></svg>',
        bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
        check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    };

    // --------------------------------------------------------------- toast
    let toastTimer;
    function toast(msg) {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
    }

    async function copy(text, label) {
        try {
            await navigator.clipboard.writeText(text);
            toast(`${label} copied to clipboard`);
        } catch (e) {
            toast(text);
        }
    }

    // ---------------------------------------------------------------- hero
    function renderHero() {
        $('#hero-status').textContent = d.status || 'Open to opportunities';
        $('#hero-sub').textContent = d.tagline || d.objective;

        const stats = $('#hero-stats');
        (d.stats || []).forEach(s => {
            stats.appendChild(el('div', { class: 'stat' }, [
                el('dt', { text: s.label }),
                el('dd', {}, [el('span', { class: 'count', 'data-to': s.value, 'data-dec': s.decimals || 0, text: '0' }), s.suffix || '']),
            ]));
        });

        if (window.animateHackerText && !reduceMotion) {
            window.animateHackerText($('#hero-fname'), 'ROHAN', 1600, 150);
            window.animateHackerText($('#hero-lname'), 'R', 800, 1100);
        }

        setTimeout(() => $$('.count', stats).forEach(countUp), reduceMotion ? 0 : 900);
        startRotator();
    }

    function countUp(node) {
        const to = parseFloat(node.dataset.to), dec = +node.dataset.dec;
        if (reduceMotion) { node.textContent = to.toFixed(dec); return; }
        const start = performance.now(), dur = 1400;
        (function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            const e = 1 - Math.pow(1 - p, 4);
            node.textContent = (to * e).toFixed(dec);
            if (p < 1) requestAnimationFrame(tick);
        })(start);
    }

    function startRotator() {
        const node = $('#hero-rotator');
        const words = d.rotatingRoles || [];
        if (!node || words.length < 2) return;
        node.textContent = words[0];
        if (reduceMotion) return;
        let i = 0;
        const typeWord = (word, done) => {
            let n = 0;
            const t = setInterval(() => { node.textContent = word.slice(0, ++n); if (n >= word.length) { clearInterval(t); done(); } }, 55);
        };
        const eraseWord = done => {
            const t = setInterval(() => { node.textContent = node.textContent.slice(0, -1); if (!node.textContent) { clearInterval(t); done(); } }, 30);
        };
        const cycle = () => setTimeout(() => eraseWord(() => { i = (i + 1) % words.length; typeWord(words[i], cycle); }), 2400);
        cycle();
    }

    // ------------------------------------------------------------- marquee
    function renderMarquee() {
        const track = $('#marquee-track');
        const items = Object.values(d.skills).flat();
        const build = () => items.forEach(s => {
            track.appendChild(el('span', { text: s }));
            track.appendChild(el('span', { class: 'star', text: '✦' }));
        });
        build(); build();
    }

    // --------------------------------------------------------------- about
    function renderAbout() {
        const bento = $('#about-bento');
        const now = d.experience && d.experience[0];
        const edu = d.education && d.education[0];

        const tiles = [
            el('article', { class: 'tile tile-intro', 'data-reveal': '' }, [
                el('span', { class: 'card-label', text: 'Hello' }),
                el('p', { class: 'intro-big', html: `I'm <span class="highlight">${d.name}</span>, an AI & Data Science engineer who turns research ideas into systems people actually use.` }),
                el('p', { class: 'muted', text: d.objective }),
            ]),
            el('article', { class: 'tile tile-portrait', 'data-reveal': '' }, [
                el('img', { src: 'assets/images/avatar_55.png', alt: 'Rohan R\'s collectible avatar', loading: 'lazy' }),
            ]),
            now && el('article', { class: 'tile tile-now', 'data-reveal': '' }, [
                el('span', { class: 'card-label', html: '<span class="pulse-dot"></span> Currently' }),
                el('p', { class: 'tile-strong', text: now.role }),
                el('p', { class: 'muted', text: `@ ${now.company} · ${now.timeline}` }),
            ]),
            edu && el('article', { class: 'tile tile-gpa', 'data-reveal': '' }, [
                el('span', { class: 'card-label', text: 'CGPA' }),
                el('p', { class: 'tile-number', html: `${edu.gpa.split('/')[0]}<small>/10</small>` }),
                el('p', { class: 'muted', text: edu.institution }),
            ]),
            el('article', { class: 'tile tile-focus', 'data-reveal': '' }, [
                el('span', { class: 'card-label', text: 'Focus areas' }),
                el('div', { class: 'focus-list' }, ['OCR', 'Computer Vision', 'Generative AI', 'Agentic Systems', 'Vision AI']
                    .map(f => el('span', { class: 'focus', text: f }))),
                el('p', { class: 'muted', text: 'Open to collaborating on ML, agentic systems and vision AI.' }),
            ]),
            el('article', { class: 'tile tile-location', 'data-reveal': '' }, [
                el('span', { class: 'card-label', text: 'Based in' }),
                el('p', { class: 'tile-strong', text: d.location }),
                el('p', { class: 'muted' }, ['Local time ', el('span', { class: 'clock', id: 'local-clock' })]),
                el('div', { class: 'radar', 'aria-hidden': 'true' }),
            ]),
            el('article', { class: 'tile tile-interests', 'data-reveal': '' }, [
                el('span', { class: 'card-label', text: 'Off the clock' }),
                el('ul', { class: 'interest-list' }, (d.interests || []).map((t, i) =>
                    el('li', {}, [el('span', { class: 'interest-icon', text: ['⚡', '🎮', '🎧'][i] || '✦' }), t]))),
            ]),
        ];
        tiles.forEach(t => t && bento.appendChild(t));

        const clock = $('#local-clock');
        const tick = () => {
            try {
                clock.textContent = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: d.timezone || 'Asia/Kolkata' }).format(new Date()) + ' IST';
            } catch (e) { clock.textContent = ''; }
        };
        tick();
        setInterval(tick, 30000);
    }

    // ---------------------------------------------------------- experience
    function renderExperience() {
        const list = $('#experience-list');
        (d.experience || []).forEach((exp, i) => {
            const blocks = exp.description.split(/<br\s*\/?>\s*<br\s*\/?>/i).map(b => {
                const lines = b.split(/<br\s*\/?>/i);
                const head = lines.shift();
                const m = head.match(/<strong>(.*?)<\/strong>\s*(?:\((.*?)\))?/i);
                return { title: m ? m[1] : stripTags(head), when: m && m[2], items: bullets(lines.join('<br>')) };
            });

            const card = el('article', { class: 'xp card', 'data-reveal': '', style: `--i:${i}` }, [
                el('div', { class: 'xp-dot', 'aria-hidden': 'true' }),
                el('header', { class: 'xp-head' }, [
                    el('div', {}, [
                        el('h3', { class: 'xp-role', text: exp.role }),
                        el('p', { class: 'xp-company', html: `<span class="highlight">${exp.company}</span> · ${exp.location}` }),
                    ]),
                    el('span', { class: 'badge', text: exp.timeline }),
                ]),
                ...blocks.map(b => {
                    const LIMIT = 3;
                    const ul = el('ul', { class: 'xp-list' }, b.items.map((it, k) => el('li', { html: it, class: k >= LIMIT ? 'extra' : null })));
                    const label = `Show ${b.items.length - LIMIT} more`;
                    const more = b.items.length > LIMIT ? el('button', {
                        class: 'link-btn', 'aria-expanded': 'false', text: label,
                        onclick: (e) => {
                            const open = ul.classList.toggle('expanded');
                            e.currentTarget.setAttribute('aria-expanded', open);
                            e.currentTarget.textContent = open ? 'Show less' : label;
                        }
                    }) : null;
                    return el('div', { class: 'xp-project' }, [
                        el('h4', {}, [b.title, b.when ? el('span', { class: 'xp-when', text: b.when }) : null]),
                        ul, more,
                    ]);
                }),
            ]);
            list.appendChild(card);
        });
    }

    function updateTimelineFill() {
        const tl = $('#experience-list'), fill = $('#timeline-fill');
        if (!tl || !fill) return;
        const r = tl.getBoundingClientRect();
        const p = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
        fill.style.transform = `scaleY(${p})`;
        $$('.xp', tl).forEach(x => {
            x.classList.toggle('lit', x.getBoundingClientRect().top < window.innerHeight * 0.6);
        });
    }

    // ------------------------------------------------------------ projects
    const PREVIEW_COUNT = 6;
    let projectFilter = 'all', showAll = false;

    // Seeded generative cover art per project, styled by category.
    function projectArt(p, idx) {
        const r = rng(hashStr(p.title));
        const W = 400, H = 220;
        let g = '';
        if (p.category === 'genai') {
            const layers = [3, 4, 4, 2], nodes = [];
            layers.forEach((n, li) => {
                for (let k = 0; k < n; k++) nodes.push({ li, x: 70 + li * 90 + r() * 10, y: H / 2 + (k - (n - 1) / 2) * 40 + r() * 8 });
            });
            nodes.forEach(a => nodes.forEach(b => {
                if (b.li === a.li + 1) g += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="a-line" style="--o:${(0.15 + r() * 0.5).toFixed(2)}"/>`;
            }));
            nodes.forEach(n => { g += `<circle cx="${n.x}" cy="${n.y}" r="${(4 + r() * 3).toFixed(1)}" class="${r() > 0.6 ? 'a-hot' : 'a-node'}"/>`; });
        } else if (p.category === 'cv') {
            for (let y = 0; y < 9; y++) for (let x = 0; x < 16; x++) {
                const v = r();
                g += `<rect x="${24 + x * 22}" y="${12 + y * 22}" width="16" height="16" rx="2" class="a-px" style="--o:${(v * v * 0.6).toFixed(2)}"/>`;
            }
            const bx = 60 + r() * 140, by = 40 + r() * 50, bw = 110 + r() * 60, bh = 90 + r() * 30;
            g += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" class="a-box"/>`;
            g += `<rect x="${bx}" y="${by - 18}" width="86" height="18" class="a-tag"/><text x="${bx + 6}" y="${by - 5}" class="a-text">conf ${(0.9 + r() * 0.09).toFixed(2)}</text>`;
        } else if (p.category === 'ml') {
            let path = '';
            for (let i = 0; i < 40; i++) {
                const x = 30 + r() * 340, base = H - 40 - (x - 30) / 340 * 130;
                const y = base + (r() - 0.5) * 50;
                g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.5 + r() * 2.5).toFixed(1)}" class="${r() > 0.8 ? 'a-hot' : 'a-node'}"/>`;
            }
            for (let x = 30; x <= 370; x += 10) path += `${x === 30 ? 'M' : 'L'}${x},${(H - 40 - (x - 30) / 340 * 130 + Math.sin(x / 40) * 10).toFixed(1)}`;
            g += `<path d="${path}" class="a-curve"/>`;
        } else {
            for (let i = 0; i < 9; i++) {
                let x = 20, y = 20 + r() * (H - 40), d0 = `M${x},${y.toFixed(0)}`;
                while (x < W - 40) {
                    x = Math.min(W - 20, x + 30 + r() * 60); d0 += ` H${x.toFixed(0)}`;
                    if (r() > 0.5) { y = Math.min(H - 20, Math.max(20, y + (r() - 0.5) * 80)); d0 += ` V${y.toFixed(0)}`; }
                }
                g += `<path d="${d0}" class="a-trace" style="--o:${(0.2 + r() * 0.5).toFixed(2)}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" class="${r() > 0.5 ? 'a-hot' : 'a-node'}"/>`;
            }
        }
        return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${g}</svg>
                <span class="pc-index">${String(idx + 1).padStart(2, '0')}</span>`;
    }

    function projectLinks(p) {
        let github = p.github, live = p.link;
        if (!github && live && live.includes('github.com')) { github = live; live = null; }
        if (live && live === p.iframeDemo) live = null; // local demo only makes sense in the modal
        return { github, live };
    }

    function tagline(p) {
        const m = (p.summary || '').match(/<strong>(.*?)<\/strong>/i);
        return m ? stripTags(m[1]) : stripTags(bullets(p.summary)[0] || '');
    }

    function renderFilters() {
        const wrap = $('#project-filters');
        const cats = d.projectCategories || {};
        const opts = [['all', 'All']].concat(Object.entries(cats).filter(([k]) => d.projects.some(p => p.category === k)));
        opts.forEach(([key, label]) => {
            const count = key === 'all' ? d.projects.length : d.projects.filter(p => p.category === key).length;
            wrap.appendChild(el('button', {
                class: 'filter' + (key === 'all' ? ' active' : ''), role: 'tab', 'aria-selected': key === 'all' ? 'true' : 'false',
                onclick: (e) => {
                    projectFilter = key;
                    $$('.filter', wrap).forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
                    e.currentTarget.classList.add('active');
                    e.currentTarget.setAttribute('aria-selected', 'true');
                    renderProjects(true);
                }
            }, [label, el('span', { class: 'filter-count', text: count })]));
        });
    }

    function renderProjects(animate) {
        const grid = $('#project-grid');
        const more = $('#projects-more');
        const all = d.projects.map((p, i) => ({ p, i })).filter(({ p }) => projectFilter === 'all' || p.category === projectFilter);
        const visible = projectFilter === 'all' && !showAll ? all.slice(0, PREVIEW_COUNT) : all;

        const draw = () => {
            grid.replaceChildren(...visible.map(({ p, i }, k) => projectCard(p, i, k, animate)));
            more.hidden = !(projectFilter === 'all' && !showAll && all.length > PREVIEW_COUNT);
            more.textContent = `Show all ${all.length} projects`;
            observeReveals(grid);
        };
        if (animate && document.startViewTransition && !reduceMotion) document.startViewTransition(draw);
        else draw();
    }

    function projectCard(p, i, k, instant) {
        const { github, live } = projectLinks(p);
        const cat = (d.projectCategories || {})[p.category] || '';
        const card = el('article', {
            class: 'project-card' + (instant ? ' in' : ''), tabindex: '0', 'data-reveal': '',
            style: `--i:${k % 3}; view-transition-name: pc-${i}`,
            'aria-label': `${p.title}: open details`,
            onclick: (e) => { if (!e.target.closest('a, button')) openProject(p); },
            onkeydown: (e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) { e.preventDefault(); openProject(p); } },
        }, [
            el('div', { class: `pc-art art-${p.category}`, html: projectArt(p, i) }),
            el('div', { class: 'pc-body' }, [
                el('span', { class: 'pc-cat', text: cat }),
                el('h3', { class: 'pc-title', text: p.title }),
                el('p', { class: 'pc-tagline', text: tagline(p) }),
                el('div', { class: 'tags' }, (p.tech || []).slice(0, 4).map(t => el('span', { class: 'tag', text: t }))),
            ]),
            el('div', { class: 'pc-foot' }, [
                el('span', { class: 'pc-more', html: `Details ${ICONS.arrow}` }),
                el('div', { class: 'pc-links' }, [
                    p.iframeDemo ? el('button', { class: 'pill-btn hot', html: `${ICONS.bolt} Try it`, onclick: () => openDemo(p) }) : null,
                    github ? el('a', { class: 'icon-link', href: github, target: '_blank', rel: 'noopener', 'aria-label': `${p.title} on GitHub`, html: ICONS.github }) : null,
                    live ? el('a', { class: 'icon-link', href: live, target: '_blank', rel: 'noopener', 'aria-label': `${p.title} live site`, html: ICONS.arrow }) : null,
                ]),
            ]),
        ]);
        attachSpotlight(card, true);
        return card;
    }

    // --------------------------------------------------------------- modal
    let lastFocus = null;
    function openModal(content, wide) {
        const modal = $('#modal');
        if (modal.hidden) lastFocus = document.activeElement;
        $('#modal-body').replaceChildren(content);
        $('#modal-panel').classList.toggle('wide', !!wide);
        $('#modal-panel').scrollTop = 0;
        modal.hidden = false;
        document.documentElement.classList.add('modal-open');
        requestAnimationFrame(() => modal.classList.add('open'));
        $('.modal-close', modal).focus({ preventScroll: true });
    }
    function closeModal() {
        const modal = $('#modal');
        if (modal.hidden) return;
        modal.classList.remove('open');
        document.documentElement.classList.remove('modal-open');
        setTimeout(() => { modal.hidden = true; $('#modal-body').replaceChildren(); }, reduceMotion ? 0 : 250);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    function openProject(p) {
        const { github, live } = projectLinks(p);
        const cat = (d.projectCategories || {})[p.category] || '';
        openModal(el('div', { class: 'pm' }, [
            el('div', { class: `pm-art pc-art art-${p.category}`, html: projectArt(p, d.projects.indexOf(p)) }),
            el('span', { class: 'pc-cat', text: cat }),
            el('h3', { class: 'pm-title', id: 'modal-title', text: p.title }),
            el('p', { class: 'pm-tagline', text: tagline(p) }),
            el('ul', { class: 'pm-list' }, bullets(p.summary).map(b => el('li', { html: b }))),
            el('h4', { class: 'card-label', text: 'Tech stack' }),
            el('div', { class: 'tags' }, (p.tech || []).map(t => el('span', { class: 'tag', text: t }))),
            el('div', { class: 'pm-actions' }, [
                p.iframeDemo ? el('button', { class: 'btn btn-primary', html: `${ICONS.bolt} Try it live`, onclick: () => openDemo(p) }) : null,
                live ? el('a', { class: 'btn btn-ghost', href: live, target: '_blank', rel: 'noopener', html: `Live demo ${ICONS.arrow}` }) : null,
                github ? el('a', { class: 'btn btn-ghost', href: github, target: '_blank', rel: 'noopener', html: `${ICONS.github} GitHub` }) : null,
            ]),
        ]));
    }

    function openDemo(p) {
        const frame = el('iframe', { src: p.iframeDemo, title: `${p.title} live demo`, allow: 'clipboard-write; camera; microphone' });
        const wrap = el('div', { class: 'demo' }, [
            el('div', { class: 'demo-bar' }, [
                el('span', { class: 'demo-dots', html: '<i></i><i></i><i></i>' }),
                el('span', { class: 'demo-title', id: 'modal-title', text: `${p.title} · live demo` }),
                el('button', { class: 'link-btn', text: '← Details', onclick: () => openProject(p) }),
            ]),
            el('div', { class: 'demo-frame' }, [el('div', { class: 'demo-loading', text: 'Booting demo…' }), frame]),
        ]);
        frame.addEventListener('load', () => wrap.classList.add('loaded'));
        openModal(wrap, true);
    }

    // -------------------------------------------------------------- skills
    function renderSkills() {
        const grid = $('#skills-grid');
        const groups = [
            ['languages', 'Languages', '{ }'],
            ['ai_ml', 'Classical ML & Computer Vision', '◎'],
            ['genai_nlp', 'Generative AI, NLP & Vector DBs', '✦'],
            ['agentic_ai', 'Agentic AI', '⟳'],
            ['tools', 'Tools & Technologies', '⌘'],
        ];
        groups.forEach(([key, label, glyph], i) => {
            const items = d.skills[key] || [];
            const card = el('article', { class: `skill-card card skill-${key}`, 'data-reveal': '', style: `--i:${i % 3}` }, [
                el('header', { class: 'skill-head' }, [
                    el('span', { class: 'skill-glyph', text: glyph, 'aria-hidden': 'true' }),
                    el('h3', { text: label }),
                    el('span', { class: 'skill-count', text: String(items.length).padStart(2, '0') }),
                ]),
                el('div', { class: 'chips' }, items.map(s => el('span', { class: 'chip', text: s }))),
            ]);
            attachSpotlight(card, false);
            grid.appendChild(card);
        });
    }

    // ----------------------------------------------------------- education
    function renderEducation() {
        const list = $('#education-list');
        (d.education || []).forEach((e, i) => {
            list.appendChild(el('article', { class: 'edu card', 'data-reveal': '', style: `--i:${i}` }, [
                el('div', { class: 'edu-top' }, [
                    el('span', { class: 'badge', text: e.timeline }),
                    el('span', { class: 'edu-score', text: e.gpa }),
                ]),
                el('h3', { text: e.degree }),
                el('p', { class: 'muted', text: `${e.institution} · ${e.location}` }),
                e.coursework ? el('div', { class: 'chips small' }, e.coursework.map(c => el('span', { class: 'chip', text: c }))) : null,
            ]));
        });
        const certs = $('#certs-list');
        (d.certifications || []).forEach(c => {
            const [issuer, name] = c.includes(':') ? c.split(/:\s*/) : ['', c];
            certs.appendChild(el('li', {}, [el('span', { class: 'check', html: ICONS.check }), el('span', {}, [name, issuer ? el('small', { text: issuer }) : null])]));
        });
        const extra = $('#extra-list');
        if (!(d.extracurricular || []).length) { $('#extra-label').remove(); extra.remove(); return; }
        d.extracurricular.forEach(c => {
            const [role, what] = c.includes(':') ? c.split(/:\s*/) : ['', c];
            extra.appendChild(el('li', {}, [el('span', { class: 'check', html: ICONS.check }), el('span', {}, [what, role ? el('small', { text: role }) : null])]));
        });
    }

    // ------------------------------------------------------------- contact
    function renderContact() {
        const grid = $('#contact-grid');
        const c = d.contact || {}, s = d.social || {};
        const cards = [];
        if (c.email) cards.push({ icon: ICONS.mail, label: 'Email', value: c.email, href: `mailto:${c.email}`, copy: c.email, primary: true });
        if (s.github) cards.push({ icon: ICONS.github, label: 'GitHub', value: '@' + s.github.replace(/\/$/, '').split('/').pop(), href: s.github, external: true });
        if (s.linkedin) cards.push({ icon: ICONS.arrow, label: 'LinkedIn', value: 'Connect', href: s.linkedin, external: true });
        if (c.phone) cards.push({ icon: ICONS.phone, label: 'Phone', value: c.phone, href: `tel:${c.phone.replace(/\s/g, '')}`, copy: c.phone });
        if (d.resume && d.resume.url) cards.push({ icon: ICONS.file, label: 'Resume', value: 'Download PDF', href: d.resume.url, download: true });

        cards.forEach((k, i) => {
            const card = el('div', { class: 'contact-card card' + (k.primary ? ' primary' : ''), 'data-reveal': '', style: `--i:${i}` }, [
                el('a', {
                    class: 'contact-main', href: k.href,
                    target: k.external ? '_blank' : null, rel: k.external ? 'noopener' : null,
                    download: k.download ? (k.href.split('/').pop() || 'resume.pdf') : null,
                }, [
                    el('span', { class: 'contact-icon', html: k.icon }),
                    el('span', { class: 'contact-text' }, [el('small', { text: k.label }), el('strong', { text: k.value })]),
                    el('span', { class: 'contact-arrow', html: ICONS.arrow }),
                ]),
                k.copy ? el('button', { class: 'copy-btn', 'aria-label': `Copy ${k.label.toLowerCase()}`, title: 'Copy', html: ICONS.copy, onclick: () => copy(k.copy, k.label) }) : null,
            ]);
            attachSpotlight(card, false);
            grid.appendChild(card);
        });
    }

    // --------------------------------------------------------- interaction
    function attachSpotlight(node, tilt) {
        if (!finePointer) return;
        node.addEventListener('pointermove', (e) => {
            const r = node.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            node.style.setProperty('--mx', x + 'px');
            node.style.setProperty('--my', y + 'px');
            if (tilt && !reduceMotion) {
                node.style.setProperty('--rx', (((y / r.height) - 0.5) * -6).toFixed(2) + 'deg');
                node.style.setProperty('--ry', (((x / r.width) - 0.5) * 8).toFixed(2) + 'deg');
            }
        });
        node.addEventListener('pointerleave', () => {
            node.style.setProperty('--rx', '0deg');
            node.style.setProperty('--ry', '0deg');
        });
    }

    function initMagnetic() {
        if (!finePointer || reduceMotion) return;
        $$('.magnetic').forEach(b => {
            b.addEventListener('pointermove', (e) => {
                const r = b.getBoundingClientRect();
                b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
            });
            b.addEventListener('pointerleave', () => { b.style.transform = ''; });
        });
    }

    let revealObserver;
    function observeReveals(root = document) {
        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                    const h2 = entry.target.matches('.section-head') && $('h2', entry.target);
                    if (h2 && window.animateHackerText && !reduceMotion) window.animateHackerText(h2, h2.textContent, 900, 100);
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        }
        $$('[data-reveal]:not(.in)', root).forEach(n => revealObserver.observe(n));
    }

    function initHeader() {
        const header = $('#site-header');
        const links = $$('[data-nav]');
        const progress = $('#scroll-progress');
        let lastY = window.scrollY, ticking = false;
        const onScroll = () => {
            const y = window.scrollY;
            header.classList.toggle('scrolled', y > 20);
            header.classList.toggle('hide', y > lastY + 2 && y > 400 && !document.body.classList.contains('menu-open'));
            if (y < lastY - 2) header.classList.remove('hide');
            lastY = y;
            const h = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
            updateTimelineFill();
            if (y < window.innerHeight * 0.5) links.forEach(l => l.classList.remove('active'));
            ticking = false;
        };
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
        window.addEventListener('resize', updateTimelineFill);
        onScroll();

        // Highlight the nav link of the section in view.
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id]').forEach(s => spy.observe(s));
    }

    function initMenu() {
        const btn = $('#menu-toggle'), menu = $('#mobile-menu');
        const set = (open) => {
            document.body.classList.toggle('menu-open', open);
            btn.setAttribute('aria-expanded', open);
            btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            menu.setAttribute('aria-hidden', !open);
        };
        btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
        $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
        window.addEventListener('resize', () => { if (window.innerWidth > 860) set(false); });
    }

    function initTheme() {
        const toggle = $('#theme-toggle');
        const meta = $('meta[name="theme-color"]');
        const sync = () => { meta.content = document.body.classList.contains('light-mode') ? '#ffffff' : '#000000'; };
        sync();
        toggle.addEventListener('click', () => {
            const flip = () => {
                const light = document.body.classList.toggle('light-mode');
                try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (err) { /* storage blocked */ }
                sync();
            };
            if (!document.startViewTransition || reduceMotion) return flip();
            // Circular reveal of the new theme, expanding from the toggle.
            const r = toggle.getBoundingClientRect();
            const root = document.documentElement;
            root.style.setProperty('--vt-x', (r.left + r.width / 2) + 'px');
            root.style.setProperty('--vt-y', (r.top + r.height / 2) + 'px');
            root.classList.add('theme-vt');
            document.startViewTransition(flip).finished.finally(() => root.classList.remove('theme-vt'));
        });
    }

    function initGlobal() {
        $('#year').textContent = new Date().getFullYear();
        $('#footer-name').textContent = d.name;
        if (d.resume && d.resume.url) $$('.resume-link').forEach(a => { a.href = d.resume.url; });

        $('#projects-more').addEventListener('click', () => { showAll = true; renderProjects(true); });
        $$('[data-close]').forEach(n => n.addEventListener('click', closeModal));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initGlobal();
        renderHero();
        renderMarquee();
        renderAbout();
        renderExperience();
        renderFilters();
        renderProjects(false);
        renderSkills();
        renderEducation();
        renderContact();
        initHeader();
        initMenu();
        initTheme();
        initMagnetic();
        observeReveals();
    });
})();
