import { createSlice } from "@reduxjs/toolkit";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const initialState = {
    isAuthenticated: !!(getCookie("isAuthenticated") ?? false),
    token: getCookie("token") || "",
    user: {
        name: getCookie("name") || "",
        email: getCookie("email") || "",
        avatar: getCookie("avatar") || "",
        industry: getCookie("industry") || "",
        job_title: getCookie("job_title") || "",
        company_activity_types: getCookie("company_activity_types") || "",
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        Authentication: (state, { payload }) => {
            state.isAuthenticated = !!payload.isAuthenticated;
            state.token = payload.token;
            state.user = {
                name: payload.name,
                email: payload.email,
                avatar: payload.avatar,
                industry: payload.industry,
                job_title: payload.job_title,
                company_activity_types: payload.company_activity_types,
            };

            // Save data to cookies
            setCookie("isAuthenticated", payload.isAuthenticated);
            setCookie("token", payload.token);
            setCookie("name", payload.name);
            setCookie("email", payload.email);
            setCookie("avatar", payload.avatar);
            setCookie("industry", payload.industry);
            setCookie("job_title", payload.job_title);
            setCookie("company_activity_types", payload.company_activity_types);
        },
        Logout: (state) => {
            state.isAuthenticated = false;
            state.token = "";
            state.user = {
                name: "",
                email: "",
                avatar: "",
                industry: "",
                job_title: "",
                company_activity_types: "",
            };

            // Remove data from cookies
            deleteCookie("isAuthenticated");
            deleteCookie("token");
            deleteCookie("name");
            deleteCookie("email");
            deleteCookie("avatar");
            deleteCookie("industry");
            deleteCookie("job_title");
            deleteCookie("company_activity_types");
        },
    },
});

export const { Authentication, Logout } = userSlice.actions;
export default userSlice.reducer;
