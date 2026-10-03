/**
 * Hero "Neural Morph" background.
 *
 * A 3D point cloud that slowly rotates and morphs between shapes
 * (latent sphere -> neural network -> DNA helix -> torus knot -> galaxy).
 * A signal pulse sweeps through each shape, the cursor pushes particles
 * away, and clicking the hero bursts the cloud into the next shape.
 */
(function () {
    'use strict';

    const hero = document.querySelector('.hero');
    const canvas = document.getElementById('neural-canvas');
    if (!hero || !canvas) return;
    const ctx = canvas.getContext('2d');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmall = window.innerWidth < 700;
    const COUNT = isSmall ? 750 : 1600;
    const MORPH_MS = 2200;      // total morph duration (incl. stagger)
    const HOLD_MS = 6500;       // time a shape is held before auto-morphing
    const MOUSE_RADIUS = 140;   // px

    // ---------- Shape generators (unit-ish scale, centred on origin) ----------
    function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) * 0.8; }

    function sphere(n) {
        const pos = new Float32Array(n * 3), phase = new Float32Array(n);
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < n; i++) {
            const y = 1 - 2 * (i + 0.5) / n;
            const r = Math.sqrt(1 - y * y);
            const th = i * golden;
            pos[i * 3] = Math.cos(th) * r;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = Math.sin(th) * r;
            phase[i] = (y + 1) / 2;
        }
        return pos2(pos, phase);
    }

    function neuralNet(n) {
        const pos = new Float32Array(n * 3), phase = new Float32Array(n);
        const layers = [3, 6, 6, 4, 1];
        const nodes = [];
        layers.forEach((count, li) => {
            // Layers stacked vertically as horizontal rings, so the spin
            // around Y never hides the network structure.
            const y = 1.15 - 2.3 * li / (layers.length - 1);
            const ring = count === 1 ? 0 : Math.min(0.16 * count, 0.9);
            const layer = [];
            for (let k = 0; k < count; k++) {
                const a = (k / count) * Math.PI * 2 + li * 0.5;
                layer.push([Math.cos(a) * ring, y, Math.sin(a) * ring]);
            }
            nodes.push(layer);
        });
        const flatNodes = nodes.flat();
        const edges = [];
        for (let l = 0; l < nodes.length - 1; l++) {
            nodes[l].forEach(a => nodes[l + 1].forEach(b => edges.push([a, b])));
        }
        const nodeShare = Math.floor(n * 0.45);
        for (let i = 0; i < n; i++) {
            let x, y, z;
            if (i < nodeShare) {
                const p = flatNodes[i % flatNodes.length];
                x = p[0] + gauss() * 0.04; y = p[1] + gauss() * 0.04; z = p[2] + gauss() * 0.04;
            } else {
                const [a, b] = edges[(Math.random() * edges.length) | 0];
                const t = Math.random();
                x = a[0] + (b[0] - a[0]) * t;
                x += gauss() * 0.006;
                y = a[1] + (b[1] - a[1]) * t;
                z = a[2] + (b[2] - a[2]) * t + gauss() * 0.008;
            }
            pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
            phase[i] = (1.15 - y) / 2.3; // signal travels input (top) -> output (bottom)
        }
        return pos2(pos, phase);
    }

    function helix(n) {
        const pos = new Float32Array(n * 3), phase = new Float32Array(n);
        const turns = 2.5, rungs = 26, radius = 0.55;
        const strandAt = (s, strand) => {
            const a = s * turns * Math.PI * 2 + strand * Math.PI;
            return [Math.cos(a) * radius, -1.3 + 2.6 * s, Math.sin(a) * radius];
        };
        for (let i = 0; i < n; i++) {
            let p, s;
            if (i < n * 0.7) {
                s = Math.random();
                p = strandAt(s, i % 2);
                p[0] += gauss() * 0.025; p[1] += gauss() * 0.025; p[2] += gauss() * 0.025;
            } else {
                s = (((Math.random() * rungs) | 0) + 0.5) / rungs;
                const a = strandAt(s, 0), b = strandAt(s, 1), t = Math.random();
                p = [a[0] + (b[0] - a[0]) * t, a[1], a[2] + (b[2] - a[2]) * t];
            }
            pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2];
            phase[i] = s;
        }
        return pos2(pos, phase);
    }

    function torusKnot(n) {
        const pos = new Float32Array(n * 3), phase = new Float32Array(n);
        const p = 2, q = 3, scale = 0.36;
        for (let i = 0; i < n; i++) {
            const u = Math.random() * Math.PI * 2;
            const r = Math.cos(q * u) + 2;
            pos[i * 3] = (r * Math.cos(p * u) + gauss() * 0.12) * scale;
            pos[i * 3 + 1] = (r * Math.sin(p * u) + gauss() * 0.12) * scale;
            pos[i * 3 + 2] = (-Math.sin(q * u) + gauss() * 0.12) * scale;
            phase[i] = u / (Math.PI * 2);
        }
        return pos2(pos, phase);
    }

    function galaxy(n) {
        const pos = new Float32Array(n * 3), phase = new Float32Array(n);
        const arms = 3;
        for (let i = 0; i < n; i++) {
            let x, y, z, r;
            if (i < n * 0.15) {
                r = Math.abs(gauss()) * 0.2;
                x = gauss() * 0.15; y = gauss() * 0.1; z = gauss() * 0.15;
            } else {
                r = Math.pow(Math.random(), 0.6) * 1.1;
                const a = (i % arms) * (Math.PI * 2 / arms) + r * 3.8 + gauss() * 0.3 * (1.2 - r);
                x = Math.cos(a) * r;
                z = Math.sin(a) * r;
                y = gauss() * 0.07 * (1.25 - r);
            }
            pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
            phase[i] = r / 1.1;
        }
        return pos2(pos, phase);
    }

    function pos2(pos, phase) { return { pos, phase }; }

    const SHAPES = [
        { name: 'LATENT_SPACE', build: sphere, tilt: 0 },
        { name: 'NEURAL_NETWORK', build: neuralNet, tilt: 0.35 },
        { name: 'DOUBLE_HELIX', build: helix, tilt: 0.25 },
        { name: 'TORUS_KNOT', build: torusKnot, tilt: 0 },
        { name: 'SPIRAL_GALAXY', build: galaxy, tilt: 0.45 },
    ].map(s => Object.assign(s, s.build(COUNT)));

    // ---------- Particle state ----------
    const from = new Float32Array(COUNT * 3);
    const fromPhase = new Float32Array(COUNT);
    const cur = new Float32Array(COUNT * 3);
    const curPhase = new Float32Array(COUNT);
    const delay = new Float32Array(COUNT);    // morph stagger 0..1
    const scatter = new Float32Array(COUNT * 3); // mid-morph flight direction
    const seed = new Float32Array(COUNT);
    const hot = new Uint8Array(COUNT);        // permanently brand coloured
    const sx = new Float32Array(COUNT), sy = new Float32Array(COUNT);    // projected pos
    const dx = new Float32Array(COUNT), dy = new Float32Array(COUNT);    // screen displacement
    const vx = new Float32Array(COUNT), vy = new Float32Array(COUNT);    // displacement velocity

    for (let i = 0; i < COUNT; i++) {
        seed[i] = Math.random();
        hot[i] = Math.random() < 0.05 ? 1 : 0; // mostly monochrome, a few brand sparks
        let a = gauss(), b = gauss(), c = gauss();
        const len = Math.hypot(a, b, c) || 1;
        scatter[i * 3] = a / len; scatter[i * 3 + 1] = b / len; scatter[i * 3 + 2] = c / len;
    }

    let shapeIndex = 0;
    let morphStart = -Infinity;
    let lastSwitch = 0;
    cur.set(SHAPES[0].pos);
    curPhase.set(SHAPES[0].phase);

    let rotY = 0, rotX = 0, tilt = 0;
    let targetRotX = 0, targetRotYOff = 0, rotYOff = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    // ---------- HUD ----------
    const hudIndex = document.getElementById('hud-index');
    const hudName = document.getElementById('hud-name');
    function updateHud() {
        if (hudIndex) hudIndex.textContent = String(shapeIndex + 1).padStart(2, '0') + ' / ' + String(SHAPES.length).padStart(2, '0');
        if (!hudName) return;
        const name = SHAPES[shapeIndex].name;
        if (window.animateHackerText && !reduceMotion) window.animateHackerText(hudName, name, 700, 0);
        else hudName.textContent = name;
    }

    function morphTo(index, now) {
        from.set(cur);
        fromPhase.set(curPhase);
        for (let i = 0; i < COUNT; i++) delay[i] = Math.random();
        shapeIndex = index;
        morphStart = now;
        lastSwitch = now;
        updateHud();
    }

    // ---------- Sprites (pre-rendered glows; far cheaper than arcs) ----------
    let sprites = null, isLight = null;
    function makeSprite(color, light) {
        const s = document.createElement('canvas');
        s.width = s.height = 64;
        const g = s.getContext('2d');
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, color);
        grad.addColorStop(light ? 0.35 : 0.18, color);
        grad.addColorStop(light ? 0.5 : 0.45, hexA(color, light ? 0.35 : 0.22));
        grad.addColorStop(1, hexA(color, 0));
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return s;
    }
    function hexA(hex, a) {
        const h = hex.replace('#', '');
        const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    }
    function refreshTheme() {
        const light = document.body.classList.contains('light-mode');
        if (light === isLight) return;
        isLight = light;
        const brand = (getComputedStyle(document.body).getPropertyValue('--brand') || '#FE3D00').trim();
        sprites = {
            neutral: makeSprite(light ? '#1a1a1a' : '#e8e8e8', light),
            brand: makeSprite(brand.startsWith('#') ? brand : '#FE3D00', light),
        };
        dirty = true;
    }

    // ---------- Layout ----------
    let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0, layerAlpha = 1;
    function resize() {
        const rect = hero.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = rect.width; H = rect.height;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        const anchor = document.querySelector('.hero-visual');
        const a = anchor && anchor.getBoundingClientRect();
        if (a && a.width > 0 && a.height > 120) {
            // Sit in the hero's dedicated visual slot.
            cx = a.left - rect.left + a.width / 2;
            cy = a.top - rect.top + a.height / 2;
            R = Math.min(a.width, a.height) * 0.42;
            layerAlpha = W > 900 ? 1 : 0.85;
        } else {
            // Behind the text on small screens, dimmed for readability.
            cx = W * 0.5;
            cy = H * 0.55;
            R = Math.min(W, H) * 0.36;
            layerAlpha = 0.4;
        }
        dirty = true;
    }

    // ---------- Input ----------
    hero.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
        targetRotX = (mouse.y / H - 0.5) * 0.6;
        targetRotYOff = (mouse.x / W - 0.5) * 0.9;
        dirty = true;
    });
    hero.addEventListener('pointerleave', () => {
        mouse.active = false;
        targetRotX = 0; targetRotYOff = 0;
    });
    hero.addEventListener('click', (e) => {
        if (e.target.closest('a, button, input, textarea, .hero-side')) return;
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left, py = e.clientY - rect.top;
        if (!reduceMotion) {
            for (let i = 0; i < COUNT; i++) {
                const ox = sx[i] - px, oy = sy[i] - py;
                const d = Math.hypot(ox, oy) || 1;
                const f = 26 * Math.max(0, 1 - d / 420) + 4;
                vx[i] += ox / d * f * (0.5 + seed[i]);
                vy[i] += oy / d * f * (0.5 + seed[i]);
            }
        }
        morphTo((shapeIndex + 1) % SHAPES.length, performance.now());
    });

    // ---------- Render loop ----------
    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let onScreen = true, tabVisible = true, dirty = true, last = performance.now();

    function frame(now) {
        requestAnimationFrame(frame);
        const dt = Math.min(now - last, 50) / 16.67;
        last = now;
        if (!onScreen || !tabVisible) return;
        refreshTheme();

        const morphing = now - morphStart < MORPH_MS;
        if (reduceMotion && !morphing && !dirty) return;
        dirty = false;

        if (!reduceMotion && !morphing && now - lastSwitch > HOLD_MS) {
            morphTo((shapeIndex + 1) % SHAPES.length, now);
        }

        // Rotation: slow spin + mouse parallax.
        if (!reduceMotion) rotY += 0.0028 * dt;
        rotX += (targetRotX - rotX) * 0.05 * dt;
        rotYOff += (targetRotYOff - rotYOff) * 0.05 * dt;
        tilt += (SHAPES[shapeIndex].tilt - tilt) * 0.03 * dt;
        const ay = rotY + rotYOff, ax = rotX + tilt;
        const cosY = Math.cos(ay), sinY = Math.sin(ay);
        const cosX = Math.cos(ax), sinX = Math.sin(ax);

        const target = SHAPES[shapeIndex];
        const elapsed = reduceMotion ? MORPH_MS : now - morphStart;
        const t = now * 0.001;
        const camD = 3.4;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;
            let x, y, z;

            // Morph: staggered ease from -> target with an outward "breath" mid-flight.
            const local = Math.min(Math.max((elapsed - delay[i] * 700) / 1500, 0), 1);
            if (local < 1) {
                const e = ease(local);
                const lift = Math.sin(Math.PI * local) * 0.45;
                x = from[i3] + (target.pos[i3] - from[i3]) * e + scatter[i3] * lift;
                y = from[i3 + 1] + (target.pos[i3 + 1] - from[i3 + 1]) * e + scatter[i3 + 1] * lift;
                z = from[i3 + 2] + (target.pos[i3 + 2] - from[i3 + 2]) * e + scatter[i3 + 2] * lift;
                curPhase[i] = fromPhase[i] + (target.phase[i] - fromPhase[i]) * e;
            } else {
                x = target.pos[i3]; y = target.pos[i3 + 1]; z = target.pos[i3 + 2];
                curPhase[i] = target.phase[i];
            }
            cur[i3] = x; cur[i3 + 1] = y; cur[i3 + 2] = z;

            // Idle "breathing" wobble.
            if (!reduceMotion) {
                const w = seed[i] * 6.283;
                x += Math.sin(t * 0.9 + w) * 0.012;
                y += Math.cos(t * 1.1 + w) * 0.012;
                z += Math.sin(t * 0.7 + w * 2) * 0.012;
            }

            // Rotate (Y then X) and project.
            const rx = x * cosY - z * sinY;
            const rz0 = x * sinY + z * cosY;
            const ry = y * cosX - rz0 * sinX;
            const rz = y * sinX + rz0 * cosX;
            const persp = camD / (camD - rz);
            let px = cx + rx * R * persp;
            let py = cy + ry * R * persp;

            // Screen-space spring displacement (mouse repulsion + click burst).
            if (mouse.active && !reduceMotion) {
                const mx = px + dx[i] - mouse.x, my = py + dy[i] - mouse.y;
                const d2 = mx * mx + my * my;
                if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
                    const d = Math.sqrt(d2) || 1;
                    const f = (1 - d / MOUSE_RADIUS) * 1.6;
                    vx[i] += mx / d * f * dt;
                    vy[i] += my / d * f * dt;
                }
            }
            vx[i] += -dx[i] * 0.045 * dt; vy[i] += -dy[i] * 0.045 * dt;
            vx[i] *= 0.86; vy[i] *= 0.86;
            dx[i] += vx[i] * dt; dy[i] += vy[i] * dt;
            px += dx[i]; py += dy[i];
            sx[i] = px; sy[i] = py;

            // Signal pulse sweeping along the shape + random synapse sparks.
            let pulse = 0;
            if (!reduceMotion) {
                const wave = Math.sin((curPhase[i] * 2 - t * 0.45) * Math.PI * 2);
                pulse = wave > 0 ? Math.pow(wave, 10) : 0;
                const s = (seed[i] * 97.3 + t * 0.15) % 1;
                if (s < 0.025) pulse = Math.max(pulse, 1 - s / 0.025);
            }

            const depth = Math.min(Math.max((rz + 1.5) / 3, 0), 1);
            const size = (0.7 + depth * 1.5 + pulse * 1.8) * (R / 220) * 1.7;
            const alpha = (0.14 + depth * 0.56 + pulse * 0.45) * layerAlpha;
            ctx.globalAlpha = alpha > 1 ? 1 : alpha;
            ctx.drawImage(hot[i] || pulse > 0.85 ? sprites.brand : sprites.neutral, px - size, py - size, size * 2, size * 2);
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    // Only animate while the hero is on screen and the tab is visible.
    new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; dirty = true; }).observe(hero);
    document.addEventListener('visibilitychange', () => { tabVisible = !document.hidden; dirty = true; });
    window.addEventListener('resize', resize);
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);

    resize();
    refreshTheme();
    lastSwitch = performance.now();
    setTimeout(updateHud, 1600); // after the name decode finishes
    requestAnimationFrame(frame);
})();
