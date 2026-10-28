import axios from "axios";

const api = axios.create({
  baseURL: "https://smart-blood-donor-73z1.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
