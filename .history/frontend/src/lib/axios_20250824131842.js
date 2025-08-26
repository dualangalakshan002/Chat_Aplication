import axios from "axios";

export const axiosInstanace = axios.create({
    baseURL:"http://localhost:5002/api",
    withCredentials:true
})