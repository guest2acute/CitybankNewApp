import {NativeModules, Platform} from 'react-native'

import CryptoJS from "react-native-crypto-js";


export default class Secure {

    static encryptData = (text, key) => {
        //let keyVal = CryptoJS.enc.Utf8.parse(key);
        let ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123').toString();
        console.log("keyval", key);
        return CryptoJS.AES.encrypt(text, key);

    }

    static decryptData = (encryptedData, key) => Aes.decrypt(encryptedData.cipher, key, encryptedData.iv);

}