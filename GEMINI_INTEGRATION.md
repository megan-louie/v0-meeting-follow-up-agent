# Gemini API Integration Guide

This document explains how the Meeting Follow-Up Agent integrates with Google's Gemini API to process meeting transcripts.

## Overview

The application uses Gemini's AI capabilities to:
1. Analyze meeting transcripts
2. Extract key information like meeting summary, decisions, and action items
3. Structure this information for display in the UI

## How It Works

### 1. API Integration Setup

The integration is implemented in `lib/gemini-api.ts`, which provides:
- `analyzeMeetingTranscript` - Sends transcript text to Gemini API and parses the response
- `extractBasicInfo` - A fallback method if the API call fails

### 2. Environment Variables

The application uses a secure approach to manage API keys:
- API key is stored in `.env.local` (locally) and in environment variables (in production)
- `.env.local` is not committed to Git (listed in `.gitignore`)
- `.env.example` provides a template for required environment variables

### 3. Processing Flow

When a user uploads a transcript:
1. The transcript content is extracted in `app/api/process-transcript/route.ts`
2. The content is sent to the Gemini API via `analyzeMeetingTranscript`
3. The API analyzes the transcript and returns structured data
4. The data is saved with a unique ID and returned to the frontend
5. The results page fetches and displays the analyzed data

### 4. Prompt Engineering

The application uses a specifically crafted prompt in `analyzeMeetingTranscript`:
```typescript
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
```

This prompt instructs Gemini to return a specific JSON structure that matches the application's data model.

### 5. Error Handling and Fallbacks

The application includes robust error handling:
1. First attempt: Process with Gemini API
2. If that fails: Use basic text extraction
3. Last resort: Fall back to mock data

This ensures users always get some results, even if the API is unavailable.

## API Key Setup

### Included Demo Key

For convenience, this project includes a demo Gemini API key in:
1. The `.env.local` file (which is committed to the repository)
2. As a fallback in the code if environment variables are not set

This allows the application to work immediately without additional setup.

### Using Your Own API Key (Optional)

If you want to use your own API key:

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev)
2. Update the `.env.local` file with your key: `GEMINI_API_KEY=your_key_here`
3. Restart the development server if it's running

### Production Deployment

For production:
1. You can use the included demo key (with usage limitations)
2. Or set your own key in your hosting platform's environment variables
3. In Vercel, add an environment variable named `GEMINI_API_KEY` with your key

## API Key Security Notes

**For this demo application:**
- API key is included in the code and `.env.local` file
- This is for demonstration and ease of use only

**For production applications:**
- Never commit API keys to Git in real-world applications
- Use environment variables on your hosting platform
- Set appropriate permissions and usage limits on your API keys

2. **Use server-side API calls only**
   - All API calls happen in API routes, not client components
   - API key is never exposed to the browser

3. **Restrict API key usage**
   - In Google AI Studio, you can set usage limits and restrictions

4. **Monitor usage**
   - Regularly check API usage in Google AI Studio

## Customizing the Integration

### Modifying the Prompt

If you want to adjust what information is extracted:
1. Edit the prompt string in `lib/gemini-api.ts`
2. Make sure the response format still matches the expected data structure
3. Update the UI components if necessary to display new data fields

### Changing Gemini Model Parameters

You can adjust the generation parameters in `lib/gemini-api.ts`:
```typescript
generationConfig: {
  temperature: 0.2,  // Lower for more consistent outputs
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 4096,
}
```

- **temperature**: Controls randomness (0.0-1.0, lower = more deterministic)
- **topK/topP**: Controls diversity of generated text
- **maxOutputTokens**: Maximum length of generated response

## Troubleshooting

### API Key Issues
- Verify your key is correctly set in `.env.local` or hosting platform
- Check that the key is active in Google AI Studio
- Ensure you have quota available

### Parsing Errors
- The application expects a specific JSON format
- If the Gemini response format changes, update the parsing logic

### Error Logs
- Check your browser console and server logs for details on API errors
- The application logs error details when API calls fail

## Further Improvements

Consider these enhancements to the Gemini integration:

1. **Caching**: Cache API responses to reduce costs for similar transcripts
2. **Fine-tuning**: Use a fine-tuned model for better meeting transcript analysis
3. **Streaming**: Implement streaming responses for faster user feedback
4. **User feedback**: Add a mechanism for users to rate and improve AI-generated results
5. **Multiple languages**: Add support for non-English meeting transcripts