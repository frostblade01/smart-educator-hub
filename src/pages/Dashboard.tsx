
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const teacherProfile = {
    name: "Sarah Johnson",
    subject: "Mathematics",
    classes: ["Grade 9A", "Grade 10B", "Grade 11C"],
  };

  const timetable = [
    { time: "8:00 AM", subject: "Math 9A", room: "Room 101" },
    { time: "9:00 AM", subject: "Math 10B", room: "Room 203" },
    { time: "10:00 AM", subject: "Free Period", room: "-" },
    { time: "11:00 AM", subject: "Math 11C", room: "Room 305" },
  ];

  const aiTools = [
    { name: "AI Lesson Planner", path: "/teaching-assistant" },
    { name: "AI Virtual Teacher", path: "/teaching-assistant" },
    { name: "AI Activity Generator", path: "/activity-generator" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Teacher Profile */}
        <Card className="neumorphic flex-1 p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Teacher Profile</h2>
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Name:</span> {teacherProfile.name}</p>
            <p><span className="text-muted-foreground">Subject:</span> {teacherProfile.subject}</p>
            <div>
              <span className="text-muted-foreground">Classes:</span>
              <ul className="list-disc list-inside ml-4">
                {teacherProfile.classes.map((cls) => (
                  <li key={cls}>{cls}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Today's Timetable */}
        <Card className="neumorphic flex-1 p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Today's Timetable</h2>
          <div className="space-y-4">
            {timetable.map((period) => (
              <div
                key={period.time}
                className="flex justify-between items-center p-3 neumorphic-inset rounded-lg"
              >
                <span className="text-sm font-medium">{period.time}</span>
                <span className="text-primary">{period.subject}</span>
                <span className="text-sm text-muted-foreground">{period.room}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Access */}
      <Card className="neumorphic p-6">
        <h2 className="text-2xl font-bold text-primary mb-4">Quick Access - AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiTools.map((tool) => (
            <button
              key={tool.name}
              className="p-4 neumorphic-button rounded-lg text-center"
              onClick={() => navigate(tool.path)}
            >
              {tool.name}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
