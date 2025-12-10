export async function useFeedback(dados: Record<string, any>) {
  const response = await fetch("http://localhost:8000/api/feedback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(dados).toString(),
  });

  return response.json();
}
