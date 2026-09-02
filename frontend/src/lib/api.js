const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/notes";

export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.isRateLimited = status === 429;
  }
}

const handleResponse = async (res, defaultErrorMessage) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    let message = err.message || err.error || defaultErrorMessage;
    if (res.status === 429) {
      message =
        err.message ||
        err.error ||
        "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
    }
    throw new ApiError(message, res.status, err);
  }
  return res.json();
};

export const noteApi = {
  getAll: async () => {
    const res = await fetch(API_BASE_URL);
    return handleResponse(res, "노트 목록을 불러오는데 실패했습니다.");
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(res, "노트를 불러오는데 실패했습니다.");
  },
  create: async ({ title, content }) => {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(res, "노트 생성에 실패했습니다.");
  },
  update: async (id, { title, content }) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    return handleResponse(res, "노트 수정에 실패했습니다.");
  },
  delete: async (id) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    return handleResponse(res, "노트 삭제에 실패했습니다.");
  },
};
