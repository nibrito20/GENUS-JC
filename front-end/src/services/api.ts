// const API_BASE_URL = "http://localhost:8000";

const API_BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://genuss.pythonanywhere.com";

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

// --- NOTICIAS ---
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
  params.append("limite", limite.toString());
  params.append("offset", offset.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/noticias/?${params.toString()}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("Erro ao buscar notícias");
  return response.json();
}

export async function getNoticiaDetalhe(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/noticias/${slug}/`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Notícia não encontrada");
  return response.json();
}

// --- FAVORITOS ---
export async function getFavoritos() {
  const response = await fetch(`${API_BASE_URL}/api/favoritos/`, {
    credentials: "include",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao buscar favoritos:", response.status, errorText);
    throw new Error(`Erro ao buscar favoritos: ${response.status}`);
  }
  return response.json();
}

export async function adicionarFavorito(noticia_id: number) {
  const response = await fetch(`${API_BASE_URL}/api/favoritos/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ noticia_id }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao adicionar favorito:", response.status, errorText);
    throw new Error(`Erro ao adicionar favorito: ${response.status}`);
  }
  return response.json();
}

export async function removerFavorito(noticia_id: number) {
  const response = await fetch(
    `${API_BASE_URL}/api/favoritos/${noticia_id}/remover/`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro ao remover favorito:", response.status, errorText);
    throw new Error(`Erro ao remover favorito: ${response.status}`);
  }
  return response.json();
}

// --- GENEROS ---
export async function getGeneros() {
  const response = await fetch(`${API_BASE_URL}/api/generos/`, {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Erro ao buscar gêneros");
  return response.json();
}

export async function updateProfileGeneros(genero_ids: number[]) {
  const response = await fetch(`${API_BASE_URL}/api/profile/generos/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ genero_ids }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Erro ao atualizar preferências");
  }

  return response.json();
}

// --- AUTH ---
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao fazer login");
  }

  return response.json();
}

export async function register(email: string, password: string, password2: string) {
  const response = await fetch(`${API_BASE_URL}/api/register/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, password2 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar conta");
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/api/logout/`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) throw new Error("Erro ao fazer logout");
  return response.json();
}

export async function getUser() {
  console.log("getUser: Enviando requisição para /api/user/");
  const response = await fetch(`${API_BASE_URL}/api/user/`, {
    credentials: "include",
  });

  console.log("getUser: Status da resposta:", response.status, response.ok);
  const data = await response.json();
  console.log("getUser: Dados recebidos:", data);
  
  // Não lançar erro se o usuário não estiver autenticado (status 401 é normal)
  // A resposta já contém "authenticated: false"
  return data;
}


export async function updateUser(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/user/update/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return response.json();
}