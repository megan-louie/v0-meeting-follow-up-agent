import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { mockMeetingData } from "@/lib/mock-meeting-data"
import { processTranscript } from "@/lib/transcript-processor"

// In-memory storage for processed results (in a real app, use a database)
const processedResults = new Map()

export async function POST(req: NextRequest) {
  try {
    let transcriptText = ""
    let useDemo = false

    // Check if this is a JSON request (demo mode)
    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const { useDemo: isDemoMode } = await req.json()
      useDemo = isDemoMode

      if (useDemo) {
        // Use mock data for demo mode
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

    if (!transcriptText) {
      return NextResponse.json({ error: "No transcript content provided" }, { status: 400 })
    }

    let meetingData

    if (useDemo) {
      // Use pre-processed mock data for demo mode
      meetingData = mockMeetingData
    } else {
      // Process the uploaded transcript using our enhanced processor
      meetingData = await processTranscript(transcriptText)
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
