import { CheckCircle, Users, FileText, Mail, Cpu } from "lucide-react"

export function Features() {
  return (
    <section className="w-full max-w-screen-xl mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Key Features</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Our AI agent helps you extract valuable information from your meetings and ensures nothing falls through the
          cracks.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">Transcript Processing</h3>
          <p className="text-sm text-gray-600">
            Upload meeting transcripts in various formats and get them processed instantly.
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">Participant Tracking</h3>
          <p className="text-sm text-gray-600">
            Automatically identify meeting participants and their roles from the transcript.
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <CheckCircle className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">Action Item Extraction</h3>
          <p className="text-sm text-gray-600">
            Extract action items, assign responsible individuals, and track due dates.
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <Mail className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">Automated Follow-Ups</h3>
          <p className="text-sm text-gray-600">
            Generate and send follow-up emails with summaries and action items to all participants.
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <Cpu className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold mb-2">Local Processing</h3>
          <p className="text-sm text-gray-600">
            Process your meeting transcripts locally without requiring any external API keys.
          </p>
        </div>
      </div>
    </section>
  )
}
