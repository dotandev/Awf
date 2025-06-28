"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PenTool, Shield, UserCheck, Key } from "lucide-react"
import { AgreementContract } from "@/lib/sui-client"
import { ZKProofGenerator } from "@/lib/zk-proof"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"

interface AgreementActionsProps {
  agreement: {
    id: string
    isSignedByCreator: boolean
    isSignedBySecondParty: boolean
    zkaVerified: boolean
    parties: string[]
  }
  currentUserAddress: string
}

export function AgreementActions({ agreement, currentUserAddress }: AgreementActionsProps) {
  const [isSigningAgreement, setIsSigningAgreement] = useState(false)
  const [isVerifyingZKA, setIsVerifyingZKA] = useState(false)
  const [isGrantingAccess, setIsGrantingAccess] = useState(false)
  const [verifierAddress, setVerifierAddress] = useState("")
  const [biometricData, setBiometricData] = useState("")
  const [communityAttestation, setCommunityAttestation] = useState("")

  const canSign = agreement.parties.includes(currentUserAddress)
  const isCreator = agreement.parties[0] === currentUserAddress
  const isSecondParty = agreement.parties[1] === currentUserAddress
  const alreadySigned = (isCreator && agreement.isSignedByCreator) || (isSecondParty && agreement.isSignedBySecondParty)

  const handleSignAgreement = async () => {
    setIsSigningAgreement(true)

    try {
      // In production, use proper wallet integration
      const keypair = Ed25519Keypair.generate()

      const result = await AgreementContract.signAgreement(agreement.id, keypair)

      if (result.success) {
        console.log("Agreement signed:", result.transactionDigest)
        // Refresh agreement data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error signing agreement:", error)
    } finally {
      setIsSigningAgreement(false)
    }
  }

  const handleVerifyZKA = async () => {
    setIsVerifyingZKA(true)

    try {
      // Generate ZK proof based on biometric data and community attestation
      const biometricHash = ZKProofGenerator.generateBiometricProof(biometricData, communityAttestation)

      const proof = ZKProofGenerator.generateProof(
        "mock_private_key", // In production, derive from secure source
        agreement.id,
        biometricHash,
      )

      // Convert proof to hex string for blockchain
      const proofHex = Buffer.from(JSON.stringify(proof)).toString("hex")

      const keypair = Ed25519Keypair.generate()

      const result = await AgreementContract.verifyParty(agreement.id, proofHex, keypair)

      if (result.success) {
        console.log("ZKA verification completed:", result.transactionDigest)
        // Refresh agreement data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error verifying ZKA:", error)
    } finally {
      setIsVerifyingZKA(false)
    }
  }

  const handleGrantAccess = async () => {
    if (!verifierAddress.trim()) return

    setIsGrantingAccess(true)

    try {
      const keypair = Ed25519Keypair.generate()

      const result = await AgreementContract.grantPlaybackAccess(agreement.id, verifierAddress, keypair)

      if (result.success) {
        console.log("Playback access granted:", result.transactionDigest)
        setVerifierAddress("")
        // Refresh agreement data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error granting access:", error)
    } finally {
      setIsGrantingAccess(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Sign Agreement */}
      {canSign && !alreadySigned && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="w-5 h-5 mr-2" />
              Sign Agreement
            </CardTitle>
            <CardDescription>Digitally sign this agreement to indicate your acceptance of the terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  By signing this agreement, you confirm that you have read, understood, and agree to all terms and
                  conditions.
                </p>
              </div>

              <Button
                onClick={handleSignAgreement}
                disabled={isSigningAgreement}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSigningAgreement ? "Signing Agreement..." : "Sign Agreement"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Already Signed Status */}
      {canSign && alreadySigned && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <PenTool className="w-3 h-3 mr-1" />
                Signed
              </Badge>
              <span className="text-green-800">You have already signed this agreement</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zero-Knowledge Authentication */}
      {canSign && !agreement.zkaVerified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Zero-Knowledge Authentication
            </CardTitle>
            <CardDescription>Verify your identity without revealing personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="biometric">Biometric Data Hash</Label>
                <Input
                  id="biometric"
                  placeholder="Enter biometric hash or identifier"
                  value={biometricData}
                  onChange={(e) => setBiometricData(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="attestation">Community Attestation</Label>
                <Textarea
                  id="attestation"
                  placeholder="Community leader attestation or verification code"
                  value={communityAttestation}
                  onChange={(e) => setCommunityAttestation(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Privacy Protection</h4>
                <p className="text-sm text-blue-700">
                  Your biometric data and personal information are never stored on the blockchain. Only cryptographic
                  proofs are used to verify your identity.
                </p>
              </div>

              <Button
                onClick={handleVerifyZKA}
                disabled={isVerifyingZKA || !biometricData || !communityAttestation}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isVerifyingZKA ? "Verifying Identity..." : "Verify Identity"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ZKA Verified Status */}
      {agreement.zkaVerified && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-purple-100 text-purple-800">
                <Shield className="w-3 h-3 mr-1" />
                ZKA Verified
              </Badge>
              <span className="text-purple-800">Zero-knowledge authentication completed</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grant Playback Access */}
      {canSign && agreement.zkaVerified && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="w-5 h-5 mr-2" />
              Grant Playback Access
            </CardTitle>
            <CardDescription>
              Authorize verifiers (e.g., arbitrators, legal advisors) to access agreement content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="verifier">Verifier Address</Label>
                <Input
                  id="verifier"
                  placeholder="0x... (Sui address of the verifier)"
                  value={verifierAddress}
                  onChange={(e) => setVerifierAddress(e.target.value)}
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">Access Control</h4>
                <p className="text-sm text-orange-700">
                  Only grant access to trusted parties such as legal arbitrators, mediators, or authorized legal
                  representatives.
                </p>
              </div>

              <Button
                onClick={handleGrantAccess}
                disabled={isGrantingAccess || !verifierAddress.trim()}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isGrantingAccess ? "Granting Access..." : "Grant Access"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signing Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Agreement Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Creator Signature:</span>
              <Badge variant={agreement.isSignedByCreator ? "default" : "secondary"}>
                {agreement.isSignedByCreator ? "Signed" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Second Party Signature:</span>
              <Badge variant={agreement.isSignedBySecondParty ? "default" : "secondary"}>
                {agreement.isSignedBySecondParty ? "Signed" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">ZK Authentication:</span>
              <Badge variant={agreement.zkaVerified ? "default" : "secondary"}>
                {agreement.zkaVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
