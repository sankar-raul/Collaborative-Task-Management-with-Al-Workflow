import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/protectedRoutes";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import RootLayout from "./components/layout/RootLayout";

// Admin Pages
import { UsersRoles } from "./pages/admin/UsersRoles";
import { Analytics } from "./pages/admin/Analytics";
import { AdminProjects } from "./pages/admin/AdminProjects";

// Manager Pages
import { ProjectsTeams } from "./pages/manager/ProjectsTeams";
import { TeamWorkload } from "./pages/manager/TeamWorkload";

// Developer Pages
import { MyTasks } from "./pages/developer/MyTasks";

// Common Pages
import { Notifications } from "./pages/common/Notifications";
import { Unauthorized } from "./pages/common/Unauthorized";
import { Profile } from "./pages/common/Profile";
import { Messages } from "./pages/common/Messages";


const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Auth Routes - without RootLayout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Common Protected Routes wrapped in RootLayout */}
            <Route path="/" element={
                <ProtectedRoute>
                    <RootLayout />
                </ProtectedRoute>
            }>
                {/* Default Dashboard */}
                <Route index element={<Home />} />

                {/* Common Pages */}
                <Route path="notifications" element={<Notifications />} />
                <Route path="projects" element={<ProjectsTeams />} />
                <Route path="tasks" element={<MyTasks />} />
                <Route path="messages" element={<Messages />} />
                <Route path="profile" element={<Profile />} />

                <Route path="users" element={
                    <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                        <UsersRoles />
                    </RoleProtectedRoute>
                } />

                {/* Admin Only Routes */}
                <Route path="admin" element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <Outlet />
                    </RoleProtectedRoute>
                }>
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="analytics" element={<Analytics />} />
                </Route>

                {/* Manager Only Routes */}
                <Route path="manager/workload" element={
                    <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
                        <TeamWorkload />
                    </RoleProtectedRoute>
                } />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />

        </>
    )
);

export default routes;