import { useAuth } from "../../context/auth";
import AdminDashboard from "../dashboard/AdminDashboard";
import UserDashboard from "../dashboard/UserDashboard";

export default function Home() {
  const { member } = useAuth();

  const renderDashboard = () => {
    switch (member?.role) {
      case "Admin":
        return <AdminDashboard />;
      case "User":
        return <UserDashboard />;
      default:
        return (
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg space-y-6 border border-gray-100 text-center mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Welcome User!</h2>
            <p className="text-gray-500 mt-2">You currently have no special assignments. Contact your administrator.</p>
          </div>
        );
    }
  };

  return (
    <>
      {renderDashboard()}
    </>
  );
}
