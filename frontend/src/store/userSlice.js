import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from "../api";


const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  permissions: [],
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
      // .addCase(logoutUser.pending, (state) => {
      //   console.debug('logoutUser.pending');
      // })
      .addCase(logoutUser.fulfilled, (state) => {
        console.debug('logoutUser.fulfilled');
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.permissions = [];
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.debug('logoutUser.rejected');
        state.error = action.payload;
      })
      // .addCase(fetchPermissions.pending, (state) => {
      //   console.debug('fetchPermissions.pending');
      // })
      // .addCase(fetchPermissions.fulfilled, (state, action) => {
      //   // console.debug('fetchPermissions.fulfilled');
      //   state.permissions = action.payload;
      //   console.debug('userSlice fetchPermissions.fulfilled', state.permissions);
      // })
      // .addCase(fetchPermissions.rejected, (state, action) => {
      //   console.debug('fetchPermissions.rejected');
      //   state.error = action.payload;
      // })
  }
});

// const fetchPermissions = createAsyncThunk(
//   'user/fetchPermissions',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get('/api/v1/account/permissions/');
//       const permissions = response.data.permissions
//       console.debug('userSlice fetchPermissions', response.data);
//       if (response.data?.superuser) {
//         permissions.push('superuser');
//       }
//       return permissions;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );


export default userSlice.reducer;
export const { setUser, updateAccessToken } = userSlice.actions;
export {logoutUser};
