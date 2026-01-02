// ------------------------------------------------------
//  ANNIVERSARY WEBSITE – ADVANCED INTERACTIVE JS
//  Includes: Password Unlock, Floating Hearts, Heart Cursor, Transitions
// ------------------------------------------------------

// SECTION REVEAL
const enterBtn = document.getElementById("enterBtn");
const sections = [
  "timeline",
  "letter",
  "music",
  "achievements",
  "timecapsule",
  "gallery",
  "puzzle",
  "passwordSection",
  "final"
];

enterBtn.addEventListener("click", () => {
  document.getElementById("welcome").classList.add("hidden");
  revealSectionsSequentially();
});

function revealSectionsSequentially() {
  let index = 0;

  function showNext() {
    if (index < sections.length) {
      const sec = document.getElementById(sections[index]);
      if (sec) {
        sec.classList.remove("hidden");
        sec.style.animationDelay = `${0.3 * index}s`;
        sec.classList.add("fade-section");
      }
      index++;
      setTimeout(showNext, 900);
    }
  }

  showNext();
}

// ------------------------------------------------------
//  PASSWORD PROTECTION
// ------------------------------------------------------
const passwordBtn = document.getElementById("passwordBtn");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const secretSection = document.getElementById("secretContent");

// change this to a password you prefer before publishing
const correctPassword = "iloveyou";

if (passwordBtn) {
  passwordBtn.onclick = () => {
    const val = passwordInput.value.trim();

    if (val === correctPassword) {
      passwordError.classList.add("hidden");
      secretSection.classList.remove("hidden");
      secretSection.classList.add("fade-section");
      // Optional: scroll to secret content
      secretSection.scrollIntoView({ behavior: "smooth" });
    } else {
      passwordError.classList.remove("hidden");
      setTimeout(() => passwordError.classList.add("hidden"), 2500);
    }
  };
}

// ------------------------------------------------------
//  FLOATING HEARTS ANIMATION
// ------------------------------------------------------
const floatingContainer = document.getElementById("floatingHeartsContainer");

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");

  // random left position, slightly off-screen allowed
  heart.style.left = Math.random() * 100 + "vw";
  // random duration and size
  const duration = 3 + Math.random() * 4;
  heart.style.animationDuration = duration + "s";
  const size = 12 + Math.random() * 18;
  heart.style.width = size + "px";
  heart.style.height = size + "px";

  floatingContainer.appendChild(heart);

  // remove after animation roughly completes
  setTimeout(() => {
    heart.remove();
  }, (duration + 1) * 1000);
}

// create hearts less frequently on small devices to save performance
const interval = window.innerWidth < 520 ? 1000 : 600;
setInterval(createHeart, interval);

// ------------------------------------------------------
//  HEART CURSOR EFFECT
// ------------------------------------------------------
document.addEventListener("mousemove", function(e) {
  // Do not create cursor hearts on very small screens (touch devices)
  if (window.innerWidth < 520) return;

  const heart = document.createElement("div");
  heart.classList.add("cursor-heart");
  heart.style.left = (e.pageX - 7) + "px";
  heart.style.top = (e.pageY - 7) + "px";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 700);
});

// ------------------------------------------------------
//  PERSONALIZED TIMELINE
// ------------------------------------------------------
const timelineData = [
  { date: "The Day We Met", text: "Life changed in the softest way." },
  { date: "First Date", text: "I still remember the excitement." },
  { date: "First Trip", text: "You felt like home everywhere we went." },
  { date: "Today", text: "Three years, and I still fall every day." }
];

const timelineContainer = document.getElementById("timelineContainer");
if (timelineContainer) {
  timelineData.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("timeline-item");
    div.innerHTML = `<h3>${item.date}</h3><p>${item.text}</p>`;
    timelineContainer.appendChild(div);
  });
}

// ------------------------------------------------------
//  INTERACTIVE LETTER
// ------------------------------------------------------
const letterLines = [
  "My love,",
  "These three years have changed everything for me.",
  "You’ve made my world softer, calmer, happier.",
  "Your love feels like magic that never fades.",
  "I would choose you in every lifetime.",
  "Happy Anniversary, my heart."
];

const letterContent = document.getElementById("letterContent");
if (letterContent) {
  letterLines.forEach((line, i) => {
    const p = document.createElement("p");
    p.textContent = line;
    p.style.opacity = 0;
    setTimeout(() => {
      p.style.transition = "0.9s";
      p.style.opacity = 1;
    }, 500 * i);
    letterContent.appendChild(p);
  });
}

// ------------------------------------------------------
//  MUSIC
// ------------------------------------------------------
const songs = [
  { title: "Night Changes – One Direction", desc: "It reminds me how beautiful time is with you." },
  { title: "Until I Found You – Stephen Sanchez", desc: "Because loving you feels peaceful and safe." },
  { title: "Perfect – Ed Sheeran", desc: "It’s our forever kind of song." }
];

const songList = document.getElementById("songList");
if (songList) {
  songs.forEach(song => {
    const div = document.createElement("div");
    div.classList.add("song");
    div.innerHTML = `<h3>${song.title}</h3><p>${song.desc}</p>`;
    songList.appendChild(div);
  });
}

// ------------------------------------------------------
//  ACHIEVEMENTS
// ------------------------------------------------------
const achievements = [
  "Best Smile", "Queen of My Heart", "Most Caring", "Best Hugger", "Future Wife (Locked)"
];
const achList = document.getElementById("achList");
if (achList) {
  achievements.forEach(a => {
    const div = document.createElement("div");
    div.classList.add("achievement");
    div.textContent = a;
    achList.appendChild(div);
  });
}

// ------------------------------------------------------
//  GALLERY
// ------------------------------------------------------
const galleryImages = [
  "assets/images/gallery1.jpg",
  "assets/images/gallery2.jpg",
  "assets/images/gallery3.jpg"
];

const galleryGrid = document.getElementById("galleryGrid");
if (galleryGrid) {
  galleryImages.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Memory";
    galleryGrid.appendChild(img);
  });
}

// ------------------------------------------------------
//  PUZZLE
// ------------------------------------------------------
const puzzleContainer = document.getElementById("puzzleContainer");
if (puzzleContainer) {
  puzzleContainer.innerHTML = `<p>Which moment made me fall for you the hardest?</p>`;

  ["Our first date", "Your first smile at me", "Our first hug"].forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      if (opt === "Your first smile at me") {
        alert("Correct ❤️ That smile changed everything.");
      } else {
        alert("Close… but not the one that stole my heart.");
      }
    };
    puzzleContainer.appendChild(btn);
  });
}
