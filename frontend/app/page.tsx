"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Mic, Shield, Users, Plus, Search } from "lucide-react"
import { CreateAgreement } from "@/components/create-agreement"
import { VerifyAgreement } from "@/components/verify-agreement"
import { AgreementList } from "@/components/agreement-list"

export default function Dashboard() {
  const [activeView, setActiveView] = useState<"dashboard" | "create" | "verify">("dashboard")
  const [agreements] = useState([
    {
      id: "1",
      title: "Small Business Loan Agreement",
      parties: ["0x123...abc", "0x456...def"],
      status: "verified",
      type: "audio",
      createdAt: "2024-01-15",
      amount: "₦50,000",
    },
    {
      id: "2",
      title: "Land Lease Contract",
      parties: ["0x789...ghi", "0x012...jkl"],
      status: "pending",
      type: "text",
      createdAt: "2024-01-14",
      amount: "₦200,000",
    },
    {
      id: "3",
      title: "Supply Agreement",
      parties: ["0x345...mno", "0x678...pqr"],
      status: "verified",
      type: "audio",
      createdAt: "2024-01-13",
      amount: "₦75,000",
    },
  ])

  if (activeView === "create") {
    return <CreateAgreement onBack={() => setActiveView("dashboard")} />
  }

  if (activeView === "verify") {
    return <VerifyAgreement onBack={() => setActiveView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Agreement Ledger</h1>
          <p className="text-gray-600">Secure, verifiable agreements on Sui blockchain</p>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            Zero-Knowledge Verified
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Agreements</p>
                  <p className="text-2xl font-bold">127</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-2xl font-bold">98</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mic className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Audio Agreements</p>
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Parties</p>
                  <p className="text-2xl font-bold">234</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => setActiveView("create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Agreement
          </Button>

          <Button
            onClick={() => setActiveView("verify")}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            size="lg"
          >
            <Search className="w-5 h-5 mr-2" />
            Verify & Playback
          </Button>
        </div>

        {/* Recent Agreements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Agreements</CardTitle>
            <CardDescription>Your latest blockchain-recorded agreements</CardDescription>
          </CardHeader>
          <CardContent>
            <AgreementList agreements={agreements} />
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-800 font-medium">Sui Network Connected</span>
              </div>
              <div className="text-sm text-green-600">Gas: 0.001 SUI | TPS: 297,000</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
