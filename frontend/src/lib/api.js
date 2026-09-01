const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/notes";

export const noteApi = {
  getAll: async () => {
    const res = await fetch(API_BASE_URL);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "노트 목록을 불러오는데 실패했습니다.");
    }
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "노트를 불러오는데 실패했습니다.");
    }
    return res.json();
  },
  create: async ({ title, content }) => {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "노트 생성에 실패했습니다.");
    }
    return res.json();
  },
  update: async (id, { title, content }) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "노트 수정에 실패했습니다.");
    }
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "노트 삭제에 실패했습니다.");
    }
    return res.json();
  },
};
