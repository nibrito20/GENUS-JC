export async function useFeedback(dados: Record<string, any>) {
  const response = await fetch("https://genus-jc.onrender.com/api/feedback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(dados).toString(),
  });

  return response.json();
}
