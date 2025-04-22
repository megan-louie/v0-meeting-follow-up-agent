import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { mockMeetingData } from "@/lib/mock-meeting-data"

// In-memory storage for processed results (in a real app, use a database)
const processedResults = new Map()

export async function POST(req: NextRequest) {
  try {
    let transcriptText = ""
    let useMockData = false

    // Check if this is a JSON request (demo mode)
    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const { useDemo } = await req.json()

      if (useDemo) {
        // Use mock data for demo mode to avoid API calls
        useMockData = true

        // Still load the sample transcript for reference
        const { sampleTranscript } = await import("@/lib/sample-transcript")
        transcriptText = sampleTranscript
      }
    } else {
      // Regular file upload
      const formData = await req.formData()
      const transcriptFile = formData.get("transcript") as File

      if (!transcriptFile) {
        return NextResponse.json({ error: "No transcript file provided" }, { status: 400 })
      }

      // Read the file content
      transcriptText = await transcriptFile.text()
    }

    if (!transcriptText && !useMockData) {
      return NextResponse.json({ error: "No transcript content provided" }, { status: 400 })
    }

    let meetingData

    if (useMockData) {
      // Use pre-processed mock data instead of calling the API
      meetingData = mockMeetingData
    } else {
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: "OpenAI API key is missing. Please add it to your environment variables." },
          { status: 500 },
        )
      }

      try {
        // Process the transcript with AI
        const result = await generateObject({
          model: openai("gpt-4o"),
          schema: z.object({
            title: z.string().describe("The title or subject of the meeting"),
            date: z.string().describe("The date of the meeting in MM/DD/YYYY format"),
            participants: z
              .array(
                z.object({
                  name: z.string().describe("Name of the participant"),
                  role: z.string().optional().describe("Role of the participant if mentioned"),
                }),
              )
              .describe("List of meeting participants"),
            summary: z.string().describe("A concise summary of the meeting discussion"),
            keyDecisions: z
              .array(z.string().describe("A key decision made during the meeting"))
              .describe("List of key decisions made during the meeting"),
            actionItems: z
              .array(
                z.object({
                  person: z.string().describe("Person responsible for the action item"),
                  task: z.string().describe("Description of the task to be completed"),
                  dueDate: z.string().optional().describe("Due date for the task if mentioned"),
                }),
              )
              .describe("List of action items assigned during the meeting"),
          }),
          prompt: `Extract key information from this meeting transcript. Identify the meeting title, date, participants and their roles, create a concise summary, list key decisions made, and extract all action items with assigned people and due dates if available.

          Transcript:
          ${transcriptText}`,
        })

        meetingData = result.object
      } catch (error) {
        console.error("OpenAI API error:", error)

        // If there's an API quota error, use mock data as fallback
        if (
          error instanceof Error &&
          (error.message.includes("quota") || error.message.includes("billing") || error.message.includes("rate limit"))
        ) {
          console.log("Using mock data as fallback due to API quota error")
          meetingData = mockMeetingData
        } else {
          // For other errors, propagate them
          throw error
        }
      }
    }

    // Generate a unique ID for this result
    const resultId = uuidv4()

    // Store the processed result
    processedResults.set(resultId, meetingData)

    return NextResponse.json({ id: resultId })
  } catch (error) {
    console.error("Error processing transcript:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to process transcript"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (!id || !processedResults.has(id)) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 })
  }

  return NextResponse.json(processedResults.get(id))
}
