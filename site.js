(() => {
  const revealSelector = [
    ".landing-label", ".landing-logo", ".landing-copy", ".entry-card", ".landing-foot",
    ".faction-hero-copy > *", ".faction-side", ".section-title", ".identity-grid > div",
    ".person-card", ".interest-list article", ".deal-heading", ".deal-pieces article",
    ".history-list article", ".character-copy > *", ".character-visual", ".story-prose p",
    ".character-relations article", ".faction-footer > *"
  ].join(",");

  const motionRoot = document.querySelector(".page-motion");
  const elements = [...document.querySelectorAll(revealSelector)];
  elements.forEach((element, index) => {
    element.classList.add("scroll-reveal");
    element.style.setProperty("--reveal-delay", (Math.min(index % 5, 4) * 70) + "ms");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    elements.forEach((element) => observer.observe(element));
  } else {
    elements.forEach((element) => element.classList.add("is-visible"));
  }

  const audio = document.querySelector(".audio-control audio");
  const button = document.querySelector(".audio-control button");
  const bars = document.querySelector(".audio-bars");
  const buttonText = button?.querySelector("span:last-child");
  const volumeInput = document.querySelector('.audio-control input[type="range"]');
  const volumeOutput = document.querySelector(".audio-control output");
  const volumeKey = "incheon-bgm-volume";
  const timeKey = "incheon-bgm-time";
  const playingKey = "incheon-bgm-playing";

  const updateAudioUI = () => {
    if (!audio || !button || !bars || !buttonText) return;
    const playing = !audio.paused;
    bars.classList.toggle("playing", playing);
    buttonText.textContent = playing ? "BGM" : "PLAY";
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "배경음악 일시정지" : "배경음악 재생");
  };

  if (audio && button && volumeInput && volumeOutput) {
    const savedVolume = Math.min(100, Math.max(0, Number(localStorage.getItem(volumeKey) ?? 42)));
    const savedTime = Number(localStorage.getItem(timeKey) ?? 0);
    audio.volume = savedVolume / 100;
    volumeInput.value = String(savedVolume);
    volumeOutput.textContent = String(savedVolume).padStart(2, "0");
    if (Number.isFinite(savedTime) && savedTime > 0) audio.currentTime = savedTime;

    const tryPlay = async () => {
      try { await audio.play(); } catch { /* Browser autoplay policy */ }
      updateAudioUI();
    };
    if (localStorage.getItem(playingKey) !== "false") void tryPlay();

    const unlock = () => {
      if (localStorage.getItem(playingKey) !== "false") void tryPlay();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    button.addEventListener("click", async () => {
      if (audio.paused) {
        localStorage.setItem(playingKey, "true");
        await tryPlay();
      } else {
        audio.pause();
        localStorage.setItem(playingKey, "false");
        updateAudioUI();
      }
    });

    volumeInput.addEventListener("input", () => {
      const next = Number(volumeInput.value);
      audio.volume = next / 100;
      localStorage.setItem(volumeKey, String(next));
      volumeOutput.textContent = String(next).padStart(2, "0");
    });
    audio.addEventListener("play", updateAudioUI);
    audio.addEventListener("pause", updateAudioUI);
    updateAudioUI();
  }

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
    const destination = new URL(anchor.href, location.href);
    if (destination.origin !== location.origin) return;
    if (destination.href === location.href || (destination.pathname === location.pathname && destination.hash)) return;
    event.preventDefault();
    if (audio) {
      localStorage.setItem(timeKey, String(audio.currentTime || 0));
      localStorage.setItem(playingKey, String(!audio.paused));
    }
    motionRoot?.classList.add("is-leaving");
    window.setTimeout(() => location.assign(destination.href), 360);
  });
})();
