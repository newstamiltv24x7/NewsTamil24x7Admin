// import Cookies from "js-cookie";

// const getToken = Cookies.get("_token");
// const OPEN_AI_KEY = "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";

// export const AppHeader = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${getToken}`,
// };

// export const imgeUploadHeaders = {
//   "Content-Type": "multipart/form-data",
//   Authorization: `Bearer ${getToken}`,
// };

// export const OpenAIHeaders = {
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${OPEN_AI_KEY}`,
// };
import Cookies from "js-cookie";

const OPEN_AI_KEY = "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";

export const getAppHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${Cookies.get("_token")}`,
});

export const getImageUploadHeaders = () => ({
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${Cookies.get("_token")}`,
});

export const OpenAIHeaders = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${OPEN_AI_KEY}`,
};

// Keep old names as functions for backwards compatibility
export const AppHeader = getAppHeader;
export const imgeUploadHeaders = getImageUploadHeaders;