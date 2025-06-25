"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Mic, Users, Calendar, Eye, MoreHorizontal } from "lucide-react"

interface Agreement {
  id: string
  title: string
  parties: string[]
  status: "verified" | "pending" | "disputed"
  type: "text" | "audio"
  createdAt: string
  amount?: string
}

interface AgreementListProps {
  agreements: Agreement[]
}

export function AgreementList({ agreements }: AgreementListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "disputed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "audio" ? (
      <Mic className="w-4 h-4 text-purple-600" />
    ) : (
      <FileText className="w-4 h-4 text-blue-600" />
    )
  }

  return (
    <div className="space-y-4">
      {agreements.map((agreement) => (
        <Card key={agreement.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(agreement.type)}
                  <h3 className="font-semibold text-lg">{agreement.title}</h3>
                  <Badge className={getStatusColor(agreement.status)}>{agreement.status}</Badge>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{agreement.parties.length} parties</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{agreement.createdAt}</span>
                  </div>

                  {agreement.amount && <div className="font-semibold text-green-600">{agreement.amount}</div>}
                </div>

                <div className="text-xs text-gray-500">
                  <span>Parties: </span>
                  {agreement.parties.map((party, index) => (
                    <span key={index} className="font-mono">
                      {party}
                      {index < agreement.parties.length - 1 && ", "}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>

                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
