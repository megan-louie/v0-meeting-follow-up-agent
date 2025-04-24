import { Card, CardContent } from "@/components/ui/card"

interface Participant {
  name: string
  role?: string
}

interface MeetingData {
  title: string
  date: string
  participants: Participant[]
  summary: string
  keyDecisions: string[]
  actionItems: any[]
}

interface MeetingSummaryProps {
  meetingData: MeetingData
}

export function MeetingSummary({ meetingData }: MeetingSummaryProps) {
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border shadow-md">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2">📋</span> Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line text-gray-700">{meetingData.summary}</p>
              </div>
            </div>

            {/* Key Decisions Section */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2">✅</span> Key Decisions
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="space-y-2">
                  {meetingData.keyDecisions.map((decision, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-700">{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items Section */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2">🛠️</span> Action Items
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="space-y-2">
                  {meetingData.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="font-medium text-gray-900">{item.person}:</span>
                      <span className="ml-2 text-gray-700">{item.task}</span>
                      {item.dueDate && <span className="ml-2 text-gray-500 text-sm">(Due: {item.dueDate})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Participants Section */}
            <div className="space-y-3">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2">👥</span> Participants
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {meetingData.participants.map((participant, index) => (
                    <div key={index} className="bg-white px-3 py-1 rounded-full border text-sm">
                      {participant.name}
                      {participant.role && <span className="text-gray-500 ml-1">({participant.role})</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
