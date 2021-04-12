import axios from "axios";
import { ActionType } from "../redux/action-type";
import { store } from "../redux/store";

export function tokenVerifycation() {

    if (JSON.parse(sessionStorage.getItem("isLoggedIn")) === true) {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token");
        store.dispatch({ type: ActionType.LOGIN, payload: sessionStorage.getItem("userType") });
    }
}