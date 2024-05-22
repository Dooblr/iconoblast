// src/audio/AudioEngine.ts

class AudioEngine {
  private audioContext: AudioContext
  private activeSources: Map<string, AudioBufferSourceNode>

  constructor() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)()
    this.activeSources = new Map()
  }

  async loadAudioBuffer(audioSrc: string): Promise<AudioBuffer> {
    const response = await fetch(audioSrc)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer
  }

  async playSound(audioSrc: string, loop: boolean = false): Promise<string> {
    const buffer = await this.loadAudioBuffer(audioSrc)
    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(this.audioContext.destination)
    source.start(0)

    const id = Math.random().toString(36).substr(2, 9) // Generate a unique ID
    this.activeSources.set(id, source)

    source.onended = () => {
      this.activeSources.delete(id)
    }

    return id
  }

  stopSound(id: string) {
    const source = this.activeSources.get(id)
    if (source) {
      source.stop()
      this.activeSources.delete(id)
    }
  }

  async playBackgroundMusic(audioSrc: string) {
    await this.playSound(audioSrc, true)
  }

  async stopAllSounds() {
    this.activeSources.forEach((source) => source.stop())
    this.activeSources.clear()
  }

  suspend() {
    this.audioContext.suspend()
  }

  resume() {
    this.audioContext.resume()
  }
}

export default new AudioEngine()
