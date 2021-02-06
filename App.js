/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {createStackNavigator, CardStyleInterpolators} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";

import SplashScreen from "./react/screens/SplashScreen";
import {Provider} from "react-redux";

import configureStore from "./react/redux/store/configureStore";
import LoginScreen from "./react/screens/LoginScreen";
import CredentialDetails from "./react/screens/CredentialDetails";
import OTPScreen from "./react/screens/OTPScreen";
import OTPVerification from "./react/screens/OTPVerification";
import TermConditionScreen from "./react/screens/TermConditionScreen";
import WebScreen from "./react/screens/WebScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Accounts from "./react/screens/BottomTabs/Accounts";
import Transfer from "./react/screens/BottomTabs/Transfer";
import Payments from "./react/screens/BottomTabs/Payments";
import CityPay from "./react/screens/BottomTabs/CityPay";
import More from "./react/screens/BottomTabs/More";
import {Image} from "react-native";
import themeStyle from "./react/resources/theme.style";
import CommonStyle from "./react/resources/CommonStyle";
import fontStyle from "./react/resources/FontStyle";


const store = configureStore(window.__State__);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
    return (
        <Tab.Navigator initialRouteName={"Accounts"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }} tabBarOptions={{
            activeTintColor: themeStyle.THEME_COLOR,
            inactiveTintColor:themeStyle.BLACK_43,
            labelStyle: {fontFamily: fontStyle.RobotoMedium}
        }}>
            <Tab.Screen name="Accounts" component={Accounts} options={{
                tabBarLabel: 'Accounts',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_account.png")}/>
                ),
            }}/>
            <Tab.Screen name="Transfer" component={Transfer} options={{
                tabBarLabel: 'Transfer',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_transfer.png")}/>
                ),
            }}/>
            <Tab.Screen name="Payments" component={Payments} options={{
                tabBarLabel: 'Payments',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_payment.png")}/>
                ),
            }}/>
            <Tab.Screen name="CityPay" component={CityPay} options={{
                tabBarLabel: 'CityPay',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{width: size, height: size}}
                           source={color === themeStyle.THEME_COLOR ? require("./react/resources/images/ic_qr_selected.png") : require("./react/resources/images/ic_qr_code.png")}/>
                ),
            }}/>
            <Tab.Screen name="More" component={More} options={{
                tabBarLabel: 'More',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_more.png")}/>
                ),
            }}/>
        </Tab.Navigator>
    );
}

function Root() {
    return (
        <Stack.Navigator initialRouteName={"SplashScreen"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CredentialDetails" component={CredentialDetails} options={{headerShown: false}}/>
            <Stack.Screen name="OTPVerification" component={OTPVerification} options={{headerShown: false}}/>
            <Stack.Screen name="OTPScreen" component={OTPScreen} options={{headerShown: false}}/>
            <Stack.Screen name="TermConditionScreen" component={TermConditionScreen} options={{headerShown: false}}/>
            <Stack.Screen name="WebScreen" component={WebScreen} options={{headerShown: false}}/>
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Root/>
            </NavigationContainer>
        </Provider>
    );
}

