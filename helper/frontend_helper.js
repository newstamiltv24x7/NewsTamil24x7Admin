import dayjs from "dayjs";

export const converDayJsDate = (value) => {
  return dayjs(value).format("DD-MMM-YYYY hh:mm A");
};

export const converDayDate = (value) => {
  return dayjs(value).format("YYYY/MM");
};