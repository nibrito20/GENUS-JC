import { useEffect, useState } from "react";

export function useAuthStatus() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      const res = await fetch("http://127.0.0.1:8000/auth-status/", {
        credentials: "include"
      });

      const data = await res.json();
      setAuthenticated(data.authenticated);
    }

    fetchStatus();
  }, []);

  return authenticated;
}
