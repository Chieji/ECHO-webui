import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Github, Mail, Chrome } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUpWithEmail, signInWithProvider } = useSupabaseAuth();
  const [, navigate] = useLocation();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await signUpWithEmail(email, password, name);
      if (err) {
        setError(err.message);
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github" | "discord") => {
    setLoading(true);
    setError(null);
    try {
      const { error: err } = await signInWithProvider(provider);
      if (err) setError(err.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-slate-800/50 border-slate-700/50 backdrop-blur-xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
              ECHOMEN
            </h1>
            <p className="text-slate-400">Create your account</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              Account created! Redirecting to sign in...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Sign up form */}
          <form onSubmit={handleEmailSignUp} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="name" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="mt-2 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-2 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-2 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/50 text-slate-400">Or sign up with</span>
            </div>
          </div>

          {/* OAuth buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("google")}
              disabled={loading}
              className="border-slate-600/50 hover:bg-slate-700/50"
            >
              <Chrome className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("github")}
              disabled={loading}
              className="border-slate-600/50 hover:bg-slate-700/50"
            >
              <Github className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("discord")}
              disabled={loading}
              className="border-slate-600/50 hover:bg-slate-700/50"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>

          {/* Sign in link */}
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
