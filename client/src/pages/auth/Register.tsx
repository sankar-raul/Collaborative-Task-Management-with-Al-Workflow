import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import SkillsInput from "../../components/shared/SkillsInput";
import PromoForSignup from "../../components/shared/PromoForSignup";

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
        localStorage.setItem("access_token", response.auth.access_token);
        // Optionally redirect the user or show success
        navigate("/login");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };



  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT SIDE - REGISTER FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-8">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-700 rounded-lg flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              AI TaskFlow
            </h1>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-gray-500">
              Join your team and start managing workflows efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 "

              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 "

            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 "
              />
            </div>

            {/* Skills / Topics Section */}

            <SkillsInput
              skills={formData.skills}
              setSkills={(skills) =>
                setFormData((prev) => ({
                  ...prev,
                  skills,
                }))
              }
            />
            <div className="pt-2">
              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Log in
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