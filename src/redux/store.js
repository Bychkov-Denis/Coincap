import { configureStore } from '@reduxjs/toolkit';
import cryptoSlice from './cryptoSlice';

const store = configureStore({
  reducer: {
    crypto: cryptoSlice,
  },
});

export default store;
