"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Play, Pause, Square, RotateCcw } from "lucide-react"

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioUrl(url)
        onRecordingComplete(blob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioBlob(null)
    setAudioUrl("")
    setRecordingTime(0)
    setIsPlaying(false)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Record Agreement Terms</h3>
            <p className="text-gray-600 text-sm">
              Record your agreement in your preferred language. The audio will be encrypted and stored securely.
            </p>
          </div>

          {/* Recording Status */}
          <div className="flex items-center justify-center space-x-4">
            {isRecording && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Recording
              </Badge>
            )}

            <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            {!isRecording && !audioBlob && (
              <Button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            )}

            {audioBlob && (
              <div className="flex space-x-2">
                <Button onClick={isPlaying ? pauseAudio : playAudio} variant="outline" className="px-6 py-2">
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>

                <Button onClick={resetRecording} variant="outline" className="px-6 py-2">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Re-record
                </Button>
              </div>
            )}
          </div>

          {/* Audio Element */}
          {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />}

          {/* Recording Tips */}
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h4 className="font-medium text-blue-900 mb-2">Recording Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Speak clearly and at a moderate pace</li>
              <li>• Include all important terms and conditions</li>
              <li>• State the names of all parties involved</li>
              <li>• Mention the date and location if relevant</li>
              <li>• Keep the recording under 10 minutes for optimal storage</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
