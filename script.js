const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.querySelector('.glass-card');
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');

let noCount = 0;
let particles = [];
const messages = [
    "Are you sure diduuuu? 😢",
    "me gussa hojaunga 😤",
    "Accha baba sorryyy 😭💗",
    "Think again... 🥺",
    "You're breaking my heart! 💔"
];

// Sound System with Safeguards
const sounds = {
    click: document.getElementById('clickSound'),
    celebrate: document.getElementById('celebrateSound'),
    heartbeat: document.getElementById('heartbeatSound'),
    bg: document.getElementById('bgMusic')
};

function playSound(name) {
    const s = sounds[name];
    if (s && s.readyState >= 2) { // Check if loaded
        s.currentTime = 0;
        s.play().catch(() => { });
    }
}

// Particle System
class Particle {
    constructor(x, y, type = 'petal') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = Math.random() * 8 + 4;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.gravity = 0.05;
        this.color = type === 'sparkle' ? '#fff' : `hsl(${Math.random() * 20 + 340}, 100%, 80%)`;
        this.alpha = 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY + this.gravity;
        this.alpha -= 0.015;
        this.rotation += this.rotationSpeed;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.beginPath();
        if (this.type === 'sparkle') {
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size / 2, 0);
        } else {
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        }
        ctx.fillStyle = this.color;
        if (this.type === 'sparkle') { ctx.shadowBlur = 10; ctx.shadowColor = '#fff'; }
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.restore();
    }
}

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) { particles.splice(i, 1); i--; }
    }
    requestAnimationFrame(animate);
}
animate();

// Consolidated Mouse Listener
document.addEventListener('mousemove', (e) => {
    // Background Blobs Parallax
    document.body.style.setProperty('--mouse-x', e.clientX + 'px');
    document.body.style.setProperty('--mouse-y', e.clientY + 'px');

    // 3D Tilt Logic
    if (card) {
        const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
        card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    }

    // Spawn Particles
    particles.push(new Particle(e.clientX, e.clientY, 'petal'));
    if (Math.random() > 0.6) particles.push(new Particle(e.clientX, e.clientY, 'sparkle'));

    // Intelligent No-Button Dodging
    dodgeButton(e);
});

// Auto Hug Overlay Dismissal
const hugOverlay = document.getElementById('hug-overlay');
if (hugOverlay) {
    hugOverlay.addEventListener('click', () => hugOverlay.classList.add('hidden'));
}

// Reset tilt on mouse leave
if (card) {
    card.addEventListener('mouseleave', () => card.style.transform = `rotateY(0deg) rotateX(0deg)`);
}

// Move No-button to body for unrestrained dodging (fixes transform conflict)
document.body.appendChild(noBtn);
noBtn.style.position = "fixed";
// Initial positioning relative to its old spot (center-ish)
noBtn.style.left = "60%";
noBtn.style.top = "60%";

// Intelligent Dodge Function
function dodgeButton(e) {
    const btnRect = noBtn.getBoundingClientRect();

    // Boundaries (Full Viewport)
    const margin = 20;
    const minX = margin;
    const maxX = window.innerWidth - btnRect.width - margin;
    const minY = margin;
    const maxY = window.innerHeight - btnRect.height - margin;

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const btnX = btnRect.left + btnRect.width / 2;
    const btnY = btnRect.top + btnRect.height / 2;

    const dist = Math.hypot(mouseX - btnX, mouseY - btnY);
    if (dist < 180) { // Repel range
        const angle = Math.atan2(btnY - mouseY, btnX - mouseX);
        const force = (180 - dist) / 1.5;
        let nx = btnRect.left + Math.cos(angle) * force;
        let ny = btnRect.top + Math.sin(angle) * force;

        // Strict Viewport Clamping
        nx = Math.max(minX, Math.min(maxX, nx));
        ny = Math.max(minY, Math.min(maxY, ny));

        noBtn.style.left = `${nx}px`;
        noBtn.style.top = `${ny}px`;
        noBtn.style.transition = "all 0.15s ease-out";
        noBtn.style.zIndex = "3000";
    }
}

// Button Events
noBtn.addEventListener("click", () => {
    if (noCount < messages.length) {
        updateMessage(messages[noCount], document.getElementById('message'));
        noCount++;
        yesBtn.style.transform = `scale(${1 + noCount * 0.4})`;
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
    }
    // Teleport to a random visible spot
    const nx = Math.random() * (window.innerWidth - 150) + 30;
    const ny = Math.random() * (window.innerHeight - 100) + 30;
    noBtn.style.left = `${nx}px`;
    noBtn.style.top = `${ny}px`;
});

yesBtn.addEventListener('mouseenter', () => playSound('heartbeat'));
yesBtn.addEventListener('mouseleave', () => { if (sounds.heartbeat) { sounds.heartbeat.pause(); sounds.heartbeat.currentTime = 0; } });

yesBtn.addEventListener("click", () => {
    playSound('click');
    playSound('celebrate');
    if (sounds.bg) sounds.bg.play().catch(() => { });

    // Hide No button since it's now in the body
    noBtn.style.display = "none";

    const overlay = document.getElementById('magic-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        document.getElementById('initial-state').classList.add('hidden');
        document.getElementById('success-state').classList.remove('hidden');
        document.body.classList.add('glow-mode', 'blur-bg');
        overlay.classList.remove('active');
        heartBurst();
    }, 800);

    // Success Step 2: Gift Box
    document.querySelector('.gift-box').addEventListener('click', function () {
        playSound('click');
        this.classList.add('open');
        setTimeout(() => {
            this.parentElement.style.display = 'none';
            startFinalSequence();
        }, 500);
    }, { once: true });
});

function startFinalSequence() {
    const successMsg = document.getElementById('success-message');
    let count = 3;
    const timer = setInterval(() => {
        if (count > 0) {
            successMsg.innerHTML = `<h1 style="font-size: 5rem; color: var(--primary-pink);">${count}</h1>`;
            count--;
            playSound('click');
        } else {
            clearInterval(timer);
            typeEffect("You are the best diduuuu in the entire world! 💖<br>I’m so lucky to have you always by my side!", successMsg);
            setTimeout(() => {
                const hug = document.getElementById('hug-overlay');
                hug.classList.remove('hidden');
                setTimeout(() => hug.classList.add('hidden'), 4000);
            }, 3500);
        }
    }, 1000);
}

// Utility Functions
function updateMessage(text, element) {
    if (!element) return;
    element.style.opacity = 0;
    setTimeout(() => { element.textContent = text; element.style.opacity = 1; }, 200);
}

function typeEffect(text, element) {
    if (!element) return;
    let i = 0;
    element.innerHTML = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text.substr(i, 4) === "<br>") { element.innerHTML += "<br>"; i += 4; }
            else { element.innerHTML += text.charAt(i); i++; }
        } else { clearInterval(interval); }
    }, 45);
}

function heartBurst() {
    const emojis = ["💖", "💗", "💓", "🌸", "✨", "🍫", "🍭"];
    for (let i = 0; i < 120; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.bottom = "-10vh";
            heart.style.fontSize = (Math.random() * 20 + 20) + "px";
            const duration = Math.random() * 3 + 3;
            heart.style.animationDuration = duration + "s";
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), duration * 1000);
        }, i * 50);
    }
}

// Easter Eggs
document.addEventListener('keydown', (e) => {
    if (['l', 'h'].includes(e.key.toLowerCase())) {
        typeEffect("Easter Egg Found: I Love You Didu! 💖", document.getElementById('message'));
        heartBurst();
    }
});

card.addEventListener('dblclick', () => { heartBurst(); spawnPopup(); });

function spawnPopup() {
    const texts = ["You're Amazing!", "Best Didu Ever!", "💖💖💖", "Chocolate?", "So Lucky! ✨"];
    const popup = document.createElement('div');
    popup.className = 'cute-popup';
    popup.textContent = texts[Math.floor(Math.random() * texts.length)];
    popup.style.left = Math.random() * 80 + 10 + 'vw';
    popup.style.top = Math.random() * 80 + 10 + 'vh';
    document.getElementById('popup-container').appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}
setInterval(() => { if (Math.random() > 0.8) spawnPopup(); }, 4000);
