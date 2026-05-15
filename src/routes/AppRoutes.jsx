import { GuestRoutes } from "./GuestRouter"
import { OrganizerRoutes } from "./OrganizerRoutes"
import { useAuthStore } from "../store/authStore"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export function AppRoutes() {
    const { isAuthenticated } = useAuthStore();

    return (
        <BrowserRouter>
                <Routes>
                    {isAuthenticated ? (
                        <Route path="/*" element={<OrganizerRoutes />} />
                    ) : (
                        <Route path="/*" element={<GuestRoutes />} />
                    )}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
        </BrowserRouter>
    )
}