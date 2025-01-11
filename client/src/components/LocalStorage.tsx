export function getToken() {
  const token = localStorage.getItem("token");
  if (token) {
    return token;
  } else {
    return null;
  }
}

export function getUsername() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return user.username;
  } catch {
    return null;
  }
}

export function getUserID() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return user.id;
  } catch {
    return null;
  }
}

export function getUserCreatedAt() {
  const userData = localStorage.getItem("user");
  if (!userData) return null;

  try {
    const user = JSON.parse(userData);
    return user.created_at;
  } catch {
    return null;
  }
}
