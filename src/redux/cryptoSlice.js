import { createSlice } from '@reduxjs/toolkit';

const initialState = { coins: [1, 2, 3, 4, 5] };

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {},
});

export default cryptoSlice.reducer;
