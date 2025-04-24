# CSV Format for Meeting Transcripts

The Meeting Follow-Up Agent can process meeting transcripts in CSV format. This document provides guidelines on how to structure your CSV files for optimal processing.

## CSV Structure

The CSV file must have the following columns:

1. **timestamp** - The time at which the message was spoken (e.g., "00:15" or "01:30:45")
2. **speaker** - The name of the person speaking (e.g., "John Smith" or "Engineer_1")
3. **text** - The actual content of what was said

## Sample CSV Format

```csv
timestamp,speaker,text
00:00,Meeting Bot,Meeting: Quarterly Product Planning
00:15,Meeting Bot,Date: 04/25/2025
00:30,Meeting Bot,"Participants: John Smith (Product Manager), Sarah Lee (UX Designer), Mike Johnson (Engineer), Emma Chen (QA Lead)"
01:30,John Smith,"Good morning everyone! Let's get started with our quarterly planning session."
02:15,Sarah Lee,"I'd like to discuss the new dashboard design we've been working on."
03:00,Mike Johnson,"Before we do that, could we talk about the backend infrastructure updates?"
```

## Format Requirements

1. **Header Row** - The first line should contain the column headers: `timestamp,speaker,text`
2. **Timestamp Format** - Use minutes and seconds (MM:SS) or hours, minutes, and seconds (HH:MM:SS)
3. **Quotes for Complex Text** - Use quotes around text that contains commas or other special characters
4. **Meeting Metadata** - Include meeting title, date, and participants in the first few rows

## Downloading a Sample

You can download a [sample CSV transcript](/sample-transcript.csv) to use as a template.

## Column Details

### timestamp
* Format: Minutes and seconds (MM:SS) or hours, minutes, seconds (HH:MM:SS)
* Example: "00:15" or "01:30:45"
* This field helps establish the chronological order of the conversation

### speaker
* The name or identifier of the person speaking
* Can be a full name ("John Smith") or a role ("Engineer_1")
* Be consistent with speaker names throughout the transcript
* Include roles in the participants line if possible

### text
* The actual spoken content
* Use quotes if the text contains commas or special characters
* Can be any length
* Include metadata about the meeting in the first few rows

## Example with Alternative Column Names

The parser will also try to work with slightly different column names:

```csv
Time,Person,Message
00:00,Meeting Bot,Meeting: Quarterly Product Planning
00:15,Meeting Bot,Date: 04/25/2025
```

Supported alternatives:
* timestamp: "time", "timestamp"
* speaker: "speaker", "person", "name"
* text: "text", "message", "content"

## Best Practices

1. **Header Row** - Always include a header row with column names
2. **Metadata** - Include meeting title, date, and participants at the beginning
3. **Speaker Names** - Use consistent names for speakers throughout the transcript
4. **Roles** - When possible, include roles in parentheses after participant names in the introduction
5. **Action Items** - Clearly label action items, ideally with assignees and due dates
6. **Decisions** - Clearly mark key decisions made during the meeting

## Optional Additional Columns

You can include additional columns for richer data:

- **Role** - The role of the speaker in the meeting
- **Type** - The type of message (e.g., question, response, action item)
- **Topic** - The topic being discussed

## Example with Additional Columns

```csv
Timestamp,Speaker,Role,Message,Type
00:00:00,Meeting Bot,System,Meeting: Q2 Product Roadmap Planning,Metadata
00:00:05,Meeting Bot,System,Date: 04/15/2025,Metadata
00:00:10,Meeting Bot,System,Participants: Sarah Johnson (Product Manager), Michael Chen (Engineering Lead), Emma Rodriguez (UX Designer), David Kim (Marketing Director), Alex Thompson (Customer Success),Metadata
00:01:30,Sarah,Product Manager,Good morning everyone! Thanks for joining our Q2 roadmap planning session. Today we need to finalize our priorities for the next quarter and assign owners to each initiative.,Introduction
00:02:15,Michael,Engineering Lead,Sounds good. Based on our technical debt discussion last week, I think we should prioritize the database migration.,Suggestion
00:03:00,Emma,UX Designer,I agree with Michael, but we also need to consider the user feedback we've been getting about the dashboard redesign.,Suggestion
```

## Converting Other Formats to CSV

If your meeting transcripts are in other formats, you can convert them to CSV:

### From Text Files

1. Split the text into lines
2. Identify the speakers and timestamps if available
3. Create a CSV with three columns: Timestamp, Speaker, Message

### From JSON

If your meeting data is in JSON format, ensure it has the necessary fields and convert to CSV.

## File Size Considerations

- The maximum file size for upload is 10MB
- For large meetings, consider breaking the transcript into smaller sections

## Tips for Best Results

1. **Clean Data** - Remove any unnecessary information or formatting
2. **Speaker Consistency** - Use the same name for each person throughout
3. **Chronological Order** - Ensure messages are in chronological order
4. **Complete Sentences** - Where possible, use complete sentences for better AI understanding
5. **Action Item Labeling** - Clearly mark action items, ideally with assignees and due dates
6. **Decision Labeling** - Clearly mark key decisions made during the meeting

By following these guidelines, you'll get the best results from the Meeting Follow-Up Agent's AI analysis.