import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ugLogo from "../assets/ugLogo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#00205B] flex items-center justify-center p-4 md:p-8" >
      <div className="max-w-4xl w-full space-y-6 bg-white/5 backdrop-blur-md rounded-2xl p-8 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(to right, #FFB81C, #FFFFFF)",
            }}
          >
            Queue Management System
          </h1>
          <p className="text-gray-200 text-lg">
            Welcome! Please select your role to continue
          </p>
        </div>

        {/* UG Logo */}
        <div className="flex justify-center mt-8">
          <img
            src={ugLogo}
            alt="University of Ghana Logo"
            className="w-32 md:w-40 object-contain drop-shadow-lg"
          />
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {/* User Card */}
          <Card className="bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer animate-scale-in text-white">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#FFB81C]/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-[#FFB81C]" /> 
              </div>
              <CardTitle className="text-2xl font-semibold">User</CardTitle>
              <CardDescription className="text-gray-300">
                Get a queue ticket for your visit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/user")}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-[#FFB81C] text-[#00205B] hover:bg-[#e6a900]"
              >
                Continue as User
              </Button>
            </CardContent>
          </Card>

          {/* Admin Card */}
          <Card className="bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer animate-scale-in text-white">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-[#FFB81C]/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-[#FFB81C]" />
              </div>
              <CardTitle className="text-2xl font-semibold">Admin</CardTitle>
              <CardDescription className="text-gray-300">
                Manage queues and serve customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate("/admin-login")}
                size="lg"
                className="w-full h-14 text-lg font-semibold bg-[#FFB81C] text-[#00205B] hover:bg-[#e6a900]"
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
