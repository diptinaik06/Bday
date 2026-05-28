const scenes = [...document.querySelectorAll(".scene")];
const randomButtons = [...document.querySelectorAll(".random-jump")];
const navButtons = [...document.querySelectorAll("[data-target]")];
const memeButton = document.querySelector(".next-meme");
const memeCategory = document.querySelector(".meme-category");
const memeText = document.querySelector(".meme-text");
const hygieneButton = document.querySelector(".hygiene-check");
const hygieneResult = document.querySelector(".hygiene-result");
const meterFill = document.querySelector(".meter-fill");
const moodButton = document.querySelector(".mood-button");
const musicButtons = [...document.querySelectorAll(".music-toggle")];
const secretInput = document.querySelector("#secretCode");
const unlockSecret = document.querySelector(".unlock-secret");
const hiddenDot = document.querySelector(".hidden-dot");
const toast = document.querySelector(".toast");
const floatLayer = document.querySelector(".float-layer");
const cursorPetals = document.querySelector(".cursor-petals");
const quoteCloud = document.querySelector(".quote-cloud");
const quizQuestion = document.querySelector(".quiz-question");
const quizOptions = document.querySelector(".quiz-options");
const quizProgress = document.querySelector(".quiz-progress");
const quizResult = document.querySelector(".quiz-result");
const blastButton = document.querySelector(".blast-button");
const auraButton = document.querySelector(".aura-button");
const vaultCards = [...document.querySelectorAll(".vault-card")];
const startFlowerGame = document.querySelector(".start-flower-game");
const flowerGame = document.querySelector(".flower-game");
const flowerScore = document.querySelector(".flower-score");
const balloonButtons = [...document.querySelectorAll(".balloon-game button")];
const balloonScore = document.querySelector(".balloon-score");
const flipCards = [...document.querySelectorAll(".flip-card")];
const typingNote = document.querySelector(".typing-note");

const sceneIds = scenes.map((scene) => scene.id).filter((id) => id !== "landing" && id !== "secret");
let currentScene = "landing";
let audioContext;
let musicTimer;
let isMusicOn = false;
let quizIndex = 0;
let quizScore = 0;
let lastMemeIndex = 0;
let petalsPaused = false;
let flowerGameTimer;
let flowerPoints = 0;
let balloonsPopped = 0;

const memes = [
  { category: "Funny daily life", text: "Swapnil after saying 'bas 2 minute': accidentally starts a full side quest." },
  { category: "Hygienic guy jokes", text: "His hands are so clean even sanitizer asks for motivation." },
  { category: "Branded / luxury", text: "Budget says normal. Swapnil still somehow gives showroom lighting." },
  { category: "Birthday chaos", text: "Birthday boy behavior: acting normal while secretly enjoying all this." },
  { category: "Soft roast", text: "Certified headache, still a good friend. Very irritating. Very true." },
  { category: "Luxury", text: "Talks about watches like the showroom personally invited him." },
  { category: "Emotional damage", text: "Acts unbothered, but deserves one proper emotional paragraph." }
];

const hygieneResults = [
  { width: 66, text: "Fresh enough to make the room behave properly." },
  { width: 84, text: "Premium hygiene. Even the towel has discipline." },
  { width: 96, text: "Sanitizer certification: emotionally proud." },
  { width: 100, text: "Unreal. Soap companies should sponsor this man." }
];

const moods = [
  "Feeling royal? Luxury Zone is glowing for you.",
  "Feeling emotional? Open the Memory Vault.",
  "Feeling chaotic? Wish Wall has entered the chat.",
  "Feeling peaceful? Ganapati Bappa section is the place.",
  "Feeling curious? Press S. That is all I will say."
];

const floatingQuotes = [
  "thank you for existing",
  "born dramatic, still invited",
  "birthday attention getting serious",
  "annoying but still our friend",
  "still surviving another year somehow",
  "made with too much feeling"
];

const typingMessages = [
  "thank you for existing",
  "certified headache but good friend",
  "still surviving another year, impressive honestly",
  "may this year be soft with you"
];

const quiz = [
  {
    question: "Swapnil's birthday is on...",
    options: ["29 May", "Every day in May", "Whenever cake arrives"],
    answer: 0
  },
  {
    question: "Most accurate Swapnil energy?",
    options: ["Activa for reality, car for dreams", "No plans, no style", "Dust is welcome"],
    answer: 0
  },
  {
    question: "His hidden superpower is...",
    options: ["Hygiene level max", "Ignoring brands", "Never posing"],
    answer: 0
  },
  {
    question: "Luxury caption that fits him?",
    options: ["Big dreams, clean fit", "Budget wallpaper only", "No watch, no aura"],
    answer: 0
  },
  {
    question: "What should Swapnil feel here?",
    options: ["Known as a friend and properly roasted", "Confused only", "Like the website ended"],
    answer: 0
  }
];

function showScene(id) {
  const nextScene = document.getElementById(id);
  if (!nextScene) return;

  scenes.forEach((scene) => scene.classList.toggle("active", scene.id === id));
  currentScene = id;
  window.scrollTo({ top: 0, behavior: "smooth" });
  burst(18);

  if (id === "quiz") resetQuiz();
  if (id === "wishes") startTypingLoop();
}

function randomScene() {
  const options = sceneIds.filter((id) => id !== currentScene);
  const next = options[Math.floor(Math.random() * options.length)];
  showScene(next);
}

function nextMeme() {
  lastMemeIndex = (lastMemeIndex + 1 + Math.floor(Math.random() * (memes.length - 1))) % memes.length;
  const meme = memes[lastMemeIndex];
  memeCategory.textContent = meme.category;
  memeText.textContent = meme.text;
}

function checkHygiene() {
  const result = hygieneResults[Math.floor(Math.random() * hygieneResults.length)];
  meterFill.style.width = `${result.width}%`;
  hygieneResult.textContent = result.text;
  showToast("Hygiene scan complete");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function unlockSecretPage() {
  showScene("secret");
  burst(90);
  showToast("Secret page unlocked");
}

function handleSecretInput() {
  const value = secretInput.value.trim().toLowerCase();
  if (["swapnil", "29 may", "ghavat", "bappa", "flower"].includes(value)) {
    unlockSecretPage();
  } else {
    showToast("Almost. Try something more personal.");
  }
}

function resetQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizResult.textContent = "";
  renderQuiz();
}

function renderQuiz() {
  const item = quiz[quizIndex];
  quizProgress.textContent = `Question ${quizIndex + 1} of ${quiz.length}`;
  quizQuestion.textContent = item.question;
  quizOptions.innerHTML = "";

  item.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerQuiz(index));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(index) {
  if (index === quiz[quizIndex].answer) {
    quizScore += 1;
    quizResult.textContent = "Correct. You understand the lore.";
  } else {
    quizResult.textContent = "Wrong, but funny enough to continue.";
  }

  quizIndex += 1;
  window.setTimeout(() => {
    if (quizIndex >= quiz.length) {
      quizProgress.textContent = "Result";
      quizQuestion.textContent = quizScore >= 4
      ? "You know him properly. Slightly concerning, but sweet."
      : "You need more Swapnil episodes, but okay, effort noticed.";
      quizOptions.innerHTML = "";
      quizResult.textContent = "This quiz never really ends. Press one more thing.";
      burst(60);
    } else {
      renderQuiz();
    }
  }, 650);
}

function createFloaty() {
  const item = document.createElement("span");
  const isFlower = Math.random() > 0.44;
  item.className = isFlower ? "floaty flower" : "floaty";
  item.textContent = isFlower ? "" : ["*", "+", "x", "."][Math.floor(Math.random() * 4)];
  item.style.left = `${Math.random() * 100}%`;
  item.style.fontSize = `${14 + Math.random() * 18}px`;
  item.style.animationDuration = `${9 + Math.random() * 7}s`;
  item.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
  if (isFlower) {
    item.style.width = `${24 + Math.random() * 20}px`;
    item.style.height = item.style.width;
    item.style.transform = `rotate(${-28 + Math.random() * 56}deg)`;
  }
  floatLayer.appendChild(item);
  window.setTimeout(() => item.remove(), 16000);
}

function burst(amount = 44) {
  const colors = ["#f5c96a", "#fff5d8", "#ffe79d", "#8ed9c5", "#c99338"];
  for (let index = 0; index < amount; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * 0.7}s`;
    piece.style.setProperty("--fall-drift", `${-150 + Math.random() * 300}px`);
    document.body.appendChild(piece);
    window.setTimeout(() => piece.remove(), 3600);
  }
}

function midnightBlast() {
  burst(140);
  for (let index = 0; index < 14; index += 1) {
    window.setTimeout(createFloaty, index * 70);
  }
  showToast("Okay birthday boy, it is officially your day.");
}

function toggleMusic() {
  if (isMusicOn) {
    window.clearInterval(musicTimer);
    isMusicOn = false;
    musicButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    showToast("Music paused");
    return;
  }

  audioContext = audioContext || new AudioContext();
  const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66];
  let noteIndex = 0;

  function playNote() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = notes[noteIndex % notes.length];
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.58);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
    noteIndex += 1;
  }

  playNote();
  musicTimer = window.setInterval(playNote, 680);
  isMusicOn = true;
  musicButtons.forEach((button) => button.setAttribute("aria-pressed", "true"));
  showToast("Soft lo-fi piano on");
}

function createMousePetal(x, y) {
  if (petalsPaused) return;
  petalsPaused = true;
  window.setTimeout(() => { petalsPaused = false; }, 42);

  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = `${x}px`;
  petal.style.top = `${y}px`;
  petal.style.width = `${18 + Math.random() * 12}px`;
  petal.style.height = petal.style.width;
  petal.style.setProperty("--x", `${-20 + Math.random() * 40}px`);
  petal.style.setProperty("--y", `${24 + Math.random() * 42}px`);
  cursorPetals.appendChild(petal);
  window.setTimeout(() => petal.remove(), 1300);
}

function spawnQuote() {
  const quote = document.createElement("span");
  quote.className = "quote";
  quote.textContent = floatingQuotes[Math.floor(Math.random() * floatingQuotes.length)];
  quote.style.left = `${8 + Math.random() * 68}%`;
  quote.style.top = `${18 + Math.random() * 58}%`;
  quoteCloud.appendChild(quote);
  window.setTimeout(() => quote.remove(), 5200);
}

function startFlowerMiniGame() {
  window.clearInterval(flowerGameTimer);
  flowerPoints = 0;
  flowerScore.textContent = "0";
  flowerGame.innerHTML = "";
  showToast("Catch the golden flowers");

  flowerGameTimer = window.setInterval(() => {
    const flower = document.createElement("button");
    flower.type = "button";
    flower.className = "falling-flower";
    flower.style.left = `${8 + Math.random() * 82}%`;
    flower.addEventListener("click", () => {
      flowerPoints += 1;
      flowerScore.textContent = String(flowerPoints);
      flower.remove();
      if (flowerPoints === 7) showToast("Flower streak unlocked");
    });
    flowerGame.appendChild(flower);
    window.setTimeout(() => flower.remove(), 3200);
  }, 520);

  window.setTimeout(() => {
    window.clearInterval(flowerGameTimer);
    showToast(`Flower score: ${flowerPoints}`);
  }, 10000);
}

function popBalloon(button) {
  if (button.hidden) return;
  button.hidden = true;
  balloonsPopped += 1;
  balloonScore.textContent = String(balloonsPopped);
  burst(16);

  const wishes = ["More peace this year.", "Better plans, fewer headaches.", "Good friends notice you. Sadly."];
  showToast(wishes[(balloonsPopped - 1) % wishes.length]);

  window.setTimeout(() => {
    button.hidden = false;
  }, 1800);
}

function startTypingLoop() {
  window.clearTimeout(startTypingLoop.timer);
  let messageIndex = 0;
  let charIndex = 0;

  function typeNext() {
    const message = typingMessages[messageIndex % typingMessages.length];
    typingNote.textContent = message.slice(0, charIndex);
    charIndex += 1;

    if (charIndex <= message.length) {
      startTypingLoop.timer = window.setTimeout(typeNext, 48);
      return;
    }

    startTypingLoop.timer = window.setTimeout(() => {
      messageIndex += 1;
      charIndex = 0;
      typeNext();
    }, 1250);
  }

  typeNext();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

navButtons.forEach((button) => {
  button.addEventListener("click", () => showScene(button.dataset.target));
});

randomButtons.forEach((button) => button.addEventListener("click", randomScene));
memeButton.addEventListener("click", nextMeme);
hygieneButton.addEventListener("click", checkHygiene);
moodButton.addEventListener("click", () => showToast(moods[Math.floor(Math.random() * moods.length)]));
musicButtons.forEach((button) => button.addEventListener("click", toggleMusic));
unlockSecret.addEventListener("click", handleSecretInput);
secretInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleSecretInput();
});
hiddenDot.addEventListener("click", unlockSecretPage);
blastButton.addEventListener("click", midnightBlast);
auraButton.addEventListener("click", () => {
  showToast("Warning: birthday attention is getting out of hand");
  midnightBlast();
});
vaultCards.forEach((card) => {
  card.addEventListener("click", () => {
    showToast(card.dataset.note);
    burst(24);
  });
});
startFlowerGame.addEventListener("click", startFlowerMiniGame);
balloonButtons.forEach((button) => button.addEventListener("click", () => popBalloon(button)));
flipCards.forEach((card) => card.addEventListener("click", () => card.classList.toggle("revealed")));

document.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "s") unlockSecretPage();
  if (event.key.toLowerCase() === "b") midnightBlast();
});

document.addEventListener("pointermove", (event) => createMousePetal(event.clientX, event.clientY));
document.addEventListener("dblclick", () => {
  burst(52);
  showToast("Double-click surprise: one more Swapnil moment added.");
});

window.setInterval(createFloaty, 820);
window.setInterval(spawnQuote, 9000);
window.setTimeout(midnightBlast, 6200);
burst(28);
