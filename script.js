/* ═══════════════════════════════════════════
   ROMANTIC ANNIVERSARY WEBSITE — SCRIPT.JS
   Multi-page | Mobile-first | Modular
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  SlideToUnlock.init();
  PageNav.init();
  ValentineWeek.init();
  PhotoBooth.init();
  ScratchCards.init();
  Anniversary.init();
  BackgroundHearts.init();
  TogetherClock.init();
  MusicPlayer.init();
});

/* ═══════════════════════════════════════════
   MODULE: SLIDE TO UNLOCK
   ═══════════════════════════════════════════ */
const SlideToUnlock = (() => {
  let thumb, groove, glow, lockScreen, mainSite;
  let isDragging = false;
  let startX = 0;
  let thumbLeft = 0;
  let maxSlide = 0;

  function init() {
    thumb = document.getElementById('slide-thumb');
    groove = document.querySelector('.slide-groove');
    glow = document.querySelector('.slide-glow');
    lockScreen = document.getElementById('lock-screen');
    mainSite = document.getElementById('main-site');

    if (!thumb || !groove) return;
    updateLockTime();
    calcMax();

    thumb.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    thumb.addEventListener('touchstart', onStart, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
    window.addEventListener('resize', calcMax);
  }

  function calcMax() {
    maxSlide = groove.offsetWidth - thumb.offsetWidth - 8;
  }

  function updateLockTime() {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('lock-time').textContent = `${h}:${m}`;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('lock-date').textContent =
      `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }

  function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

  function onStart(e) {
    e.preventDefault();
    isDragging = true;
    startX = getX(e);
    thumbLeft = thumb.offsetLeft - 4;
    thumb.style.transition = 'none';
    glow.style.transition = 'none';
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const dx = getX(e) - startX;
    const newLeft = Math.max(0, Math.min(thumbLeft + dx, maxSlide));
    thumb.style.left = (newLeft + 4) + 'px';
    glow.style.width = (newLeft + 30) + 'px';
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    const currentLeft = thumb.offsetLeft - 4;

    thumb.style.transition = 'left 0.4s cubic-bezier(0.4,0,0.2,1)';
    glow.style.transition = 'width 0.4s cubic-bezier(0.4,0,0.2,1)';

    if (currentLeft >= maxSlide * 0.7) {
      thumb.style.left = (maxSlide + 4) + 'px';
      glow.style.width = '100%';
      unlock();
    } else {
      thumb.style.left = '4px';
      glow.style.width = '0';
    }
  }

  function unlock() {
    setTimeout(() => {
      lockScreen.classList.add('unlocking');
      // Try to play music on user gesture
      MusicPlayer.tryPlay();
      setTimeout(() => {
        lockScreen.style.display = 'none';
        mainSite.classList.remove('hidden');
        PageNav.showPage('home-section');
      }, 600);
    }, 300);
  }

  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: PAGE NAVIGATION
   Multi-page: one page visible at a time
   ═══════════════════════════════════════════ */
const PageNav = (() => {
  let currentPage = null;

  function init() {
    // Bottom nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => showPage(btn.dataset.page));
    });

    // Home cards
    document.querySelectorAll('.home-card').forEach(card => {
      card.addEventListener('click', () => showPage(card.dataset.page));
    });

    // Explore button → home
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => showPage('home-section'));
    }
  }

  function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
    });

    // Show target
    const target = document.getElementById(pageId);
    if (target) {
      // Small delay for transition
      requestAnimationFrame(() => {
        target.classList.add('active');
        // Scroll internal scrollable content to top
        const scrollable = target.querySelector('.page-scrollable');
        if (scrollable) scrollable.scrollTop = 0;
      });
    }

    // Highlight active nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    currentPage = pageId;

    // Re-init scratch cards when entering that page (canvas sizing)
    if (pageId === 'scratch-section') {
      setTimeout(() => ScratchCards.reinit(), 100);
    }
  }

  return { init, showPage };
})();

/* ═══════════════════════════════════════════
   MODULE: VALENTINE WEEK
   ═══════════════════════════════════════════ */
const ValentineWeek = (() => {
  const letterData = {
    rose: {
      header: '🌹 Rose Day 🌹',
      body: `<p>My dearest love,</p>
<p>If I could give you a garden full of roses, I would — but even a million roses couldn't capture how beautiful you are to me. You are the most exquisite flower in my life's garden.</p>
<p>Every time I see a rose, I think of you — delicate, graceful, and captivating. You make my world bloom in ways I never imagined.</p>
<p>This rose is just a small symbol of the infinite love I hold for you. Happy Rose Day, my beautiful rose. 🌹</p>`,
      stickersTop: ['🌹', '🌹', '🌹', '🌹', '🌹'],
      stickersBottom: ['🌷', '💐', '🌺'],
      photos: 0,
      effects: 'roses'
    },
    propose: {
      header: '💍 Propose Day 💍',
      body: `<p>My Forever Person,</p>
<p>So it’s Propose Day… and yes, kitni baar proposal legi 😭🤣 but what can I do, you deserve to be chosen every single time(oo yes i also deserve to get accepted every single time🤣🤣 don't u dare!!)</p>
<p>Uhmm...Loving you has been the most beautiful thing(a tough one tho🤧)my heart has ever done...❤️ You’re not just my girlfriend you’re the safe place of mine... my favorite thought jo thought dimaag se nikalta hi nhi🫠🤣❤️ and the reason my days feel complete... Srsly bhai without you day doesn't felt complete....</p>
<p>Tere sath, i feel loved, felt calm, exciting, funn and real all at once idk how😂🙃<br>Times has been very good for us recently(iykyk😝)aage bhi aise hi rhega🤞🏻🧿</p>
<p>Umm so today again, with the same heart and even more love than before..!!🌝i want to ask you...<br>will you keep being mine, holding my hand through every smile, every fight, every dream and till forever?🫠❤️✨</p>
<p>(Lots of Huggies🫂 and loads of kissiii 😘😘)</p>`,
      stickersTop: ['💍', '💑', '💕'],
      stickersBottom: ['💏', '🥰', '✨'],
      photos: 0,
      effects: 'stars'
    },
    chocolate: {
      header: '🍫 Chocolate Day 🍫',
      body: `<p>Hi Sweetie Pie,</p>
<p>They say chocolate makes everything better — but darling, YOU make everything sweet. You are the sweetest thing in my life, more delicious than any chocolate ever made.</p>
<p>Just like chocolate melts on your tongue, my heart melts every time you smile. I could drown in the sweetness of your love.</p>
<p>Happy Chocolate Day! Here's to a life as sweet as us together. 🍫💕</p>`,
      stickersTop: ['🍫', '🍬', '🍩', '🧁', '🍪'],
      stickersBottom: ['🍭', '🎂', '🍰'],
      photos: 0,
      effects: 'chocolates'          // ← CHOCOLATE FALL ANIMATION
    },
    teddy: {
      header: '🧸 Teddy Day 🧸',
      body: `<p>My cuddly love,</p>
<p>If I were a teddy bear, I'd want to be held by you forever. Until I can be there to hold you myself, let this teddy remind you that my arms are always open and waiting for you.</p>
<p>You are the warmest, softest, most comforting presence in my life. Just like a teddy, you make everything feel safe and cozy.</p>
<p>Happy Teddy Day, my snuggle buddy! 🧸💗</p>`,
      stickersTop: ['🧸'],
      stickersBottom: ['🧸', '🧸', '🧸', '🧸'],
      photos: 0,
      effects: 'teddies'
    },
    promise: {
      header: '🤞 Promise Day 🤞',
      body: `<p>Hi Love,</p>
<p>Promise Day it isss… and haan ik, kitne promises karenge 😭ab toh bhai promises khatam ho rhe hai itne kr diye🤣 but kya karu, you deserve every single one of them (chal yaad dila dete hai agar bhool gayi toh 😭🙃).</p>
<p>Uhmm… I promise to be there for you- on your best days and even on the ones jab mood off ho for no reason 🤧❤️. I promise to listen to you, even when tu same baat baar-baar bole (cutiee hai chalegaaa🫠🤣)</p>
<p>I promise to be your safe place, tera comfort zone, jahan tu bina filter ke reh sake.... yrr tere sath, life thodi zyada fun, thodi zyada real, aur bohot zyada special lagti hai idk kaise 😂but yeahhh❤️</p>
<p>Chahe fights ho, misunderstandings ho, ya bas random overthinking ya talks<br>we will be together ye pakka promise 🤞🏻hehee🧿.</p>
<p>So today, Promise Day pe dil se ek hi baat main tujhe i'll choose you everyday, in every phase, in every version… why so? coz u r minee babygurll🫂❤️</p>
<p>(Lots of tight hugs 🫂 and kissiii 😘😘)</p>`,
      stickersTop: ['🤞', '🤝', '💫'],
      stickersBottom: ['✨', '💖', '🌟'],
      photos: 0,
      effects: 'stars'
    },
    hug: {
      header: '🤗 Hug Day 🤗',
      body: `<p>My Teddy Beer,</p>
<p>If I could bottle the feeling of hugging you, I'd keep it with me forever. Your hugs are my favorite place in the whole universe — warm, safe, and utterly magical.</p>
<p>Every time I hold you close, the world stops spinning and everything just makes sense. You are my peace, my calm in every storm.</p>
<p>Until I can wrap my arms around you again — sending you the tightest, warmest, most loving hug through these words. 🤗💕</p>`,
      stickersTop: ['🤗', '🫂', '💕'],
      stickersBottom: ['🥰', '💞', '🤗'],
      photos: 2,
      photoUrls: ['assets/hug1.jpeg', 'assets/hug2.jpeg'],
      effects: 'hugs'
    },
    kiss: {
      header: '💋 Kiss Day 💋',
      body: `<p>My irresistible love,</p>
<p>A kiss from you is like magic — it makes the world disappear and leaves only us. Every kiss we share writes another line in our beautiful love story.</p>
<p>I miss the softness of your lips, the warmth of your breath, the moment just before our lips meet when everything feels electric.</p>
<p>Happy Kiss Day, my love. Every kiss is a promise that words could never capture. 💋✨</p>`,
      stickersTop: ['💋', '💋', '😘'],
      stickersBottom: ['💕', '✨', '💋'],
      photos: 2,
      photoUrls: ['assets/kiss1.jpeg', 'assets/kiss2.jpeg'],
      effects: 'kisses'
    },
    valentine: {
      header: '💝 Happy Valentine\'s Day 💝',
      body: `<p>Meri Jaan,</p>
<p>So it’s Valentine’s Day… ❤️🌹<br>I don’t need a special day to tell you how much you mean to me 💭💖, but since the universe gave me this perfect excuse on the valentine's ✨ let me be extra cheesy but heartful 🧀🤣. You make my mornings less boring ☀️😴, my nights less lonely 🌙🤍, and my silly moments feel like the best scenes or the best moment from a film 🎬💫. With you even the smallest things become memories 🫶🏻 your laugh❤️, the way you roll your eyes when I joke 😂, that look you give when I know I’ve messed up 😶🌫️👉👈 but you still can’t stay mad... 🥹heh💞</p>
<p>I love the way how being with you feels both safe secured🫂🤍 and exciting at the same time⚡😍like a home to me 🏡❤️ with a little adrenaline mixed in 😝heheee✨ You’re my comfort 🧸teddy💗 and my favourite kind of trouble 😈😘 You push me to be better... 📈❤️ you forgive my nonsense jokes and harkatein🤧🥹 and somehow you make ordinary days feel like joyful and somewhat celebrations 🎉💃 I could write a million reasons why I love you 📖likhte likhte keyboard band ho jayega😂💘 but honestly it always comes down to this: you make my life sweeter like u🍯💖 funnier 😂💕 and a thousand times more meaningful 🌍✨</p>
<p>So today, on Valentine’s 💝🌹, let me say again 🤞🏻🧿i'll laugh with you 😆❤️ i'll fight fair with u 😤🤝 i'll hold you tight when things get messy 🫂🥺, and to celebrate every tiny win and loss with you 🥳💋...<br>but also I promise to be silly 🤡😘, to be serious when it matters 🫡❤️, and to keep choosing you every single day 🔁💞 (yes, even on your grumpy mornings and bad days😝😌) I want to build a thousand little forever-moments with you ♾️💍the weird 🤪 the soft 🥹💓 and the wildly romantic ones 😍🔥...</p>
<p>Thank you for being my person 🧿❤️ my chaos 🌪️😘 and my calm 🌸🤍 Let’s make today ridiculously memorable 🎊🥂 lots of hugs 🫂🫂 endless kisses 😘😘😘 and a promise that this is only the start of more love than we can measure ♾️💖✨</p>`,
      stickersTop: ['💝', '💗', '💕', '✨', '🥰'],
      stickersBottom: ['🤗', '💋', '🤞', '♾️', '🧿'],
      photos: 4,
      photoUrls: ['assets/kiss1.jpeg', 'assets/kiss2.jpeg', 'assets/hug1.jpeg', 'assets/hug2.jpeg'],
      effects: 'white-petals'
    }
  };

  function init() {
    document.querySelectorAll('.envelope-card').forEach(card => {
      card.addEventListener('click', () => openLetter(card.dataset.day));
    });
    document.getElementById('letterClose').addEventListener('click', closeLetter);
    document.getElementById('letterOverlay').addEventListener('click', closeLetter);
  }

  function openLetter(day) {
    const data = letterData[day];
    if (!data) return;
    const modal = document.getElementById('letterModal');

    document.getElementById('letterHeader').textContent = data.header;
    document.getElementById('letterBody').innerHTML = data.body;

    // Stickers
    document.getElementById('letterStickersTop').innerHTML = data.stickersTop.map((s, i) => {
      const cls = ['sticker'];
      if (day === 'teddy' && i === 0) cls.push('sticker-float');
      if (day === 'promise') cls.push('sticker-glow');
      return `<span class="${cls.join(' ')}" style="animation-delay:${i * 0.15}s">${s}</span>`;
    }).join('');

    document.getElementById('letterStickersBottom').innerHTML = data.stickersBottom.map((s, i) => {
      const cls = ['sticker'];
      if (day === 'teddy') cls.push('sticker-float');
      if (day === 'valentine') cls.push('sticker-glow');
      return `<span class="${cls.join(' ')}" style="animation-delay:${(i + 3) * 0.15}s">${s}</span>`;
    }).join('');

    // Photos
    const photosEl = document.getElementById('letterPhotos');
    photosEl.innerHTML = '';
    for (let i = 0; i < data.photos; i++) {
      const bgImg = (data.photoUrls && data.photoUrls[i]) ? `style="background-image: url('${data.photoUrls[i]}'); background-size: cover; background-position: center;"` : '';
      photosEl.innerHTML += `<div class="letter-photo-frame" ${bgImg}></div>`;
    }

    // Effects
    const effects = document.getElementById('letterEffects');
    effects.innerHTML = '';

    if (data.effects === 'roses') {
      createFallEffect(effects, '🌹', 25, 3000);
    } else if (data.effects === 'chocolates') {
      createChocolateFall(effects, 30, 3000);
    } else if (data.effects === 'white-petals') {
      createWhitePetals(effects, 30, 3000);
    } else if (data.effects === 'stars') {
      createFallEffect(effects, '✨', 30, 3000);
    } else if (data.effects === 'teddies') {
      createFallEffect(effects, '🧸', 25, 3000);
    } else if (data.effects === 'hugs') {
      createFallEffect(effects, '🫂', 25, 3000);
    } else if (data.effects === 'kisses') {
      createFallEffect(effects, '💋', 25, 3000);
    }

    if (day === 'valentine') {
      document.querySelector('.letter-container').style.animationDuration = '1s';
    }

    modal.classList.add('active');
  }

  function closeLetter() {
    document.getElementById('letterModal').classList.remove('active');
    document.getElementById('letterPaper').style.boxShadow = '';
    document.getElementById('letterEffects').innerHTML = '';
  }

  function createFallEffect(container, emoji, count, dur) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'petal';
      el.textContent = emoji;
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (1.5 + Math.random() * 1) + 's';
      el.style.animationDelay = Math.random() * 1.2 + 's';
      el.style.fontSize = (1 + Math.random()) + 'rem';
      container.appendChild(el);
    }
    setTimeout(() => container.innerHTML = '', dur);
  }

  function createChocolateFall(container, count, dur) {
    const chocos = ['🍫', '🍬', '🍩', '🧁', '🍪', '🍭', '🍰', '🎂'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'choco-fall';
      el.textContent = chocos[Math.floor(Math.random() * chocos.length)];
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
      el.style.animationDelay = Math.random() * 1.5 + 's';
      el.style.fontSize = (1.2 + Math.random() * 1) + 'rem';
      container.appendChild(el);
    }
    setTimeout(() => container.innerHTML = '', dur);
  }

  function createWhitePetals(container, count, dur) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'white-petal';
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (3 + Math.random() * 3) + 's';
      el.style.animationDelay = Math.random() * 3 + 's';
      el.style.width = (8 + Math.random() * 10) + 'px';
      el.style.height = (10 + Math.random() * 12) + 'px';
      container.appendChild(el);
    }
    setTimeout(() => container.innerHTML = '', dur);
  }

  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: PHOTO BOOTH
   Full camera in frame, countdown overlay, flash
   ═══════════════════════════════════════════ */
const PhotoBooth = (() => {
  let stream = null;
  let photos = [];
  let currentFrame = 0;
  let isBW = false;
  let isCapturing = false;

  const frames = [
    { name: 'Classic', border: '#e8a0bf', caption: 'HAPPY VALENTINE\'S DAY', padding: 8 },
    { name: 'Polaroid', border: '#fff', caption: '♡ with love ♡', padding: 10 },
    { name: 'Vintage', border: '#d4a373', caption: '~ forever us ~', padding: 6 },
    { name: 'Dreamy', border: '#c3aed6', caption: '✨ our moment ✨', padding: 8 }
  ];

  function init() {
    document.getElementById('btnTakePhoto').addEventListener('click', startCamera);
    document.getElementById('btnUploadPhoto').addEventListener('click', () => {
      document.getElementById('photoUploadInput').click();
    });
    document.getElementById('photoUploadInput').addEventListener('change', handleUpload);
    document.getElementById('frameLeft').addEventListener('click', () => {
      currentFrame = (currentFrame - 1 + frames.length) % frames.length;
    });
    document.getElementById('frameRight').addEventListener('click', () => {
      currentFrame = (currentFrame + 1) % frames.length;
    });
    document.getElementById('filterToggle').addEventListener('click', toggleFilter);
    document.getElementById('boothGreenBtn').addEventListener('click', onGreenBtn);
    document.getElementById('btnDownload').addEventListener('click', downloadStrip);
    document.getElementById('btnShare').addEventListener('click', shareStrip);
    document.getElementById('btnPrint').addEventListener('click', printStrip);
    document.getElementById('btnRestart').addEventListener('click', restart);
    document.getElementById('scissorBtn').addEventListener('click', openScissorModal);
    document.getElementById('scissorCancel').addEventListener('click', closeScissorModal);
  }

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      const video = document.getElementById('cameraPreview');
      video.srcObject = stream;
      video.classList.add('active');
      if (isBW) video.classList.add('bw-filter');
      // Hide start buttons, camera fills the frame
      document.getElementById('boothStartBtns').style.display = 'none';
    } catch (err) {
      console.warn('Camera error:', err);
      alert('Camera not available. Please use the upload option.');
    }
  }

  function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    photos = [];
    const promises = files.slice(0, 4).map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = ev => {
          const img = new Image();
          img.onload = () => { photos.push(img); resolve(); };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(() => {
      while (photos.length < 4) photos.push(photos[photos.length - 1]);
      document.getElementById('boothStartBtns').style.display = 'none';
      generateStrip();
    });
    e.target.value = '';
  }

  function toggleFilter() {
    const toggle = document.getElementById('filterToggle');
    isBW = toggle.getAttribute('aria-checked') !== 'true';
    toggle.setAttribute('aria-checked', isBW.toString());
    const video = document.getElementById('cameraPreview');
    video.classList.toggle('bw-filter', isBW);
  }

  function onGreenBtn() {
    if (isCapturing) return;
    const video = document.getElementById('cameraPreview');
    if (video.classList.contains('active') && stream) {
      captureSequence();
    } else if (photos.length === 0) {
      document.getElementById('photoUploadInput').click();
    }
  }

  async function captureSequence() {
    if (isCapturing) return;
    isCapturing = true;
    photos = [];

    const greenBtn = document.getElementById('boothGreenBtn');
    const counter = document.getElementById('boothPhotoCounter');
    greenBtn.classList.add('recording');
    counter.classList.add('visible');

    for (let i = 0; i < 4; i++) {
      document.getElementById('photoCounterText').textContent = `${i}/4`;
      await doCountdown();
      flashEffect();
      const img = captureFrame();
      photos.push(img);
      document.getElementById('photoCounterText').textContent = `${i + 1}/4`;
      if (i < 3) await delay(700);
    }

    greenBtn.classList.remove('recording');
    counter.classList.remove('visible');
    isCapturing = false;

    // Stop camera
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      document.getElementById('cameraPreview').classList.remove('active');
    }

    generateStrip();
  }

  function doCountdown() {
    return new Promise(resolve => {
      const el = document.getElementById('boothCountdown');
      const num = document.getElementById('countdownNumber');
      el.classList.add('visible');

      let count = 3;
      num.textContent = count;
      num.style.animation = 'none';
      void num.offsetHeight;
      num.style.animation = 'countPop 1s ease-in-out';

      const iv = setInterval(() => {
        count--;
        if (count <= 0) {
          clearInterval(iv);
          el.classList.remove('visible');
          resolve();
        } else {
          num.textContent = count;
          num.style.animation = 'none';
          void num.offsetHeight;
          num.style.animation = 'countPop 1s ease-in-out';
        }
      }, 1000);
    });
  }

  function flashEffect() {
    const flash = document.getElementById('boothFlash');
    flash.classList.remove('flash');
    void flash.offsetHeight;
    flash.classList.add('flash');
  }

  function captureFrame() {
    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('cameraCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    const img = new Image();
    img.src = canvas.toDataURL('image/jpeg', 0.9);
    return img;
  }

  function generateStrip() {
    if (photos.length < 4) return;
    const frame = frames[currentFrame];
    const canvas = document.getElementById('photostripCanvas');
    const ctx = canvas.getContext('2d');

    const photoW = 300, photoH = 225, captionH = 28;
    const pad = frame.padding;
    canvas.width = photoW + pad * 2;
    canvas.height = (photoH + captionH + pad) * 4 + pad;

    ctx.fillStyle = frame.border;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let loaded = 0;
    photos.forEach((photo, i) => {
      const draw = () => {
        const y = pad + i * (photoH + captionH + pad);
        ctx.fillStyle = frame.border;
        ctx.fillRect(pad, y, photoW, captionH);
        ctx.fillStyle = frame.border === '#fff' ? '#888' : '#fff';
        ctx.font = 'bold 11px Quicksand, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(frame.caption.toUpperCase(), canvas.width / 2, y + 19);

        if (isBW) {
          const tmp = document.createElement('canvas');
          tmp.width = photoW; tmp.height = photoH;
          const tc = tmp.getContext('2d');
          tc.filter = 'grayscale(100%) contrast(1.1)';
          tc.drawImage(photo, 0, 0, photoW, photoH);
          ctx.drawImage(tmp, pad, y + captionH, photoW, photoH);
        } else {
          ctx.drawImage(photo, pad, y + captionH, photoW, photoH);
        }
        loaded++;
        if (loaded >= 4) showOutput();
      };
      if (photo.complete && photo.naturalWidth > 0) draw();
      else photo.onload = draw;
    });
  }

  function showOutput() {
    const out = document.getElementById('photostripOutput');
    out.style.display = 'block';
    out.scrollIntoView({ behavior: 'smooth' });
  }

  function downloadStrip() {
    const c = document.getElementById('photostripCanvas');
    const a = document.createElement('a');
    a.download = 'valentine-photostrip.png';
    a.href = c.toDataURL('image/png');
    a.click();
  }

  async function shareStrip() {
    const c = document.getElementById('photostripCanvas');
    try {
      const blob = await new Promise(r => c.toBlob(r, 'image/png'));
      if (navigator.share && navigator.canShare) {
        await navigator.share({ files: [new File([blob], 'photostrip.png', { type: 'image/png' })], title: 'Our Photo Strip ❤️' });
      } else downloadStrip();
    } catch { downloadStrip(); }
  }

  function printStrip() {
    const c = document.getElementById('photostripCanvas');
    const w = window.open('');
    w.document.write(`<img src="${c.toDataURL()}" style="max-width:100%;"/>`);
    w.document.close();
    w.print();
  }

  function restart() {
    photos = [];
    isCapturing = false;
    currentFrame = 0;
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    document.getElementById('cameraPreview').classList.remove('active', 'bw-filter');
    document.getElementById('boothStartBtns').style.display = 'flex';
    document.getElementById('photostripOutput').style.display = 'none';
    document.getElementById('boothGreenBtn').classList.remove('recording');
    document.getElementById('boothPhotoCounter').classList.remove('visible');
    isBW = false;
    document.getElementById('filterToggle').setAttribute('aria-checked', 'false');
  }

  function openScissorModal() {
    if (photos.length < 4) return;
    const modal = document.getElementById('scissorModal');
    const cont = document.getElementById('scissorPhotos');
    cont.innerHTML = '';
    photos.forEach((photo, i) => {
      const div = document.createElement('div');
      div.className = 'scissor-photo-option';
      const img = photo.cloneNode(); img.style.width = '100%';
      if (isBW) img.classList.add('bw-filter');
      const cut = document.createElement('div'); cut.className = 'cut-line';
      div.appendChild(img); div.appendChild(cut);
      div.addEventListener('click', () => cutPhoto(i));
      cont.appendChild(div);
    });
    modal.style.display = 'flex';
  }

  function closeScissorModal() {
    document.getElementById('scissorModal').style.display = 'none';
  }

  function cutPhoto(idx) {
    const p = photos[idx]; if (!p) return;
    const c = document.createElement('canvas');
    c.width = 300; c.height = 225;
    const ctx = c.getContext('2d');
    if (isBW) ctx.filter = 'grayscale(100%) contrast(1.1)';
    ctx.drawImage(p, 0, 0, 300, 225);
    const a = document.createElement('a');
    a.download = `valentine-photo-${idx + 1}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
    closeScissorModal();
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: SCRATCH CARDS
   ═══════════════════════════════════════════ */
const ScratchCards = (() => {
  function init() {
    setupCards();
  }

  function reinit() {
    document.querySelectorAll('.scratch-card').forEach(card => {
      if (card.scratchResize) card.scratchResize();
    });
  }

  function setupCards() {
    document.querySelectorAll('.scratch-card').forEach(card => {
      if (card.dataset.scratchInitialized) return;
      const canvas = card.querySelector('.scratch-canvas');
      if (!canvas) return;
      initCard(card, canvas);
      card.dataset.scratchInitialized = 'true';
    });
  }

  function initCard(card, canvas) {
    const ctx = canvas.getContext('2d');
    let isScratching = false;
    let revealed = false;

    function resize() {
      if (revealed) return;
      const rect = card.getBoundingClientRect();
      if (rect.width === 0) return; // not visible yet
      // Only draw if we haven't already drawn for this size
      if (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height)) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
        drawCover(ctx, canvas.width, canvas.height);
      }
    }

    card.scratchResize = resize;
    resize();
    window.addEventListener('resize', resize);

    function drawCover(c, w, h) {
      const grad = c.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#ffd700');
      grad.addColorStop(0.5, '#ffea70');
      grad.addColorStop(1, '#ffc000');
      c.fillStyle = grad;
      c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 40; i++) {
        c.beginPath();
        c.arc(Math.random() * w, Math.random() * h, Math.random() * 4 + 1, 0, Math.PI * 2);
        c.fill();
      }
    }

    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.touches ? e.touches[0].clientX : e.clientX) - r.left,
        y: (e.touches ? e.touches[0].clientY : e.clientY) - r.top
      };
    }

    function scratch(pos) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkReveal() {
      if (revealed) return;
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let t = 0;
      for (let i = 3; i < d.data.length; i += 4) {
        if (d.data[i] === 0) t++;
      }
      if (t / (canvas.width * canvas.height) > 0.3) {
        revealed = true;

        // Add special scratch fade out transition
        canvas.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        canvas.style.opacity = '0';
        canvas.style.transform = 'scale(1.1)';

        card.classList.add('revealing');
        const confettiEmojis = ['🎉', '🎊', '✨', '💖', '🌟', '💕'];
        for (let c = 0; c < 10; c++) {
          const conf = document.createElement('span');
          conf.className = 'scratch-confetti';
          conf.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
          const angle = (Math.PI * 2 / 10) * c;
          const dist = 60 + Math.random() * 40;
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          conf.style.left = '50%';
          conf.style.top = '50%';
          conf.style.setProperty('--tx', tx + 'px');
          conf.style.setProperty('--ty', ty + 'px');
          conf.style.animation = `confettiBurst 0.8s ease-out forwards`;
          conf.style.transform = `translate(${tx}px, ${ty}px)`;
          card.appendChild(conf);
        }
        setTimeout(() => {
          card.classList.remove('revealing');
          card.classList.add('revealed');
          card.querySelectorAll('.scratch-confetti').forEach(c => c.remove());
          canvas.style.display = 'none'; // hide completely after fade
        }, 650);
      }
    }

    canvas.addEventListener('mousedown', e => { if (!revealed) { isScratching = true; scratch(getPos(e)); } });
    canvas.addEventListener('mousemove', e => { if (isScratching && !revealed) { scratch(getPos(e)); checkReveal(); } });
    canvas.addEventListener('mouseup', () => { isScratching = false; checkReveal(); });
    canvas.addEventListener('mouseleave', () => { isScratching = false; checkReveal(); });
    canvas.addEventListener('touchstart', e => { if (!revealed) { e.preventDefault(); isScratching = true; scratch(getPos(e)); } }, { passive: false });
    canvas.addEventListener('touchmove', e => { if (isScratching && !revealed) { e.preventDefault(); scratch(getPos(e)); checkReveal(); } }, { passive: false });
    canvas.addEventListener('touchend', () => { isScratching = false; checkReveal(); });
  }

  return { init, reinit };
})();

/* ═══════════════════════════════════════════
   MODULE: ANNIVERSARY
   ═══════════════════════════════════════════ */
const Anniversary = (() => {
  function init() {
    const container = document.getElementById('sparkleContainer');
    if (!container) return;
    const sparkles = ['✨', '💫', '⭐', '🌟', '💖'];
    for (let i = 0; i < 15; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      s.style.animationDuration = (2 + Math.random() * 2) + 's';
      container.appendChild(s);
    }
  }
  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: BACKGROUND HEARTS
   ═══════════════════════════════════════════ */
const BackgroundHearts = (() => {
  function init() {
    const container = document.getElementById('floatingHearts');
    if (!container) return;
    const hearts = ['💕', '💗', '💖', '💞', '♡', '❤️'];
    for (let i = 0; i < 10; i++) {
      const h = document.createElement('span');
      h.className = 'bg-heart';
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = Math.random() * 100 + '%';
      h.style.animationDuration = (12 + Math.random() * 18) + 's';
      h.style.animationDelay = (Math.random() * 15) + 's';
      h.style.fontSize = (0.6 + Math.random() * 0.8) + 'rem';
      container.appendChild(h);
    }
  }
  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: TOGETHER CLOCK
   Counts time from Nov 12 to now
   ═════════════════════════════════════════ */
const TogetherClock = (() => {
  // ✏️ EDIT THIS DATE — your relationship start date
  const START_DATE = new Date('2022-11-12T00:00:00');

  function init() {
    update();
    setInterval(update, 1000);
  }

  function update() {
    const now = new Date();
    let years = now.getFullYear() - START_DATE.getFullYear();
    let months = now.getMonth() - START_DATE.getMonth();
    let days = now.getDate() - START_DATE.getDate();
    let hours = now.getHours() - START_DATE.getHours();
    let mins = now.getMinutes() - START_DATE.getMinutes();
    let secs = now.getSeconds() - START_DATE.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    const el = id => document.getElementById(id);
    el('clockYears').textContent = years;
    el('clockMonths').textContent = months;
    el('clockDays').textContent = days;
    el('clockHours').textContent = hours;
    el('clockMins').textContent = mins;
    el('clockSecs').textContent = secs;
  }

  return { init };
})();

/* ═══════════════════════════════════════════
   MODULE: MUSIC PLAYER
   Background music with toggle
   ═══════════════════════════════════════════ */
const MusicPlayer = (() => {
  let audio;
  let isPlaying = false;
  let btn;

  function init() {
    audio = document.getElementById('bgMusic');
    btn = document.getElementById('musicToggle');
    if (!audio || !btn) return;

    audio.volume = 0.3;

    btn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        btn.classList.remove('playing');
        btn.textContent = '🎵';
      } else {
        audio.play().then(() => {
          isPlaying = true;
          btn.classList.add('playing');
          btn.textContent = '🔊';
        }).catch(() => { });
      }
    });
  }

  function tryPlay() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      if (btn) {
        btn.classList.add('playing');
        btn.textContent = '🔊';
      }
    }).catch(() => { });
  }

  return { init, tryPlay };
})();
