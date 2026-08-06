(() => {
  const REVEAL_SELECTOR = [
    ".landing-label", ".landing-logo", ".landing-copy", ".entry-card", ".landing-foot",
    ".faction-hero-copy > *", ".faction-side", ".section-title", ".identity-grid > div",
    ".person-card", ".interest-list article", ".deal-heading", ".deal-pieces article",
    ".history-list article", ".character-copy > *", ".character-visual", ".story-prose",
    ".character-relations article", ".faction-footer > *",
    ".zone-canvas", ".zone-cards li", ".gallery", ".zone-levers article", ".chronicle article"
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


  /* ---------------- 갤러리 (슬라이드 + 확대 보기) ---------------- */
  let lightbox = null;
  let lbImage = null;
  let lbCaption = null;
  let lbCounter = null;
  let lbList = [];
  let lbIndex = 0;

  const buildLightbox = () => {
    if (lightbox) return lightbox;
    lightbox = document.createElement("div");
    lightbox.className = "gal-lightbox";
    lightbox.setAttribute("hidden", "");
    lightbox.innerHTML =
      '<button class="gl-close" type="button" aria-label="닫기">✕</button>' +
      '<button class="gl-arrow gl-prev" type="button" aria-label="이전">‹</button>' +
      '<figure><img alt=""/><figcaption><span class="gl-caption"></span>' +
      '<span class="gl-counter"></span></figcaption></figure>' +
      '<button class="gl-arrow gl-next" type="button" aria-label="다음">›</button>';
    document.body.appendChild(lightbox);
    lbImage = lightbox.querySelector("img");
    lbCaption = lightbox.querySelector(".gl-caption");
    lbCounter = lightbox.querySelector(".gl-counter");

    const close = () => {
      lightbox.setAttribute("hidden", "");
      document.body.classList.remove("gal-open");
      lbImage.removeAttribute("src");
    };
    lightbox.querySelector(".gl-close").addEventListener("click", close);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.tagName === "FIGURE") close();
    });
    lightbox.querySelector(".gl-prev").addEventListener("click", () => showAt(lbIndex - 1));
    lightbox.querySelector(".gl-next").addEventListener("click", () => showAt(lbIndex + 1));
    document.addEventListener("keydown", (event) => {
      if (lightbox.hasAttribute("hidden")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showAt(lbIndex - 1);
      if (event.key === "ArrowRight") showAt(lbIndex + 1);
    });

    // 모바일 스와이프
    let startX = null;
    lightbox.addEventListener("touchstart", (event) => {
      startX = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (event) => {
      if (startX === null) return;
      const delta = event.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(delta) < 45) return;
      showAt(delta < 0 ? lbIndex + 1 : lbIndex - 1);
    }, { passive: true });

    return lightbox;
  };

  function showAt(index) {
    if (!lbList.length) return;
    lbIndex = (index + lbList.length) % lbList.length;
    const item = lbList[lbIndex];
    lbImage.src = new URL(item.dataset.full, location.href).href;
    lbImage.alt = item.querySelector("img")?.alt || "";
    lbCaption.textContent = item.dataset.caption || "";
    lbCounter.textContent = (lbIndex + 1) + " / " + lbList.length;
  }

  const initGalleries = (scope) => {
    scope.querySelectorAll("[data-gallery]").forEach((gallery) => {
      const track = gallery.querySelector(".gal-track");
      const items = [...gallery.querySelectorAll(".gal-item")];
      if (!track || !items.length) return;

      items.forEach((item) => {
        item.addEventListener("click", () => {
          buildLightbox();
          lbList = items;
          lightbox.removeAttribute("hidden");
          document.body.classList.add("gal-open");
          showAt(Number(item.dataset.index) || 0);
        });
      });

      const step = () => Math.max(track.clientWidth * 0.8, 240);
      gallery.querySelector(".gal-prev")?.addEventListener("click", () => {
        track.scrollBy({ left: -step(), behavior: "smooth" });
      });
      gallery.querySelector(".gal-next")?.addEventListener("click", () => {
        track.scrollBy({ left: step(), behavior: "smooth" });
      });

      const syncArrows = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        gallery.classList.toggle("at-start", track.scrollLeft <= 2);
        gallery.classList.toggle("at-end", track.scrollLeft >= max);
      };
      track.addEventListener("scroll", syncArrows, { passive: true });
      window.addEventListener("resize", syncArrows);
      syncArrows();
    });
  };

  const initPage = (scope) => {
    if (lightbox) { lightbox.setAttribute("hidden", ""); document.body.classList.remove("gal-open"); }
    initReveals(scope);
    initZoneMaps(scope);
    initGalleries(scope);
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
  const pausedKey = "incheon-bgm-paused";

  const readStore = (key, fallback) => {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  };
  const writeStore = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* 저장소 차단됨 */ }
  };
  // "직접 껐다"는 상태는 이번 방문에만 유지한다. 새로 들어오면 항상 자동재생을 시도한다.
  const readSession = (key) => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  };
  const writeSession = (key, value) => {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
    } catch { /* 저장소 차단됨 */ }
  };
  // 예전 버전이 영구 저장해 둔 "꺼짐" 플래그가 남아 있으면 자동재생이 막히므로 제거
  try { localStorage.removeItem("incheon-bgm-playing"); } catch { /* 무시 */ }

  const updateAudioUI = () => {
    if (!audio || !button || !bars || !buttonText) return;
    const audible = !audio.paused && !audio.muted;
    bars.classList.toggle("playing", audible);
    buttonText.textContent = audible ? "BGM" : "PLAY";
    button.setAttribute("aria-pressed", String(audible));
    button.setAttribute("aria-label", audible ? "배경음악 일시정지" : "배경음악 재생");
  };

  if (audio && button && volumeInput && volumeOutput) {
    // iOS: 무음(진동) 스위치가 켜져 있어도 배경음악이 나오도록 세션 종류를 지정
    try {
      if (navigator.audioSession) navigator.audioSession.type = "playback";
    } catch { /* 미지원 브라우저 */ }

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

    const wantsMusic = () => readSession(pausedKey) !== "1";

    // 사용자 제스처 핸들러 안에서 동기적으로 호출되어야 모바일에서 통과된다
    const startPlayback = (allowMutedFallback) => {
      if (!wantsMusic() || !audio.paused) return;
      if (audio.readyState === 0) { try { audio.load(); } catch { /* 무시 */ } }
      const request = audio.play();
      if (!request || typeof request.catch !== "function") return;
      request.catch(() => {
        // 소리 있는 재생이 막히면 일단 음소거 상태로 틀어두고,
        // 첫 터치가 들어오는 순간 소리를 켠다.
        if (!allowMutedFallback || !wantsMusic() || !audio.paused) return;
        audio.muted = true;
        const silent = audio.play();
        if (silent && typeof silent.catch === "function") {
          silent.catch(() => { audio.muted = false; });
        }
      });
    };

    const GESTURES = [
      "touchstart", "touchend", "pointerdown", "pointerup", "mousedown",
      "click", "keydown", "wheel", "scroll", "pointermove", "mousemove"
    ];
    const settle = () => {
      if (!audio.paused && !audio.muted) {
        disarmGestures();
        document.body.classList.remove("bgm-waiting");
      }
      updateAudioUI();
    };
    const onGesture = () => {
      if (audio.muted) {
        audio.muted = false;
        audio.volume = Number(volumeInput.value) / 100;
      }
      startPlayback(false);
      window.setTimeout(settle, 0);
    };
    function armGestures() {
      GESTURES.forEach((type) => {
        document.addEventListener(type, onGesture, { capture: true, passive: true });
        window.addEventListener(type, onGesture, { capture: true, passive: true });
      });
    }
    function disarmGestures() {
      GESTURES.forEach((type) => {
        document.removeEventListener(type, onGesture, true);
        window.removeEventListener(type, onGesture, true);
      });
    }

    startPlayback(true);   // 1) 진입 즉시 시도 (막히면 음소거로라도 시작)
    armGestures();         // 2) 어떤 동작이든 첫 신호에 소리 켜기

    audio.addEventListener("playing", settle);
    audio.addEventListener("pause", () => { if (wantsMusic()) armGestures(); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) startPlayback(true);
    });
    window.addEventListener("pageshow", () => startPlayback(true));

    // 그래도 소리가 안 나면 재생 버튼을 깜빡여 알린다
    window.setTimeout(() => {
      if ((audio.paused || audio.muted) && wantsMusic()) {
        document.body.classList.add("bgm-waiting");
      }
    }, 1200);

    button.addEventListener("click", () => {
      if (audio.paused || audio.muted) {
        writeSession(pausedKey, null);
        audio.muted = false;
        startPlayback(false);
      } else {
        audio.pause();
        writeSession(pausedKey, "1");
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
