import {actions} from "./../actions/index";
import en from "../../localization/en";
import bn from "../../localization/bangla";
import bangla from "../../localization/bangla";


const initialState = {
    langId: 'en',
    language: en,
    login_val: 0,
    userDetails: "",
    signupDetails:"",
};

export function accountReducer(state = initialState, action) {
    switch (action.type) {
        case actions.account.CHANGE_LANG:
            return Object.assign(
                {},
                {
                    ...state,
                    langId: action.payload.langId,
                    language: action.payload.langId === 'en' ? en : bangla,
                },
            );
        case actions.account.CHANGE_LOGIN_PREF:
            return Object.assign(
                {},
                {
                    ...state,
                    login_val: action.payload.login_val
                },
            );
        case actions.account.SET_USER_DETAILS:
            return Object.assign(
                {},
                {
                    ...state,
                    userDetails: action.payload.userDetails
                },
            );
        case actions.account.SET_SIGNUP_DETAILS:
            return Object.assign(
                {},
                {
                    ...state,
                    signupDetails: action.payload.signupDetails
                },
            );
        default:
            return state;
    }
}
