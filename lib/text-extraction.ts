// Extract dates from text
export function extractDates(text: string): string[] {
  const dates: string[] = []

  // Date patterns
  const datePatterns = [
    // Format: MM/DD/YYYY or DD/MM/YYYY
    /\b(\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4})\b/g,

    // Format: Month DD, YYYY
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}\b/gi,

    // Format: DD Month YYYY
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December),?\s+\d{4}\b/gi,

    // Look for "Date:" or "Meeting Date:" headers
    /Meeting Date:?\s*([^\n]+)/i,
    /Date:?\s*([^\n]+)/i,
  ]

  // Extract dates using patterns
  datePatterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        // For header patterns, extract just the date part
        if (match.includes(":")) {
          const parts = match.split(":")
          if (parts.length > 1) {
            dates.push(parts[1].trim())
          }
        } else {
          dates.push(match)
        }
      })
    }
  })

  // If no dates found, use today's date
  if (dates.length === 0) {
    dates.push(new Date().toLocaleDateString())
  }

  return [...new Set(dates)] // Remove duplicates
}

// Enhanced function to extract participants with roles
export function extractParticipants(text: string): { name: string; role?: string }[] {
  const participants: { name: string; role?: string }[] = []
  const processedNames = new Set<string>() // To avoid duplicates

  // First look for a participants section with various formats
  const participantSectionPatterns = [
    /Participants:?\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\s*\n|\n(?=\w+:))/i,
    /Attendees:?\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\s*\n|\n(?=\w+:))/i,
    /Present:?\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\s*\n|\n(?=\w+:))/i,
    /In attendance:?\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\s*\n|\n(?=\w+:))/i,
    /Meeting members:?\s*([^\n]+(?:\n[^\n]+)*?)(?:\n\s*\n|\n(?=\w+:))/i,
  ]

  let participantsText = ""

  // Try each pattern to find a participants section
  for (const pattern of participantSectionPatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      participantsText = match[1]
      break
    }
  }

  if (participantsText) {
    // Try to parse participants with different separators
    const separators = [/\n/, /,/, /;/]

    for (const separator of separators) {
      const participantLines = participantsText.split(separator)
      if (participantLines.length > 1) {
        participantLines.forEach((line) => {
          processParticipantLine(line, participants, processedNames)
        })
        break // If we found a good separator, stop trying others
      }
    }

    // If no good separator found, try the whole text as one entry
    if (participants.length === 0) {
      processParticipantLine(participantsText, participants, processedNames)
    }
  }

  // If no participants were found using the above methods, extract from conversation
  if (participants.length === 0) {
    // Look for dialog patterns like "Name: text"
    const speakerPattern = /^([A-Za-z\s.]+):\s/gm
    let match

    while ((match = speakerPattern.exec(text)) !== null) {
      const speaker = match[1].trim()
      if (speaker && speaker.length > 1 && !speaker.match(/^(http|www)/i)) {
        if (!processedNames.has(speaker.toLowerCase())) {
          participants.push({ name: speaker })
          processedNames.add(speaker.toLowerCase())
        }
      }
    }
  }

  // Look for additional role information in the text
  participants.forEach((participant) => {
    if (!participant.role) {
      const namePattern = new RegExp(
        `${escapeRegExp(participant.name)}\\s+(?:is|as)\\s+(?:the|a|an)?\\s+([\\w\\s]+)`,
        "i",
      )
      const match = text.match(namePattern)
      if (match && match[1]) {
        const potentialRole = match[1].trim()
        // Only use if it looks like a job title (not too long, not a common verb)
        if (potentialRole.length < 30 && !commonVerbs.includes(potentialRole.toLowerCase())) {
          participant.role = potentialRole
        }
      }
    }
  })

  return participants
}

// Helper function to process a participant line
function processParticipantLine(
  line: string,
  participants: { name: string; role?: string }[],
  processedNames: Set<string>,
) {
  line = line.trim()
  if (!line) return

  // Check for patterns like "Name (Role)" or "Name - Role" or "Name, Role"
  const rolePatterns = [
    /([^(]+)\s*$$([^)]+)$$/, // Name (Role)
    /([^-]+)\s*-\s*(.+)/, // Name - Role
    /([^,]+),\s*([^,]+)$/, // Name, Role (at end)
    /([^:]+):\s*(.+)/, // Name: Role
  ]

  let matched = false

  for (const pattern of rolePatterns) {
    const match = line.match(pattern)
    if (match) {
      const name = match[1].trim()
      const role = match[2].trim()

      if (name && !processedNames.has(name.toLowerCase())) {
        participants.push({ name, role })
        processedNames.add(name.toLowerCase())
        matched = true
        break
      }
    }
  }

  // If no role pattern matched, just use the line as a name
  if (!matched && !processedNames.has(line.toLowerCase())) {
    participants.push({ name: line })
    processedNames.add(line.toLowerCase())
  }
}

// Helper function to escape special characters in regex
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Common verbs to avoid as roles
const commonVerbs = [
  "said",
  "mentioned",
  "noted",
  "added",
  "suggested",
  "proposed",
  "asked",
  "questioned",
  "answered",
  "replied",
  "responded",
  "stated",
  "explained",
  "clarified",
  "confirmed",
  "agreed",
  "disagreed",
  "approved",
  "rejected",
]

// Extract names from text (simplified version that calls extractParticipants)
export function extractNames(text: string): string[] {
  const participants = extractParticipants(text)
  return participants.map((p) => p.name)
}
