import {createSlice} from "@reduxjs/toolkit";
import {setCookie, getCookie} from "cookies-next";

const getUnreadMessagesFromCookies = () => {
    const value: any = getCookie("total_unread_messages");
    return value ? parseInt(value, 10) : 0; // Ensure it's a number
};

const initialState = {
    unreadMessagesCount: getUnreadMessagesFromCookies(),
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {

        updateUnreadMessages: (state, {payload}) => {
            state.unreadMessagesCount = payload.unreadMessagesCount;

            // Save updated count to cookies
            setCookie("total_unread_messages", payload.unreadMessagesCount);
        },
    },
});

export const {updateUnreadMessages} = notificationSlice.actions;
export default notificationSlice.reducer;
