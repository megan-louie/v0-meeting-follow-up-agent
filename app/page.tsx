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
            Upload your meeting transcript and let our AI agent extract key information, generate summaries, and prepare
            follow-up emails automatically.
          </p>
          <div className="w-full max-w-md">
            <Upload />
          </div>
        </section>
        <Features />
      </main>
      <footer className="border-t py-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-screen-xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500">Built with Next.js and Hugging Face models</p>
          <div className="flex items-center space-x-1 mt-2 md:mt-0">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.91 34.727H30.09V37H9.91V34.727Z" fill="#FFD21E" />
              <path
                d="M16.364 15.273C16.364 16.273 17.182 17.091 18.182 17.091C19.182 17.091 20 16.273 20 15.273H23.636C23.636 16.273 24.454 17.091 25.454 17.091C26.454 17.091 27.272 16.273 27.272 15.273H30.909V26.364H9.09V15.273H12.727C12.727 16.273 13.545 17.091 14.545 17.091C15.545 17.091 16.364 16.273 16.364 15.273Z"
                fill="#FFD21E"
              />
              <path
                d="M32.727 12.727H27.273C27.273 13.727 26.455 14.545 25.455 14.545C24.455 14.545 23.637 13.727 23.637 12.727H20C20 13.727 19.182 14.545 18.182 14.545C17.182 14.545 16.364 13.727 16.364 12.727H12.727C12.727 13.727 11.909 14.545 10.909 14.545C9.909 14.545 9.091 13.727 9.091 12.727H7.273V28.182H32.727V12.727Z"
                fill="#FFD21E"
              />
              <path
                d="M30.909 10.909H27.273C27.273 11.909 26.455 12.727 25.455 12.727C24.455 12.727 23.637 11.909 23.637 10.909H20C20 11.909 19.182 12.727 18.182 12.727C17.182 12.727 16.364 11.909 16.364 10.909H12.727C12.727 11.909 11.909 12.727 10.909 12.727C9.909 12.727 9.091 11.909 9.091 10.909H7.273C6.018 10.909 5 11.927 5 13.182V30C5 31.255 6.018 32.273 7.273 32.273H32.727C33.982 32.273 35 31.255 35 30V15C35 12.736 33.173 10.909 30.909 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M25.455 10.909C25.455 9.909 26.273 9.091 27.273 9.091C28.273 9.091 29.091 9.909 29.091 10.909C29.091 11.909 28.273 12.727 27.273 12.727C26.273 12.727 25.455 11.909 25.455 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M18.182 10.909C18.182 9.909 19 9.091 20 9.091C21 9.091 21.818 9.909 21.818 10.909C21.818 11.909 21 12.727 20 12.727C19 12.727 18.182 11.909 18.182 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M10.909 10.909C10.909 9.909 11.727 9.091 12.727 9.091C13.727 9.091 14.545 9.909 14.545 10.909C14.545 11.909 13.727 12.727 12.727 12.727C11.727 12.727 10.909 11.909 10.909 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M25.455 10.909C25.455 9.909 26.273 9.091 27.273 9.091C28.273 9.091 29.091 9.909 29.091 10.909C29.091 11.909 28.273 12.727 27.273 12.727C26.273 12.727 25.455 11.909 25.455 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M18.182 10.909C18.182 9.909 19 9.091 20 9.091C21 9.091 21.818 9.909 21.818 10.909C21.818 11.909 21 12.727 20 12.727C19 12.727 18.182 11.909 18.182 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M10.909 10.909C10.909 9.909 11.727 9.091 12.727 9.091C13.727 9.091 14.545 9.909 14.545 10.909C14.545 11.909 13.727 12.727 12.727 12.727C11.727 12.727 10.909 11.909 10.909 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M25.455 10.909C25.455 9.909 26.273 9.091 27.273 9.091C28.273 9.091 29.091 9.909 29.091 10.909C29.091 11.909 28.273 12.727 27.273 12.727C26.273 12.727 25.455 11.909 25.455 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M18.182 10.909C18.182 9.909 19 9.091 20 9.091C21 9.091 21.818 9.909 21.818 10.909C21.818 11.909 21 12.727 20 12.727C19 12.727 18.182 11.909 18.182 10.909Z"
                fill="#FFD21E"
              />
              <path
                d="M10.909 10.909C10.909 9.909 11.727 9.091 12.727 9.091C13.727 9.091 14.545 9.909 14.545 10.909C14.545 11.909 13.727 12.727 12.727 12.727C11.727 12.727 10.909 11.909 10.909 10.909Z"
                fill="#FFD21E"
              />
            </svg>
            <span className="text-sm text-gray-500">Powered by Hugging Face</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
