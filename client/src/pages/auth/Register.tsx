import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/shared/Input";
import Button from "../../components/shared/Button";

const SUGGESTED_SKILLS = [
  "react", "reactjs", "react-native", "node.js", "typescript",
  "javascript", "python", "java", "c++", "design", "ui/ux", "figma",
  "aws", "docker", "graphql", "sql", "mongodb", "nextjs", "vuejs"
];

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
    setShowSuggestions(true);
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim().toLowerCase();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill],
      }));
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Prevent form submission
      addSkill(skillInput);
    } else if (e.key === "Backspace" && skillInput === "" && formData.skills.length > 0) {
      // Remove last skill if input is empty and backspace is pressed
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", formData);
    // TODO: Dispatch Redux register action here
  };

  const filteredSuggestions = SUGGESTED_SKILLS.filter(
    (skill) =>
      skill.includes(skillInput.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

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
            
              <Input
                label="Username"
                type="text"
                name="username"
                placeholder="janedoe"
                value={formData.username}
                onChange={handleChange}
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
            />

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Skills / Topics Section */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Skills (separate with spaces)
              </label>
              <div
                className="flex flex-wrap items-center gap-2 p-2 w-full min-h-[50px] max-h-[120px] overflow-y-auto rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all cursor-text"
                onClick={() => document.getElementById('skill-input')?.focus()}
              >
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-indigo-500 hover:text-indigo-900 focus:outline-none flex items-center justify-center font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  id="skill-input"
                  type="text"
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={formData.skills.length === 0 ? "e.g., react nodejs" : ""}
                  className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 placeholder-gray-400 py-1"
                  autoComplete="off"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && skillInput && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      onClick={() => addSkill(suggestion)}
                      className="px-4 py-2 cursor-pointer hover:bg-indigo-50 text-gray-700 text-sm font-medium border-b border-gray-50 last:border-b-0"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth>
                Sign up
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-indigo-700 items-center justify-center p-12">
        <div className="max-w-lg space-y-8">

          <h2 className="text-5xl font-serif text-white leading-tight">
            Supercharge your team's workflow
          </h2>

          <p className="text-lg text-indigo-200">
            Join thousands of professionals using AI TaskFlow to ship products faster and manage tasks seamlessly without the clutter.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4">
            {[
              { title: "Smart Assignments", desc: "AI automatically matches tasks to team members based on their skills." },
              { title: "Real-time Sync", desc: "Collaborate instantly across boards, lists, and timelines." },
              { title: "Deep Integrations", desc: "Connects with GitHub, Slack, and your favorite developer tools." },
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5 border-l-4 border-l-indigo-400">
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-indigo-200 mt-1">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;