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
            setCookie("isAuthenticated", payload.isAuthenticated, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("token", payload.token, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("name", payload.name, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("email", payload.email, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("avatar", payload.avatar, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("industry", payload.industry, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("job_title", payload.job_title, { maxAge: 7 * 24 * 60 * 60 });
            setCookie("company_activity_types", payload.company_activity_types, { maxAge: 7 * 24 * 60 * 60 });
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
