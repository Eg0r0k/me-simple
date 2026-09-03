import { watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { play, setEnabled, setVolume, type SoundName } from 'cuelume'

const SOUND_STORAGE_KEY = 'sound-enabled'

const SOUND_VOLUME = 0.3

const SOUND_CONFIRM: SoundName = 'toggle'

const soundEnabled = useStorage(SOUND_STORAGE_KEY, false)

setVolume(SOUND_VOLUME)
setEnabled(soundEnabled.value)

watch(soundEnabled, (value) => setEnabled(value))

export const useSound = () => {
  const cue = (name: SoundName) => {
    if (!soundEnabled.value) {
      return
    }
    play(name)
  }

  const toggleSound = () => {
    const next = !soundEnabled.value
    soundEnabled.value = next

    if (next) {
      setEnabled(true)
      play(SOUND_CONFIRM)
    }
  }

  return {
    soundEnabled,
    cue,
    toggleSound,
  }
}
