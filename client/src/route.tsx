import { createBrowserRouter, createRoutesFromElements, Route, Outlet } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/protectedRoutes";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import RootLayout from "./components/layout/RootLayout";

import RedirectIfAuthenticated from "./routes/RedirectIfAuthenticated";

// Admin Pages
import { UsersRoles } from "./pages/admin/UsersRoles";
import { UserDetails } from "./pages/admin/UserDetails";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminProjectDetails } from "./pages/admin/AdminProjectDetails";

// Common Page
import { Notifications } from "./pages/common/Notifications";
import { Unauthorized } from "./pages/common/Unauthorized";
import { Profile } from "./pages/common/Profile";
import UserProjectDetails from "./pages/user/UserProjectDetails";


const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Auth Routes - without RootLayout */}
            <Route path="/login" element={
                <RedirectIfAuthenticated>
                    <Login />
                </RedirectIfAuthenticated>
            } />
            <Route path="/register" element={
                <RedirectIfAuthenticated>
                    <Register />
                </RedirectIfAuthenticated>
            } />

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
                <Route path="projects/:id" element={<UserProjectDetails />} />
                <Route path="profile" element={<Profile />} />

                <Route path="users" element={
                    <RoleProtectedRoute allowedRoles={["Admin"]}>
                        <UsersRoles />
                    </RoleProtectedRoute>
                } />
                <Route path="users/:id" element={
                    <RoleProtectedRoute allowedRoles={["Admin"]}>
                        <UserDetails />
                    </RoleProtectedRoute>
                } />

                {/* Admin Only Routes */}
                <Route path="admin" element={
                    <RoleProtectedRoute allowedRoles={["Admin"]}>
                        <Outlet />
                    </RoleProtectedRoute>
                }>
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="projects/:id" element={<AdminProjectDetails />} />
                </Route>

            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />

        </>
    )
);

export default routes;