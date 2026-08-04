"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioController() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(42);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const saved = window.localStorage.getItem("yeonpo-bgm-volume");
    const initialVolume = saved === null ? 42 : Math.min(100, Math.max(0, Number(saved)));
    setVolume(initialVolume);
    audio.volume = initialVolume / 100;

    const play = async () => {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    void play();
    const unlock = () => void play();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const changeVolume = (next: number) => {
    const audio = audioRef.current;
    setVolume(next);
    window.localStorage.setItem("yeonpo-bgm-volume", String(next));
    if (audio) audio.volume = next / 100;
  };

  return (
    <aside className="audio-control" aria-label="배경음악 제어">
      <audio
        ref={audioRef}
        src="/assets/rise-instrumental.mp3"
        autoPlay
        loop
        preload="auto"
        playsInline
      />
      <button type="button" onClick={toggle} aria-pressed={playing} aria-label={playing ? "배경음악 일시정지" : "배경음악 재생"}>
        <span className={`audio-bars ${playing ? "playing" : ""}`} aria-hidden="true"><i /><i /><i /></span>
        <span>{playing ? "BGM" : "PLAY"}</span>
      </button>
      <label>
        <span className="sr-only">배경음악 볼륨</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={(event) => changeVolume(Number(event.target.value))}
          aria-label={`배경음악 볼륨 ${volume}%`}
        />
      </label>
      <output>{String(volume).padStart(2, "0")}</output>
    </aside>
  );
}
