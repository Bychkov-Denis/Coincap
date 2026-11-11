export const endpoints = {
  coins: {
    getAll: '/markets',
    getOne: id => `/${id}`,
    getPriceHistory: id => `/${id}/market_chart`,
  },
};
