const state = {
  food: "",
  date: "",
  time: "",
};

const screens = [...document.querySelectorAll(".screen")];
const dateInput = document.getElementById("date-input");
const dateNextBtn = document.getElementById("date-next-btn");
const maybeBtn = document.getElementById("maybe-btn");
const yesBtn = document.getElementById("yes-btn");
const runawayMessage = document.getElementById("runaway-message");

let runawayAttempts = 0;
let heartInterval;

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  setTimeout(() => {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 50);
}

function getLocalISODate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDatePtBr(dateString) {
  if (!dateString) return "-";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function setMinimumDate() {
  dateInput.min = getLocalISODate();
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.next);
  });
});

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.back);
  });
});

document.querySelectorAll("[data-food]").forEach((button) => {
  button.addEventListener("click", () => {
    state.food = button.dataset.food;
    showScreen("screen-date");
  });
});

dateInput.addEventListener("change", () => {
  const selected = dateInput.value;

  if (!selected) {
    dateNextBtn.disabled = true;
    return;
  }

  const today = getLocalISODate();

  if (selected < today) {
    dateInput.value = "";
    dateNextBtn.disabled = true;
    return;
  }

  state.date = selected;
  dateNextBtn.disabled = false;
});

dateNextBtn.addEventListener("click", () => {
  if (!state.date) return;
  showScreen("screen-time");
});

document.querySelectorAll("[data-time]").forEach((button) => {
  button.addEventListener("click", () => {
    state.time = button.dataset.time;
    updateSummary();
    showScreen("screen-summary");
  });
});

function updateSummary() {
  const date = formatDatePtBr(state.date);

  document.getElementById("summary-food").textContent = state.food;
  document.getElementById("summary-date").textContent = date;
  document.getElementById("summary-time").textContent = state.time;

  document.getElementById("final-food").textContent = state.food;
  document.getElementById("final-date").textContent = date;
  document.getElementById("final-time").textContent = state.time;
}

document.getElementById("reveal-invite-btn").addEventListener("click", () => {
  runawayAttempts = 0;
  maybeBtn.textContent = "Não sei... 🤨";
  maybeBtn.classList.remove("is-running");
  maybeBtn.style.left = "";
  maybeBtn.style.top = "";
  runawayMessage.textContent = "";

  showScreen("screen-invite");
});

function moveRunawayButton() {
  runawayAttempts += 1;

  if (runawayAttempts >= 5) {
    maybeBtn.classList.remove("is-running");
    maybeBtn.style.left = "";
    maybeBtn.style.top = "";
    maybeBtn.textContent = "Tá bom, eu quero 😒❤️";
    runawayMessage.textContent = "Sabia que você ia ceder 😏";
    maybeBtn.onclick = acceptInvitation;
    return;
  }

  const buttonWidth = 175;
  const buttonHeight = 58;
  const padding = 16;

  const maxX = Math.max(
    padding,
    window.innerWidth - buttonWidth - padding
  );
  const maxY = Math.max(
    padding,
    window.innerHeight - buttonHeight - padding
  );

  const x = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
  const y = Math.floor(Math.random() * (maxY - padding + 1)) + padding;

  maybeBtn.classList.add("is-running");
  maybeBtn.style.left = `${x}px`;
  maybeBtn.style.top = `${y}px`;

  const messages = [
    "Opa... esse botão tá meio tímido 😂",
    "Quase! 😌",
    "Tem certeza mesmo? 👀",
    "Esse botão não quer colaborar não 😏",
  ];

  runawayMessage.textContent =
    messages[Math.min(runawayAttempts - 1, messages.length - 1)];
}

["mouseenter", "touchstart", "pointerdown"].forEach((eventName) => {
  maybeBtn.addEventListener(eventName, (event) => {
    if (runawayAttempts < 5) {
      event.preventDefault();
      moveRunawayButton();
    }
  });
});

yesBtn.addEventListener("click", acceptInvitation);

function acceptInvitation() {
  updateSummary();
  showScreen("screen-success");
  celebrate();
}

function celebrate() {
  const container = document.getElementById("celebration-container");
  const hearts = ["❤️", "💕", "💗", "💖", "💘", "💞"];

  for (let i = 0; i < 70; i += 1) {
    const heart = document.createElement("span");
    heart.className = "celebration-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const angle = Math.random() * Math.PI * 2;
    const distance = 130 + Math.random() * 520;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const rotation = `${Math.floor(Math.random() * 360)}deg`;

    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);
    heart.style.setProperty("--r", rotation);
    heart.style.fontSize = `${1.1 + Math.random() * 2.5}rem`;
    heart.style.animationDelay = `${Math.random() * 0.35}s`;

    container.appendChild(heart);

    setTimeout(() => heart.remove(), 2300);
  }
}

document.getElementById("restart-btn").addEventListener("click", () => {
  state.food = "";
  state.date = "";
  state.time = "";
  dateInput.value = "";
  dateNextBtn.disabled = true;
  runawayAttempts = 0;
  maybeBtn.onclick = null;
  maybeBtn.textContent = "Não sei... 🤨";
  maybeBtn.classList.remove("is-running");
  maybeBtn.style.left = "";
  maybeBtn.style.top = "";
  runawayMessage.textContent = "";
  showScreen("screen-start");
});

function createFloatingHeart() {
  const container = document.getElementById("hearts-container");
  const heart = document.createElement("span");
  const heartSet = ["❤", "♥", "💕", "💗"];

  heart.className = "floating-heart";
  heart.textContent = heartSet[Math.floor(Math.random() * heartSet.length)];

  const size = 12 + Math.random() * 24;
  const left = Math.random() * 100;
  const duration = 7 + Math.random() * 8;
  const opacity = 0.22 + Math.random() * 0.35;
  const drift = -50 + Math.random() * 100;
  const rotation = -60 + Math.random() * 120;

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty("--heart-opacity", opacity);
  heart.style.setProperty("--heart-drift", `${drift}px`);
  heart.style.setProperty("--heart-rotation", `${rotation}deg`);

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, (duration + 1) * 1000);
}

function startHearts() {
  for (let i = 0; i < 16; i += 1) {
    setTimeout(createFloatingHeart, i * 220);
  }

  heartInterval = setInterval(createFloatingHeart, 620);
}

setMinimumDate();
startHearts();
