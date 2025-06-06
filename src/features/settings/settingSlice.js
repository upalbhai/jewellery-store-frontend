import { createSlice } from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'setting',
  isMobile: false,  
  initialState: {
    settingData: null, // To store user data
  },
  reducers: {
    setSettingData: (state, action) => {
      state.settingData = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    
  },
});

export const { setSettingData, setIsMobile } = settingSlice.actions;
export default settingSlice.reducer;
