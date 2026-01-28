import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gamepad2, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, signIn, resetPassword } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect only if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const validateForm = () => {
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = z.string().email("Please enter a valid email address").safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    setErrors({});
    
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setIsForgotPassword(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You are now logged in as admin.",
        });
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Login Status Indicator */}
      {!authLoading && user && !isAdmin && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500/20 border border-orange-500/50 rounded-lg px-4 py-2 backdrop-blur-sm">
          <p className="text-orange-400 text-xs font-display uppercase tracking-wider">
            Logged in as: <span className="text-orange-300">{user.email}</span> (Not Admin)
          </p>
        </div>
      )}

      <div className="w-full max-w-md relative">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-sm p-8 border-glow-red">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary clip-angle flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-wider text-glow-red">
                ADMIN ACCESS
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {isForgotPassword
                ? "Enter your email to receive a reset link"
                : user && !isAdmin
                  ? "You're logged in but not as admin. Sign in with admin credentials."
                  : "Sign in to manage tournament scores"}
            </p>
          </div>

          {/* Forgot Password Form */}
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-xs uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="bg-background/50 border-border focus:border-primary"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 font-display uppercase tracking-wider clip-angle-sm"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 animate-pulse" />
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="text-primary hover:text-primary/80 font-display uppercase tracking-wider text-xs"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          ) : (
          /* Login/Signup Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-xs uppercase tracking-widest">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-background/50 border-border focus:border-primary"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-display text-xs uppercase tracking-widest">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background/50 border-border focus:border-primary pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-muted-foreground hover:text-primary text-xs"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 font-display uppercase tracking-wider clip-angle-sm"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 animate-pulse" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          )}


          {/* Back link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              ← Back to Scoreboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
