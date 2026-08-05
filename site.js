(() => {
  const REVEAL_SELECTOR = [
    ".landing-label", ".landing-logo", ".landing-copy", ".entry-card", ".landing-foot",
    ".faction-hero-copy > *", ".faction-side", ".section-title", ".identity-grid > div",
    ".person-card", ".interest-list article", ".deal-heading", ".deal-pieces article",
    ".history-list article", ".character-copy > *", ".character-visual", ".story-prose",
    ".character-relations article", ".faction-footer > *",
    ".zone-canvas", ".zone-cards li", ".zone-levers article", ".chronicle article"
  ].join(",");

  const motionRoot = document.querySelector(".page-motion");
  const FADE_MS = 300;

  /* ---------------- 스크롤 리빌 ---------------- */
  let revealObserver = null;

  const initReveals = (scope) => {
    const elements = [...scope.querySelectorAll(REVEAL_SELECTOR)];
    elements.forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", (Math.min(index % 5, 4) * 70) + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    revealObserver?.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
    elements.forEach((element) => revealObserver.observe(element));
  };

  /* ---------------- 관리 영역 지도 ---------------- */
  const initZoneMaps = (scope) => {
    scope.querySelectorAll("[data-zone-map]").forEach((map) => {
      const nodes = [...map.querySelectorAll("[data-zone]")];
      if (!nodes.length) return;

      const setActive = (id) => {
        nodes.forEach((node) => node.classList.toggle("is-active", node.dataset.zone === id));
      };

      nodes.forEach((node) => {
        const activate = () => setActive(node.dataset.zone);
        node.addEventListener("pointerenter", activate);
        node.addEventListener("click", activate);
        node.addEventListener("focusin", activate);
      });

      setActive(nodes[0].dataset.zone);
    });
  };

  const initPage = (scope) => {
    initReveals(scope);
    initZoneMaps(scope);
  };

  /* ---------------- 배경음악 (페이지 전환에도 끊기지 않음) ---------------- */
  const audio = document.querySelector(".audio-control audio");
  const button = document.querySelector(".audio-control button");
  const bars = document.querySelector(".audio-bars");
  const buttonText = button?.querySelector("span:last-child");
  const volumeInput = document.querySelector('.audio-control input[type="range"]');
  const volumeOutput = document.querySelector(".audio-control output");
  const volumeKey = "incheon-bgm-volume";
  const timeKey = "incheon-bgm-time";
  const playingKey = "incheon-bgm-playing";

  const readStore = (key, fallback) => {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  };
  const writeStore = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* 저장소 차단됨 */ }
  };

  const updateAudioUI = () => {
    if (!audio || !button || !bars || !buttonText) return;
    const playing = !audio.paused;
    bars.classList.toggle("playing", playing);
    buttonText.textContent = playing ? "BGM" : "PLAY";
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "배경음악 일시정지" : "배경음악 재생");
  };

  if (audio && button && volumeInput && volumeOutput) {
    const savedVolume = Math.min(100, Math.max(0, Number(readStore(volumeKey, "42"))));
    const savedTime = Number(readStore(timeKey, "0"));
    audio.volume = savedVolume / 100;
    volumeInput.value = String(savedVolume);
    volumeOutput.textContent = String(savedVolume).padStart(2, "0");
    if (Number.isFinite(savedTime) && savedTime > 0) {
      try { audio.currentTime = savedTime; } catch { /* 메타데이터 대기 */ }
    }

    const wantsMusic = () => readStore(playingKey, "true") !== "false";

    const tryPlay = async () => {
      if (!audio.paused) return;
      try { await audio.play(); } catch { /* 브라우저 자동재생 정책 */ }
      updateAudioUI();
    };

    // 진입 즉시 재생 시도
    if (wantsMusic()) void tryPlay();

    // 자동재생이 막힌 경우: 마우스 이동·스크롤·터치·키 입력 등 어떤 동작이든 첫 신호에 재생
    const gestureEvents = [
      "pointerdown", "pointermove", "pointerup", "mousemove",
      "touchstart", "keydown", "wheel", "scroll", "click"
    ];
    const onGesture = () => { if (wantsMusic()) void tryPlay(); };
    const releaseGestures = () => {
      gestureEvents.forEach((type) => window.removeEventListener(type, onGesture));
    };
    gestureEvents.forEach((type) => {
      window.addEventListener(type, onGesture, { passive: true });
    });
    audio.addEventListener("play", releaseGestures, { once: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && wantsMusic()) void tryPlay();
    });

    button.addEventListener("click", async () => {
      if (audio.paused) {
        writeStore(playingKey, "true");
        await tryPlay();
      } else {
        audio.pause();
        writeStore(playingKey, "false");
        updateAudioUI();
      }
    });

    volumeInput.addEventListener("input", () => {
      const next = Number(volumeInput.value);
      audio.volume = next / 100;
      writeStore(volumeKey, String(next));
      volumeOutput.textContent = String(next).padStart(2, "0");
    });

    // 새로고침·외부 진입 대비 재생 위치 저장 (사이트 내부 이동에는 사용되지 않음)
    let lastSaved = 0;
    audio.addEventListener("timeupdate", () => {
      const now = audio.currentTime || 0;
      if (Math.abs(now - lastSaved) < 1) return;
      lastSaved = now;
      writeStore(timeKey, String(now));
      writeStore(playingKey, String(!audio.paused));
    });

    audio.addEventListener("play", updateAudioUI);
    audio.addEventListener("pause", updateAudioUI);
    updateAudioUI();
  }

  /* ---------------- 페이지 전환 (문서를 새로 읽지 않고 내용만 교체) ---------------- */
  const absolutize = (root, baseHref) => {
    root.querySelectorAll("[src], [href]").forEach((element) => {
      ["src", "href"].forEach((attribute) => {
        const raw = element.getAttribute(attribute);
        if (!raw || /^(https?:|data:|blob:|mailto:|tel:|javascript:|#|\/\/)/i.test(raw)) return;
        try {
          element.setAttribute(attribute, new URL(raw, baseHref).href);
        } catch { /* 잘못된 경로는 그대로 둔다 */ }
      });
    });
  };

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  let navigating = false;

  const swapTo = async (href, push = true) => {
    const current = document.querySelector(".page-frame");
    if (!current || !motionRoot || navigating) return;
    navigating = true;
    motionRoot.classList.add("is-leaving");

    try {
      const [response] = await Promise.all([
        fetch(href, { credentials: "same-origin" }),
        wait(FADE_MS)
      ]);
      if (!response.ok) throw new Error(String(response.status));

      const markup = await response.text();
      const incoming = new DOMParser().parseFromString(markup, "text/html");
      const frame = incoming.querySelector(".page-frame");
      if (!frame) throw new Error("frame-missing");

      absolutize(frame, href);
      if (push) history.pushState({ spa: true }, "", href);
      if (incoming.title) document.title = incoming.title;

      current.innerHTML = frame.innerHTML;
      window.scrollTo(0, 0);
      initPage(current);

      await wait(30);
      motionRoot.classList.remove("is-leaving");
      navigating = false;
    } catch {
      navigating = false;
      location.assign(href);
    }
  };

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = event.target.closest?.("a[href]");
    if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    let destination;
    try { destination = new URL(anchor.href, location.href); } catch { return; }
    if (destination.origin !== location.origin) return;
    if (destination.href === location.href) return;
    if (destination.pathname === location.pathname && destination.hash) return;

    event.preventDefault();
    void swapTo(destination.href, true);
  });

  window.addEventListener("popstate", () => {
    void swapTo(location.href, false);
  });

  initPage(document.querySelector(".page-frame") ?? document);
})();
