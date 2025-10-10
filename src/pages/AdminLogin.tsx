import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ADMIN_PASSWORD = "Ug1234";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      // Store admin session
      sessionStorage.setItem("adminAuthenticated", "true");
      toast({
        title: "Access Granted",
        description: "Welcome to Admin Dashboard",
      });
      navigate("/admin-dashboard");
    } else {
      setError(true);
      toast({
        title: "Access Denied",
        description: "Incorrect Password",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#00205B] p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Back Button */}
        <Button variant="outline" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className="shadow-lg animate-scale-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Admin Access</CardTitle>
            <CardDescription className="text-base">
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    className={`pl-10 h-12 ${error ? "border-destructive" : ""}`}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive animate-fade-in">
                    Access Denied: Incorrect Password
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full h-12 text-lg">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
