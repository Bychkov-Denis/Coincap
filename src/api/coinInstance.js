import axios from 'axios';

const coinInstance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/coins',
  headers: { 'x-cg-demo-api-key': import.meta.env.VITE_API_KEY },
  params: { vs_currency: 'usd', order: 'market_cap_desc' },
});

export default coinInstance;
