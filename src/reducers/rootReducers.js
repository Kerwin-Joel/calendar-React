import {combineReducers} from "redux"
import { calendarReducer } from "./calendarReducer";
import { uiReducer } from "./uiReducer";
import { authReducer } from "./authReducer";
export const rootReducers = combineReducers({
    ui:uiReducer,
    calendar:calendarReducer,
    auth:authReducer
})