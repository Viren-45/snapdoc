export const isDev = process.env.NODE_ENV === 'development';
//todo: change this to your origin url
export const ORIGIN_URL = isDev ? 'http://localhost:3000' : 'https://snapdoc-ai.vercel.app/';