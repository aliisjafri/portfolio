import React, { useState, useRef, useEffect, useCallback } from 'react'
import StatusIndicator from './StatusIndicator'
import lamejs from '@breezystack/lamejs'

const convertToMp3 = async (audioBuffer: AudioBuffer): Promise<Uint8Array> => {
  try {
    const channels = Math.min(audioBuffer.numberOfChannels, 2) // Limit to stereo
    const sampleRate = audioBuffer.sampleRate
    const kbps = 128

    // Initialize encoder with error handling
    let encoder: lamejs.Mp3Encoder
    try {
      encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps)
    } catch (error) {
      console.error('Failed to create MP3 encoder:', error)
      throw new Error('MP3 encoding not supported in this browser')
    }

    const mp3Data: Uint8Array[] = []
    const sampleBlockSize = 1152 // Required by lamejs

    if (channels === 1) {
      // Mono encoding
      const samples = audioBuffer.getChannelData(0)

      for (let i = 0; i < samples.length; i += sampleBlockSize) {
        const sampleChunk = samples.subarray(i, i + sampleBlockSize)
        const int16Buffer = new Int16Array(sampleChunk.length)

        for (let j = 0; j < sampleChunk.length; j++) {
          int16Buffer[j] = Math.max(
            -32768,
            Math.min(32767, sampleChunk[j] * 32767),
          )
        }

        const mp3buf = encoder.encodeBuffer(int16Buffer)
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf)
        }
      }
    } else {
      // Stereo encoding
      const leftSamples = audioBuffer.getChannelData(0)
      const rightSamples = audioBuffer.getChannelData(1)

      for (let i = 0; i < leftSamples.length; i += sampleBlockSize) {
        const leftChunk = leftSamples.subarray(i, i + sampleBlockSize)
        const rightChunk = rightSamples.subarray(i, i + sampleBlockSize)

        const leftInt16 = new Int16Array(leftChunk.length)
        const rightInt16 = new Int16Array(rightChunk.length)

        for (let j = 0; j < leftChunk.length; j++) {
          leftInt16[j] = Math.max(-32768, Math.min(32767, leftChunk[j] * 32767))
          rightInt16[j] = Math.max(
            -32768,
            Math.min(32767, rightChunk[j] * 32767),
          )
        }

        const mp3buf = encoder.encodeBuffer(leftInt16, rightInt16)
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf)
        }
      }
    }

    // Flush remaining data
    const mp3buf = encoder.flush()
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }

    // Combine all MP3 data
    let totalLength = 0
    mp3Data.forEach(data => {
      totalLength += data.length
    })

    const result = new Uint8Array(totalLength)
    let offset = 0
    mp3Data.forEach(data => {
      result.set(data, offset)
      offset += data.length
    })

    return result
  } catch (error) {
    console.error('MP3 conversion error:', error)
    throw error
  }
}

type AudioClip = {
  id: string
  name: string
  originalName: string
  duration: number
  audioBuffer: AudioBuffer
  originalFile: File
}

type AudioPlayerState = {
  status: 'playing' | 'recording' | 'idle'
  repeatCount: number
  currentCount: number
  audioFile: File | null
  duration: number
  remainingTime: number
  clips: AudioClip[]
  selectedClipId: string | null
  isLoading: boolean
}

const AudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    status: 'idle',
    repeatCount: 1,
    currentCount: 0,
    audioFile: null,
    duration: 0,
    remainingTime: 0,
    clips: [],
    selectedClipId: null,
    isLoading: false,
  })

  const currentCountRef = useRef<number>(0)
  const durationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null)
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const isPlayingRef = useRef<boolean>(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [repeatCountInput, setRepeatCountInput] = useState(
    String(state.repeatCount),
  )
  const [showClipEditor, setShowClipEditor] = useState<string | null>(null)
  const [clipStartTime, setClipStartTime] = useState('0')
  const [clipEndTime, setClipEndTime] = useState('0')
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false)
  const previewSourceRef = useRef<AudioBufferSourceNode | null>(null)

  const MAX_FILE_SIZE_MB = 25 // 25 MB limit
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
  const MAX_RECORDING_DURATION_S = 5 * 60 // 5 minutes

  useEffect(() => {
    currentCountRef.current = state.currentCount
  }, [state.currentCount])

  useEffect(() => {
    durationRef.current = state.duration
  }, [state.duration])

  useEffect(() => {
    isPlayingRef.current = state.status === 'playing'
  }, [state.status])

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = [
        'mobile',
        'android',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone',
      ]
      return (
        mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
        'ontouchstart' in window ||
        window.innerWidth <= 768
      )
    }
    setIsMobile(checkMobile())
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (htmlAudioRef.current) {
        htmlAudioRef.current.pause()
        htmlAudioRef.current.src = ''
      }
    }
  }, [])

  const cleanupAudio = useCallback(() => {
    // Clean up Web Audio API
    if (sourceRef.current) {
      try {
        sourceRef.current.stop()
        sourceRef.current.disconnect()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error stopping audio source:', e)
      }
      sourceRef.current = null
    }

    // Clean up HTML5 audio
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause()
      if (htmlAudioRef.current.src) {
        URL.revokeObjectURL(htmlAudioRef.current.src)
        htmlAudioRef.current.src = ''
      }
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const initializeAudioContext = useCallback(async () => {
    if (
      !audioContextRef.current ||
      audioContextRef.current.state === 'closed'
    ) {
      audioContextRef.current = new AudioContext()
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    return audioContextRef.current
  }, [])

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file || state.status !== 'idle') return

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(
        `File is too large (${(file.size / 1024 / 1024).toFixed(
          1,
        )} MB). Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB.`,
      )
      event.target.value = '' // Clear the input
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const audioContext = await initializeAudioContext()
      const arrayBuffer = await file.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const clipId = Date.now().toString()
      const originalName = file.name.replace(/\.[^/.]+$/, '')
      const newClip: AudioClip = {
        id: clipId,
        name: originalName,
        originalName: originalName,
        duration: audioBuffer.duration,
        audioBuffer,
        originalFile: file,
      }

      setState(prev => ({
        ...prev,
        audioFile: file,
        duration: audioBuffer.duration,
        remainingTime: audioBuffer.duration,
        clips: [...prev.clips, newClip],
        selectedClipId: clipId,
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error loading audio file:', error)
      alert('Error loading audio file. Please try a different file.')
      setState(prev => ({ ...prev, isLoading: false }))
    }

    event.target.value = ''
  }

  const getSelectedAudioBuffer = useCallback((): AudioBuffer | null => {
    if (!state.selectedClipId) return null
    const selectedClip = state.clips.find(
      clip => clip.id === state.selectedClipId,
    )
    return selectedClip?.audioBuffer || null
  }, [state.selectedClipId, state.clips])

  const playAudio = useCallback(async (): Promise<void> => {
    const selectedClip = state.clips.find(
      clip => clip.id === state.selectedClipId,
    )
    if (!selectedClip || !isPlayingRef.current) return

    try {
      if (isMobile) {
        // Use HTML5 audio for mobile devices
        if (!htmlAudioRef.current) {
          htmlAudioRef.current = new Audio()
        }

        const audio = htmlAudioRef.current
        audio.src = URL.createObjectURL(selectedClip.originalFile)

        audio.onended = () => {
          if (!isPlayingRef.current) return

          const newCount = currentCountRef.current - 1
          setState(prev => ({ ...prev, currentCount: newCount }))

          if (newCount > 0) {
            setTimeout(() => playAudio(), 50)
          } else {
            stopAudio()
          }
        }

        // Start playing
        await audio.play()
        startTimeRef.current = Date.now() / 1000
        startTimer()
      } else {
        // Use Web Audio API for desktop
        const audioBuffer = getSelectedAudioBuffer()
        if (!audioBuffer) return

        const audioContext = await initializeAudioContext()

        if (sourceRef.current) {
          sourceRef.current.disconnect()
        }

        startTimeRef.current = audioContext.currentTime
        sourceRef.current = audioContext.createBufferSource()
        sourceRef.current.buffer = audioBuffer
        sourceRef.current.connect(audioContext.destination)

        sourceRef.current.onended = () => {
          if (!isPlayingRef.current) return

          const newCount = currentCountRef.current - 1
          setState(prev => ({ ...prev, currentCount: newCount }))

          if (newCount > 0) {
            setTimeout(() => playAudio(), 50)
          } else {
            stopAudio()
          }
        }

        sourceRef.current.start(0)
        startTimer()
      }
    } catch (error) {
      console.error('Error playing audio:', error)
      stopAudio()
    }
  }, [
    getSelectedAudioBuffer,
    initializeAudioContext,
    isMobile,
    state.clips,
    state.selectedClipId,
  ])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = window.setInterval(() => {
      if (!isPlayingRef.current) return

      let elapsed: number
      if (isMobile && htmlAudioRef.current) {
        // For mobile HTML5 audio
        elapsed = htmlAudioRef.current.currentTime || 0
      } else if (audioContextRef.current) {
        // For desktop Web Audio API
        elapsed = audioContextRef.current.currentTime - startTimeRef.current
      } else {
        return
      }

      const remaining = durationRef.current - elapsed

      setState(prev => ({
        ...prev,
        remainingTime: remaining > 0 ? remaining : 0,
      }))

      if (remaining <= 0) {
        clearInterval(timerRef.current!)
        timerRef.current = null
      }
    }, 100)
  }, [isMobile])

  const startPlayback = useCallback(() => {
    if (
      state.repeatCount < 1 ||
      !getSelectedAudioBuffer() ||
      state.status !== 'idle'
    )
      return

    setState(prev => ({
      ...prev,
      status: 'playing',
      currentCount: prev.repeatCount,
    }))

    setTimeout(() => playAudio(), 0)
  }, [state.repeatCount, state.status, getSelectedAudioBuffer, playAudio])

  const stopAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'idle',
      remainingTime: prev.duration,
    }))

    // Stop HTML5 audio if playing on mobile
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause()
      htmlAudioRef.current.currentTime = 0
      URL.revokeObjectURL(htmlAudioRef.current.src)
      htmlAudioRef.current.src = ''
    }

    cleanupAudio()
  }, [cleanupAudio])

  const startRecording = async () => {
    if (state.status !== 'idle') return

    try {
      // Ensure audio context is ready (important for iOS)
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'suspended'
      ) {
        await audioContextRef.current.resume()
      }

      // Check if MediaRecorder is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          'Recording is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.',
        )
        return
      }

      // iOS Safari specific constraints
      const constraints = {
        audio: {
          channelCount: 1, // Mono for better iOS compatibility
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // Determine the best MIME type for the device
      let mimeType = 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4' // iOS Safari often prefers MP4
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav'
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType,
          })

          const audioContext = await initializeAudioContext()
          const arrayBuffer = await audioBlob.arrayBuffer()
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

          // Convert to MP3
          const mp3Buffer = await convertToMp3(audioBuffer)

          const clipId = Date.now().toString()
          const fileName = `Recording ${new Date().toLocaleTimeString()}`

          const audioFile = new File([mp3Buffer], `${fileName}.mp3`, {
            type: 'audio/mpeg',
          })

          const newClip: AudioClip = {
            id: clipId,
            name: fileName,
            originalName: fileName,
            duration: audioBuffer.duration,
            audioBuffer,
            originalFile: audioFile,
          }

          setState(prev => ({
            ...prev,
            audioFile: audioFile,
            duration: audioBuffer.duration,
            remainingTime: audioBuffer.duration,
            status: 'idle',
            clips: [...prev.clips, newClip],
            selectedClipId: clipId,
          }))

          audioChunksRef.current = []
        } catch (error) {
          console.error('Error processing recording:', error)
          alert('Error processing recording. Please try again.')
          setState(prev => ({ ...prev, status: 'idle' }))
        }

        stream.getTracks().forEach(track => track.stop())

        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
      }

      mediaRecorder.start(100)
      setRecordingTime(MAX_RECORDING_DURATION_S)

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prevTime => {
          const newTime = prevTime - 1
          if (newTime <= 0) {
            stopRecording()
            return 0
          }
          return newTime
        })
      }, 1000)

      setState(prev => ({ ...prev, status: 'recording' }))
    } catch (error) {
      console.error('Error accessing microphone:', error)

      // Provide iOS-specific error messages
      let errorMessage = 'Error accessing microphone.'

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage =
            'Microphone access denied. Please:\n\n' +
            '• Go to Settings > Safari > Camera & Microphone\n' +
            '• Allow access for this website\n' +
            '• Refresh the page and try again'
        } else if (error.name === 'NotFoundError') {
          errorMessage =
            'No microphone found. Please check that your device has a microphone.'
        } else if (error.name === 'NotSupportedError') {
          errorMessage =
            'Recording is not supported on this device/browser. Try using Safari on iOS or Chrome on desktop.'
        } else if (error.name === 'SecurityError') {
          errorMessage =
            "Microphone access blocked by security policy. Please ensure you're using HTTPS and try again."
        }
      }

      alert(errorMessage)
      setState(prev => ({ ...prev, status: 'idle' }))
    }
  }

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.status === 'recording') {
      mediaRecorderRef.current.stop()
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }, [state.status])

  const selectClip = useCallback(
    (clipId: string) => {
      if (state.status !== 'idle') return

      const selectedClip = state.clips.find(clip => clip.id === clipId)
      if (!selectedClip) return

      setState(prev => ({
        ...prev,
        selectedClipId: clipId,
        audioFile: selectedClip.originalFile,
        duration: selectedClip.duration,
        remainingTime: selectedClip.duration,
      }))
    },
    [state.clips, state.status],
  )

  const deleteClip = useCallback(
    (id: string) => {
      if (state.status !== 'idle') return

      setState(prev => {
        const newClips = prev.clips.filter(clip => clip.id !== id)
        const wasSelected = prev.selectedClipId === id

        return {
          ...prev,
          clips: newClips,
          selectedClipId: wasSelected
            ? newClips[0]?.id || null
            : prev.selectedClipId,
          audioFile: wasSelected
            ? newClips[0]?.originalFile || null
            : prev.audioFile,
          duration: wasSelected ? newClips[0]?.duration || 0 : prev.duration,
          remainingTime: wasSelected
            ? newClips[0]?.duration || 0
            : prev.remainingTime,
        }
      })
    },
    [state.status],
  )

  const updateClipName = useCallback((id: string, newName: string) => {
    setState(prev => ({
      ...prev,
      clips: prev.clips.map(clip =>
        clip.id === id ? { ...clip, name: newName } : clip,
      ),
    }))
  }, [])

  const handleClipNameBlur = useCallback(
    (id: string, currentName: string) => {
      const trimmedName = currentName.trim()
      if (trimmedName === '') {
        const clip = state.clips.find(c => c.id === id)
        if (clip) {
          updateClipName(id, clip.originalName)
        }
      }
    },
    [state.clips, updateClipName],
  )

  const handleRepeatCountInputChange = useCallback((value: string) => {
    if (value === '') {
      setRepeatCountInput('')
      setState(prev => ({ ...prev, repeatCount: 0 }))
      return
    }

    const parsedCount = parseInt(value, 10)

    if (isNaN(parsedCount)) {
      setRepeatCountInput('')
      setState(prev => ({ ...prev, repeatCount: 0 }))
      return
    }

    const newCount = Math.max(0, Math.min(1000, parsedCount))

    setRepeatCountInput(String(newCount))
    setState(prev => ({
      ...prev,
      repeatCount: newCount,
    }))
  }, [])

  const selectedClip = state.clips.find(
    clip => clip.id === state.selectedClipId,
  )
  const canOperate = state.status === 'idle' && !state.isLoading
  const hasSelectedClip = selectedClip !== undefined

  const handleDownloadClip = useCallback(
    (id: string) => {
      if (state.status !== 'idle') return

      const clipToDownload = state.clips.find(clip => clip.id === id)
      if (!clipToDownload) return

      const link = document.createElement('a')
      link.href = URL.createObjectURL(clipToDownload.originalFile)
      link.download = clipToDownload.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    },
    [state.clips, state.status],
  )

  const handleDownloadLoopedClip = useCallback(
    async (id: string) => {
      if (state.status !== 'idle' || state.repeatCount === 0) return

      const clipToDownload = state.clips.find(clip => clip.id === id)
      if (!clipToDownload) return

      try {
        setState(prev => ({ ...prev, isLoading: true }))

        // Create looped audio buffer
        const originalBuffer = clipToDownload.audioBuffer
        const loopCount = state.repeatCount
        const newLength = originalBuffer.length * loopCount
        const numberOfChannels = originalBuffer.numberOfChannels
        const sampleRate = originalBuffer.sampleRate

        // Create new audio buffer for looped version
        const audioContext = await initializeAudioContext()
        const loopedBuffer = audioContext.createBuffer(
          numberOfChannels,
          newLength,
          sampleRate,
        )

        // Copy original audio data multiple times
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const originalChannelData = originalBuffer.getChannelData(channel)
          const loopedChannelData = loopedBuffer.getChannelData(channel)

          for (let loop = 0; loop < loopCount; loop++) {
            const offset = loop * originalBuffer.length
            loopedChannelData.set(originalChannelData, offset)
          }
        }

        // Convert looped buffer to MP3
        const mp3Buffer = await convertToMp3(loopedBuffer)

        const fileName = `${clipToDownload.name} (${loopCount}x Loop)`
        const loopedFile = new File([mp3Buffer], `${fileName}.mp3`, {
          type: 'audio/mpeg',
        })

        // Download the looped file
        const link = document.createElement('a')
        link.href = URL.createObjectURL(loopedFile)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)

        setState(prev => ({ ...prev, isLoading: false }))
      } catch (error) {
        console.error('Error creating looped download:', error)
        alert('Error creating looped version. Please try again.')
        setState(prev => ({ ...prev, isLoading: false }))
      }
    },
    [state.clips, state.status, state.repeatCount, initializeAudioContext],
  )

  const handleOpenClipEditor = useCallback(
    (id: string) => {
      const clip = state.clips.find(c => c.id === id)
      if (!clip) return

      setShowClipEditor(id)
      setClipStartTime('0')
      setClipEndTime(clip.duration.toFixed(1))
    },
    [state.clips],
  )

  const handleCreateClip = useCallback(async () => {
    if (!showClipEditor) return

    const originalClip = state.clips.find(c => c.id === showClipEditor)
    if (!originalClip) return

    const startTime = parseFloat(clipStartTime)
    const endTime = parseFloat(clipEndTime)

    // Validation
    if (isNaN(startTime) || isNaN(endTime)) {
      alert('Please enter valid start and end times')
      return
    }

    if (startTime < 0 || endTime > originalClip.duration) {
      alert(
        `Times must be between 0 and ${originalClip.duration.toFixed(
          1,
        )} seconds`,
      )
      return
    }

    if (startTime >= endTime) {
      alert('Start time must be less than end time')
      return
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }))

      // Create clipped audio buffer
      const originalBuffer = originalClip.audioBuffer
      const sampleRate = originalBuffer.sampleRate
      const numberOfChannels = originalBuffer.numberOfChannels

      const startSample = Math.floor(startTime * sampleRate)
      const endSample = Math.floor(endTime * sampleRate)
      const newLength = endSample - startSample

      const audioContext = await initializeAudioContext()
      const clippedBuffer = audioContext.createBuffer(
        numberOfChannels,
        newLength,
        sampleRate,
      )

      // Copy the selected portion
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalChannelData = originalBuffer.getChannelData(channel)
        const clippedChannelData = clippedBuffer.getChannelData(channel)

        for (let i = 0; i < newLength; i++) {
          clippedChannelData[i] = originalChannelData[startSample + i]
        }
      }

      // Convert to MP3
      const mp3Buffer = await convertToMp3(clippedBuffer)

      const clipId = Date.now().toString()
      const fileName = `${originalClip.name} (${startTime}s-${endTime}s)`

      const clippedFile = new File([mp3Buffer], `${fileName}.mp3`, {
        type: 'audio/mpeg',
      })

      const newClip: AudioClip = {
        id: clipId,
        name: fileName,
        originalName: fileName,
        duration: clippedBuffer.duration,
        audioBuffer: clippedBuffer,
        originalFile: clippedFile,
      }

      setState(prev => ({
        ...prev,
        clips: [...prev.clips, newClip],
        selectedClipId: clipId,
        audioFile: clippedFile,
        duration: clippedBuffer.duration,
        remainingTime: clippedBuffer.duration,
        isLoading: false,
      }))

      // Close the clip editor
      setShowClipEditor(null)
    } catch (error) {
      console.error('Error creating clip:', error)
      alert('Error creating clip. Please try again.')
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [
    showClipEditor,
    state.clips,
    clipStartTime,
    clipEndTime,
    initializeAudioContext,
  ])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(1)
    return `${mins}:${secs.padStart(4, '0')}`
  }, [])

  const handlePreviewClip = useCallback(async () => {
    if (!showClipEditor || isPreviewPlaying) return

    const originalClip = state.clips.find(c => c.id === showClipEditor)
    if (!originalClip) return

    const startTime = parseFloat(clipStartTime)
    const endTime = parseFloat(clipEndTime)

    // Validation
    if (isNaN(startTime) || isNaN(endTime) || startTime >= endTime) {
      alert('Please enter valid start and end times')
      return
    }

    try {
      const audioContext = await initializeAudioContext()
      const source = audioContext.createBufferSource()
      source.buffer = originalClip.audioBuffer
      source.connect(audioContext.destination)

      // Store reference for cleanup
      previewSourceRef.current = source

      setIsPreviewPlaying(true)

      // Start playback at the specified time
      const playDuration = endTime - startTime
      source.start(0, startTime, playDuration)

      // Stop preview when it ends
      source.onended = () => {
        setIsPreviewPlaying(false)
        previewSourceRef.current = null
      }
    } catch (error) {
      console.error('Error previewing clip:', error)
      setIsPreviewPlaying(false)
    }
  }, [
    showClipEditor,
    isPreviewPlaying,
    state.clips,
    clipStartTime,
    clipEndTime,
    initializeAudioContext,
  ])

  const handleStopPreview = useCallback(() => {
    if (previewSourceRef.current) {
      previewSourceRef.current.stop()
      previewSourceRef.current = null
    }
    setIsPreviewPlaying(false)
  }, [])

  // Cleanup preview on unmount or when clip editor closes
  useEffect(() => {
    if (!showClipEditor && previewSourceRef.current) {
      handleStopPreview()
    }
  }, [showClipEditor, handleStopPreview])

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-lg max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Audio Player
      </h1>

      {/* File Upload Section */}
      <div className="mb-8">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          disabled={!canOperate}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {state.isLoading && (
          <p className="text-blue-600 text-sm mt-2">Loading audio file...</p>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <button
          onClick={
            state.status === 'recording' ? stopRecording : startRecording
          }
          disabled={state.status === 'playing'}
          className={`inline-flex items-center px-6 py-3 font-medium rounded
            focus:outline-none focus:ring-2 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              state.status === 'recording'
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
        >
          <i
            className={`fas ${
              state.status === 'recording' ? 'fa-stop' : 'fa-microphone'
            } mr-2`}
          ></i>
          {state.status === 'recording' ? (
            <span>
              Stop Recording (
              {`${Math.floor(recordingTime / 60)}:${(recordingTime % 60)
                .toString()
                .padStart(2, '0')}`}
              )
            </span>
          ) : (
            'Record Clip'
          )}
        </button>

        <label className="flex items-center gap-2 text-gray-700">
          Replay Count:
          <input
            type="number"
            min="0"
            max="1000"
            value={repeatCountInput}
            onChange={e => handleRepeatCountInputChange(e.target.value)}
            disabled={!canOperate}
            className="border rounded px-3 py-2 w-24
              focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </label>

        <button
          onClick={state.status === 'playing' ? stopAudio : startPlayback}
          disabled={
            !hasSelectedClip ||
            state.status === 'recording' ||
            state.repeatCount === 0
          }
          className="inline-flex items-center px-6 py-3
            bg-blue-600 text-white font-medium rounded
            hover:bg-blue-700 focus:outline-none
            focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          <i
            className={`fas ${
              state.status === 'playing' ? 'fa-stop' : 'fa-play'
            } mr-2`}
          ></i>
          {state.status === 'playing' ? 'Stop' : 'Start'}
        </button>
      </div>

      {/* Clips Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Audio Clips</h2>
        {state.clips.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No clips available. Upload a file or record a new clip.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {state.clips.map(clip => (
              <div
                key={clip.id}
                onClick={() => canOperate && selectClip(clip.id)}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  clip.id === state.selectedClipId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${!canOperate ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={clip.name}
                      onChange={e => updateClipName(clip.id, e.target.value)}
                      onBlur={e => handleClipNameBlur(clip.id, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      disabled={!canOperate}
                      className="bg-transparent font-medium focus:outline-none w-full
                         disabled:cursor-not-allowed hover:bg-white hover:border hover:border-gray-300
                         focus:bg-white focus:border focus:border-blue-500 rounded px-2 py-1"
                      placeholder="Clip name"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: {clip.duration.toFixed(1)}s
                      {clip.id === state.selectedClipId && (
                        <span className="ml-2 text-blue-600 font-medium">
                          • Selected
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDownloadClip(clip.id)
                      }}
                      disabled={!canOperate}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded
                         hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                      aria-label="Download original clip"
                      title="Download original clip"
                    >
                      <i className="fas fa-download text-lg"></i>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleDownloadLoopedClip(clip.id)
                      }}
                      disabled={!canOperate || state.repeatCount === 0}
                      className="text-purple-600 hover:text-purple-700 p-2 rounded
                         hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                      aria-label={`Download looped version (${state.repeatCount}x)`}
                      title={`Download looped version (${state.repeatCount}x)`}
                    >
                      <i className="fas fa-sync text-lg"></i>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        handleOpenClipEditor(clip.id)
                      }}
                      disabled={!canOperate}
                      className="text-green-600 hover:text-green-700 p-2 rounded
                        hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors"
                      aria-label="Clip audio"
                      title="Create clip from portion of this audio"
                    >
                      <i className="fas fa-cut text-lg"></i>
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        deleteClip(clip.id)
                      }}
                      disabled={!canOperate}
                      className="text-red-600 hover:text-red-700 p-2 rounded
                         hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors"
                      aria-label="Delete clip"
                      title="Delete clip"
                    >
                      <i className="fas fa-trash text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clip Editor */}
      {showClipEditor && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-green-800">
              <i className="fas fa-cut mr-2"></i>
              Create Audio Clip
            </h3>
            <button
              onClick={() => setShowClipEditor(null)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Select the portion of "
              {state.clips.find(c => c.id === showClipEditor)?.name}" to
              extract:
            </p>
            <p className="text-sm text-gray-600">
              Total duration:{' '}
              {formatTime(
                state.clips.find(c => c.id === showClipEditor)?.duration || 0,
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                max={
                  state.clips.find(c => c.id === showClipEditor)?.duration || 0
                }
                value={clipStartTime}
                onChange={e => setClipStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2
                  focus:ring-green-500 focus:border-transparent"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time (seconds)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                max={
                  state.clips.find(c => c.id === showClipEditor)?.duration || 0
                }
                value={clipEndTime}
                onChange={e => setClipEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2
                  focus:ring-green-500 focus:border-transparent"
                placeholder="10.0"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">
                  <i className="fas fa-info-circle mr-1"></i>
                  Clip Preview: {formatTime(
                    parseFloat(clipStartTime) || 0,
                  )} to {formatTime(parseFloat(clipEndTime) || 0)}
                  <span className="ml-2 font-medium">
                    Duration:{' '}
                    {formatTime(
                      Math.max(
                        0,
                        (parseFloat(clipEndTime) || 0) -
                          (parseFloat(clipStartTime) || 0),
                      ),
                    )}
                  </span>
                </p>
              </div>
              <button
                onClick={
                  isPreviewPlaying ? handleStopPreview : handlePreviewClip
                }
                disabled={
                  !clipStartTime ||
                  !clipEndTime ||
                  parseFloat(clipStartTime) >= parseFloat(clipEndTime) ||
                  state.isLoading
                }
                className={`px-4 py-2 rounded font-medium transition-colors
                  ${
                    isPreviewPlaying
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPreviewPlaying ? (
                  <>
                    <i className="fas fa-stop mr-2"></i>
                    Stop Preview
                  </>
                ) : (
                  <>
                    <i className="fas fa-play mr-2"></i>
                    Preview
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCreateClip}
              disabled={
                !clipStartTime ||
                !clipEndTime ||
                parseFloat(clipStartTime) >= parseFloat(clipEndTime) ||
                state.isLoading
              }
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded font-medium
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {state.isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Creating Clip...
                </>
              ) : (
                <>
                  <i className="fas fa-cut mr-2"></i>
                  Create Clip
                </>
              )}
            </button>
            <button
              onClick={() => setShowClipEditor(null)}
              className="px-6 py-3 border border-gray-300 rounded font-medium
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500
                transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Status Dashboard */}
      <div className="grid grid-cols-2 gap-4 text-center p-4 bg-gray-50 rounded">
        <div className="text-gray-600">
          <div className="text-sm">Selected Clip</div>
          <div className="font-medium text-lg">
            {selectedClip?.name || 'None'}
          </div>
        </div>
        <div className="text-gray-600">
          <div className="text-sm">Time Remaining</div>
          <div className="font-medium text-lg">
            {state.remainingTime.toFixed(1)}s
          </div>
        </div>
        <div className="text-gray-600">
          <div className="text-sm">Remaining Plays</div>
          <div className="font-medium text-lg">
            {state.status === 'playing'
              ? state.currentCount
              : state.repeatCount}
          </div>
        </div>
        <div className="text-gray-600">
          <div className="text-sm">Status</div>
          <div className="font-medium text-lg flex items-center justify-center gap-2">
            <StatusIndicator
              status={state.status}
              hasSelectedClip={hasSelectedClip}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
