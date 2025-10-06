import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Queue Management System
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome! Please select your role to continue
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* User Card */}
          <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">User</CardTitle>
              <CardDescription className="text-base">
                Get a queue ticket for your visit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/user")}
                size="lg"
                variant="accent"
                className="w-full h-14 text-lg"
              >
                Continue as User
              </Button>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Admin</CardTitle>
              <CardDescription className="text-base">
                Manage queues and serve customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/admin-login")}
                size="lg"
                className="w-full h-14 text-lg"
              >
                Continue as Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
