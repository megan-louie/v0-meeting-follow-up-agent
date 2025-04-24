"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Download, Mail, Calendar, ClipboardList, Info, ArrowLeft, FileText } from "lucide-react"
import { MeetingSummary } from "@/components/meeting-summary"
import { ActionItems } from "@/components/action-items"
import { EmailComposer } from "@/components/email-composer"
import Link from "next/link"

interface Participant {
  name: string
  role?: string
}

interface ActionItem {
  person: string
  task: string
  dueDate?: string
}

interface MeetingData {
  title: string
  date: string
  participants: Participant[]
  summary: string
  keyDecisions: string[]
  actionItems: ActionItem[]
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoData, setIsDemoData] = useState(false)

  useEffect(() => {
    if (!id) {
      setError("No result ID provided")
      setLoading(false)
      return
    }

    async function fetchResults() {
      try {
        const response = await fetch(`/api/process-transcript?id=${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }

        const data = await response.json()
        setMeetingData(data)

        // Check if this is likely demo data by comparing the title
        if (data.title === "Q2 Product Roadmap Planning") {
          setIsDemoData(true)
        }
      } catch (err) {
        setError("Failed to load meeting data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-gray-600">Analyzing meeting transcript...</p>
        </div>
      </div>
    )
  }

  if (error || !meetingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">Error</CardTitle>
            <CardDescription>{error || "Failed to load meeting data"}</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="font-bold text-xl">Meeting Follow-Up Agent</span>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-screen-xl mx-auto px-4 py-10">
        <div className="mx-auto">
          <div className="mb-8 space-y-4">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Link>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h1 className="text-3xl font-bold">{meetingData.title}</h1>
                </div>
                <p className="text-gray-500">
                  Meeting Date: <span className="font-medium text-gray-700">{meetingData.date}</span>
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Follow-Ups
                </Button>
              </div>
            </div>
          </div>

          {isDemoData && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Demo Data</AlertTitle>
              <AlertDescription className="text-blue-700">
                You are viewing pre-processed demo data. Upload your own transcript to see custom results.
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-8 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center text-gray-900">
                  <span className="mr-2">📋</span> Summary
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{meetingData.summary}</p>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center text-gray-900">
                  <span className="mr-2">✅</span> Key Decisions
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {meetingData.keyDecisions.length > 0 ? meetingData.keyDecisions[0] : "No key decisions found"}
                  {meetingData.keyDecisions.length > 1 && "..."}
                </p>
              </div>

              <div className="bg-white p-4 rounded-md border">
                <h3 className="font-medium flex items-center text-gray-900">
                  <span className="mr-2">🛠️</span> Action Items
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {meetingData.actionItems.length} action items assigned
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="summary">
                <ClipboardList className="mr-2 h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="action-items">
                <Calendar className="mr-2 h-4 w-4" />
                Action Items
              </TabsTrigger>
              <TabsTrigger value="follow-up">
                <Mail className="mr-2 h-4 w-4" />
                Follow-Up Emails
              </TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
              <MeetingSummary meetingData={meetingData} />
            </TabsContent>
            <TabsContent value="action-items">
              <ActionItems actionItems={meetingData.actionItems} />
            </TabsContent>
            <TabsContent value="follow-up">
              <EmailComposer meetingData={meetingData} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
