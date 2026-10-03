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
    const pad = (n, w = 2) => String(n).padStart(w, '0');

    // "• a<br>• b" -> ["a", "b"] (keeps inline <strong> markup)
    const bullets = html => html.split(/<br\s*\/?>/i)
        .map(s => s.trim().replace(/^•\s*/, ''))
        .filter(Boolean);

    const ICONS = {
        github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M3 5.5h18v13H3z M3 6l9 7 9-7"/></svg>',
        file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M6 2.5h8l4 4v15H6z M14 2.5v4h4 M9 12h6 M9 16h6"/></svg>',
    };

    // --------------------------------------------------------------- toast
    let toastTimer;
    function toast(msg) {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
    }

    // ---------------------------------------------------------------- hero
    function packCard(p, i, small) {
        return el('figure', { class: 'pack' + (small ? ' pack-sm' : '') }, [
            el('div', { class: 'pack-frame' }, [
                el('img', { src: p.image, alt: '', loading: small ? 'eager' : 'lazy' }),
            ]),
            el('figcaption', {}, [
                el('span', { text: `/${pad(i + 1, 3)}` }),
                el('span', { text: p.title }),
            ]),
        ]);
    }

    function renderHero() {
        const strip = $('#hero-strip');
        const picks = d.projects.filter(p => p.image).slice(0, 4);
        const track = el('div', { class: 'strip-track' });
        // Doubled so the strip can loop seamlessly; the copy is hidden from assistive tech.
        [...picks, ...picks].forEach((p, k) => {
            const card = packCard(p, k % picks.length, true);
            if (k >= picks.length) card.setAttribute('aria-hidden', 'true');
            else {
                card.tabIndex = 0;
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', `${p.title}: open details`);
                card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(p); } });
            }
            card.addEventListener('click', () => openProject(p));
            track.appendChild(card);
        });
        strip.appendChild(track);

        // Gentle parallax on the hero photo.
        const bg = $('.hero-bg-img');
        if (bg && finePointer && !reduceMotion) {
            $('#hero').addEventListener('pointermove', (e) => {
                bg.style.setProperty('--px', ((e.clientX / innerWidth - 0.5) * -24).toFixed(1) + 'px');
                bg.style.setProperty('--py', ((e.clientY / innerHeight - 0.5) * -16).toFixed(1) + 'px');
            });
        }

        const social = $('#hero-social');
        const links = [
            d.social && d.social.github && { href: d.social.github, label: 'GitHub', icon: ICONS.github, ext: true },
            d.contact && d.contact.email && { href: `mailto:${d.contact.email}`, label: 'Email', icon: ICONS.mail },
            d.resume && d.resume.url && { href: d.resume.url, label: 'Resume', icon: ICONS.file, ext: true },
        ].filter(Boolean);
        links.forEach(l => social.appendChild(el('li', {}, [
            el('a', { href: l.href, 'aria-label': l.label, title: l.label, html: l.icon, target: l.ext ? '_blank' : null, rel: l.ext ? 'noopener' : null }),
        ])));

        startRotator();
    }

    function startRotator() {
        const node = $('#hero-rotator');
        const words = (d.rotatingRoles || []).map(w => w.toLowerCase());
        if (!node || words.length < 2) return;
        node.textContent = words[0];
        if (reduceMotion) return;
        let i = 0;
        setInterval(() => {
            i = (i + 1) % words.length;
            node.classList.add('out');
            setTimeout(() => {
                node.textContent = words[i];
                if (window.animateHackerText) window.animateHackerText(node, words[i], 500, 0);
                node.classList.remove('out');
            }, 250);
        }, 2800);
    }

    // --------------------------------------------------------------- about
    function renderAbout() {
        const internships = (d.experience || []).length;
        $('#about-lead').textContent = `With ${internships} AI internships under my belt,`;
        $('#about-rest').textContent = 'I craft — memorable, intelligent systems: real-time voice agents, OCR pipelines and vision models that run on factory floors.';

        const stats = $('#about-stats');
        (d.stats || []).forEach(s => {
            stats.appendChild(el('div', { class: 'stat' }, [
                el('dd', {}, [el('span', { class: 'count', 'data-to': s.value, 'data-dec': s.decimals || 0, text: '0' }), s.suffix || '']),
                el('dt', { text: s.label }),
            ]));
        });

        const paras = [
            d.objective,
            `Open to collaborating on machine learning, agentic systems and vision AI. Off the clock, you'll find me deep in ${(d.interests || []).join(', ').toLowerCase()}.`,
        ];
        const wrap = $('#quote-paras');
        paras.forEach((t, i) => wrap.appendChild(el('p', { 'data-reveal': '', style: `--i:${i}` }, [
            el('span', { class: 'circled', text: String(i + 1) }), t,
        ])));
        $('#sig-role').textContent = d.status || '';
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

    // ---------------------------------------------------------- experience
    const XP_IMAGES = ['assets/images/avatar_66.png', 'assets/images/avatar_22.png', 'assets/images/avatar_11.png'];

    function renderExperience() {
        const list = $('#experience-list');
        (d.experience || []).forEach((exp, i) => {
            const blocks = exp.description.split(/<br\s*\/?>\s*<br\s*\/?>/i).map(b => {
                const lines = b.split(/<br\s*\/?>/i);
                const head = lines.shift();
                const m = head.match(/<strong>(.*?)<\/strong>\s*(?:\((.*?)\))?/i);
                return { title: m ? m[1] : stripTags(head), when: m && m[2], items: bullets(lines.join('<br>')) };
            });
            const year = (exp.timeline.match(/\d{4}/) || [''])[0];

            const card = el('article', { class: 'xp-card', 'data-reveal': '', style: `--i:${i}` }, [
                el('div', { class: 'xp-top' }, [
                    el('span', { class: 'plus', text: '+' }),
                    el('div', { class: 'pills' }, [
                        el('span', { class: 'pill', text: String(i + 1) }),
                        el('span', { class: 'pill', text: year }),
                        el('span', { class: 'pill', text: exp.location.split(',')[0] }),
                    ]),
                ]),
                el('div', { class: 'xp-body' }, [
                    el('figure', { class: 'xp-photo' }, [
                        el('img', { src: XP_IMAGES[i % XP_IMAGES.length], alt: '', loading: 'lazy' }),
                    ]),
                    el('div', { class: 'xp-info' }, [
                        el('p', { class: 'xp-when', text: exp.timeline }),
                        ...blocks.map(b => {
                            const LIMIT = 2;
                            const ul = el('ul', { class: 'xp-list' }, b.items.map((it, k) => el('li', { html: it, class: k >= LIMIT ? 'extra' : null })));
                            const label = `+ ${b.items.length - LIMIT} more`;
                            const more = b.items.length > LIMIT ? el('button', {
                                class: 'link-btn', 'aria-expanded': 'false', text: label,
                                onclick: (e) => {
                                    const open = ul.classList.toggle('expanded');
                                    e.currentTarget.setAttribute('aria-expanded', open);
                                    e.currentTarget.textContent = open ? '– Show less' : label;
                                }
                            }) : null;
                            return el('div', { class: 'xp-project' }, [el('h4', { text: b.title }), ul, more]);
                        }),
                    ]),
                ]),
                el('div', { class: 'xp-foot' }, [
                    el('div', {}, [
                        el('h3', { class: 'xp-company', text: exp.company }),
                        el('p', { class: 'xp-role', text: `/ ${exp.role}` }),
                    ]),
                    el('span', { class: 'xp-num', text: `/${pad(i + 1)}` }),
                ]),
            ]);
            list.appendChild(card);
        });
    }

    // ------------------------------------------------------------ projects
    const PREVIEW_COUNT = 6;
    const selectedCats = new Set(); // empty = every category
    let showAll = false;

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
        const list = $('#project-filters');
        const btn = $('#filter-toggle'), panel = $('#filter-panel'), badge = $('#filter-count');
        const cats = Object.entries(d.projectCategories || {}).filter(([k]) => d.projects.some(p => p.category === k));

        const sync = () => {
            badge.hidden = !selectedCats.size;
            badge.textContent = selectedCats.size;
            btn.classList.toggle('has-filter', selectedCats.size > 0);
            renderProjects(true);
        };
        cats.forEach(([key, label]) => {
            const count = d.projects.filter(p => p.category === key).length;
            const box = el('input', {
                type: 'checkbox', value: key,
                onchange: (e) => { e.target.checked ? selectedCats.add(key) : selectedCats.delete(key); sync(); },
            });
            list.appendChild(el('label', { class: 'fp-item' }, [box, el('span', { text: label }), el('sup', { text: count })]));
        });
        $('#filter-clear').addEventListener('click', () => {
            selectedCats.clear();
            $$('input', list).forEach(b => { b.checked = false; });
            sync();
        });

        const setOpen = (open) => {
            panel.hidden = !open;
            btn.setAttribute('aria-expanded', open);
            btn.classList.toggle('open', open);
            if (open) $('input', list).focus({ preventScroll: true });
        };
        btn.addEventListener('click', () => setOpen(panel.hidden));
        document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('.filter-wrap')) setOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
    }

    function renderProjects(animate) {
        if (animate) finishProjectIntro();
        const grid = $('#project-grid');
        const more = $('#projects-more');
        const filtering = selectedCats.size > 0;
        const all = d.projects.map((p, i) => ({ p, i })).filter(({ p }) => !filtering || selectedCats.has(p.category));
        const visible = !filtering && !showAll ? all.slice(0, PREVIEW_COUNT) : all;

        const draw = () => {
            grid.replaceChildren(...visible.map(({ p, i }, k) => projectCell(p, i, k, animate)));
            more.hidden = !(!filtering && !showAll && all.length > PREVIEW_COUNT);
            $('span', more).textContent = `Show all ${all.length} projects`;
            observeReveals(grid);
        };
        if (animate && document.startViewTransition && !reduceMotion) document.startViewTransition(draw);
        else draw();
    }

    function projectCell(p, i, k, instant) {
        const cat = (d.projectCategories || {})[p.category] || '';
        const cell = el('article', {
            class: 'pack-cell' + (instant ? ' in' : ''), tabindex: '0', 'data-reveal': '',
            style: `--i:${k % 3}; view-transition-name: pc-${i}`,
            'aria-label': `${p.title}: open details`,
            onclick: () => openProject(p),
            onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(p); } },
        }, [
            el('div', { class: 'pc-stage' }, [
                el('span', { class: 'pc-num', text: `/${pad(i + 1, 3)}` }),
                p.iframeDemo ? el('button', {
                    class: 'pc-live', 'aria-label': `Open ${p.title} live demo`,
                    html: '<i class="dot"></i>Live demo',
                    onclick: (e) => { e.stopPropagation(); openDemo(p); },
                    onkeydown: (e) => e.stopPropagation(),
                }) : null,
                el('div', { class: 'pack-frame' }, [el('img', { src: p.image, alt: '', loading: 'lazy' })]),
                el('h3', { class: 'pc-title', text: p.title }),
                el('i', { class: 'dot pc-dl' }), el('i', { class: 'dot pc-dr' }),
            ]),
            el('div', { class: 'pc-foot' }, [
                el('span', { text: cat }),
                el('span', { text: `(${(p.tech || [])[0] || ''})` }),
            ]),
        ]);
        return cell;
    }

    // ------------------------------------------------------- project intro
    // On first view: one pack pops in, the rest fan out diagonally from
    // behind it ("PROJECT SQUAD"), then every pack flies into its grid cell.
    let introState = 'idle'; // idle | pending | playing | done
    let introLayer = null;

    function setupProjectIntro() {
        const grid = $('#project-grid');
        if (reduceMotion || !('IntersectionObserver' in window) || !Element.prototype.animate) { introState = 'done'; return; }
        introState = 'pending';
        grid.classList.add('intro-pending');
        const io = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            if (introState === 'pending') playProjectIntro();
        }, { rootMargin: '0px 0px -62% 0px' });
        io.observe(grid);
    }

    function finishProjectIntro() {
        if (introState === 'done') return;
        introState = 'done';
        $('#project-grid').classList.remove('intro-pending');
        if (introLayer) {
            const layer = introLayer;
            introLayer = null;
            layer.getAnimations({ subtree: true }).forEach(a => a.cancel());
            layer.remove();
        }
    }

    async function playProjectIntro() {
        introState = 'playing';
        const section = $('#projects'), grid = $('#project-grid');
        const frames = $$('.pack-cell .pack-frame', grid);
        if (!frames.length) return finishProjectIntro();

        const sr = section.getBoundingClientRect();
        const gr = grid.getBoundingClientRect();
        const headerH = $('#site-header').offsetHeight;
        // Stage = the part of the grid currently on screen.
        const top = Math.max(gr.top, headerH + 10);
        const bottom = Math.min(gr.bottom, window.innerHeight);
        const W = gr.width, H = Math.max(bottom - top, 260);
        const small = W < 700;

        const layer = el('div', { class: 'intro-layer', 'aria-hidden': 'true' });
        const word = el('div', {
            class: 'intro-word',
            style: `left:${gr.left - sr.left}px; top:${top - sr.top + 12}px;`,
            html: '<span>PROJECT</span><span>SQUAD</span>',
        });
        layer.appendChild(word);
        const cards = frames.map((f, i) => {
            const r = f.getBoundingClientRect();
            const card = el('div', {
                class: 'intro-card',
                style: `left:${r.left - sr.left}px; top:${r.top - sr.top}px; width:${r.width}px; height:${r.height}px; z-index:${frames.length - i};`,
            }, [el('img', { src: $('img', f).src, alt: '' })]);
            layer.appendChild(card);
            return { card, cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
        });
        introLayer = layer;
        section.appendChild(layer);

        const n = cards.length;
        const s2 = small ? 0.55 : 0.72;
        const ch = cards[0].h * s2;
        const center = { x: gr.left + W / 2, y: top + H / 2 };
        const spanX = Math.min(W * (small ? 0.62 : 0.74), n * cards[0].w * s2 * 1.05);
        const spanY = Math.max(H - ch - 40, 0);
        const diag = i => n === 1 ? center : {
            x: center.x - spanX / 2 + spanX * i / (n - 1),
            y: top + 20 + ch / 2 + spanY * i / (n - 1),
        };
        const tf = (c, pt, sc) => `translate(${(pt.x - c.cx).toFixed(1)}px, ${(pt.y - c.cy).toFixed(1)}px) scale(${sc})`;
        const wait = ms => new Promise(r => setTimeout(r, ms));
        const alive = () => introLayer === layer;
        const ease = 'cubic-bezier(.2,.7,0,1)';

        // Everything starts stacked behind the first pack.
        cards.forEach((c, i) => { c.card.style.transform = tf(c, center, i ? 0.92 : 1.02); c.card.style.opacity = i ? 0 : 1; });

        // 1. A single pack pops in.
        await cards[0].card.animate([
            { transform: tf(cards[0], center, 0.6), opacity: 0 },
            { transform: tf(cards[0], center, 1.02), opacity: 1 },
        ], { duration: 700, easing: ease, fill: 'both' }).finished.catch(() => { });
        await wait(550);
        if (!alive()) return;

        // 2. The squad fans out diagonally from behind it.
        word.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'none' }],
            { duration: 700, easing: ease, fill: 'both' });
        await Promise.all(cards.map((c, i) => c.card.animate([
            { transform: tf(c, center, i ? 0.92 : 1.02), opacity: i ? 0 : 1 },
            { transform: tf(c, diag(i), s2), opacity: 1 },
        ], { duration: 850, delay: i * 70, easing: ease, fill: 'both' }).finished)).catch(() => { });
        await wait(900);
        if (!alive()) return;

        // 3. Each pack flies into its own grid cell.
        word.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'both' });
        await Promise.all(cards.map((c, i) => c.card.animate([
            { transform: tf(c, diag(i), s2) },
            { transform: 'none' },
        ], { duration: 900, delay: i * 60, easing: ease, fill: 'both' }).finished)).catch(() => { });
        if (!alive()) return;
        grid.classList.remove('intro-pending');
        await wait(450);
        finishProjectIntro();
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
        setTimeout(() => { modal.hidden = true; $('#modal-body').replaceChildren(); }, reduceMotion ? 0 : 300);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    function openProject(p) {
        const { github, live } = projectLinks(p);
        const idx = d.projects.indexOf(p);
        const cat = (d.projectCategories || {})[p.category] || '';
        openModal(el('div', { class: 'wd' }, [
            el('div', { class: 'rail' }, [
                el('span', { html: `<i class="dot"></i>©${pad(idx + 1)}` }),
                el('span', { html: '<i class="dot"></i>(Work Detail)' }),
                el('span', { text: cat }),
            ]),
            el('div', { class: 'wd-head' }, [
                el('h3', { class: 'display wd-title', id: 'modal-title', text: p.title }),
                el('div', { class: 'pills' }, [
                    el('span', { class: 'pill', text: String(idx + 1) }),
                    ...(p.tech || []).slice(0, 3).map(t => el('span', { class: 'pill', text: t })),
                ]),
            ]),
            el('div', { class: 'wd-grid' }, [
                el('div', { class: 'wd-media' }, [
                    el('div', { class: 'pack-frame' }, [el('img', { src: p.image, alt: '' })]),
                    el('span', { class: 'display wd-num', text: `/${pad(idx + 1)}` }),
                ]),
                el('div', { class: 'wd-copy' }, [
                    el('p', { class: 'wd-tagline', html: `<i class="dot"></i>${tagline(p)}` }),
                    el('ul', { class: 'wd-list' }, bullets(p.summary).map(b => el('li', { html: b }))),
                    el('p', { class: 'cr-label', html: '<i class="dot"></i>(Stack)' }),
                    el('div', { class: 'pills' }, (p.tech || []).map(t => el('span', { class: 'pill', text: t }))),
                    el('div', { class: 'wd-actions' }, [
                        p.iframeDemo ? el('button', { class: 'btn-arrow', html: '<span>Try it live</span><i aria-hidden="true">→</i>', onclick: () => openDemo(p) }) : null,
                        live ? el('a', { class: 'btn-arrow ghost', href: live, target: '_blank', rel: 'noopener', html: '<span>Live site</span><i aria-hidden="true">↗</i>' }) : null,
                        github ? el('a', { class: 'btn-arrow ghost', href: github, target: '_blank', rel: 'noopener', html: '<span>GitHub</span><i aria-hidden="true">↗</i>' }) : null,
                    ]),
                ]),
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
            ['languages', 'Languages'],
            ['ai_ml', 'ML & Computer Vision'],
            ['genai_nlp', 'GenAI, NLP & Vector DBs'],
            ['agentic_ai', 'Agentic AI'],
            ['tools', 'Tools & Platforms'],
        ];
        groups.forEach(([key, label], i) => {
            const items = d.skills[key] || [];
            grid.appendChild(el('div', { class: 'spec-row', 'data-reveal': '', style: `--i:${i % 3}` }, [
                el('span', { class: 'spec-num', text: `/${pad(i + 1, 3)}` }),
                el('h3', { class: 'spec-label', text: label }),
                el('div', { class: 'pills' }, items.map(s => el('span', { class: 'pill', text: s }))),
                el('i', { class: 'dot end' }),
            ]));
        });
    }

    // ----------------------------------------------------------- education
    function renderEducation() {
        const list = $('#education-list');
        (d.education || []).forEach((e, i) => {
            list.appendChild(el('li', { 'data-reveal': '' }, [
                el('span', { class: 'aw-num', text: `/${pad(i + 1, 3)}` }),
                el('span', { class: 'aw-text' }, [
                    `${e.degree} – ${e.institution} `,
                    el('span', { class: 'muted', text: `(${e.timeline})` }),
                ]),
                el('span', { class: 'aw-score', text: e.gpa }),
            ]));
        });
        const certs = $('#certs-list');
        (d.certifications || []).concat(d.extracurricular || []).forEach((c, i) => {
            const [issuer, name] = c.includes(':') ? c.split(/:\s*/) : ['', c];
            certs.appendChild(el('li', { 'data-reveal': '' }, [
                el('span', { class: 'aw-num', text: `/${pad(i + 1, 3)}` }),
                el('span', { class: 'aw-text' }, [name + ' ', issuer ? el('span', { class: 'muted', text: `(${issuer})` }) : null]),
            ]));
        });
    }

    // ------------------------------------------------------------- contact
    function renderContact() {
        const c = d.contact || {}, s = d.social || {};
        $$('[data-email]').forEach(a => {
            a.href = `mailto:${c.email}`;
            if (!a.textContent.trim()) a.textContent = c.email;
        });
        $$('[data-phone]').forEach(a => { a.href = `tel:${(c.phone || '').replace(/\s/g, '')}`; a.textContent = c.phone; });
        $$('[data-github]').forEach(a => { a.href = s.github; });

        const follow = $('#follow-list');
        [
            s.github && ['GitHub', s.github],
            s.linkedin && ['LinkedIn', s.linkedin],
            d.resume && d.resume.url && ['Resume (PDF)', d.resume.url],
            c.email && ['Email', `mailto:${c.email}`],
        ].filter(Boolean).forEach(([label, href]) => follow.appendChild(el('li', {}, [
            el('a', { href, target: href.startsWith('mailto') ? null : '_blank', rel: 'noopener', text: label }),
        ])));

        $('#contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            const subject = `Portfolio enquiry from ${f.get('name')}`;
            const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
            window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            toast('Opening your email app…');
        });
    }

    // --------------------------------------------------------- interaction
    function initClock() {
        const nodes = $$('[data-clock]');
        const fmt = (secs) => new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', second: secs ? '2-digit' : undefined, hour12: false, timeZone: d.timezone || 'Asia/Kolkata',
        });
        const long = fmt(true), short = fmt(false);
        const tick = () => {
            const now = new Date();
            nodes.forEach(n => { n.textContent = (n.closest('.site-header') ? long : short).format(now); });
        };
        tick();
        setInterval(tick, 1000);
    }

    let revealObserver;
    function observeReveals(root = document) {
        if (!revealObserver) {
            revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                    $$('.count', entry.target).forEach(countUp);
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        }
        $$('[data-reveal]:not(.in), [data-lines]:not(.in)', root).forEach(n => revealObserver.observe(n));
    }

    function initScroll() {
        const header = $('#site-header');
        const hero = $('#hero');
        const drift = $$('[data-drift]');
        let ticking = false;
        const onScroll = () => {
            const y = window.scrollY;
            header.classList.toggle('past-hero', y > hero.offsetHeight * 0.35);
            if (!reduceMotion) {
                drift.forEach(n => {
                    const r = n.getBoundingClientRect();
                    const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
                    n.style.transform = `translateX(${((0.5 - p) * 18).toFixed(2)}vw)`;
                });
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
        onScroll();
    }

    function initMenu() {
        const btn = $('#menu-toggle'), menu = $('#menu');
        const set = (open) => {
            document.body.classList.toggle('menu-open', open);
            btn.setAttribute('aria-expanded', open);
            $('.menu-label', btn).textContent = open ? 'Close' : 'Menu';
            menu.setAttribute('aria-hidden', !open);
        };
        btn.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
        $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    }

    function initMagnetic() {
        if (!finePointer || reduceMotion) return;
        $$('.btn-arrow, .round-btn, .menu-btn').forEach(b => {
            b.addEventListener('pointermove', (e) => {
                const r = b.getBoundingClientRect();
                b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
            });
            b.addEventListener('pointerleave', () => { b.style.transform = ''; });
        });
    }

    function initGlobal() {
        $('#year').textContent = new Date().getFullYear();
        if (d.resume && d.resume.url) $$('.resume-link').forEach(a => { a.href = d.resume.url; });
        $('#projects-more').addEventListener('click', () => { showAll = true; renderProjects(true); });
        $$('[data-close]').forEach(n => n.addEventListener('click', closeModal));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
        initPreloader(() => document.body.classList.add('loaded'));
    }

    // Intro loader: counts to 100% (tracking real page load), then wipes away.
    function initPreloader(done) {
        const root = document.documentElement, pre = $('#preloader');
        if (!pre || !root.classList.contains('preloading')) {
            if (pre) pre.remove();
            requestAnimationFrame(done);
            return;
        }
        const pct = $('#pl-pct'), bar = $('#pl-bar');
        const MIN_MS = 2200, start = performance.now();
        let pageReady = document.readyState === 'complete', shown = 0;
        if (!pageReady) window.addEventListener('load', () => { pageReady = true; }, { once: true });
        // Never hold the visitor for long on a slow connection.
        setTimeout(() => { pageReady = true; }, 6000);

        (function tick(now) {
            const t = Math.min((now - start) / MIN_MS, 1);
            const target = pageReady ? 100 * (1 - Math.pow(1 - t, 3)) : Math.min(90, 100 * t * 0.9);
            shown += (target - shown) * 0.12;
            if (pageReady && t >= 1 && shown > 99.5) shown = 100;
            pct.textContent = Math.round(shown) + '%';
            bar.style.transform = `scaleX(${shown / 100})`;
            if (shown < 100) return requestAnimationFrame(tick);

            try { sessionStorage.setItem('introSeen', '1'); } catch (e) { /* storage blocked */ }
            root.classList.add('pl-done');
            setTimeout(() => { root.classList.remove('preloading'); done(); }, 650);
            setTimeout(() => pre.remove(), 1500);
        })(start);
    }

    document.addEventListener('DOMContentLoaded', () => {
        initGlobal();
        renderHero();
        renderAbout();
        renderExperience();
        renderFilters();
        renderProjects(false);
        setupProjectIntro();
        renderSkills();
        renderEducation();
        renderContact();
        initClock();
        initScroll();
        initMenu();
        initMagnetic();
        observeReveals();
    });
})();
