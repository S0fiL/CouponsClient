import { createStore } from "redux";
import { AppState } from "./appState";
import { reduce } from "./reducer";


const initialState = new AppState();
initialState.isLoggedIn = false;
initialState.userType = "";

export const store = createStore(reduce, initialState);