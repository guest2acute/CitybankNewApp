import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "../config/Config";

/**
 * used for storing and retrieving user data
 */

export default class User {
  static async store(key, val) {
    try {
      console.log("store", key + "," + val);
      await AsyncStorage.setItem(key, val);
    } catch (e) {
      console.log(e);
    }
  }

  static async retrieve(key) {
    try {
      let value = await AsyncStorage.getItem(key);
      return value !== undefined ? value : null;
    } catch (e) {
      console.log(e);
    }
  }

  static async clear(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  }

}
