import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import { useAuth } from "../../context/auth";
import PromoForLogin from "../../components/shared/PromoForLogin";

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
    <div className="min-h-screen flex bg-background">

      {/* LEFT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-card">
        <div className="w-full max-w-md space-y-10">

          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tighter">
              AI TaskFlow
            </h1>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Sign in to manage your team workflows efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-3 px-4 rounded-xl"
            />

            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground/70 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium"
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-xs text-rose-500 text-center font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading} className="py-4 text-base font-black shadow-xl shadow-primary/20">
              {loading ? "Authenticating..." : "Log In to Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground font-medium pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-black hover:opacity-80 transition-opacity ml-1"
              >
                Join the Team
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - TASK MANAGEMENT PROMO */}
      <PromoForLogin />
    </div>
  );
};

export default Login;