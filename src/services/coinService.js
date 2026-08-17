import coinInstance from '../api/coinInstance';
import { endpoints } from '../api/endpoints';

export const coinService = {
  getAll: (params = {}) => coinInstance.get(endpoints.coins.getAll, { params }),
  getOne: id => coinInstance.get(endpoints.coins.getOne(id)),
  getPriceHistory: (id, params = {}) =>
    coinInstance.get(endpoints.coins.getPriceHistory(id), { params }),
};
