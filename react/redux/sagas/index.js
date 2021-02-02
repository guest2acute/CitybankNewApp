import {all, takeLatest} from 'redux-saga/effects';

import * as AccountSagas from './accountSagas';

import {actions} from '../actions/index';

export default function* sagas() {
  yield all([
    takeLatest(actions.account.CHANGE_LANG, AccountSagas.changeLanguage),
    takeLatest(actions.account.CHANGE_LOGIN_PREF, AccountSagas.changeLoginPref),
    takeLatest(actions.account.SET_USER_DETAILS, AccountSagas.setUserDetails),
    takeLatest(actions.account.SET_SIGNUP_DETAILS, AccountSagas.setSignupDetails),
  ]);
}
