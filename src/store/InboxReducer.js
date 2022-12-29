import {createSlice} from '@reduxjs/toolkit'

const initialState = {mails:[], unread:0}

const inboxSlice = createSlice({
    name:'inbox',
    initialState,
    reducers:{
        loadMails(state,action){
            state.mails = action.payload
        },
        incrementUnread(state){
            state.unread++;
        },
        decrementUnread(state){
            state.unread--;
        }, 
        clear(state){
            state.mails = [];
            state.unread = 0;
        }
    }
})

export const inboxActions = inboxSlice.actions
export default inboxSlice;