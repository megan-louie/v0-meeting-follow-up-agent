/**
 * Static API mock for GitHub Pages deployment
 * 
 * This file simulates API endpoints for static hosting environments
 * where server-side API routes aren't available
 */

// In-memory storage for processed results
// This is a client-side simulation of server storage
const localStorage = typeof window !== 'undefined' ? window.localStorage : null;

export const processTranscriptApi = async (formData: FormData | { useDemo: boolean }) => {
  // Generate a random ID for the result
  const resultId = Math.random().toString(36).substring(2, 15);
  
  try {
    let transcriptText = "";
    let useDemo = false;
    
    // Check if this is demo mode
    if ('useDemo' in formData && formData.useDemo) {
      useDemo = true;
      // Import sample transcript dynamically
      const { sampleTranscript } = await import("@/lib/sample-transcript");
      transcriptText = sampleTranscript;
    } else if (formData instanceof FormData) {
      // Handle file upload
      const transcriptFile = formData.get('transcript') as File;
      if (!transcriptFile) {
        throw new Error("No transcript file provided");
      }
      transcriptText = await transcriptFile.text();
    }
    
    if (!transcriptText && !useDemo) {
      throw new Error("No transcript content provided");
    }
    
    // Determine file type and parse transcript
    let fileType = "";
    if (formData instanceof FormData) {
      const file = formData.get('transcript') as File;
      if (file?.name) {
        fileType = file.name.split('.').pop()?.toLowerCase() || "";
      }
    }
    
    // Parse the transcript based on file type
    let parsedTranscript = transcriptText;
    try {
      const { parseTranscript } = await import("@/lib/transcript-parser");
      parsedTranscript = parseTranscript(transcriptText, fileType);
      console.log("Transcript parsed successfully");
    } catch (parseError) {
      console.error("Error parsing transcript:", parseError);
      // If parsing fails, use the original text
    }
    
    // Process with Gemini API
    const { analyzeMeetingTranscript, extractBasicInfo } = await import("@/lib/gemini-api");
    
    let meetingData;
    try {
      // Try to analyze with Gemini
      meetingData = await analyzeMeetingTranscript(parsedTranscript);
    } catch (error) {
      console.error("Gemini API error:", error);
      
      try {
        // Fallback to basic extraction
        meetingData = extractBasicInfo(parsedTranscript);
      } catch (fallbackError) {
        // Final fallback to mock data
        const { mockMeetingData } = await import("@/lib/mock-meeting-data");
        meetingData = mockMeetingData;
      }
    }
    
    // Store in local storage (simulating server storage)
    if (localStorage) {
      localStorage.setItem(`meeting_${resultId}`, JSON.stringify(meetingData));
    }
    
    return { id: resultId };
  } catch (error) {
    console.error("Error processing transcript:", error);
    throw error;
  }
};

export const getMeetingDataApi = async (id: string) => {
  // Try to retrieve from local storage
  if (localStorage) {
    const data = localStorage.getItem(`meeting_${id}`);
    if (data) {
      return JSON.parse(data);
    }
  }
  
  // If not found, return mock data
  const { mockMeetingData } = await import("@/lib/mock-meeting-data");
  return mockMeetingData;
};

export const sendEmailApi = async (data: any) => {
  // Simulate email sending
  console.log("Sending email:", data);
  
  // Return success response after a small delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: "Email sent successfully (simulated)",
  };
};