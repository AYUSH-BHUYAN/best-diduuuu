const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const message = document.getElementById("message");
const music = document.getElementById("bgMusic");

let noCount = 0;
const messages = [
    "Are you sure diduuuu? 😢",
    "Chocolate cancel ho jayega 😤🍫",
    "Accha baba sorryyy 😭💗",
    "Think again... 🥺",
    "You're breaking my heart! 💔"
];

// Magical Sakura Trail System
const canvas = document.getElementById('trail-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Sound System
const sounds = {
    click: document.getElementById('clickSound'),
    celebrate: document.getElementById('celebrateSound'),
    heartbeat: document.getElementById('heartbeatSound'),
    bg: document.getElementById('bgMusic')
};

function playSound(name) {
    if (sounds[name]) {
        sounds[name].currentTime = 0;
        sounds[name].play().catch(() => { });
    }
}

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
            // Draw a diamond/sparkle
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size / 2, 0);
        } else {
            // Draw a petal
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
        }
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.type === 'sparkle' ? 10 : 0;
        ctx.shadowColor = '#fff';
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.restore();
    }
}

function handleParticles() {
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}
animate();

// 3D Parallax Tilt Logic
const card = document.querySelector('.glass-card');
// Mouse tracking & Particle Spawn
document.addEventListener('mousemove', (e) => {
    // Background parallax blobs
    document.body.style.setProperty('--mouse-x', e.clientX + 'px');
    document.body.style.setProperty('--mouse-y', e.clientY + 'px');

    // 3D Card Tilt Math
    const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
    const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

    // Add new particles on move
    particles.push(new Particle(e.clientX, e.clientY, 'petal'));
    if (Math.random() > 0.5) particles.push(new Particle(e.clientX, e.clientY, 'sparkle'));
});

// Sound Hovers
yesBtn.addEventListener('mouseenter', () => sounds.heartbeat.play().catch(() => { }));
yesBtn.addEventListener('mouseleave', () => {
    sounds.heartbeat.pause();
    sounds.heartbeat.currentTime = 0;
});

// Random Popups
const cuteTexts = ["You're Amazing!", "Best Didu Ever!", "💖💖💖", "Chocolate?", "So Lucky! ✨"];
setInterval(() => {
    if (Math.random() > 0.7) spawnPopup();
}, 3000);

function spawnPopup() {
    const popup = document.createElement('div');
    popup.className = 'cute-popup';
    popup.textContent = cuteTexts[Math.floor(Math.random() * cuteTexts.length)];
    popup.style.left = Math.random() * 80 + 10 + 'vw';
    popup.style.top = Math.random() * 80 + 10 + 'vh';
    document.getElementById('popup-container').appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// Easter Eggs
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'l' || e.key.toLowerCase() === 'h') {
        typeEffect("Easter Egg Found: I Love You Didu! 💖", document.getElementById('message'));
        heartBurst();
    }
});

card.addEventListener('dblclick', () => {
    heartBurst();
    spawnPopup();
});

// Reset tilt on mouse leave
card.addEventListener('mouseleave', () => {
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

// Smooth "No" button escape logic
noBtn.addEventListener("mouseover", () => {
    if (noCount >= 4) {
        moveNoButton();
    }
});

function moveNoButton() {
    // Get viewport dimensions
    const padding = 50;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    // Random position within safe bounds
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noBtn.style.position = "fixed";
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
}

noBtn.addEventListener("click", () => {
    if (noCount < messages.length) {
        // Update message area
        const initialMessage = document.getElementById('message');
        updateMessage(messages[noCount], initialMessage);

        noCount++;

        // Make the Yes button grow bigger and more prominent
        const scale = 1 + (noCount * 0.3);
        yesBtn.style.transform = `scale(${scale})`;

        // Shake effect on the card
        document.querySelector('.glass-card').classList.add('shake');
        setTimeout(() => document.querySelector('.glass-card').classList.remove('shake'), 500);
    }

    // Start running away after 4 clicks
    if (noCount >= 4) {
        moveNoButton();
    }
});

// Success Sequence
yesBtn.addEventListener("click", () => {
    playSound('click');
    playSound('celebrate');
    sounds.bg.play().catch(() => { });

    // Trigger Magical World Transition
    const overlay = document.getElementById('magic-overlay');
    overlay.classList.add('active');

    setTimeout(() => {
        document.getElementById('initial-state').classList.add('hidden');
        document.getElementById('success-state').classList.remove('hidden');

        // Final State Aesthetics
        document.body.classList.add('glow-mode', 'blur-bg');
        document.body.style.background = "linear-gradient(135deg, #ff758c, #ff7eb3)";

        overlay.classList.remove('active');
        heartBurst();
    }, 800);

    const giftBox = document.querySelector('.gift-box');
    const successMsg = document.getElementById('success-message');

    giftBox.addEventListener('click', () => {
        playSound('click');
        giftBox.classList.add('open');

        // Final Countdown Sequence
        setTimeout(() => {
            giftBox.style.display = 'none';
            let count = 3;
            const timer = setInterval(() => {
                if (count > 0) {
                    successMsg.innerHTML = `<h1 style="font-size: 4rem">${count}</h1>`;
                    count--;
                } else {
                    clearInterval(timer);
                    typeEffect("You are the best diduuuu in the entire world! 💖<br>I’m so lucky to have you always by my side.", successMsg);

                    // Trigger Auto-Hug after message
                    setTimeout(() => {
                        document.getElementById('hug-overlay').classList.remove('hidden');
                        setTimeout(() => {
                            document.getElementById('hug-overlay').classList.add('hidden');
                        }, 3000);
                    }, 4000);
                }
            }, 800);
        }, 500);
    }, { once: true });
});

function updateMessage(text, element) {
    element.style.opacity = 0;
    setTimeout(() => {
        element.textContent = text;
        element.style.opacity = 1;
    }, 200);
}

function typeEffect(text, element) {
    let i = 0;
    element.innerHTML = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text.substr(i, 4) === "<br>") {
                element.innerHTML += "<br>";
                i += 4;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }
        } else {
            clearInterval(interval);
        }
    }, 40);
}

function heartBurst() {
    const emojis = ["💖", "💗", "💓", "🌸", "✨"];
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            const startX = Math.random() * 100;
            heart.style.left = startX + "vw";
            heart.style.bottom = "-5vh";

            // Randomize size and animation duration
            const size = Math.random() * (30 - 15) + 15;
            heart.style.fontSize = size + "px";

            const duration = Math.random() * (5 - 3) + 3;
            heart.style.animationDuration = duration + "s";

            document.body.appendChild(heart);

            // Cleanup
            setTimeout(() => heart.remove(), duration * 1000);
        }, i * 50);
    }
}
