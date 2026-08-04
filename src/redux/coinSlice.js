import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { coinService } from '../services/coinService.js';

const initialState = { coins: [], loading: false, error: null };

export const getAllCoins = createAsyncThunk(
  'coins/getAllCoins',
  async (_, { rejectWithValue }) => {
    try {
      const { data: coinsData } = await coinService.getAll();

      return coinsData.map((coin, index) => {
        return {
          number: index + 1,
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          vwap24: (coin.high_24h + coin.low_24h + coin.current_price) / 3,
          priceChange24: coin.price_change_24h,
          marketCap: coin.market_cap,
          price: coin.current_price,
        };
      });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const coinSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getAllCoins.fulfilled, (state, action) => {
      state.coins = action.payload;
    });
    builder.addMatcher(isPending, state => {
      state.loading = true;
    });
    builder.addMatcher(isFulfilled, state => {
      state.loading = false;
      state.error = null;
    });
    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
  selectors: {
    selectedCoins: state => state.coins,
    selectedTopCoins: state => state.coins.slice(0, 3),
    selectedLoading: state => state.loading,
    selectedError: state => state.error,
  },
});

export const {
  selectedCoins,
  selectedTopCoins,
  selectedLoading,
  selectedError,
} = coinSlice.selectors;
export default coinSlice.reducer;
