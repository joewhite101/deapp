import { DOMAIN, JWT_TOKEN } from 'api/constants';

const resource = 'finances';

const defaultOptions = {
  headers: new Headers({
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
  }),
};

const request = async (url, options) => {
  const response = await fetch(url, options);

  return response.status >= 200 && response.status < 300
    ? response.json()
    : Promise.reject(new Error(response.statusText || response.status));
};

export const apiFinanceGet = async id => {
  const url = `${DOMAIN}/${resource}/${id}`;
  const options = {
    ...defaultOptions,
    method: 'GET',
  };
  return request(url, options);
};

export const apiFinancePost = async finance => {
  const url = `${DOMAIN}/${resource}`;
  const options = {
    ...defaultOptions,
    method: 'POST',
    body: finance ? JSON.stringify(finance) : null,
  };
  return request(url, options);
};

export const apiFinancePut = async finance => {
  const url = `${DOMAIN}/${resource}`;
  const options = {
    ...defaultOptions,
    method: 'PUT',
    body: finance ? JSON.stringify(finance) : null,
  };
  return request(url, options);
};
