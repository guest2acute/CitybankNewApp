/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from "react";
import {NavigationContainer} from "@react-navigation/native";

import {createStackNavigator} from "@react-navigation/stack";

import SplashScreen from "./react/screens/SplashScreen";
import {Provider} from "react-redux";

import configureStore from "./react/redux/store/configureStore";
import LoginScreen from "./react/screens/LoginScreen";


const store = configureStore(window.__State__);
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const Navigator = () => {
    return (
        <Drawer.Navigator
            drawerContentOptions={{
                activeTintColor: themeStyle.THEME_COLOR,
                itemStyle: {marginVertical: 5},
            }}
            drawerContent={(props) => <CustomSidebarMenu {...props} />}>
            <Drawer.Screen
                name="Home"
                options={{drawerLabel: "Home"}}
                component={DashBoardScreen}/>
        </Drawer.Navigator>);
};

function Root() {
    return (
        <Stack.Navigator initialRouteName={"SplashScreen"}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
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

