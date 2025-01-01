import {combineReducers , configureStore} from "@reduxjs/toolkit";
import userSlice from "@/store/userSlice";

const rootReducer = combineReducers({
    user : userSlice,
})

export default configureStore ({
    reducer: rootReducer,
})