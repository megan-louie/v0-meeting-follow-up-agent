"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, RefreshCw, AlertCircle, Mail, User } from "lucide-react"

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

interface EmailComposerProps {
  meetingData: MeetingData
}

export function EmailComposer({ meetingData }: EmailComposerProps) {
  const [selectedPerson, setSelectedPerson] = useState<string>("all")
  const [emailSubject, setEmailSubject] = useState<string>(`Follow-up: ${meetingData.title}`)
  const [emailBody, setEmailBody] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Get unique list of people from action items
  const people = Array.from(new Set(meetingData.actionItems.map((item) => item.person)))

  // Generate email content based on selected person
  const generateEmailContent = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Generate a template email based on the meeting data
      let emailContent = ""

      if (selectedPerson === "all") {
        emailContent = `Hi Team,

Here's a summary of our "${meetingData.title}" meeting on ${meetingData.date}:

---

### 📋 Summary
${meetingData.summary
  .split(". ")
  .map((sentence) => `- ${sentence.trim()}`)
  .join("\n")}

---

### ✅ Key Decisions
${meetingData.keyDecisions.map((decision) => `- ${decision}`).join("\n")}

---

### 🛠️ Action Items
${meetingData.actionItems.map((item) => `- **${item.person}**: ${item.task}${item.dueDate ? ` (Due: ${item.dueDate})` : ""}`).join("\n")}

---

### 📅 Next Steps
Let's schedule a follow-up meeting next week to track our progress.

Please let me know if you have any questions or need clarification on any of the items above.

Best regards,
[Your Name]`
      } else {
        // Filter action items for the selected person
        const personItems = meetingData.actionItems.filter((item) => item.person === selectedPerson)

        emailContent = `Hi ${selectedPerson},

I wanted to follow up on our "${meetingData.title}" meeting on ${meetingData.date}.

---

### 📋 Meeting Summary
${meetingData.summary}

---

### ✅ Key Decisions
${meetingData.keyDecisions.map((decision) => `- ${decision}`).join("\n")}

---

### 🛠️ Your Action Items
${personItems.map((item) => `- ${item.task}${item.dueDate ? ` (Due: ${item.dueDate})` : ""}`).join("\n")}

---

Please let me know if you have any questions or need clarification on any of the items above.

Best regards,
[Your Name]`
      }

      setEmailBody(emailContent)
    } catch (error) {
      console.error("Error generating email:", error)
      setError(error instanceof Error ? error.message : "Failed to generate email content")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border shadow-md">
        <CardHeader className="bg-gray-50 pb-3">
          <div className="flex items-center">
            <span className="mr-2 text-xl">✉️</span>
            <CardTitle>Follow-Up Email Composer</CardTitle>
          </div>
          <CardDescription>Generate and customize follow-up emails for meeting participants</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="recipient" className="text-sm font-medium">
                Recipient
              </Label>
              <select
                id="recipient"
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={selectedPerson}
                onChange={(e) => setSelectedPerson(e.target.value)}
              >
                <option value="all">All Participants</option>
                {people.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject
              </Label>
              <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="body" className="text-sm font-medium">
                Email Body
              </Label>
              <Button variant="outline" size="sm" onClick={generateEmailContent} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
            <div className="rounded-md border">
              <Textarea
                id="body"
                className="min-h-[300px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm"
                placeholder="Email content will appear here after generation..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-gray-50 border-t">
          <Button variant="outline">Preview</Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100">
          <TabsTrigger value="individual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <User className="mr-2 h-4 w-4" />
            Individual Emails
          </TabsTrigger>
          <TabsTrigger value="summary" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Mail className="mr-2 h-4 w-4" />
            Summary Email
          </TabsTrigger>
        </TabsList>
        <TabsContent value="individual">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => {
              // Filter action items for this person
              const personItems = meetingData.actionItems.filter((item) => item.person === person)

              return (
                <Card key={person} className="overflow-hidden border shadow-md">
                  <CardHeader className="bg-gray-50 pb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-600" />
                      <CardTitle className="text-base">{person}</CardTitle>
                    </div>
                    <CardDescription>
                      {personItems.length} action {personItems.length === 1 ? "item" : "items"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 text-sm">
                    <p className="mb-2 font-medium">Action Items:</p>
                    <ul className="list-inside list-disc space-y-1 text-gray-600">
                      {personItems.map((item, index) => (
                        <li key={index}>
                          {item.task}
                          {item.dueDate && <span className="text-xs"> (Due: {item.dueDate})</span>}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t bg-gray-50 p-2">
                    <Button size="sm" variant="outline" className="w-full">
                      <Send className="mr-2 h-3 w-3" />
                      Send Email
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <Card className="overflow-hidden border shadow-md">
            <CardHeader className="bg-gray-50 pb-3">
              <div className="flex items-center">
                <span className="mr-2 text-xl">📧</span>
                <CardTitle>Summary Email</CardTitle>
              </div>
              <CardDescription>Send a comprehensive summary to all participants</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Email Preview</h4>
                  <div className="bg-white p-4 rounded border">
                    <p className="font-medium">Subject: Follow-up: {meetingData.title}</p>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>Hi Team,</p>
                      <p className="mt-2">Here's a summary of our meeting:</p>

                      <div className="mt-3">
                        <p className="font-medium">📋 Summary</p>
                        <p>{meetingData.summary.substring(0, 100)}...</p>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium">✅ Key Decisions</p>
                        <ul className="list-disc pl-5">
                          {meetingData.keyDecisions.slice(0, 2).map((decision, i) => (
                            <li key={i}>{decision.substring(0, 60)}...</li>
                          ))}
                          {meetingData.keyDecisions.length > 2 && <li>...</li>}
                        </ul>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium">🛠️ Action Items</p>
                        <ul className="list-disc pl-5">
                          {meetingData.actionItems.slice(0, 2).map((item, i) => (
                            <li key={i}>
                              <strong>{item.person}</strong>: {item.task.substring(0, 40)}...
                            </li>
                          ))}
                          {meetingData.actionItems.length > 2 && <li>...</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Summary Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
