import api from "@/shared/services/api.instance";

export const loginRequest = async (data: {
  documento: string;
  password: string;
}) => {
  const res = await api.post("auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("Auth/me");
  return res.data;
};
