import {createSlice} from '@reduxjs/toolkit';

const token = localStorage.getItem('LOGIN_TOKEN');
const email = localStorage.getItem('EMAIL');
const initialState = {isLoggedIn: !!token, loginToken: token, loginEmail:email};

const authSlice = createSlice({
    name:'Authentication',
    initialState,
    reducers:{
        login(state, action){
            state.loginToken = action.payload.token;
            state.loginEmail = action.payload.email;
            localStorage.setItem('LOGIN_TOKEN',action.payload.token);
            localStorage.setItem('EMAIL', action.payload.email);
            state.isLoggedIn = true;
        },
        logout(state){
            state.loginToken = '';
            state.email = '';
            state.isLoggedIn = false;
            localStorage.clear();
        },
    }
})

export const authActions = authSlice.actions;
export default authSlice;