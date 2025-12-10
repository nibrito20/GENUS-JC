const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/";

export async function useFeedback(dados: Record<string, any>) {
  const response = await fetch(`${API_BASE_URL}/api/feedback/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(dados).toString(),
  });

  return response.json();
}
