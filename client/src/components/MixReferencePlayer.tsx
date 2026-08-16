import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Version = "before" | "after";

interface MixReferencePlayerProps {
  id: string;
  beforeSrc: string;
  afterSrc: string;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export default function MixReferencePlayer({ id, beforeSrc, afterSrc }: MixReferencePlayerProps) {
  const beforeRef = useRef<HTMLAudioElement>(null);
  const afterRef = useRef<HTMLAudioElement>(null);
  const sharedDurationRef = useRef(0);
  const activeVersionRef = useRef<Version>("before");
  const [activeVersion, setActiveVersion] = useState<Version>("before");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const getAudio = (version: Version) => version === "before" ? beforeRef.current : afterRef.current;

  const pauseBoth = () => {
    [beforeRef.current, afterRef.current].forEach((audio) => {
      if (!audio) return;
      audio.pause();
      audio.volume = 1;
    });
    setIsPlaying(false);
  };

  useEffect(() => {
    const stopOtherPlayer = (event: Event) => {
      const playingId = (event as CustomEvent<string>).detail;
      if (playingId !== id) pauseBoth();
    };

    window.addEventListener("tfb-mix-play", stopOtherPlayer);
    return () => {
      window.removeEventListener("tfb-mix-play", stopOtherPlayer);
      pauseBoth();
    };
  }, [id]);

  const updateDuration = () => {
    const beforeDuration = beforeRef.current?.duration;
    const afterDuration = afterRef.current?.duration;
    if (!beforeDuration || !afterDuration || !Number.isFinite(beforeDuration) || !Number.isFinite(afterDuration)) return;

    const sharedDuration = Math.min(beforeDuration, afterDuration);
    sharedDurationRef.current = sharedDuration;
    setDuration(sharedDuration);
  };

  const handleTimeUpdate = (version: Version) => {
    if (version !== activeVersionRef.current) return;
    const audio = getAudio(version);
    if (!audio) return;

    if (sharedDurationRef.current && audio.currentTime >= sharedDurationRef.current - 0.05) {
      pauseBoth();
      setCurrentTime(sharedDurationRef.current);
      return;
    }

    setCurrentTime(audio.currentTime);
  };

  const togglePlayback = async () => {
    const activeAudio = getAudio(activeVersionRef.current);
    if (!activeAudio) return;

    if (isPlaying) {
      pauseBoth();
      return;
    }

    if (duration && activeAudio.currentTime >= duration - 0.05) {
      beforeRef.current!.currentTime = 0;
      afterRef.current!.currentTime = 0;
      setCurrentTime(0);
    }

    try {
      window.dispatchEvent(new CustomEvent("tfb-mix-play", { detail: id }));
      await activeAudio.play();
      setIsPlaying(true);
      setError(false);
    } catch {
      setError(true);
      setIsPlaying(false);
    }
  };

  const switchVersion = async (nextVersion: Version) => {
    if (nextVersion === activeVersionRef.current) return;

    const currentAudio = getAudio(activeVersionRef.current);
    const nextAudio = getAudio(nextVersion);
    if (!currentAudio || !nextAudio) return;

    const wasPlaying = isPlaying;
    const switchTime = Math.min(currentAudio.currentTime, nextAudio.duration || currentAudio.currentTime);
    nextAudio.currentTime = switchTime;
    activeVersionRef.current = nextVersion;
    setActiveVersion(nextVersion);
    setCurrentTime(switchTime);

    if (!wasPlaying) {
      currentAudio.pause();
      return;
    }

    try {
      currentAudio.pause();
      await nextAudio.play();
    } catch {
      currentAudio.pause();
      currentAudio.volume = 1;
      nextAudio.volume = 1;
      setError(true);
      setIsPlaying(false);
    }
  };

  const seek = (nextTime: number) => {
    [beforeRef.current, afterRef.current].forEach((audio) => {
      if (audio) audio.currentTime = Math.min(nextTime, audio.duration || nextTime);
    });
    setCurrentTime(nextTime);
  };

  const restart = () => seek(0);

  return (
    <div className="space-y-5">
      <audio ref={beforeRef} src={beforeSrc} preload="metadata" onLoadedMetadata={updateDuration} onTimeUpdate={() => handleTimeUpdate("before")} onError={() => setError(true)} />
      <audio ref={afterRef} src={afterSrc} preload="metadata" onLoadedMetadata={updateDuration} onTimeUpdate={() => handleTimeUpdate("after")} onError={() => setError(true)} />

      <div className="grid grid-cols-2 rounded-xl border border-border bg-black/35 p-1" aria-label="Choose mix version">
        <button
          type="button"
          onClick={() => switchVersion("before")}
          className={`rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${activeVersion === "before" ? "bg-white/10 text-white shadow-sm" : "text-muted-foreground hover:text-white"}`}
          aria-pressed={activeVersion === "before"}
        >
          Before · Rough
        </button>
        <button
          type="button"
          onClick={() => switchVersion("after")}
          className={`rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${activeVersion === "after" ? "bg-primary text-white shadow-[0_0_18px_hsl(var(--primary)/.28)]" : "text-muted-foreground hover:text-white"}`}
          aria-pressed={activeVersion === "after"}
        >
          After · Master
        </button>
      </div>

      <div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-primary"
          aria-label="Audio position"
        />
        <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Hearing: <span className={activeVersion === "after" ? "text-primary" : "text-white"}>{activeVersion === "before" ? "Rough mix" : "J11 master"}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="icon" onClick={restart} aria-label="Restart audio">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button type="button" size="lg" className="min-w-32 gap-2" onClick={togglePlayback} disabled={!duration}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">This audio could not be played. Please refresh and try again.</p>}
    </div>
  );
}
