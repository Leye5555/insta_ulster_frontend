import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_APP_API || "http://localhost:5000";

export default class AuthAPi {
  static async register({
    email,
    username,
    password,
    role,
  }: {
    email: string;
    username: string;
    password: string;
    role: string;
  }) {
    const response = await axios.post(`${API_URL}/v1/auth/register`, {
      email,
      username,
      password,
      role,
    });
    return response;
  }
  static async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const response = await axios.post(`${API_URL}/v1/auth/login`, {
      username,
      password,
    });
    return response;
  }
}
