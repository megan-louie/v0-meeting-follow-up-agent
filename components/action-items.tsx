import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, User } from "lucide-react"

interface ActionItem {
  person: string
  task: string
  dueDate?: string
}

interface ActionItemsProps {
  actionItems: ActionItem[]
}

export function ActionItems({ actionItems }: ActionItemsProps) {
  // Group action items by person
  const groupedByPerson: Record<string, ActionItem[]> = {}

  actionItems.forEach((item) => {
    if (!groupedByPerson[item.person]) {
      groupedByPerson[item.person] = []
    }
    groupedByPerson[item.person].push(item)
  })

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-primary/5 pb-3">
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Tasks assigned during the meeting</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[180px]">Assignee</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="w-[150px]">Due Date</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.person}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell>
                      {item.dueDate ? (
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                          {item.dueDate}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not specified</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedByPerson).map(([person, items]) => (
          <Card key={person} className="overflow-hidden border-0 shadow-md">
            <CardHeader className="bg-primary/5 pb-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{person}</CardTitle>
              </div>
              <CardDescription>
                {items.length} action {items.length === 1 ? "item" : "items"} assigned
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start rounded-md p-2 hover:bg-muted/50">
                    <CheckCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{item.task}</p>
                      {item.dueDate && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Due: {item.dueDate}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
