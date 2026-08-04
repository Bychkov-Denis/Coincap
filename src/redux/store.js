import { configureStore } from '@reduxjs/toolkit';
import coinSlice from './coinSlice';

const store = configureStore({
  reducer: {
    coins: coinSlice,
  },
});

export default store;
