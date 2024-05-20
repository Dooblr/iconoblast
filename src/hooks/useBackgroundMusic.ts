// src/hooks/useBackgroundMusic.ts

import { useEffect, useRef } from "react"

const useBackgroundMusic = (isPaused: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const duration = 33.3889 // Duration in seconds

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/src/assets/audio/music.mp3")

      // Add event listener for seamless looping
      const handleTimeUpdate = () => {
        if (audioRef.current!.currentTime >= duration) {
          audioRef.current!.currentTime = 0
          audioRef.current!.play()
        }
      }

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
    }

    if (isPaused) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", () => {})
      }
    }
  }, [isPaused, duration])

  return audioRef.current
}

export default useBackgroundMusic
