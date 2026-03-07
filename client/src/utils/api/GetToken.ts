export const getToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("No access token found");
  return token;
};
