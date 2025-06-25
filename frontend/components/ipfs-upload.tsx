"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Hash, CheckCircle, AlertCircle } from "lucide-react"

interface IPFSUploadProps {
  content: string | Blob | null
  onUploadComplete: (hash: string) => void
}

export function IPFSUpload({ content, onUploadComplete }: IPFSUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [ipfsHash, setIpfsHash] = useState<string>("")
  const [contentHash, setContentHash] = useState<string>("")

  const simulateUpload = async () => {
    if (!content) return

    setUploadStatus("uploading")

    // Simulate IPFS upload delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock hashes
    const mockIpfsHash = "QmX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9"
    const mockContentHash = "0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"

    setIpfsHash(mockIpfsHash)
    setContentHash(mockContentHash)
    setUploadStatus("success")
    onUploadComplete(mockIpfsHash)
  }

  useEffect(() => {
    if (content && uploadStatus === "idle") {
      simulateUpload()
    }
  }, [content])

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case "uploading":
        return <Upload className="w-5 h-5 text-blue-600 animate-spin" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Upload className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (uploadStatus) {
      case "uploading":
        return "Uploading to IPFS..."
      case "success":
        return "Successfully uploaded to IPFS"
      case "error":
        return "Upload failed"
      default:
        return "Ready to upload"
    }
  }

  const getStatusColor = () => {
    switch (uploadStatus) {
      case "uploading":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">IPFS Storage</h3>
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-2">{getStatusText()}</span>
            </Badge>
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Encrypting and uploading your agreement to decentralized storage...
              </p>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">IPFS Hash (CID)</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border break-all">{ipfsHash}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Content Hash (SHA-256)</label>
                    <p className="font-mono text-sm bg-white p-2 rounded border break-all">{contentHash}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Hash className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Integrity Protection</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your agreement content is encrypted and stored on IPFS. The content hash will be recorded on the
                      Sui blockchain to ensure integrity and prevent tampering.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Storage:</span>
                  <span className="ml-2 font-medium">Decentralized (IPFS)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Encryption:</span>
                  <span className="ml-2 font-medium text-green-600">AES-256</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Redundancy:</span>
                  <span className="ml-2 font-medium">Multi-node</span>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="text-gray-600">Access:</span>
                  <span className="ml-2 font-medium">Authorized only</span>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Upload Failed</h4>
                  <p className="text-sm text-red-700 mt-1">
                    There was an error uploading your content to IPFS. Please try again.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                    onClick={simulateUpload}
                  >
                    Retry Upload
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
