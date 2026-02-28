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
    music.play().catch(e => console.log("Audio play blocked"));

    document.getElementById('initial-state').classList.add('hidden');
    document.getElementById('success-state').classList.remove('hidden');

    document.body.style.background = "linear-gradient(135deg, #ff9a9e, #fad0c4)";
    heartBurst();

    const giftBox = document.querySelector('.gift-box');
    const successMsg = document.getElementById('success-message');

    giftBox.addEventListener('click', () => {
        giftBox.classList.add('open');
        setTimeout(() => {
            giftBox.style.display = 'none';
            typeEffect("You are the best diduuuu in the entire world! 💖<br>I’m so lucky to have you always by my side. ✨<br>Let's celebrate with lots of chocolates! 🍫🍭", successMsg);
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
