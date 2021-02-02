import {Alert, Dimensions, Platform, ToastAndroid} from "react-native";
import Config from "../config/Config";
import axios from "axios";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";
import base64 from 'react-native-base64';
import DeviceInfo from "react-native-device-info";
import User from "./User";

export default class Utility {
    static alert(msg) {
        Alert.alert(Config.appName, msg);
    }

    static alertWithBack(btn_txt, msg, navigation) {
        Alert.alert(
            Config.appName,
            msg,
            [
                {text: btn_txt, onPress: () => navigation.goBack(null)},
            ]
        );
    }

    static alertConfirm(positive_txt, negative_txt, msg, navigation) {
        Alert.alert(
            Config.appName,
            msg,
            [
                {text: positive_txt, onPress: () => navigation.goBack(null)},
                {text: negative_txt, onPress: () => navigation.goBack(null)},
            ]
        );
    }

    static getImage(baseString) {
        return base64.decode("data:image/png;base64," + baseString);
    }

    static validateEmail(text) {
        console.log(text);
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(text);
    }

    /*  static async makePostApiCall(url,postRequest) {
        const response = await axios.post(Config.base_url+url, {
          email : "cb@gmail.com",
          password: '12346'
        });
      } */

    static async makePostApiCall(body) {
        fetch(Config.base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson', responseJson);
                if (responseJson != null) {
                    return responseJson;
                }
            })
            .catch((error) => {
                return "";
            });

    }

    static async parseResponse(response) {
        console.log("response", response);
    }

    static async makeGetApiCall(url) {
        const response = await axios.get(
            Config.base_url + url,
        );
    }

    static getCurrentTimeStamp() {
        return moment(new Date()).format('DD-MM-YYYY-HH-ss');
    }

    static isConnected() {
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            return state.isConnected;
        });

    }

    static async getDeviceID() {
        let userId = await User.retrieve(Config.UserId);
        if (userId === undefined) {
            userId = "";
        }
        let deviceId = await DeviceInfo.getUniqueId();
        if (deviceId === undefined || deviceId === null || deviceId === "") {
            deviceId = userId + "-" + Utility.getCurrentTimeStamp();
        }
        return deviceId;
    }

}
