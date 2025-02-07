import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Login = () => {
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    if (teacherId && password) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="neumorphic w-full max-w-md p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Teacher Portal</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="teacherId" className="text-sm font-medium">
              Teacher ID
            </label>
            <Input
              id="teacherId"
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="neumorphic-inset"
              placeholder="Enter your Teacher ID"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neumorphic-inset"
              placeholder="Enter your password"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full neumorphic-button bg-primary hover:bg-primary/90"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;