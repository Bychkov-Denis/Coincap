import coinInstance from '../api/coinInstance';
import { endpoints } from '../api/endpoints';

export const coinService = {
  getAll: () => coinInstance.get(endpoints.coins.getAll),
};
