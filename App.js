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


const store = configureStore(window.__State__);
const Stack = createStackNavigator();

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

