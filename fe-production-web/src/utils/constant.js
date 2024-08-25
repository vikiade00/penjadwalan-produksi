const token = localStorage.getItem("token");
export const baseUrl = import.meta.env.VITE_BASE_URL;

export const tokenRole = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};
