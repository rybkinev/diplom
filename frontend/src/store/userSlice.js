import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from "../api";


const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
};

const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    const { user } = getState();
    api.post(
      '/api/v1/account/logout/',
      {
        refresh: user.refreshToken
      }
    ).then(r => {
      console.debug('success logout')
      return r.data;
    }).catch(
      (error) => {
        console.debug(error)
        return rejectWithValue(error.response.data);
      }
    )
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  // Синхронные действия
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    updateAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        console.debug('logoutUser.pending');
        // state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.debug('logoutUser.fulfilled');
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.debug('logoutUser.rejected');
        // state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setUser, updateAccessToken } = userSlice.actions;
export default userSlice.reducer;
export { logoutUser };
