import { Upload } from "@/components/upload"
import { Features } from "@/components/features"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center justify-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="font-bold text-xl">Meeting Follow-Up Agent</span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-screen-xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center">
          <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium mb-8">Streamline Your Meetings</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">
            Transform Meetings into Action
          </h1>
          <p className="text-center max-w-2xl text-gray-600 mb-12 text-lg">
            Upload your meeting transcript and let our agent extract key information, generate summaries, and prepare
            follow-up emails automatically - no API key required.
          </p>
          <div className="w-full max-w-md">
            <Upload />
          </div>
        </section>
        <Features />
      </main>
      <footer className="border-t py-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-screen-xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500">Built with Next.js and advanced NLP techniques</p>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span className="text-sm text-gray-500">Powered by local processing</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
