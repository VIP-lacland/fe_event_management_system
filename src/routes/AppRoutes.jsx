import { GuestRoutes } from "./GuestRouter"
import { HashRouter, Routes, Route, Navigate } from "react-router-dom"

export function AppRoutes() {
    return (
        <HashRouter>
                <Routes>
                    <Route path="/*" element={<GuestRoutes />} />
                    {/* Private Routes - cho user đã login (thêm sau) */}
                    {/* <Route path="/*" element={<PrivateRoutes />} /> */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
        </HashRouter>
    )
}