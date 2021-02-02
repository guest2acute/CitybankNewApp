import React from 'react';
import {Alert,} from 'react-native';
import Config from "../config/Config";

export default class CustomAlert {
    static setAlertView(title, message) {
        Alert.alert(title === '' ? Config.appName : title, message);
    }
}
