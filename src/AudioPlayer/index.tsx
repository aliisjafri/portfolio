import React, { useState, useRef, useEffect, useCallback } from 'react'
import StatusIndicator from './StatusIndicator'

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
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const isPlayingRef = useRef<boolean>(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef<number | null>(null)
  const [repeatCountInput, setRepeatCountInput] = useState(
    String(state.repeatCount),
  )

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

  useEffect(() => {
    return () => {
      cleanupAudio()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const cleanupAudio = useCallback(() => {
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
    const audioBuffer = getSelectedAudioBuffer()
    if (!audioBuffer || !isPlayingRef.current) return

    try {
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
    } catch (error) {
      console.error('Error playing audio:', error)
      stopAudio()
    }
  }, [getSelectedAudioBuffer, initializeAudioContext])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = window.setInterval(() => {
      if (!audioContextRef.current || !isPlayingRef.current) return

      const elapsed = audioContextRef.current.currentTime - startTimeRef.current
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
  }, [])

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

    cleanupAudio()
  }, [cleanupAudio])

  const startRecording = async () => {
    if (state.status !== 'idle') return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })
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

          const clipId = Date.now().toString()
          const fileName = `Recording ${new Date().toLocaleTimeString()}`

          const newClip: AudioClip = {
            id: clipId,
            name: fileName,
            originalName: fileName,
            duration: audioBuffer.duration,
            audioBuffer,
            originalFile: new File([audioBlob], `${fileName}.webm`, {
              type: mediaRecorder.mimeType,
            }),
          }

          setState(prev => ({
            ...prev,
            audioFile: newClip.originalFile,
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
      alert('Error accessing microphone. Please check permissions.')
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
                      aria-label="Download clip"
                    >
                      <i className="fas fa-download text-lg"></i>
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
