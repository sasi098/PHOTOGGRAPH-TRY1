export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveusername = (username) => {
  localStorage.setItem("username", username);
};

export const getusername = () => {
  return localStorage.getItem("username");
};

export const saveemail = (email) => {
  localStorage.setItem("email", email);
};

export const getemail = () => {
  return localStorage.getItem("email");
};

export const saverefershtoken = (refreshtoken) => {
  localStorage.setItem("refreshtoken", refreshtoken);
};

export const getrefershtoken = () => {
  return localStorage.getItem("refreshtoken");
};
