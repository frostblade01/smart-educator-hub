import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  MonitorPlay,
  Puzzle,
  LineChart,
  Users,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "AI Lesson Planner",
    icon: BookOpen,
    path: "/dashboard/lesson-planner",
  },
  {
    title: "AI Virtual Teacher",
    icon: MonitorPlay,
    path: "/dashboard/virtual-teacher",
  },
  {
    title: "AI Activity Generator",
    icon: Puzzle,
    path: "/dashboard/activity-generator",
  },
  {
    title: "Student Insights",
    icon: LineChart,
    path: "/dashboard/student-insights",
  },
  {
    title: "Attendance & Class",
    icon: Users,
    path: "/dashboard/attendance",
  },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Teacher Portal</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="w-full"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full text-destructive hover:text-destructive/90"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;