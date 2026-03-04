import axios from "axios";
import { url, urlAdmin } from "./url";

const api = axios.create({
    baseURL: url,
    withCredentials: true,
    timeout: 30000,
  })
const apiAdmin = axios.create({
    baseURL: urlAdmin,
    withCredentials: true,
    timeout: 30000,
  })
  export { api, apiAdmin };
