import { GuestRoutes } from "./GuestRouter"
import { HomeRedirect } from "./HomeRedirect"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export function AppRoutes() {
    return (
        <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<HomeRedirect />} />
                    {/* Private Routes - cho user đã login (thêm sau) */}
                    {/* <Route path="/*" element={<PrivateRoutes />} /> */}
                    {GuestRoutes()}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
        </BrowserRouter>
    )
}