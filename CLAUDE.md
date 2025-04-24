# Meeting Follow-Up Agent Application Analysis

## Overview
The Meeting Follow-Up Agent is a web application that processes meeting transcripts to automatically generate summaries, extract action items, and create follow-up emails. It's designed to streamline post-meeting workflows.

## Application Structure

### Frontend Components
- **Homepage (`app/page.tsx`)**: Main landing page with app description and file upload interface
- **Results Page (`app/results/page.tsx`)**: Displays the processed meeting data in three tabs:
  - Summary tab: Shows meeting overview and key decisions
  - Action Items tab: Lists tasks assigned to participants
  - Follow-Up Emails tab: Provides auto-generated emails based on meeting content
- **Upload Component (`components/upload.tsx`)**: Provides drag-and-drop file upload functionality with a demo mode option

### Backend API Routes
- **Transcript Processing (`app/api/process-transcript/route.ts`)**: Handles file uploads and transcript processing
- **Email Sending (`app/api/send-email/route.ts`)**: Mock implementation of email sending functionality

### Data Models
- **MeetingData Interface**:
  ```typescript
  interface MeetingData {
    title: string;
    date: string;
    participants: Participant[];
    summary: string;
    keyDecisions: string[];
    actionItems: ActionItem[];
  }
  ```

## Transcript Processing Flow

1. **User Upload**: User uploads a transcript file (TXT, CSV, JSON) or uses the demo mode
2. **API Request**: The file is sent to the `/api/process-transcript` endpoint
3. **Transcript Handling**:
   - For file uploads: The file content is extracted as text
   - For demo mode: A sample transcript is used from `lib/sample-transcript.ts`
4. **Processing**: Currently, the application bypasses actual AI processing and uses mock data
5. **Result Storage**: The processed data is stored in-memory with a UUID reference
6. **Navigation**: User is redirected to the results page with the UUID as a query parameter
7. **Results Display**: The results page fetches the processed data using the UUID and displays it

## Current Mock Implementation
The current implementation doesn't actually process the uploaded transcript. Instead, it:
1. Accepts the upload and extracts the text content
2. Ignores the actual content and returns pre-defined mock data from `lib/mock-meeting-data.ts`
3. The comment in `route.ts` indicates this is to avoid requiring API keys

## Current Mock Data Structure
Mock data in `mock-meeting-data.ts` contains:
- Meeting title and date
- List of participants with names and roles
- Meeting summary paragraph
- List of key decisions
- List of action items with assignees and due dates

## LLM Integration Strategy

To replace the mock implementation with a real LLM-based solution:

### 1. Integration Points
The main integration point is in `app/api/process-transcript/route.ts`, where the mock data is currently used:

```typescript
// Current implementation:
// For simplicity and to avoid requiring API keys, we'll use the mock data
// In a production app, you would integrate with Hugging Face Inference API here
meetingData = mockMeetingData
```

### 2. Required Changes
1. **API Authentication**:
   - Add LLM API client with authentication
   - Set up environment variables for API keys

2. **Transcript Parsing**:
   - Implement proper parsing for different file formats
   - Extract text content in a structured format

3. **LLM Processing Pipeline**:
   - Send the transcript text to your LLM API
   - Create a prompt template that instructs the LLM to:
     - Extract meeting title and date
     - Identify participants and their roles
     - Summarize the meeting content
     - Extract key decisions
     - Identify action items, assignees, and due dates

4. **Response Processing**:
   - Parse the LLM response and transform it into the expected `MeetingData` structure
   - Implement validation to ensure all required fields are present

5. **Error Handling**:
   - Add robust error handling for API failures
   - Implement fallbacks when the LLM response is incomplete

### 3. Example LLM Implementation
Replace the mock data section in `route.ts` with:

```typescript
// Process transcript with LLM
try {
  // Initialize LLM client
  const llmClient = new LLMClientAPI(process.env.LLM_API_KEY);
  
  // Create prompt with transcript
  const prompt = `
    Analyze the following meeting transcript and extract:
    1. Meeting title and date
    2. Participants and their roles
    3. A concise summary of the meeting
    4. Key decisions made
    5. Action items with assignees and due dates
    
    Format your response as JSON with the following structure:
    {
      "title": "Meeting title",
      "date": "MM/DD/YYYY",
      "participants": [{"name": "Person Name", "role": "Role"}],
      "summary": "Concise meeting summary",
      "keyDecisions": ["Decision 1", "Decision 2"],
      "actionItems": [{"person": "Name", "task": "Task description", "dueDate": "Due date"}]
    }
    
    Transcript:
    ${transcriptText}
  `;
  
  // Send request to LLM API
  const llmResponse = await llmClient.generateCompletion(prompt);
  
  // Parse the response
  meetingData = JSON.parse(llmResponse);
  
  // Validate required fields
  if (!meetingData.title || !meetingData.summary || !meetingData.actionItems) {
    throw new Error("Incomplete response from LLM");
  }
} catch (error) {
  console.error("Error processing with LLM:", error);
  // Fallback to basic extraction if LLM fails
  meetingData = extractBasicInfo(transcriptText);
}
```

## Persistence Considerations
Currently, the application uses in-memory storage (`const processedResults = new Map()`). For a production implementation:

1. Replace with a database solution (MongoDB, PostgreSQL, etc.)
2. Add user authentication to associate results with specific users
3. Implement proper data retention policies

## Conclusion
The Meeting Follow-Up Agent is well-structured for LLM integration. The current mock implementation can be replaced with actual LLM processing while maintaining the same data structure and user experience. The application's modular design separates concerns between the transcript processing, data storage, and presentation layers, making it straightforward to swap out the mock processing with real LLM-based analysis.