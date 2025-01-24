import {combineReducers , configureStore} from "@reduxjs/toolkit";
import userSlice from "@/store/userSlice";
import notificationSlice from "@/store/notificationSlice";

const rootReducer = combineReducers({
    user : userSlice,
    notification : notificationSlice,
})

export default configureStore ({
    reducer: rootReducer,
})
