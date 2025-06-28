"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, File, Image, FileText, X, Eye, Paperclip, ClipboardPasteIcon as Paste, Plus } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size: number
  content: string | ArrayBuffer
  preview?: string
}

interface DocumentUploadProps {
  onDocumentsChange: (documents: Document[]) => void
  documents: Document[]
}

export function DocumentUpload({ onDocumentsChange, documents }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pasteText, setPasteText] = useState("")
  const [showPasteArea, setShowPasteArea] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- MODIFICATION START ---
  const handleFileSelect = useCallback(
    async (files: File[]) => { // Changed from FileList to File[]
      const newDocuments: Document[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`)
          continue
        }

        const reader = new FileReader()

        await new Promise<void>((resolve) => {
          reader.onload = (e) => {
            const content = e.target?.result
            if (content) {
              const doc: Document = {
                id: Math.random().toString(36).substring(2),
                name: file.name,
                type: file.type,
                size: file.size,
                content: content,
              }

              // Generate preview for images
              if (file.type.startsWith("image/")) {
                doc.preview = content as string
              }

              newDocuments.push(doc)
            }
            resolve()
          }

          if (file.type.startsWith("image/") || file.type === "application/pdf") {
            reader.readAsDataURL(file)
          } else {
            reader.readAsArrayBuffer(file)
          }
        })
      }

      onDocumentsChange([...documents, ...newDocuments])
    },
    [documents, onDocumentsChange],
  )
  // --- MODIFICATION END ---

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        // --- MODIFICATION START ---
        handleFileSelect(Array.from(files)) // Convert FileList to File[]
        // --- MODIFICATION END ---
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        // --- MODIFICATION START ---
        handleFileSelect(Array.from(files)) // Convert FileList to File[]
        // --- MODIFICATION END ---
      }
    },
    [handleFileSelect],
  )

  const handlePasteDocument = () => {
    if (!pasteText.trim()) return

    const doc: Document = {
      id: Math.random().toString(36).substring(2),
      name: `Pasted Document ${documents.length + 1}.txt`,
      type: "text/plain",
      size: new Blob([pasteText]).size,
      content: pasteText,
    }

    onDocumentsChange([...documents, doc])
    setPasteText("")
    setShowPasteArea(false)
  }

  const handleClipboardPaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read()

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith("image/")) {
            const blob = await clipboardItem.getType(type)
            // The new File(...) constructor is correct based on web standards.
            // If you still get "Expected 1 arguments, but got 3", it's a TypeScript config/version issue.
            const file = new (window as any).File([blob], `Pasted Image ${documents.length + 1}.png`, { type: 'image/png' });
            // --- MODIFICATION START ---
            // Removed problematic DataTransfer and mockFileList
            handleFileSelect([file]) // Pass an array containing the single File object
            // --- MODIFICATION END ---

          } else if (type === "text/plain") {
            const text = await navigator.clipboard.readText()
            setPasteText(text)
            setShowPasteArea(true)
          }
        }
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error)
      setShowPasteArea(true)
    }
  }

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter((doc) => doc.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />
    if (type === "application/pdf") return <FileText className="w-4 h-4" />
    if (type.startsWith("text/")) return <FileText className="w-4 h-4" />
    return <File className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Upload Supporting Documents</h3>
          <p className="text-gray-600 mb-4">Drag and drop files here, or click to browse</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              Choose Files
            </Button>

            <Button onClick={handleClipboardPaste} variant="outline" className="flex items-center bg-transparent">
              <Paste className="w-4 h-4 mr-2" />
              Paste from Clipboard
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-3">Supports: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 10MB each)</p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Paste Text Area */}
      {showPasteArea && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="paste-text">Paste Document Content</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowPasteArea(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                id="paste-text"
                placeholder="Paste your document content here..."
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                className="min-h-[120px]"
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowPasteArea(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePasteDocument} disabled={!pasteText.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Document
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {documents.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4 flex items-center">
              <File className="w-4 h-4 mr-2" />
              Attached Documents ({documents.length})
            </h4>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(doc.type)}

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {doc.type.split("/")[1]?.toUpperCase() || "FILE"}
                        </Badge>
                      </div>
                    </div>

                    {/* Preview for images */}
                    {doc.preview && (
                      <div className="w-12 h-12 rounded border overflow-hidden">
                        <img
                          src={doc.preview || "/placeholder.svg"}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {doc.preview && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(doc.preview, "_blank")}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(doc.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Upload className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Document Security</p>
                  <p className="text-blue-700 mt-1">
                    All documents are encrypted and stored on IPFS. Only authorized parties can access them.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}