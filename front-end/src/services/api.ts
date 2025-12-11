const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000";

// Helpers reutilizáveis
async function handleJsonResponse(response: Response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    throw new Error("Erro inesperado no servidor");
  }

  if (!response.ok) {
    throw new Error(data.error || "Erro no servidor");
  }

  return data;
}

// Tipos
interface Noticia {
  id: number;
  titulo: string;
  resumo: string;
  detalhes: string;
  imagem?: string;
  imagem_url?: string;
  data: string;
  reporter: string;
  slug: string;
  generos: Genero[];
}

interface Genero {
  id: number;
  nome: string;
}

interface Favorito {
  id: number;
  noticia: Noticia;
  noticia_id: number;
  adicionado: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile?: any;
}

interface Comentario {
  id: number;
  noticia: number;
  texto: string;
  likes: number;
  data: string;
  usuario: string;
  nome_usuario: string;
  foto_usuario?: string | null;
}

// =========================
// NOTÍCIAS
// =========================

export async function getNoticias(
  query?: string,
  genero?: string,
  ordenacao: string = "-data",
  limite: number = 20,
  offset: number = 0
) {
  const params = new URLSearchParams();
  if (query) params.append("q", query);
  if (genero) params.append("genero", genero);
  params.append("ordenacao", ordenacao);
  params.append("limite", String(limite));
  params.append("offset", String(offset));

  const response = await fetch(`${API_BASE_URL}/api/noticias/?${params}`, {
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function getNoticiaDetalhe(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/noticias/${slug}/`, {
    credentials: "include",
  });

  return handleJsonResponse(response);
}

// =========================
// FAVORITOS
// =========================

export async function getFavoritos() {
  const response = await fetch(`${API_BASE_URL}/api/favoritos/`, {
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function adicionarFavorito(noticia_id: number) {
  const response = await fetch(`${API_BASE_URL}/api/favoritos/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ noticia_id }),
  });

  return handleJsonResponse(response);
}

export async function removerFavorito(noticia_id: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/favoritos/${noticia_id}/remover/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  return handleJsonResponse(response);
}

// =========================
// GÊNEROS
// =========================

export async function getGeneros() {
  const response = await fetch(`${API_BASE_URL}/api/generos/`, {
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function updateProfileGeneros(genero_ids: number[]) {
  const response = await fetch(`${API_BASE_URL}/api/profile/generos/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ genero_ids }),
  });

  return handleJsonResponse(response);
}

// =========================
// SUPORTE
// =========================

export async function submitSupportTicket(description: string) {
  const response = await fetch(`${API_BASE_URL}/api/suporte/submit/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  return handleJsonResponse(response);
}

// =========================
// AUTH
// =========================

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/login/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleJsonResponse(response);
}

export async function register(
  email: string,
  password: string,
  password2: string
) {
  const response = await fetch(`${API_BASE_URL}/api/register/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, password2 }),
  });

  return handleJsonResponse(response);
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/logout/`, {
    method: "POST",
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function getUser() {
  console.log("getUser → chamada feita para /api/user/");

  const response = await fetch(`${API_BASE_URL}/api/user/`, {
    credentials: "include",
  });

  const data = await handleJsonResponse(response);

  console.log("getUser → resposta:", data);
  return data;
}

export async function updateUser(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/user/update/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleJsonResponse(response);
}

// =========================
// COMENTÁRIOS
// =========================

export async function getComentariosNoticia(slug: string): Promise<{ comentarios: Comentario[] }> {
  const response = await fetch(`${API_BASE_URL}/api/noticias/${slug}/comentarios/`, {
    credentials: "include",
  });

  return handleJsonResponse(response);
}

export async function criarComentario(slug: string, texto: string): Promise<Comentario> {
  const response = await fetch(`${API_BASE_URL}/api/noticias/${slug}/comentarios/criar/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto }),
  });

  return handleJsonResponse(response);
}

export async function curtirComentario(comentario_id: number): Promise<Comentario> {
  const response = await fetch(`${API_BASE_URL}/api/comentarios/${comentario_id}/curtir/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  return handleJsonResponse(response);
}

export type { Comentario };
