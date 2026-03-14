import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import SkillsInput from "../../components/shared/SkillsInput";
import PromoForSignup from "../../components/shared/PromoForSignup";
import { useAuth } from "../../context/auth";

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
    <div className="min-h-screen flex bg-background">

      {/* LEFT SIDE - REGISTER FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-card overflow-y-auto">
        <div className="w-full max-w-md space-y-10 py-8">

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
              Create an Account
            </h2>
            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
              Join your team and start managing workflows efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-xs text-rose-500 text-center font-bold uppercase tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              className="py-3 px-4 rounded-xl"
              required
            />

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

            <div>
              <label className="block text-sm font-bold text-foreground/70 mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="py-3 px-4 rounded-xl"
              />
            </div>

            {/* Skills / Topics Section */}
            <div className="space-y-2">
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

            <div className="pt-4">
              <Button type="submit" fullWidth disabled={loading} className="py-4 text-base font-black shadow-xl shadow-primary/20">
                {loading ? "Creating Account..." : "Join AI TaskFlow"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground font-medium pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-black hover:opacity-80 transition-opacity ml-1"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - TASK MANAGEMENT PROMO */}
      <PromoForSignup />
    </div>
  );
};

export default Register;