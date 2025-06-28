"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Shield, Play, Download, Hash, Calendar } from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"
import { AgreementActions } from "@/components/agreement-actions"

// Add blockchain integration imports
import { AgreementContract } from "@/lib/sui-client"

interface VerifyAgreementProps {
  onBack: () => void
}

export function VerifyAgreement({ onBack }: VerifyAgreementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [foundAgreement, setFoundAgreement] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "failed">("pending")

  // Update the handleSearch function
  const handleSearch = async () => {
    setIsSearching(true)

    try {
      // Query blockchain for agreement
      const result = await AgreementContract.getAgreement(searchQuery)

      if (result.success) {
        // Transform blockchain data to UI format
        const agreement = {
          id: searchQuery,
          title: "Agreement", // Could be derived from metadata
          parties: result.agreement.parties || [],
          amount: "₦50,000", // Could be stored in metadata
          createdAt: new Date().toISOString().split("T")[0],
          type: "audio", // Could be derived from playback_data
          ipfsHash: Buffer.from(result.agreement.playback_data).toString("utf8"),
          termsHash: "0x" + Buffer.from(result.agreement.terms_hash).toString("hex"),
          verifiers: result.agreement.verifiers || [],
          status: result.agreement.zka_verified ? "verified" : "pending",
          isSignedByCreator: result.agreement.is_signed_by_creator,
          isSignedBySecondParty: result.agreement.is_signed_by_second_party,
          zkaVerified: result.agreement.zka_verified,
        }

        setFoundAgreement(agreement)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error searching agreement:", error)
      setFoundAgreement(null)
    } finally {
      setIsSearching(false)
    }
  }

  // Update the handleVerifyIntegrity function
  const handleVerifyIntegrity = async () => {
    setIsVerifying(true)

    try {
      // Retrieve content from IPFS using the hash
      const ipfsContent = await retrieveFromIPFS(foundAgreement.ipfsHash)

      // Generate hash of retrieved content
      const computedHash = await generateContentHash(ipfsContent)

      // Compare with on-chain hash
      if (computedHash === foundAgreement.termsHash) {
        setVerificationStatus("verified")
      } else {
        setVerificationStatus("failed")
      }
    } catch (error) {
      console.error("Error verifying integrity:", error)
      setVerificationStatus("failed")
    } finally {
      setIsVerifying(false)
    }
  }

  // Add helper functions
  const retrieveFromIPFS = async (hash: string): Promise<string> => {
    // Simulate IPFS retrieval
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return "Mock agreement content retrieved from IPFS"
  }

  const generateContentHash = async (content: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Verify & Playback Agreement</h1>
            <p className="text-gray-600">Search for and verify blockchain-recorded agreements</p>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Search Agreement
            </CardTitle>
            <CardDescription>
              Enter the agreement ID, transaction hash, or IPFS hash to find an agreement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="search">Agreement Identifier</Label>
                <Input
                  id="search"
                  placeholder="0x1a2b3c... or QmX1Y2Z3... or agreement ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={!searchQuery || isSearching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement Details */}
        {foundAgreement && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    Agreement Found
                  </CardTitle>
                  <Badge variant={foundAgreement.status === "verified" ? "default" : "secondary"}>
                    {foundAgreement.status}
                  </Badge>
                </div>
                <CardDescription>Agreement details retrieved from Sui blockchain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Title</Label>
                      <p className="text-lg font-semibold">{foundAgreement.title}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Amount</Label>
                      <p className="text-lg font-semibold text-green-600">{foundAgreement.amount}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Created</Label>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {foundAgreement.createdAt}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Type</Label>
                      <Badge variant="outline" className="ml-2">
                        {foundAgreement.type === "audio" ? "🎵 Audio" : "📄 Text"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Parties</Label>
                      <div className="space-y-1">
                        {foundAgreement.parties.map((party: string, index: number) => (
                          <p key={index} className="font-mono text-sm bg-gray-100 p-2 rounded">
                            {party}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Authorized Verifiers</Label>
                      <p className="text-sm text-gray-500">{foundAgreement.verifiers.length} verifiers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hash Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="w-5 h-5 mr-2" />
                  Integrity Verification
                </CardTitle>
                <CardDescription>Verify the agreement content hasn't been tampered with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">IPFS Hash</Label>
                      <p className="font-mono text-sm bg-purple-50 p-2 rounded break-all">{foundAgreement.ipfsHash}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-600">Terms Hash (On-chain)</Label>
                      <p className="font-mono text-sm bg-blue-50 p-2 rounded break-all">{foundAgreement.termsHash}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={handleVerifyIntegrity}
                      disabled={isVerifying}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      {isVerifying ? "Verifying..." : "Verify Integrity"}
                    </Button>

                    {verificationStatus === "verified" && (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Integrity Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Playback Section */}
            {verificationStatus === "verified" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Agreement Playback
                  </CardTitle>
                  <CardDescription>
                    {foundAgreement.type === "audio"
                      ? "Listen to the recorded agreement terms"
                      : "View the written agreement terms"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {foundAgreement.type === "audio" ? (
                    <AudioPlayer />
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Agreement Terms</h3>
                      <div className="prose max-w-none">
                        <p>This loan agreement is entered into between the parties identified above...</p>
                        <p>The borrower agrees to repay the principal amount of ₦50,000 plus interest...</p>
                        <p>Terms of repayment: Monthly installments over 12 months...</p>
                        <p>In case of default, the following remedies shall apply...</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex space-x-4">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Copy
                    </Button>

                    <Button variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Generate Verification Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agreement Actions */}
            {verificationStatus === "verified" && (
              <AgreementActions
                agreement={{
                  id: foundAgreement.id,
                  isSignedByCreator: foundAgreement.isSignedByCreator,
                  isSignedBySecondParty: foundAgreement.isSignedBySecondParty,
                  zkaVerified: foundAgreement.zkaVerified,
                  parties: foundAgreement.parties,
                }}
                currentUserAddress="0x123...abc" // In production, get from wallet
              />
            )}
          </div>
        )}

        {/* Zero-Knowledge Authentication Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Zero-Knowledge Authentication</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All party verifications use zero-knowledge proofs to protect privacy while ensuring authenticity. No
                  personal information is revealed during the verification process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
