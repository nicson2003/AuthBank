export const API_BASE = "https://auth-bank-api.vercel.app/api";

// 🔹 Get all users
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// 🔹 Get accounts for a user
export async function getAccounts(userId: string) {
  const res = await fetch(`${API_BASE}/accounts?userId=${userId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// 🔹 Get cards for an account
export async function getCards(accountId: string) {
  const res = await fetch(`${API_BASE}/cards?accountId=${accountId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// 🔹 Get transactions for an account
export async function getTransactions(accountId: string) {
  const res = await fetch(`${API_BASE}/transactions?accountId=${accountId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// 🔹 Login
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// 🔹 Signup
export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}
