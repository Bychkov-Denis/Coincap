export const endpoints = {
  coins: {
    getAll: '/markets',
    getOne: id => `/${id}`,
    getPriceHistory: id => `/coins/${id}/market_chart`,
  },
};
