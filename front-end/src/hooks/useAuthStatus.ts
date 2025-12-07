import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useAuthStatus() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch(`${API_BASE_URL}/auth-status/`, {
        credentials: "include"
      });

      const data = await res.json();
      setAuthenticated(data.authenticated);
    }

    fetchStatus();
  }, []);

  return authenticated;
}
