import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Attendance = () => {
  const students = [
    { id: 1, name: "Alice Johnson", present: true },
    { id: 2, name: "Bob Smith", present: false },
    { id: 3, name: "Charlie Brown", present: true },
    { id: 4, name: "Diana Prince", present: true },
  ];

  const handleMarkAttendance = (studentId: number) => {
    toast.success(`Attendance marked for student ${studentId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance & Class Management</h1>

      <Card className="neumorphic">
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 neumorphic-inset rounded-lg"
              >
                <span>{student.name}</span>
                <Button
                  onClick={() => handleMarkAttendance(student.id)}
                  variant={student.present ? "default" : "secondary"}
                  className="neumorphic-button"
                >
                  {student.present ? "Present" : "Absent"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Attendance Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] neumorphic-inset rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Attendance Chart</p>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic">
          <CardHeader>
            <CardTitle>Class Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] neumorphic-inset rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Add class notes here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;