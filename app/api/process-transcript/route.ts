import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { mockMeetingData } from "@/lib/mock-meeting-data"
import { analyzeMeetingTranscript, extractBasicInfo } from "@/lib/gemini-api"
import { parseTranscript } from "@/lib/transcript-parser"

// In-memory storage for processed results (in a real app, use a database)
const processedResults = new Map()

export async function POST(req: NextRequest) {
  try {
    let transcriptText = ""
    let useDemo = false
    let fileType = ""

    // Check if this is a JSON request (demo mode)
    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const { useDemo: isDemoMode } = await req.json()
      useDemo = isDemoMode

      if (useDemo) {
        // Use sample transcript for demo mode
        const { sampleTranscript } = await import("@/lib/sample-transcript")
        transcriptText = sampleTranscript
        fileType = "txt"
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
      
      // Get file extension for parsing
      const fileName = transcriptFile.name || ""
      fileType = fileName.split('.').pop()?.toLowerCase() || ""
      console.log(`Processing file of type: ${fileType}`)
    }

    if (!transcriptText && !useDemo) {
      return NextResponse.json({ error: "No transcript content provided" }, { status: 400 })
    }

    // Parse the transcript based on file type
    let parsedTranscript = transcriptText
    try {
      console.log("Parsing transcript content...")
      parsedTranscript = parseTranscript(transcriptText, fileType)
      console.log("Transcript parsed successfully")
    } catch (parseError) {
      console.error("Error parsing transcript:", parseError)
      // If parsing fails, use the original text
    }

    let meetingData

    // Process the transcript with Gemini API
    try {
      console.log("Processing transcript with Gemini API...")
      meetingData = await analyzeMeetingTranscript(parsedTranscript)
      console.log("Gemini API processing successful")
    } catch (error) {
      console.error("Error processing with Gemini API:", error)
      
      // First fallback: try basic extraction
      try {
        console.log("Attempting basic extraction fallback...")
        meetingData = extractBasicInfo(parsedTranscript)
      } catch (fallbackError) {
        console.error("Basic extraction fallback failed:", fallbackError)
        
        // Final fallback: use mock data
        console.log("Using mock data as final fallback")
        meetingData = mockMeetingData
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
