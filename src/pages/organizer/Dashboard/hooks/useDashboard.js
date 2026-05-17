// src/pages/organizer/dashboard/hooks/useDashboard.js

import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../../../../services/DashboardService";

export default function useDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);  // ← true từ đầu
  const [error,   setError]   = useState(null);

  const refetch = useCallback(() => {
    let cancelled = false;

    // Không gọi setState ở đây — chỉ gọi bên trong callback async
    getDashboardData()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message ?? "Lỗi không xác định");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  // useEffect chỉ gọi refetch, không gọi setState trực tiếp
  useEffect(() => {
    const cleanup = refetch();
    return cleanup;
  }, [refetch]);

  return { data, loading, error, refetch };
}