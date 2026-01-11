import api from '../services/api';

export default function resolveImageUrl(photoValue) {
  if (!photoValue) return 'https://via.placeholder.com/120'; // fallback

  // If already absolute (http/https), return directly
  if (photoValue.startsWith('http://') || photoValue.startsWith('https://')) return photoValue;
  
  // Build URL from backend base (api.defaults.baseURL like http://localhost:5001/api)
  const base = (api.defaults?.baseURL || '').replace(/\/api$/, '');
  return `${base}${photoValue.startsWith('/') ? '' : '/'}${photoValue}`;
}
