# Meeting Follow-Up Agent

A web application that processes meeting transcripts to automatically generate summaries, extract action items, and create follow-up emails using Google's Gemini AI.

[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue?style=for-the-badge&logo=google)](https://ai.google.dev/)

## Features

- Upload meeting transcripts in TXT, CSV, or JSON format
- Automatic analysis using Google's Gemini AI to extract:
  - Meeting summary
  - Key decisions
  - Action items with assignees and due dates
- View organized meeting information in a clean interface
- Generate follow-up emails based on meeting content
- Demo mode with sample data

## Live Demo

**[Access the live demo here](https://your-username.github.io/meeting-follow-up-agent/)**

## Getting Started

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/your-username/meeting-follow-up-agent.git
   cd meeting-follow-up-agent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. API Key Setup:
   - A demo Gemini API key is already included in the project
   - **Note:** For production use, you should replace this key with your own from [Google AI Studio](https://ai.google.dev)

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Pages Deployment

This repository is set up to automatically deploy to GitHub Pages when you push to the main branch.

To deploy manually:

1. Build the static site:
   ```
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## How It Works

1. **Upload Transcript**: Upload your meeting transcript or use the demo mode
2. **AI Processing**: Gemini AI analyzes the transcript to extract key information
3. **View Results**: See the structured summary, decisions, and action items
4. **Follow Up**: Send auto-generated follow-up emails to participants

## Transcript Format

The application supports multiple transcript formats:

### Text Format (TXT)

```
Meeting Title: Product Planning Meeting
Date: 04/23/2023
Participants: John Smith (Product Manager), Jane Doe (Engineer), Bob Johnson (Designer)

John: Let's discuss our roadmap for the next quarter.
Jane: I think we should prioritize the new search feature.
Bob: I agree, but we also need to update the dashboard design.

[Discussion continues...]

John: So our action items are:
1. Jane will implement the search feature by May 15
2. Bob will update the dashboard design by June 1
3. I will prepare the product requirements document by next week

Everyone agreed to meet again next Monday to review progress.
```

### CSV Format

The application handles CSV files with timestamp, speaker, and text columns:

```csv
timestamp,speaker,text
00:00,Meeting Bot,Meeting: Quarterly Product Planning
00:15,Meeting Bot,Date: 04/25/2025
00:30,Meeting Bot,"Participants: John Smith (Product Manager), Sarah Lee (UX Designer)"
01:30,John Smith,"Good morning everyone! Let's get started with our planning session."
02:15,Sarah Lee,"I'd like to discuss the new dashboard design we've been working on."
```

A sample CSV file is available for download: [sample-transcript.csv](/sample-transcript.csv)

For detailed CSV format guidelines, see [CSV_FORMAT.md](docs/CSV_FORMAT.md).

## API Key Information

This project includes a demo Gemini API key for out-of-the-box functionality.

**Important notes:**
- The included API key is for demonstration purposes
- It has usage limits and may be deactivated in the future
- For long-term use, replace it with your own API key from [Google AI Studio](https://ai.google.dev)

## Technical Details

For detailed information about the Gemini API integration, see [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md).

## License

This project is MIT licensed.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/) and [Shadcn UI](https://ui.shadcn.com/)
- AI-powered by [Google Gemini](https://ai.google.dev/)
- Originally scaffolded with [v0.dev](https://v0.dev)