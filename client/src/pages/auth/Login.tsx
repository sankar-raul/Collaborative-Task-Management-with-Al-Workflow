import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, ArrowRight, Moon } from "lucide-react";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await login(formData.email, formData.password);
    setLoading(false);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfaf8] relative overflow-hidden font-sans">
      {/* Theme Toggle placeholder */}
      <div className="absolute top-8 right-10 z-50">
        <button className="p-2.5 bg-white rounded-full shadow-sm border border-border/40 hover:bg-secondary/50 transition-all text-muted-foreground/60">
          <Moon size={18} />
        </button>
      </div>

      {/* LEFT SIDE - CONTENT */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center p-20 relative">
        <div className="max-w-xl space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              TaskFlow AI
            </h1>
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-5xl font-semibold text-foreground leading-tight tracking-tight">
              Master your team's<br />
              <span className="text-muted-foreground font-medium">AI workflow.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-normal leading-relaxed max-w-lg mx-auto">
              Manage tasks with intelligent assignment, real-time collaboration, and AI-driven insights. Streamline your productivity today.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-4 pt-10 border-t border-border/40 mx-auto w-max">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-[#fdfaf8] bg-secondary flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Join <span className="text-primary">10,000+</span> Professionals
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM CARD */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16 relative bg-white lg:bg-transparent">
        <div className="w-full max-w-md bg-white p-12 lg:rounded-3xl lg:shadow-xl lg:shadow-black/[0.02] lg:border border-border/50 animate-in fade-in zoom-in-95 duration-700 space-y-12">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-foreground tracking-tight">
              Welcome back
            </h3>
            <p className="text-sm font-medium text-muted-foreground/60">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                <p className="text-xs text-rose-500 text-center font-bold uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary/30 border border-border/20 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-sm text-foreground placeholder:text-muted-foreground/30"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                    Password
                  </label>
                  <Link to="/forgot-password" title="Coming soon!" className="text-[10px] font-semibold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary/30 border border-border/20 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-sm text-foreground placeholder:text-muted-foreground/30"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-xl hover:bg-primary/95 disabled:opacity-50 transition-all font-semibold uppercase tracking-widest text-[10px] shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs font-bold text-muted-foreground/60 tracking-tight">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-dark transition-colors font-semibold ml-1"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
