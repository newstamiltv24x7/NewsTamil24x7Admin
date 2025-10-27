import Cookies from "js-cookie";

const getToken = Cookies.get("_token");
const OPEN_AI_KEY = "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";

export const AppHeader = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken}`,
};

export const imgeUploadHeaders = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${getToken}`,
};

export const OpenAIHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPEN_AI_KEY}`,
};
