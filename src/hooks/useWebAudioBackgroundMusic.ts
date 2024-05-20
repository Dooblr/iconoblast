// src/hooks/useWebAudioBackgroundMusic.ts

import { useEffect, useRef } from "react";

const useWebAudioBackgroundMusic = (isPaused: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const fetchAudioBuffer = async (context: AudioContext) => {
      const response = await fetch("/src/assets/audio/music.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await context.decodeAudioData(arrayBuffer);
      return audioBuffer;
    };

    const playAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const context = audioContextRef.current;

      if (bufferSourceRef.current) {
        bufferSourceRef.current.stop();
      }

      const buffer = await fetchAudioBuffer(context);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopEnd = 33.389; // Set the loop end point
      source.connect(context.destination);
      source.start(0);
      bufferSourceRef.current = source;
    };

    if (isPaused) {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.suspend();
      }
    } else {
      if (audioContextRef.current) {
        if (audioContextRef.current.state === "suspended") {
          audioContextRef.current.resume();
        } else if (audioContextRef.current.state !== "running") {
          playAudio();
        }
      } else {
        playAudio();
      }
    }

    return () => {
      if (bufferSourceRef.current) {
        bufferSourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isPaused]);
};

export default useWebAudioBackgroundMusic;
