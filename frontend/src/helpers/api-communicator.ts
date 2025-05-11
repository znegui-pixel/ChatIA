import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";


export const loginUser = async (email: string, password: string) => {
  const res = await axios.post("/user/login", { email, password });
  if (res.status !== 200) {
    throw new Error("Unable to login");
  }
  return res.data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post("/user/signup", { name, email, password });
  if (res.status !== 201) {
    throw new Error("Unable to signup");
  }
  return res.data;
};

export const chekAuthStatus = async () => {
  const res = await axios.get("/user/auth-status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  return res.data;
};

export const sendChatRequest = async (message: string) => {
  const res = await axios.post("/chat/local-nlp", { message });
  return res.data;
};

export const getUserChats = async () => {
  const res = await axios.get("/chat/all-chats");
  if (res.status !== 200) {
    throw new Error("Unable to get chats");
  }
  return res.data;
};

export const deleteUserChats = async () => {
  const res = await axios.delete("/chat/delete");
  if (res.status !== 200) {
    throw new Error("Unable to delete chats");
  }
  return res.data;
};

export const logoutUser = async (token: string) => {
  const res = await axios.get("/user/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });

  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  return res.data;
};

export const getNLPResponse = async (message: string) => {
  const res = await axios.post("/chat/nlp-predict", { message });
  return res.data;
};
