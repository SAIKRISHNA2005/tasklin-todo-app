const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/v1";

function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error || "Request failed");
  }

  return payload.data;
}

export const todoService = {
  getTodos(params) {
    return request(`/todos${buildQueryString(params)}`);
  },

  getTodoById(id) {
    return request(`/todos/${id}`);
  },

  createTodo(todo) {
    return request("/todos", {
      method: "POST",
      body: JSON.stringify(todo),
    });
  },

  updateTodo(id, todo) {
    return request(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
    });
  },

  patchTodo(id, updates) {
    return request(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  deleteTodo(id) {
    return request(`/todos/${id}`, {
      method: "DELETE",
    });
  },
};
