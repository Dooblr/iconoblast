// src/hooks/useWebAudioBackgroundMusic.ts

import { useEffect } from "react"
import AudioEngine from "../audio/AudioEngine"

const useWebAudioBackgroundMusic = (isPaused: boolean) => {
  useEffect(() => {
    const playBackgroundMusic = async () => {
      await AudioEngine.playBackgroundMusic("/src/assets/audio/music.mp3")
    }

    playBackgroundMusic()

    if (isPaused) {
      AudioEngine.suspend()
    } else {
      AudioEngine.resume()
    }

    return () => {
      AudioEngine.stopAllSounds()
    }
  }, [isPaused])
}

export default useWebAudioBackgroundMusic
