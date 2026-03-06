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
    <div className="min-h-screen flex bg-gray-50">

      {/* LEFT SIDE - LOGIN FORM */}
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
              Welcome Back
            </h2>
            <p className="text-gray-500">
              Sign in to manage your team workflows efficiently
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center font-medium">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:text-indigo-800"
              >
                Sign up
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