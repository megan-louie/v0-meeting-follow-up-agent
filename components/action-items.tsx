import { Card, CardContent } from "@/components/ui/card"
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
      <Card className="overflow-hidden border shadow-md">
        <CardContent className="p-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="mr-2">🛠️</span> Action Items
            </h3>

            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
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
                            <Clock className="mr-1 h-4 w-4 text-gray-500" />
                            {item.dueDate}
                          </div>
                        ) : (
                          <span className="text-gray-500">Not specified</span>
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
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groupedByPerson).map(([person, items]) => (
          <Card key={person} className="overflow-hidden border shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-indigo-600" />
                <h4 className="font-medium">{person}</h4>
                <Badge variant="outline" className="ml-auto">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Badge>
              </div>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <li key={index} className="flex items-start rounded-md p-2 hover:bg-gray-50">
                    <CheckCircle className="mr-2 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm">{item.task}</p>
                      {item.dueDate && (
                        <p className="mt-1 text-xs text-gray-500 flex items-center">
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
