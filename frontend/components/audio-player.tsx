"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes mock duration
  const [volume, setVolume] = useState([80])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Mock audio playback simulation
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, duration])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const skipBackward = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const skipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Waveform Visualization (Mock) */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-center h-20">
              <div className="flex items-end space-x-1">
                {Array.from({ length: 50 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t ${
                      i < (currentTime / duration) * 50 ? "opacity-100" : "opacity-30"
                    }`}
                    style={{
                      height: `${Math.random() * 60 + 10}px`,
                      animation: isPlaying ? `pulse ${Math.random() * 2 + 1}s infinite` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="sm" onClick={skipBackward} className="rounded-full">
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlayPause}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </Button>

            <Button variant="outline" size="sm" onClick={skipForward} className="rounded-full">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <Slider value={volume} max={100} step={1} onValueChange={setVolume} className="flex-1" />
            <span className="text-sm text-gray-500 w-8">{volume[0]}%</span>
          </div>

          {/* Audio Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Language:</span>
                <span className="ml-2 font-medium">Hausa</span>
              </div>
              <div>
                <span className="text-gray-600">Quality:</span>
                <span className="ml-2 font-medium">High (48kHz)</span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <span className="ml-2 font-medium">2.1 MB</span>
              </div>
              <div>
                <span className="text-gray-600">Encrypted:</span>
                <span className="ml-2 font-medium text-green-600">Yes</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
