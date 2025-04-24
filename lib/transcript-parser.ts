/**
 * Transcript parser utilities
 * Handles different transcript formats (TXT, CSV, JSON)
 */

interface TranscriptEntry {
  timestamp?: string;
  speaker: string;
  text: string;
}

/**
 * Parse CSV transcript data
 * Expected format: timestamp,speaker,text
 */
export function parseCSV(csvText: string): TranscriptEntry[] {
  try {
    // Split by lines
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    // Check if we have at least one line
    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }
    
    // Try to find header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('timestamp') && 
                     (firstLine.includes('speaker') || firstLine.includes('person')) && 
                     (firstLine.includes('text') || firstLine.includes('message'));
    
    // Determine indexes of columns
    let timestampIndex = 0;
    let speakerIndex = 1;
    let textIndex = 2;
    
    // If we have a header, use it to determine column indices
    if (hasHeader) {
      const headers = parseCSVLine(firstLine);
      headers.forEach((header, index) => {
        const h = header.toLowerCase().trim();
        if (h.includes('time') || h.includes('timestamp')) timestampIndex = index;
        if (h.includes('speaker') || h.includes('person') || h.includes('name')) speakerIndex = index;
        if (h.includes('text') || h.includes('message') || h.includes('content')) textIndex = index;
      });
    }
    
    // Process content lines
    const entries: TranscriptEntry[] = [];
    const startIndex = hasHeader ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = parseCSVLine(line);
      
      // Require at least speaker and text
      if (parts.length >= 2) {
        const entry: TranscriptEntry = {
          speaker: parts[speakerIndex] || 'Unknown',
          text: parts[textIndex] || '',
        };
        
        // Add timestamp if available
        if (parts[timestampIndex]) {
          entry.timestamp = parts[timestampIndex];
        }
        
        entries.push(entry);
      }
    }
    
    return entries;
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw new Error("Failed to parse CSV transcript. Please check the format.");
  }
}

/**
 * Parse a single CSV line, handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Don't forget the last field
  result.push(current.trim());
  return result;
}

/**
 * Parse TXT transcript data
 * Expected format: [Speaker]: [Text]
 * Or: [Timestamp] [Speaker]: [Text]
 */
export function parseTXT(text: string): TranscriptEntry[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  const entries: TranscriptEntry[] = [];
  
  // First attempt to extract metadata (title, date, participants)
  let inMetadata = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check for dialogue patterns
    const speakerMatch = line.match(/^([^:]+):\s*(.+)$/);
    const timestampMatch = line.match(/^(\d{1,2}:\d{2}(?::\d{2})?)\s+([^:]+):\s*(.+)$/);
    
    if (speakerMatch || timestampMatch) {
      inMetadata = false;
      
      if (timestampMatch) {
        entries.push({
          timestamp: timestampMatch[1],
          speaker: timestampMatch[2].trim(),
          text: timestampMatch[3].trim()
        });
      } else if (speakerMatch) {
        entries.push({
          speaker: speakerMatch[1].trim(),
          text: speakerMatch[2].trim()
        });
      }
    } 
    else if (!inMetadata) {
      // If we're already in dialogue but line doesn't match pattern, 
      // append to previous entry if possible
      if (entries.length > 0) {
        entries[entries.length - 1].text += ' ' + line;
      }
    }
  }
  
  return entries;
}

/**
 * Convert transcript entries to formatted text
 */
export function formatTranscriptForAI(entries: TranscriptEntry[]): string {
  let result = '';
  
  entries.forEach(entry => {
    if (entry.timestamp) {
      result += `[${entry.timestamp}] `;
    }
    result += `${entry.speaker}: ${entry.text}\n`;
  });
  
  return result;
}

/**
 * Detect and parse a transcript based on file extension or content
 */
export function parseTranscript(content: string, fileType?: string): string {
  try {
    // Try to determine the format based on content if not specified
    if (!fileType) {
      if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
        fileType = 'json';
      } else if (content.includes(',') && 
                (content.toLowerCase().includes('timestamp') || 
                 content.toLowerCase().includes('speaker'))) {
        fileType = 'csv';
      } else {
        fileType = 'txt';
      }
    }
    
    let entries: TranscriptEntry[] = [];
    
    // Parse based on detected format
    if (fileType.toLowerCase() === 'csv') {
      entries = parseCSV(content);
    } else if (fileType.toLowerCase() === 'json') {
      try {
        const jsonData = JSON.parse(content);
        // Attempt to extract entries from common JSON formats
        if (Array.isArray(jsonData) && jsonData.length > 0 && 
            (jsonData[0].speaker || jsonData[0].text || jsonData[0].message)) {
          entries = jsonData.map(item => ({
            timestamp: item.timestamp || item.time,
            speaker: item.speaker || item.person || item.name || 'Unknown',
            text: item.text || item.message || item.content || ''
          }));
        } else {
          // If JSON doesn't match expected format, fall back to treating as text
          return content;
        }
      } catch (e) {
        // If JSON parsing fails, fall back to treating as text
        return content;
      }
    } else {
      entries = parseTXT(content);
    }
    
    // If we couldn't parse any entries, return the original content
    if (entries.length === 0) {
      return content;
    }
    
    // Format entries for AI processing
    return formatTranscriptForAI(entries);
  } catch (error) {
    console.error("Error parsing transcript:", error);
    // Fall back to the original content if parsing fails
    return content;
  }
}