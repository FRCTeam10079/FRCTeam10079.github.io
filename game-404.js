
'use strict';

(function () {
    var canvas = document.getElementById('runner');
    if (!canvas || !canvas.getContext) return;

    var ctx = canvas.getContext('2d');
    var hint = document.getElementById('runner-hint');

    // ---- Theme colors come from the stylesheet so the game matches the site ----
    var css = getComputedStyle(document.documentElement);
    function token(name, fallback) {
        return (css.getPropertyValue(name) || '').trim() || fallback;
    }

    var COLOR = {
        accent: token('--color-accent', '#472FFF'),
        accentLit: token('--color-accent-hover', '#5a47ff'),
        text: token('--color-text', '#EAEAEA'),
        border: token('--color-border', '#333333'),
        gold: token('--color-award-gold', '#f1c40f'),
        subtle: token('--color-text-subtle', 'rgba(255,255,255,0.65)'),
        // Sprite art colors — bumper red and metal greys are artwork, not theme.
        bumper: '#c0392b',
        bumperDark: '#8f2c20',
        metal: '#2b2b30',
        metalLit: '#3d3d45',
        tire: '#1a1a1a',
        cone: '#e8721f'
    };

    // ---- World constants (logical units) ----
    // The camera zooms to whichever axis is tighter, so every screen gets at
    // least MIN_W of track ahead (reaction time) and MIN_H of headroom (the
    // robot's jump arc). Short, wide canvases are limited by height; narrow
    // phone canvases by width, which then simply show more sky.
    var MIN_W = 460;
    var MIN_H = 150;
    var GROUND_MARGIN = 30;   // ground line sits this far above the bottom
    var ROBOT_X = 62;
    var GRAVITY = 0.95;
    var JUMP_V = -11.6;
    var SPEED_START = 6.6;
    var SPEED_MAX = 15.5;
    var SPEED_RAMP = 0.0016;

    var view = { w: 800, h: MIN_H };
    var scale = 1;
    var GROUND_Y = view.h - GROUND_MARGIN;

    var state = 'idle';          // idle | running | over
    var speed = SPEED_START;
    var score = 0;
    var best = readBest();
    var groundOffset = 0;
    var wallOffset = 0;
    var obstacles = [];
    var spawnGap = 0;
    var overAt = 0;
    var idleTime = 0;
    var raf = null;
    var last = 0;
    var inView = true;

    var robot = { y: 0, vy: 0, airborne: false, ducking: false, spin: 0 };

    // ---- Canvas sizing (device pixel ratio aware) ----
    function resize() {
        var rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        scale = Math.min(canvas.height / MIN_H, canvas.width / MIN_W);
        view.w = canvas.width / scale;
        view.h = canvas.height / scale;
        GROUND_Y = view.h - GROUND_MARGIN;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        draw();
    }

    function readBest() {
        try {
            return parseInt(window.localStorage.getItem('ad10079-runner-best'), 10) || 0;
        } catch (e) {
            return 0;
        }
    }

    function saveBest(value) {
        try {
            window.localStorage.setItem('ad10079-runner-best', String(value));
        } catch (e) { /* private mode — high score just won't persist */ }
    }

    // ---- Rounded rectangle helper (older engines lack ctx.roundRect) ----
    function roundRect(x, y, w, h, r) {
        var radius = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, w, h, radius);
            return;
        }
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
    }

    function fillRound(x, y, w, h, r, color) {
        roundRect(x, y, w, h, r);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // ---- Entities ----
    function robotBox() {
        var h = robot.ducking && !robot.airborne ? 28 : 44;
        var w = robot.ducking && !robot.airborne ? 54 : 46;
        var base = GROUND_Y + robot.y;
        // Trimmed a little so near-misses read as misses.
        return { x: ROBOT_X + 3, y: base - h + 3, w: w - 6, h: h - 4 };
    }

    function spawnObstacle() {
        var roll = Math.random();
        if (roll < 0.24 && score > 220) {
            // Drone: duck under it, or clear it with a well-timed jump.
            obstacles.push({ kind: 'drone', x: view.w + 40, base: 38, w: 32, h: 16, wing: 0 });
        } else if (roll < 0.55) {
            var count = 1 + (Math.random() < 0.45 ? 1 : 0) + (Math.random() < 0.2 ? 1 : 0);
            obstacles.push({ kind: 'cones', x: view.w + 40, base: 0, w: 14 * count + 4, h: 24, count: count });
        } else {
            var tall = Math.random() < 0.35;
            var h = tall ? 34 : 24;
            obstacles.push({ kind: 'crate', x: view.w + 40, base: 0, w: 26, h: h, tall: tall });
        }
        spawnGap = speed * (34 + Math.random() * 26);
    }

    function obsTop(o) {
        return GROUND_Y - o.base - o.h;
    }

    function hits(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    // ---- Input ----
    function jump() {
        if (state === 'idle') { start(); return; }
        if (state === 'over') { if (Date.now() - overAt > 350) start(); return; }
        if (!robot.airborne) {
            robot.vy = JUMP_V;
            robot.airborne = true;
            robot.ducking = false;
        }
    }

    function setDuck(on) {
        if (state !== 'running') return;
        robot.ducking = on;
        // Ducking mid-air drops you faster, which is how the original plays.
        if (on && robot.airborne && robot.vy < 0) robot.vy = 1.5;
    }

    function start() {
        state = 'running';
        speed = SPEED_START;
        score = 0;
        obstacles = [];
        spawnGap = 400;
        robot.y = 0;
        robot.vy = 0;
        robot.airborne = false;
        robot.ducking = false;
        if (hint) hint.textContent = 'Space or ↑ to jump · ↓ to duck';
    }

    function gameOver() {
        state = 'over';
        overAt = Date.now();
        var final = Math.floor(score);
        if (final > best) { best = final; saveBest(best); }
        if (hint) hint.textContent = 'Game over — score ' + final + '. Press space or tap to try again.';
    }

    document.addEventListener('keydown', function (e) {
        var key = e.key;
        var isJump = key === ' ' || key === 'Spacebar' || key === 'ArrowUp' || key === 'w' || key === 'W';
        var isDuck = key === 'ArrowDown' || key === 's' || key === 'S';
        if (!isJump && !isDuck) return;

        // Space and the arrows only belong to the game while it is genuinely
        // in play — otherwise they must keep scrolling the page as usual.
        var engaged = document.activeElement === canvas || (state === 'running' && inView);
        if (!engaged) return;

        e.preventDefault();
        if (isJump) jump(); else setDuck(true);
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setDuck(false);
    });

    canvas.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        canvas.focus();
        jump();
    });

    var touchPad = document.querySelector('.game-touch');
    if (touchPad) {
        touchPad.addEventListener('pointerdown', function (e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            e.preventDefault();
            if (btn.getAttribute('data-action') === 'jump') jump();
            else setDuck(true);
        });
        touchPad.addEventListener('pointerup', function () { setDuck(false); });
        touchPad.addEventListener('pointercancel', function () { setDuck(false); });
    }

    // ---- Update ----
    function update(dt) {
        if (state === 'idle') { idleTime += dt; return; }
        if (state !== 'running') return;

        speed = Math.min(SPEED_MAX, speed + SPEED_RAMP * dt);
        score += speed * dt * 0.06;

        groundOffset = (groundOffset + speed * dt) % 40;
        wallOffset = (wallOffset + speed * dt * 0.35) % 90;
        robot.spin += speed * dt * 0.09;

        robot.vy += GRAVITY * dt;
        robot.y += robot.vy * dt;
        if (robot.y >= 0) {
            robot.y = 0;
            robot.vy = 0;
            robot.airborne = false;
        }

        spawnGap -= speed * dt;
        if (spawnGap <= 0) spawnObstacle();

        var box = robotBox();
        for (var i = obstacles.length - 1; i >= 0; i--) {
            var o = obstacles[i];
            o.x -= speed * dt;
            if (o.kind === 'drone') o.wing += dt * 0.35;
            if (o.x + o.w < -20) { obstacles.splice(i, 1); continue; }
            if (hits(box, { x: o.x + 2, y: obsTop(o) + 2, w: o.w - 4, h: o.h - 4 })) gameOver();
        }
    }

    // ---- Drawing ----
    function drawBackdrop() {
        ctx.clearRect(0, 0, view.w, view.h);

        // Distant field wall, parallaxed
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = COLOR.border;
        for (var x = -wallOffset; x < view.w; x += 90) {
            ctx.fillRect(x, GROUND_Y - 46, 3, 46);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = COLOR.border;
        ctx.fillRect(0, GROUND_Y - 2, view.w, 2);
    }

    function drawGround() {
        ctx.fillStyle = COLOR.border;
        for (var x = -groundOffset; x < view.w; x += 40) {
            ctx.fillRect(x, GROUND_Y + 7, 18, 2);
            ctx.fillRect(x + 26, GROUND_Y + 14, 7, 2);
        }
    }

    function drawRobot() {
        var base = GROUND_Y + robot.y;
        var ducking = robot.ducking && !robot.airborne;
        var bodyW = ducking ? 54 : 46;

        ctx.save();
        ctx.translate(ROBOT_X, base);
        // Tip forward on the way up, back on the way down — reads as momentum.
        if (robot.airborne) {
            ctx.translate(bodyW / 2, -20);
            ctx.rotate((robot.vy < 0 ? -5 : 4) * Math.PI / 180);
            ctx.translate(-bodyW / 2, 20);
        }

        // Hover jets while airborne
        if (robot.airborne) {
            ctx.globalAlpha = 0.65;
            ctx.fillStyle = COLOR.accent;
            var flare = 6 + Math.random() * 5;
            fillRound(10, -6, 8, flare, 4, COLOR.accent);
            fillRound(bodyW - 18, -6, 8, flare, 4, COLOR.accent);
            ctx.globalAlpha = 1;
        }

        if (!ducking) {
            // Elevator mast with a carriage part way up
            fillRound(26, -62, 8, 30, 3, COLOR.metal);
            fillRound(23, -50, 14, 6, 2, COLOR.metalLit);
            // Claw at the top: two short prongs around a camera housing
            ctx.strokeStyle = COLOR.metalLit;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(23, -62); ctx.lineTo(20, -69);
            ctx.moveTo(37, -62); ctx.lineTo(40, -69);
            ctx.stroke();
            fillRound(24, -70, 12, 8, 3, COLOR.metalLit);
            ctx.fillStyle = COLOR.accentLit;
            ctx.fillRect(27, -68, 6, 4);
        } else {
            // Crouched: mast folded flat across the top
            fillRound(14, -30, 36, 7, 3, COLOR.metalLit);
        }

        // Chassis — a clean bar above the bumper, lighter so it reads separately
        fillRound(7, ducking ? -28 : -34, bodyW - 14, ducking ? 8 : 11, 4, COLOR.metalLit);

        // Bumper with the team number
        fillRound(0, -22, bodyW, 15, 4, COLOR.bumper);
        ctx.fillStyle = COLOR.bumperDark;
        ctx.fillRect(0, -10, bodyW, 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 8px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('10079', bodyW / 2, -14.5);

        // Wheels — spokes turn with distance travelled
        drawWheel(12, -8, 8);
        drawWheel(bodyW - 12, -8, 8);

        ctx.restore();
    }

    function drawWheel(cx, cy, r) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = COLOR.tire;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = COLOR.metalLit;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.rotate(robot.spin);
        ctx.strokeStyle = COLOR.metalLit;
        ctx.lineWidth = 1.5;
        for (var i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -r + 2);
            ctx.stroke();
            ctx.rotate(Math.PI * 2 / 3);
        }
        ctx.restore();
    }

    function drawObstacle(o) {
        var top = obsTop(o);
        if (o.kind === 'cones') {
            for (var i = 0; i < o.count; i++) {
                var x = o.x + i * 14;
                ctx.fillStyle = COLOR.cone;
                ctx.beginPath();
                ctx.moveTo(x + 6, top);
                ctx.lineTo(x + 12, top + o.h);
                ctx.lineTo(x, top + o.h);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.85;
                ctx.fillRect(x + 2.5, top + 12, 7, 3);
                ctx.globalAlpha = 1;
            }
        } else if (o.kind === 'crate') {
            fillRound(o.x, top, o.w, o.h, 3, COLOR.metal);
            ctx.strokeStyle = COLOR.metalLit;
            ctx.lineWidth = 1.5;
            roundRect(o.x + 0.75, top + 0.75, o.w - 1.5, o.h - 1.5, 3);
            ctx.stroke();
            ctx.fillStyle = COLOR.accent;
            ctx.globalAlpha = 0.75;
            ctx.fillRect(o.x + 5, top + o.h / 2 - 2, o.w - 10, 4);
            ctx.globalAlpha = 1;
        } else {
            // Drone: body plus flapping rotor arms
            var flap = Math.sin(o.wing) * 3;
            ctx.strokeStyle = COLOR.accentLit;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(o.x + 2, top + 6 + flap);
            ctx.lineTo(o.x + 12, top + 8);
            ctx.moveTo(o.x + o.w - 2, top + 6 - flap);
            ctx.lineTo(o.x + o.w - 12, top + 8);
            ctx.stroke();
            fillRound(o.x + 8, top + 4, o.w - 16, 10, 4, COLOR.metal);
            ctx.fillStyle = COLOR.gold;
            ctx.beginPath();
            ctx.arc(o.x + o.w / 2, top + 9, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawHud() {
        ctx.font = '700 12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        var current = pad(Math.floor(score));
        if (best > 0) {
            ctx.fillStyle = COLOR.subtle;
            ctx.fillText('HI ' + pad(best), view.w - 62, 12);
        }
        ctx.fillStyle = COLOR.text;
        ctx.fillText(current, view.w - 14, 12);
    }

    function pad(n) {
        var s = String(n);
        while (s.length < 5) s = '0' + s;
        return s;
    }

    function drawMessage(lines) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = COLOR.text;
        ctx.font = '700 15px Inter, system-ui, sans-serif';
        var midY = Math.max(46, view.h * 0.32);
        ctx.fillText(lines[0], view.w / 2, midY);
        if (lines[1]) {
            ctx.fillStyle = COLOR.subtle;
            ctx.font = '600 11px Inter, system-ui, sans-serif';
            ctx.fillText(lines[1], view.w / 2, midY + 22);
        }
    }

    function draw() {
        drawBackdrop();
        drawGround();
        for (var i = 0; i < obstacles.length; i++) drawObstacle(obstacles[i]);
        drawRobot();
        drawHud();

        if (state === 'idle') {
            drawMessage(['CLICK OR TAP TO DRIVE', 'Jump the cones · duck the drone']);
        } else if (state === 'over') {
            drawMessage(['GAME OVER', 'Press space or tap to run it back']);
        }
    }

    // ---- Loop ----
    function frame(now) {
        if (!last) last = now;
        var dt = Math.min((now - last) / 16.6667, 3);
        last = now;
        update(dt);
        draw();
        raf = window.requestAnimationFrame(frame);
    }

    function play() {
        if (raf === null) { last = 0; raf = window.requestAnimationFrame(frame); }
    }

    function pause() {
        if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; }
    }

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) pause(); else play();
    });

    // Only burn frames while the game is actually on screen.
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            inView = entries[0].isIntersecting;
            if (inView) play(); else pause();
        }, { threshold: 0.1 }).observe(canvas);
    }

    window.addEventListener('resize', resize);
    resize();
    play();
})();
