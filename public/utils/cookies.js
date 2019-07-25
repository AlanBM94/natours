/* eslint-disable */
export const setCookie = res => {
  document.cookie = `jwt=${res.data.token}; max-age=${60 * 60 * 24 * 7}`;
};

export const deleteCookie = name => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
