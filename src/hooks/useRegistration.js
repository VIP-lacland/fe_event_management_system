// src/hooks/useRegistration.js

import { useState } from "react";
import { registerEvent, cancelRegistration } from "../services/RegistrationService";

/**
 * Hook xử lý đăng ký / hủy đăng ký event
 * Dùng trong EventDetailPage
 */
export default function useRegistration(eventId, initialStatus = null) {
  const [status,  setStatus]  = useState(initialStatus); // null | "confirmed" | "waitlist"
  const [position, setPosition] = useState(null);         // số thứ tự trong waitlist
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [message, setMessage] = useState(null);

  // ── Đăng ký ───────────────────────────────────────────────────
  const register = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await registerEvent(eventId);
      setStatus(data.registration.status);
      setPosition(data.registration.position ?? null);
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Hủy đăng ký ───────────────────────────────────────────────
  const cancel = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await cancelRegistration(eventId);
      setStatus(null);
      setPosition(null);
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Hủy đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return { status, position, loading, error, message, register, cancel };
}