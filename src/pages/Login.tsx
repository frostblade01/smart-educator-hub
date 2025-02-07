
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [teacherId, setTeacherId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the teacher login function
      const { data, error } = await supabase.rpc('handle_teacher_login', {
        p_teacher_id: teacherId,
        p_password: password
      });

      if (error) throw error;

      if (data.success) {
        // Sign in with Supabase auth using the generated email
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: `${teacherId}@teacher.edu`,
          password: password
        });

        if (signInError) throw signInError;

        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full neumorphic-button bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
