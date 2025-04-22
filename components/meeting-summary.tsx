import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
      <Card>
        <CardHeader>
          <CardTitle>Meeting Summary</CardTitle>
          <CardDescription>A concise summary of the meeting discussion</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{meetingData.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Decisions</CardTitle>
          <CardDescription>Important decisions made during the meeting</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {meetingData.keyDecisions.map((decision, index) => (
              <li key={index} className="flex items-start">
                <Badge className="mr-2 mt-1 h-5 w-5 rounded-full p-0 text-center">{index + 1}</Badge>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>People who attended the meeting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {meetingData.participants.map((participant, index) => {
              // Get initials for avatar
              const initials = participant.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()

              return (
                <div key={index} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    {participant.role && <p className="text-xs text-gray-500">{participant.role}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
