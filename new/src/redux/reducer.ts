import { Action } from "./action";
import { ActionType } from "./action-type";
import { AppState } from "./appState";

export function reduce(oldAppState: AppState, action: Action): AppState {
    const newAppState = { ...oldAppState };
    switch (action.type) {
        case ActionType.LOGIN:
            newAppState.isLoggedIn = true;
            sessionStorage.setItem("isLoggedIn", String(JSON.stringify(true)));
            newAppState.userType = action.payload;
            break;
        case ActionType.LOGOUT:
            newAppState.isLoggedIn = false;
            sessionStorage.setItem("isLoggedIn", String(JSON.stringify(false)));
            break;
    }
    return newAppState;
}