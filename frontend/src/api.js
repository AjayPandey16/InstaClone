import { api_base_url } from './helper';

export const apiRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${api_base_url}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.msg || 'Something went wrong');
  }
  return data;
};

export const apiJson = (path, body) => apiRequest(path, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
