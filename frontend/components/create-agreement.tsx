"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mic, FileText, Users, Shield } from "lucide-react"
import { AudioRecorder } from "@/components/audio-recorder"
import { IPFSUpload } from "@/components/ipfs-upload"

interface CreateAgreementProps {
  onBack: () => void
}

export function CreateAgreement({ onBack }: CreateAgreementProps) {
  const [step, setStep] = useState(1)
  const [agreementType, setAgreementType] = useState<"text" | "audio">("text")
  const [formData, setFormData] = useState({
    title: "",
    parties: [""],
    terms: "",
    amount: "",
    language: "en",
  })
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [ipfsHash, setIpfsHash] = useState<string>("")
  const [isCreating, setIsCreating] = useState(false)

  const addParty = () => {
    setFormData((prev) => ({
      ...prev,
      parties: [...prev.parties, ""],
    }))
  }

  const updateParty = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      parties: prev.parties.map((party, i) => (i === index ? value : party)),
    }))
  }

  const handleCreateAgreement = async () => {
    setIsCreating(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsCreating(false)
    setStep(4) // Success step
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Choose Agreement Type</h2>
              <p className="text-gray-600">Select how you want to record your agreement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${agreementType === "text" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                onClick={() => setAgreementType("text")}
              >
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">Text Agreement</h3>
                  <p className="text-sm text-gray-600">Written terms and conditions</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${agreementType === "audio" ? "ring-2 ring-purple-500 bg-purple-50" : "hover:bg-gray-50"}`}
                onClick={() => setAgreementType("audio")}
              >
                <CardContent className="p-6 text-center">
                  <Mic className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Audio Agreement</h3>
                  <p className="text-sm text-gray-600">Spoken terms in local language</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Popular in Nigeria</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Agreement Details</h2>
              <p className="text-gray-600">Provide basic information about your agreement</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Agreement Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Small Business Loan Agreement"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  placeholder="e.g., ₦50,000"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div>
                <Label>Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ha">Hausa</SelectItem>
                    <SelectItem value="yo">Yoruba</SelectItem>
                    <SelectItem value="ig">Igbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Parties</Label>
                <div className="space-y-2">
                  {formData.parties.map((party, index) => (
                    <Input
                      key={index}
                      placeholder={`Party ${index + 1} Sui Address (0x...)`}
                      value={party}
                      onChange={(e) => updateParty(index, e.target.value)}
                    />
                  ))}
                  <Button variant="outline" onClick={addParty} className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Add Another Party
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Record Agreement Terms</h2>
              <p className="text-gray-600">
                {agreementType === "text" ? "Write your agreement terms" : "Record your agreement in audio"}
              </p>
            </div>

            {agreementType === "text" ? (
              <div>
                <Label htmlFor="terms">Agreement Terms</Label>
                <Textarea
                  id="terms"
                  placeholder="Enter the detailed terms and conditions of your agreement..."
                  className="min-h-[200px]"
                  value={formData.terms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                />
              </div>
            ) : (
              <AudioRecorder onRecordingComplete={setAudioBlob} />
            )}

            <IPFSUpload
              content={agreementType === "text" ? formData.terms : audioBlob}
              onUploadComplete={setIpfsHash}
            />
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-800">Agreement Created Successfully!</h2>
              <p className="text-gray-600 mt-2">Your agreement has been recorded on the Sui blockchain</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transaction Hash:</span>
                <span className="font-mono text-blue-600">0x1a2b3c4d...</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">IPFS Hash:</span>
                <span className="font-mono text-purple-600">{ipfsHash || "QmX1Y2Z3..."}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Gas Used:</span>
                <span className="text-green-600">0.001 SUI</span>
              </div>
            </div>

            <Button onClick={onBack} className="w-full">
              Return to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStepContent()}

            {step < 4 && (
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                  Previous
                </Button>

                {step === 3 ? (
                  <Button
                    onClick={handleCreateAgreement}
                    disabled={
                      isCreating ||
                      (agreementType === "text" && !formData.terms) ||
                      (agreementType === "audio" && !audioBlob)
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isCreating ? "Creating Agreement..." : "Create Agreement"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !agreementType) ||
                      (step === 2 && (!formData.title || formData.parties.some((p) => !p)))
                    }
                  >
                    Next
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
