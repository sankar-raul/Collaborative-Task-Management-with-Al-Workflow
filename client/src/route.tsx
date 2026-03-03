import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/protectedRoutes";


const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Auth Routes - without RootLayout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
        </>
    )
);

export default routes;