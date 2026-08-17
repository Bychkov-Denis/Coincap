import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { coinService } from '../services/coinService.js';

const initialState = {
  coins: [],
  loading: false,
  error: null,
  currentCoin: null,

  portfolio: {
    items: [],
    currentPrice: 0,
    prevPrice: 0,
    changePrice: 0,
    changePricePercent: 0,
    formattedStr: '0.00 USD +0.00 (0.00 %)',
  },

  history: {
    data: [],
    days: 7,
  },
};

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

export const getCoinDetails = createAsyncThunk(
  'coins/getCoinDetails',
  async (coinId, { rejectWithValue }) => {
    try {
      const { data: coinData } = await coinService.getOne(coinId);
      const marketData = coinData.market_data;

      return {
        symbol: coinData.symbol.toUpperCase(),
        name: coinData.name,
        circulatingSupply: marketData?.circulating_supply.toFixed(2),
        totalSupply: marketData?.total_supply.toFixed(2),
        totalVolume: marketData?.total_volume?.usd,
        vwap24: (() => {
          const high = marketData?.high_24h?.usd;
          const low = marketData?.low_24h?.usd;
          const price = marketData?.current_price?.usd;
          return ((high + low + price) / 3).toFixed(2);
        })(),
        priceChange24h: marketData?.price_change_percentage_24h.toFixed(2),
        homepage: coinData.links?.homepage?.[0],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

export const updatePortfolioValue = createAsyncThunk(
  'coins/updatePortfolioValue',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const items = state.coin.portfolio.items;

      if (items.length === 0) {
        return {
          totalValue: 0,
          initialValue: 0,
          change: 0,
          changePercent: 0,
          formattedStr: '0.00 USD +0.00 (0.00 %)',
        };
      }

      const coinIds = [...new Set(items.map(item => item.coinId))];

      const { data } = await coinService.getAll({ ids: coinIds.join(',') });

      const currentPrices = {};
      data.forEach(coin => {
        currentPrices[coin.id] = coin.current_price;
      });

      let currentPrice = 0;
      let prevPrice = 0;

      items.forEach(item => {
        const currentCoinPrice = currentPrices[item.coinId];
        currentPrice += item.amount * currentCoinPrice;
        prevPrice += item.amount * item.buyPrice;
      });

      const changePrice = currentPrice - prevPrice;
      const changePricePercent =
        prevPrice > 0 ? (changePrice / prevPrice) * 100 : 0;
      const sign = changePrice > 0 ? '+' : '';

      return {
        prevPrice,
        currentPrice,
        changePrice,
        changePricePercent,
        formattedStr: `${currentPrice.toFixed(2)} USD ${sign}${changePrice.toFixed(2)} (${sign}${changePricePercent.toFixed(2)} %)`,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getCoinHistory = createAsyncThunk(
  'coins/getCoinHistory',
  async ({ coinId, days = 7 }, { rejectWithValue }) => {
    try {
      const { data } = await coinService.getPriceHistory(coinId, {
        days: days,
      });

      const prices = data.prices;

      if (prices.length === 0) {
        return { coinId, days, chartData: [] };
      }

      const dayMap = new Map();

      prices.forEach(([timestamp, price]) => {
        const date = new Date(timestamp);
        const key = date.toISOString().split('T')[0];

        if (!dayMap.has(key)) {
          dayMap.set(key, []);
        }
        dayMap.get(key).push(price);
      });

      const chartData = Array.from(dayMap.entries()).map(([key, prices]) => {
        const date = new Date(key).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });

        const lastPrice = prices[prices.length - 1];

        return {
          date,
          price: lastPrice,
        };
      });

      return {
        coinId,
        days,
        chartData,
      };
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
    builder.addCase(getCoinDetails.fulfilled, (state, action) => {
      state.currentCoin = action.payload;
    });
    builder.addCase(updatePortfolioValue.fulfilled, (state, action) => {
      state.portfolio = action.payload;
    });
    builder.addCase(getCoinHistory.fulfilled, (state, action) => {
      state.history.data = action.payload.chartData;
      state.history.days = action.payload.days;
    });
    builder.addMatcher(isFulfilled, state => {
      state.loading = false;
      state.error = null;
    });
    builder.addMatcher(isPending, state => {
      state.loading = true;
    });
    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
  selectors: {
    selectedCoins: state => state.coins,
    selectedCurrentCoin: state => state.currentCoin,
    selectedTopCoins: state => state.coins.slice(0, 3),
    selectedLoading: state => state.loading,
    selectedError: state => state.error,
    selectedPortfolio: state => state.portfolio,
    selectPortfolioItems: state => state.portfolio.items,
    selectPortfolioFormatted: state => state.portfolio.formattedStr,
    selectHistoryData: state => state.history.data,
    selectHistoryDays: state => state.history.days,
  },
});

export const {
  selectedCoins,
  selectedCurrentCoin,
  selectedTopCoins,
  selectedLoading,
  selectedError,
  selectedPortfolio,
  selectPortfolioItems,
  selectPortfolioFormatted,
  selectHistoryData,
  selectHistoryDays,
} = coinSlice.selectors;
export default coinSlice.reducer;
