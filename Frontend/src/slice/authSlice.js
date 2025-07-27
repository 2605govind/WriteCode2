import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {axiosAuth} from '../utils/axiosClient.js'


// createAsyncThunk<TypeOfReturnedData, ArgType>(
//   'sliceName/actionName',
//   async (arg, thunkAPI) => {
//     // async logic
//   }
// )

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosAuth.post('/auth/register/email', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const registerUserVerifyOtp = createAsyncThunk(
    'auth/register/verify-otp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosAuth.post('/auth/register/email/otp-verification', data);            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const loginUser = createAsyncThunk(
    'auth/login/email',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosAuth.post('/auth/email/login', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const authWithGoogle = createAsyncThunk(
    'auth/google',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosAuth.post('/auth/google', data);  

            // console.log("success", response);
            
            return response.data;
        } catch (error) {

            console.log("error", error);
            return rejectWithValue(error.response.data);
        }
    }
)


export const authWithGitHub = createAsyncThunk(
    'auth/github',
    async (data, { rejectWithValue }) => {
        try {
            // console.log("data authWithGitHub", data);
            const response = await axiosAuth.post('/auth/github', data);              
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const checkAuth = createAsyncThunk(
    'auth/check',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosAuth.get('/registerduser/check');            
            // console.log("data authWithGitHub", response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosAuth.post('/auth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        message: '',
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })

        // verify otp
        .addCase(registerUserVerifyOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(registerUserVerifyOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(registerUserVerifyOtp.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })


        // login with Email and username
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })



        // register/login with google   / authWithGoogle
        .addCase(authWithGoogle.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(authWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(authWithGoogle.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })


        // register/login with github   authWithGitHub
        .addCase(authWithGitHub.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(authWithGitHub.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(authWithGitHub.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })



        // checkAuth
        .addCase(checkAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(checkAuth.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true,
            state.user = action.payload.user;
            state.message = action.payload.message;
        })
        .addCase(checkAuth.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action?.payload?.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = action.payload.message;
        })


        // logoutUser
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = 'pending';
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = false,
            state.user = null;
            state.message = "logout succussfully";
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = action.payload.message || 'something went wrong';
            state.isAuthenticated = false;
            state.message = "logout";
        })
    }
})


export default authSlice.reducer;