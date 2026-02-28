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
    moveNoButton();
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
        updateMessage(messages[noCount]);
        noCount++;

        // Make the Yes button grow bigger and more prominent
        const scale = 1 + (noCount * 0.2);
        yesBtn.style.transform = `scale(${scale})`;

        // Shake effect on the card
        document.querySelector('.glass-card').classList.add('shake');
        setTimeout(() => document.querySelector('.glass-card').classList.remove('shake'), 500);
    }
    moveNoButton();
});

yesBtn.addEventListener("click", () => {
    // Attempt to play music (might need user interaction first)
    music.play().catch(e => console.log("Audio play blocked: ", e));

    // Smooth transition for background
    document.body.style.background = "linear-gradient(135deg, #ff9a9e, #fad0c4)";

    // Success content
    message.innerHTML = "";
    typeEffect("Yayyyyyyy 💖<br>You are the best diduuuu in the world! I’m lucky to have you always ✨");

    // Celebration
    heartBurst();

    // Hide buttons after "Yes"
    noBtn.style.display = "none";
    yesBtn.style.transform = "scale(1)";
    yesBtn.style.pointerEvents = "none";
});

function updateMessage(text) {
    message.style.opacity = 0;
    setTimeout(() => {
        message.textContent = text;
        message.style.opacity = 1;
    }, 200);
}

function typeEffect(text) {
    let i = 0;
    message.innerHTML = "";
    const interval = setInterval(() => {
        if (i < text.length) {
            if (text.substr(i, 4) === "<br>") {
                message.innerHTML += "<br>";
                i += 4;
            } else {
                message.innerHTML += text.charAt(i);
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
