"use client";

import { useEffect, useRef, useState } from "react";

export type RecorderState = "idle" | "recording" | "stopped";
export interface Recording {
  blob: Blob | null; // null when the mic wasn't available (simulated)
  seconds: number;
}

const BARS = 46;

/**
 * Microphone recorder with live levels for the waveform. Stops itself at
 * `maxSeconds`. Without mic permission it falls back to a simulated take so
 * the flow can still be tried (the answer just has no audio).
 */
export function useRecorder(maxSeconds: number, onDone: (r: Recording) => void) {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.08));
  const [micError, setMicError] = useState<string | null>(null);

  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const raf = useRef<number | null>(null);
  const startedAt = useRef(0);
  const cancelled = useRef(false);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  const stopRef = useRef<() => void>(() => {});

  const cleanup = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    ctx.current?.close().catch(() => {});
    ctx.current = null;
  };

  useEffect(() => cleanup, []);

  const finish = (blob: Blob | null) => {
    const seconds = Math.max(1, Math.min(maxSeconds, (performance.now() - startedAt.current) / 1000));
    cleanup();
    setState("stopped");
    if (!cancelled.current) doneRef.current({ blob, seconds });
  };

  const start = async () => {
    cancelled.current = false;
    chunks.current = [];
    setMicError(null);
    let analyser: AnalyserNode | null = null;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      stream.current = s;
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((m) => MediaRecorder.isTypeSupported(m));
      const r = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => finish(new Blob(chunks.current, { type: r.mimeType || "audio/webm" }));
      rec.current = r;
      ctx.current = new AudioContext();
      analyser = ctx.current.createAnalyser();
      analyser.fftSize = 512;
      ctx.current.createMediaStreamSource(s).connect(analyser);
      r.start(250);
    } catch {
      rec.current = null;
      setMicError("Microphone unavailable — recording a practice run without audio.");
    }
    startedAt.current = performance.now();
    setElapsed(0);
    setState("recording");

    const data = analyser ? new Uint8Array(analyser.fftSize) : null;
    let lastPush = 0;
    const tick = (t: number) => {
      const secs = (performance.now() - startedAt.current) / 1000;
      setElapsed(secs);
      if (t - lastPush > 90) {
        lastPush = t;
        let level: number;
        if (analyser && data) {
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (const v of data) sum += ((v - 128) / 128) ** 2;
          level = Math.min(1, Math.sqrt(sum / data.length) * 4.5);
        } else {
          level = 0.15 + Math.abs(Math.sin(t / 260)) * 0.5 * Math.random() + 0.2 * Math.random();
        }
        setLevels((prev) => [...prev.slice(1), Math.max(0.08, level)]);
      }
      if (secs >= maxSeconds) return stopRef.current();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    if (rec.current && rec.current.state !== "inactive") rec.current.stop(); // onstop → finish
    else finish(null);
  };
  useEffect(() => {
    stopRef.current = stop;
  });

  const cancel = () => {
    cancelled.current = true;
    if (rec.current && rec.current.state !== "inactive") rec.current.stop();
    cleanup();
    setState("idle");
    setLevels(Array(BARS).fill(0.08));
  };

  return { state, elapsed, levels, micError, start, stop, cancel };
}
