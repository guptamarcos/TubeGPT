import axiosInstance from "./axiosInstance.js";

export async function getSummary(url){
  return axiosInstance.post("/v1/summarize",{url})
}