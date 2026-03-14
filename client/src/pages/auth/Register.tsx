import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, ArrowRight, CheckCircle2, Moon } from "lucide-react";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import { api } from "../../utils/api";
import { useAuth } from "../../context/auth";
import SkillsInput from "../../components/shared/SkillsInput";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: [] as string[],
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(formData);
    try {
      const response = await api.auth.register(formData);
      if (response.success && response.auth?.access_token) {
        const loginSuccess = await login(formData.email, formData.password);
        if (loginSuccess) {
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfaf8] relative overflow-hidden font-sans">

      {/* LEFT SIDE - CONTENT */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center relative">
        <div className="max-w-xl space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 ">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              AI TaskFlow
            </h1>
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-5xl font-semibold text-foreground leading-tight tracking-tight">
              Join the AI-powered<br />
              <span className="text-muted-foreground font-medium">productivity wave.</span>
            </h2>
            <p className="text-lg text-muted-foreground font-normal leading-relaxed max-w-lg mx-auto">
              Create an account to experience smart task delegation, real-time progress syncing, and a workspace that grows with your team's ambition.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-5 pt-4 border-t border-border/40 mx-auto w-max">
            <div className="grid grid-cols-1 gap-5">
              {[
                { title: "Adaptive Workflows", desc: "Tasks that adjust to your team's skill level." },
                { title: "Detailed Analytics", desc: "Track your strengths and bottlenecks." },
                { title: "AI Explanations", desc: "Understand the 'why' behind every assignment." }
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-4 group cursor-default text-left">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground tracking-tight">{feature.title}</h4>
                    <p className="text-[11px] font-medium text-muted-foreground/60 mt-0.5">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM CARD */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8  relative bg-white lg:bg-transparent overflow-y-auto">
        <div className="w-full max-w-lg bg-white p-5 lg:rounded-xl lg:shadow-xl lg:shadow-black/[0.02] lg:border border-border/50 animate-in fade-in zoom-in-95 duration-700 space-y-12 my-12">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-semibold text-foreground tracking-tight">
              Create an account
            </h3>
            <p className="text-sm font-medium text-muted-foreground/60">
              Enter your details to generate your account
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
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-secondary/30 border border-border/20 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-sm text-foreground placeholder:text-muted-foreground/30"
                />
              </div>

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

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-6 py-4 bg-secondary/30 border border-border/20 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-sm text-foreground placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">
                    Skills Matrix
                  </label>
                  <SkillsInput
                    skills={formData.skills}
                    setSkills={(skills) =>
                      setFormData((prev) => ({
                        ...prev,
                        skills,
                      }))
                    }
                  />
                </div>
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
                  Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
            <div className="text-center pt-2">
              <p className="text-xs font-bold text-muted-foreground/60 tracking-tight">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-dark transition-colors font-semibold ml-1"
                >
                  Log In
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
