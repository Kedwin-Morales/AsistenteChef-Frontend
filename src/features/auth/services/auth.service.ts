import api from "@/shared/services/api.instance";

export const loginRequest = async (data: {
  documento: string;
  password: string;
}) => {
  const res = await api.post("auth/login", data);
  return res.data;
};