# CV Customization Tool

An intelligent React application that automatically customizes your CV based on job postings using Claude AI. The tool maintains a master profile and adapts it to specific job requirements without inventing qualifications.

## Features

- **Master Profile Management**: One-time setup of personal data, skills, and experiences
- **Job Posting Analysis**: Upload plain text job postings for analysis
- **AI-Powered Customization**: Uses Claude AI to tailor CVs to specific job requirements
- **Bilingual Support**: Generate CVs in English or German
- **Professional Layout**: Clean, print-ready CV design with 35% sidebar / 65% main content
- **PDF Export**: High-quality PDF generation using Puppeteer
- **Data Persistence**: localStorage for maintaining profiles and generated CVs

## Tech Stack

- **Frontend**: React 18 with Next.js 15
- **Styling**: Tailwind CSS
- **PDF Generation**: Puppeteer
- **AI Integration**: Claude API (Anthropic)
- **Storage**: Browser localStorage
- **TypeScript**: Full type safety

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Claude API key from Anthropic

## Quick Start (Recommended)

### Prerequisites

- Node.js 18+ installed
- Claude API key from Anthropic

### Easy Setup with Batch File

For **Windows users**, the quickest way to get started:

1. **Download/Clone this repository**
2. **Double-click `START-CV-TOOL.bat`** 
   
   The batch file will automatically:
   - Check if Node.js is installed
   - Install dependencies (`npm install`)
   - Build the application (`npm run build`)
   - Start the development server
   - Open your browser at `http://localhost:3000`

3. **To stop the application**: Close the command window or press `Ctrl+C`

> **Note**: Keep the command window open while using the application. Closing it will stop the server.


### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Getting a Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Generate a new API key (starts with `sk-ant-`)
5. Enter this key in the application header when using the tool

## Usage Workflow

### 1. Master Profile Setup
- Fill in your personal information (name, contact details, profile image)
- Add your professional summary
- Create your skills pool with context and evidence
- Add your work experiences with responsibilities and keywords
- Include your education background
- List additional skills

### 2. Job Posting Upload
- Select your target CV language (English or German)
- Upload a job posting as plain text file, or paste it directly
- Ensure your Claude API key is entered in the header
- Click "Customize CV" to generate a tailored version

### 3. Preview & Export
- Review the customized CV in the preview
- The AI will have prioritized relevant skills and experiences
- Export to high-quality PDF for applications

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── claude/route.ts          # Claude API integration
│   │   └── generate-pdf/route.ts    # PDF generation endpoint
│   └── page.tsx                     # Main application component
├── components/
│   ├── MasterProfileSetup.tsx       # Profile setup form
│   ├── JobPostingUpload.tsx         # Job upload interface
│   └── CVLayout.tsx                 # CV preview component
├── services/
│   ├── claudeApi.ts                 # Claude AI service
│   └── pdfGenerator.ts              # PDF generation service
├── types/
│   └── index.ts                     # TypeScript interfaces
└── utils/
    └── localStorage.ts              # Data persistence utilities
```

## Key Design Principles

1. **No Qualification Invention**: The AI strictly uses only existing qualifications and experiences
2. **Intelligent Prioritization**: Skills and experiences are reordered based on job relevance
3. **Contextual Adaptation**: Wording is adapted to emphasize relevant aspects without adding fiction
4. **Clean UI/UX**: Step-by-step workflow with clear progress indication
5. **Professional Output**: High-quality, print-ready PDF generation

## Data Structure

The application uses a structured approach to CV data:

```typescript
interface MasterProfile {
  personalInfo: PersonalInfo;
  shortProfile: string;
  skillsPool: Skill[];
  experiencePool: Experience[];
  education: Education[];
  additionalSkills: string[];
}
```

## API Integration

The tool integrates with Claude AI using:
- **Model**: claude-3-haiku-20240307
- **Temperature**: 0.3 (for consistent, focused responses)
- **Max Tokens**: 4000
- **System Prompts**: Separate prompts for English and German output

## PDF Generation

Uses Puppeteer to generate PDFs with:
- A4 format
- Print-ready quality
- Exact layout preservation
- Professional typography

## Browser Compatibility

- Modern browsers with ES6+ support
- localStorage availability required
- File upload and download capabilities

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking (if available)
npx tsc --noEmit

# Linting
npm run lint
```

## Troubleshooting

### Common Issues

1. **PDF Generation Fails**:
   - Ensure Puppeteer dependencies are installed
   - Check if running on a system that supports headless Chrome

2. **Claude API Errors**:
   - Verify API key format (should start with `sk-ant-`)
   - Check API key permissions and rate limits
   - Ensure stable internet connection

3. **localStorage Issues**:
   - Verify browser supports localStorage
   - Check if localStorage is enabled in browser settings

## License

This project is created for educational and professional development purposes.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments for implementation details.
