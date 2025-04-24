/**
 * Gemini API client for meeting transcript analysis
 */

const GEMINI_API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Analyzes a meeting transcript using the Gemini API
 */
export async function analyzeMeetingTranscript(transcript: string) {
  // Hardcoded API key for demo purposes
  // NOTE: In a production app, you would normally use environment variables
  // This approach works on both local dev and static GitHub Pages deployments
  const apiKey = "AIzaSyDOFdqJfwsruNs1mA3Byfk4wza-j3gk1FE";
  

  // Prepare the prompt for Gemini
  const prompt = `
    Analyze this meeting transcript and extract the following information in a structured JSON format:
    
    1. Meeting title
    2. Meeting date (in MM/DD/YYYY format)
    3. Participants and their roles
    4. A concise summary of the meeting (1-2 paragraphs)
    5. Key decisions made (as a list)
    6. Action items with assignees and due dates

    Meeting Transcript:
    ${transcript}

    Response Format:
    {
      "title": "Meeting Title",
      "date": "MM/DD/YYYY",
      "participants": [
        {"name": "Person Name", "role": "Person Role"},
        ...
      ],
      "summary": "Concise meeting summary",
      "keyDecisions": [
        "Decision 1",
        "Decision 2",
        ...
      ],
      "actionItems": [
        {"person": "Name", "task": "Task description", "dueDate": "Due date"},
        ...
      ]
    }

    Only respond with the JSON object, no additional text or explanations.
  `;

  // Create request to Gemini API
  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API Error:", errorText);
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  try {
    // Extract the content from Gemini response
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    console.log("Raw Gemini response:", data);
    throw new Error("Failed to parse Gemini API response");
  }
}

/**
 * Fallback function if Gemini API fails
 * Extracts basic information from the transcript
 */
export function extractBasicInfo(transcript: string) {
  const lines = transcript.split('\n').filter(line => line.trim() !== '');
  
  // Default values
  let title = "Untitled Meeting";
  let date = new Date().toLocaleDateString('en-US', {
    month: '2-digit', 
    day: '2-digit',
    year: 'numeric'
  });
  let participants: any[] = [];
  let summary = "No summary available.";
  let keyDecisions: string[] = [];
  let actionItems: any[] = [];
  
  // Basic extraction logic
  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i];
    
    if (line.toLowerCase().includes('meeting title:')) {
      title = line.split(':')[1]?.trim() || title;
    }
    else if (line.toLowerCase().includes('date:')) {
      date = line.split(':')[1]?.trim() || date;
    }
    else if (line.toLowerCase().includes('participants:')) {
      const participantsText = line.split(':')[1]?.trim() || '';
      participants = participantsText.split(',').map(p => {
        const match = p.match(/(.*)\((.*)\)/);
        return match 
          ? { name: match[1].trim(), role: match[2].trim() }
          : { name: p.trim() };
      });
    }
  }
  
  return {
    title,
    date,
    participants,
    summary,
    keyDecisions,
    actionItems
  };
}