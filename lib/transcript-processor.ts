import { extractDates, extractParticipants } from "./text-extraction"

// Types for our meeting data
export interface Participant {
  name: string
  role?: string
}

export interface ActionItem {
  person: string
  task: string
  dueDate?: string
  status?: string
}

export interface MeetingData {
  title: string
  date: string
  participants: Participant[]
  summary: string
  keyDecisions: string[]
  actionItems: ActionItem[]
}

// Enhanced rule-based transcript processor
export async function processTranscript(transcriptText: string): Promise<MeetingData> {
  // Initialize the meeting data structure
  const meetingData: MeetingData = {
    title: "Untitled Meeting",
    date: new Date().toLocaleDateString(),
    participants: [],
    summary: "",
    keyDecisions: [],
    actionItems: [],
  }

  try {
    // Clean up the transcript text
    const cleanText = transcriptText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    // Extract title (look for "Meeting Title:" or first line)
    const titleMatch =
      cleanText.match(/Meeting Title:?\s*([^\n]+)/i) ||
      cleanText.match(/Title:?\s*([^\n]+)/i) ||
      cleanText.match(/^([^\n]+)/)
    if (titleMatch && titleMatch[1]) {
      meetingData.title = titleMatch[1].trim()
    }

    // Extract date
    const extractedDates = extractDates(cleanText)
    if (extractedDates.length > 0) {
      meetingData.date = extractedDates[0]
    }

    // Extract participants with roles
    meetingData.participants = extractParticipants(cleanText)

    // Extract summary using advanced text summarization
    meetingData.summary = generateSummary(cleanText)

    // Extract key decisions
    meetingData.keyDecisions = extractKeyDecisions(cleanText)

    // Extract action items
    const participantNames = meetingData.participants.map((p) => p.name)
    meetingData.actionItems = extractActionItems(cleanText, participantNames)

    return meetingData
  } catch (error) {
    console.error("Error processing transcript:", error)
    // Return basic structure with error information
    return {
      ...meetingData,
      title: meetingData.title || "Transcript Processing Error",
      summary: "There was an error processing the transcript. Using basic information only.",
    }
  }
}

// Advanced text summarization function
function generateSummary(text: string): string {
  // Split into paragraphs and sentences
  const paragraphs = text.split(/\n\s*\n/)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []

  // Keywords that indicate important content
  const importantKeywords = [
    "agenda",
    "discuss",
    "purpose",
    "goal",
    "objective",
    "summary",
    "conclusion",
    "decision",
    "action",
    "next steps",
    "follow-up",
    "important",
    "critical",
    "essential",
    "key",
    "main",
    "primary",
  ]

  // Score sentences based on keywords and position
  const scoredSentences = sentences.map((sentence, index) => {
    const lowerSentence = sentence.toLowerCase()
    let score = 0

    // Score based on keywords
    importantKeywords.forEach((keyword) => {
      if (lowerSentence.includes(keyword)) {
        score += 2
      }
    })

    // Score based on position (first and last sentences often contain important info)
    if (index < sentences.length * 0.2) score += 1
    if (index > sentences.length * 0.8) score += 1

    // Score based on sentence length (not too short, not too long)
    const wordCount = sentence.split(/\s+/).length
    if (wordCount > 5 && wordCount < 25) score += 1

    return { sentence, score }
  })

  // Sort by score and take top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map((item) => item.sentence.trim())

  // Join sentences into a coherent summary
  return topSentences.join(" ")
}

// Extract key decisions from text
function extractKeyDecisions(text: string): string[] {
  const decisions: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []

  // Decision patterns
  const decisionPatterns = [
    /(?:it was )?decided that\s+([^.!?]+[.!?]+)/gi,
    /(?:the|we|they|team) (?:all )?agreed (?:to|that)\s+([^.!?]+[.!?]+)/gi,
    /(?:the|we|they|team) (?:came to a|reached a) consensus (?:to|that)\s+([^.!?]+[.!?]+)/gi,
    /(?:final|key) decision:?\s+([^.!?]+[.!?]+)/gi,
    /conclusion:?\s+([^.!?]+[.!?]+)/gi,
  ]

  // Decision keywords
  const decisionKeywords = [
    "decide",
    "agreed",
    "approved",
    "finalized",
    "concluded",
    "consensus",
    "resolution",
    "determined",
    "settled on",
    "confirmed",
  ]

  // Extract decisions using patterns
  decisionPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 10) {
        decisions.push(match[1].trim())
      }
    }
  })

  // If we didn't find enough decisions with patterns, look for sentences with keywords
  if (decisions.length < 3) {
    sentences.forEach((sentence) => {
      const sentenceLower = sentence.toLowerCase()
      if (decisionKeywords.some((keyword) => sentenceLower.includes(keyword))) {
        // Don't add duplicates
        const trimmedSentence = sentence.trim()
        if (!decisions.some((d) => d.toLowerCase().includes(trimmedSentence.toLowerCase()))) {
          decisions.push(trimmedSentence)
        }
      }
    })
  }

  // Limit to reasonable number of key decisions
  return decisions.slice(0, 5)
}

// Extract action items from text
function extractActionItems(text: string, names: string[]): ActionItem[] {
  const actionItems: ActionItem[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []

  // Action patterns
  const actionPatterns = [
    /(?:action item|task|to-do):?\s+([^.!?]+[.!?]+)/gi,
    /([A-Za-z\s]+) (?:will|should|needs to|is going to|has to)\s+([^.!?]+[.!?]+)/gi,
    /assigned to ([A-Za-z\s]+):?\s+([^.!?]+[.!?]+)/gi,
  ]

  // Process each action pattern
  actionPatterns.forEach((pattern) => {
    let match
    while ((match = pattern.exec(text)) !== null) {
      let person = "Unassigned"
      let task = ""

      if (pattern.toString().includes("assigned to")) {
        person = match[1].trim()
        task = match[2].trim()
      } else if (pattern.toString().includes("will|should|needs")) {
        person = match[1].trim()
        task = match[0].trim() // Use the full match as the task
      } else {
        task = match[1].trim()

        // Try to identify the person from the task text
        names.forEach((name) => {
          if (task.includes(name)) {
            person = name
          }
        })
      }

      // Look for dates in the task
      const dueDate = extractDueDate(task)

      // Add the action item if it's not too short
      if (task.length > 10) {
        actionItems.push({
          person,
          task,
          dueDate,
          status: "Pending",
        })
      }
    }
  })

  // Also look for sentences with action keywords near participant names
  if (actionItems.length < 5) {
    const actionKeywords = [
      "will",
      "should",
      "needs to",
      "going to",
      "responsible for",
      "take care of",
      "handle",
      "follow up",
    ]

    sentences.forEach((sentence) => {
      const sentenceLower = sentence.toLowerCase()

      if (actionKeywords.some((keyword) => sentenceLower.includes(keyword))) {
        let person = "Unassigned"
        const task = sentence.trim()

        // Check if any participant name is in the sentence
        names.forEach((name) => {
          if (sentence.includes(name)) {
            person = name
          }
        })

        // Look for dates in the sentence
        const dueDate = extractDueDate(sentence)

        // Don't add duplicates
        if (
          !actionItems.some(
            (item) =>
              item.task.toLowerCase().includes(task.toLowerCase()) ||
              task.toLowerCase().includes(item.task.toLowerCase()),
          )
        ) {
          actionItems.push({
            person,
            task,
            dueDate,
            status: "Pending",
          })
        }
      }
    })
  }

  // Limit to a reasonable number of action items
  return actionItems.slice(0, 10)
}

// Extract due date from text
function extractDueDate(text: string): string | undefined {
  const datePatterns = [
    /by\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i,
    /due\s+(?:on|by)?\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i,
    /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,
    /by\s+(next\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month))/i,
  ]

  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return undefined
}
