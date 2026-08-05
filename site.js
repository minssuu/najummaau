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
    }, { threshold: 0, rootMargin: "0px 0px -6%" });
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

  /* ---------------- 배경음악 (진입 즉시 / 첫 터치에 재생) ---------------- */
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
    audio.volume = savedVolume / 100;
    volumeInput.value = String(savedVolume);
    volumeOutput.textContent = String(savedVolume).padStart(2, "0");

    // 저장된 재생 위치는 메타데이터가 준비된 뒤에 복원한다.
    // (iOS는 준비 전 currentTime 조작 시 play() 요청을 거부한다)
    const savedTime = Number(readStore(timeKey, "0"));
    const restoreTime = () => {
      if (!Number.isFinite(savedTime) || savedTime <= 0) return;
      if (audio.currentTime > 0.5) return;
      try { audio.currentTime = savedTime; } catch { /* 무시 */ }
    };
    if (audio.readyState >= 1) restoreTime();
    else audio.addEventListener("loadedmetadata", restoreTime, { once: true });

    const wantsMusic = () => readStore(playingKey, "true") !== "false";

    // 사용자 제스처 핸들러 안에서 동기적으로 호출되어야 모바일에서 통과된다
    const startPlayback = () => {
      if (!audio.paused || !wantsMusic()) return;
      if (audio.readyState === 0) { try { audio.load(); } catch { /* 무시 */ } }
      const request = audio.play();
      if (request && typeof request.catch === "function") request.catch(() => { /* 정책 차단 */ });
    };

    const GESTURES = [
      "touchstart", "touchend", "pointerdown", "pointerup", "mousedown",
      "click", "keydown", "wheel", "scroll", "pointermove", "mousemove"
    ];
    const onGesture = () => startPlayback();
    const armGestures = () => {
      GESTURES.forEach((type) => {
        document.addEventListener(type, onGesture, { capture: true, passive: true });
        window.addEventListener(type, onGesture, { capture: true, passive: true });
      });
    };
    const disarmGestures = () => {
      GESTURES.forEach((type) => {
        document.removeEventListener(type, onGesture, true);
        window.removeEventListener(type, onGesture, true);
      });
    };

    // 1) 진입 즉시 시도
    startPlayback();
    // 2) 차단되면 어떤 동작이든 첫 신호에 재생
    armGestures();

    audio.addEventListener("playing", () => {
      disarmGestures();
      document.body.classList.remove("bgm-waiting");
      updateAudioUI();
    });
    audio.addEventListener("pause", () => {
      if (wantsMusic()) armGestures();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) startPlayback();
    });
    window.addEventListener("pageshow", startPlayback);

    // 아직 못 틀었으면 재생 버튼을 은은하게 깜빡여 알린다
    window.setTimeout(() => {
      if (audio.paused && wantsMusic()) document.body.classList.add("bgm-waiting");
    }, 1200);

    button.addEventListener("click", () => {
      if (audio.paused) {
        writeStore(playingKey, "true");
        startPlayback();
      } else {
        audio.pause();
        writeStore(playingKey, "false");
        document.body.classList.remove("bgm-waiting");
      }
      updateAudioUI();
    });

    volumeInput.addEventListener("input", () => {
      const next = Number(volumeInput.value);
      audio.volume = next / 100;
      writeStore(volumeKey, String(next));
      volumeOutput.textContent = String(next).padStart(2, "0");
    });

    // 새로고침·외부 진입 대비 재생 위치 저장
    let lastSaved = 0;
    audio.addEventListener("timeupdate", () => {
      const now = audio.currentTime || 0;
      if (Math.abs(now - lastSaved) < 1) return;
      lastSaved = now;
      writeStore(timeKey, String(now));
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
