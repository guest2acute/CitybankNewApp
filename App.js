/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {createStackNavigator, CardStyleInterpolators} from "@react-navigation/stack";
import {CommonActions, NavigationContainer} from "@react-navigation/native";

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
import RegistrationAccount from "./react/screens/RegistrationAccount";
import RegistrationCard from "./react/screens/RegistrationCard";
import AccountDetails from "./react/screens/BottomTabs/AccountDetails";
import LoginConfigureProfile from "./react/screens/LoginConfigureProfile";
import Profile from "./react/screens/BottomTabs/Profile";
import ChangeTransPin from "./react/screens/ChangeTransPin";
import ChangeLoginCredential from "./react/screens/ChangeLoginCredential";
import ChangeContactDetails from "./react/screens/ChangeContactDetails";
import UploadSupportDoc from "./react/screens/UploadSupportDoc";
import PinLogin from "./react/screens/PinLogin";
import BeneficiaryManagement from "./react/screens/Trasfer/BeneficiaryManagement";
import Beneficiary from "./react/screens/Trasfer/Beneficiary";
import BeneficiaryWithCityBank from "./react/screens/Trasfer/BeneficiaryWithCityBank";
import BeneficiaryOtherBank from "./react/screens/Trasfer/BeneficiaryOtherBank";
import BeneficiaryTransfer from "./react/screens/Trasfer/BeneficiaryTransfer";
import TransferWithBkash from "./react/screens/Trasfer/TransferWithBkash";
import TransferCategory from "./react/screens/TransferCategory";
import TransferHistory from "./react/screens/TransferHistory";
import TransferToBkash from "./react/screens/Trasfer/TransferToBkash";
import CashByCode from "./react/screens/Trasfer/CashByCode";
import FundTransfer from "./react/screens/Trasfer/FundTransfer";
import OtherBankAccount from "./react/screens/Trasfer/OtherBankAccount";
import Favorite from "./react/screens/Trasfer/Favorite";
import FavTransferBkash from "./react/screens/Trasfer/FavTransferBkash";
import EmailTransfer from "./react/screens/Trasfer/EmailTransfer";
import EmailTransferScreen from "./react/screens/Trasfer/EmailTransferScreen";
import BeneficiaryMobileNumber from "./react/screens/Trasfer/BeneficiaryMobileNumber";
import SelectBeneficiary from "./react/screens/Trasfer/SelectBeneficiary";
import MobileRecharge from "./react/screens/Payments/MobileRecharge";
import ViewBeneficiaryOtherBank from "./react/screens/Trasfer/ViewBeneficiaryOtherBank";
import CityCreditCard from "./react/screens/Payments/CityCreditCard";
import SecurityVerification from "./react/screens/Trasfer/SecurityVerification";



const store = configureStore(window.__State__);
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabBarListeners = ({navigation, route}) => ({
    tabPress: () => navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{name: route.name}],
        })
    )
});

const BottomNavigator = () => {
    return (
        <Tab.Navigator initialRouteName={"Accounts"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }} tabBarOptions={{
            activeTintColor: themeStyle.THEME_COLOR,
            inactiveTintColor: themeStyle.BLACK_43,
            labelStyle: {fontFamily: fontStyle.RobotoMedium}
        }}>
            <Tab.Screen name="AccountTab" component={AccountTab} listeners={tabBarListeners} options={{
                tabBarLabel: "Accounts",
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_account.png")}/>
                ),
            }}/>

            <Tab.Screen name="TransferTab" component={TransferTab} listeners={tabBarListeners} options={{
                tabBarLabel: 'Transfer',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_transfer.png")}/>
                ),
            }}/>
            <Tab.Screen name="PaymentTab" component={PaymentTab} listeners={tabBarListeners} options={{
                tabBarLabel: 'Payments',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_payment.png")}/>
                ),
            }}/>
            <Tab.Screen name="CityPay" component={CityPay} listeners={tabBarListeners} options={{
                tabBarLabel: 'CityPay',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{width: size, height: size}}
                           source={color === themeStyle.THEME_COLOR ? require("./react/resources/images/ic_qr_selected.png") : require("./react/resources/images/ic_qr_code.png")}/>
                ),
            }}/>
            <Tab.Screen name="MoreTab" component={MoreTab} listeners={tabBarListeners} options={{
                tabBarLabel: 'More',
                tabBarIcon: ({color, size}) => (
                    <Image resizeMode={"contain"} style={{tintColor: color, width: size, height: size}}
                           source={require("./react/resources/images/ic_more.png")}/>
                ),
            }}/>
        </Tab.Navigator>
    );
}

/*
function TransferTab() {
    return (
        <Stack.Navigator initialRouteName={"Transfer"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Transfer" component={Transfer} options={{headerShown: false}}/>
        </Stack.Navigator>);
}
*/

function TransferTab() {
    return (
        <Stack.Navigator initialRouteName={"Transfer"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Transfer" component={Transfer} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryManagement" component={BeneficiaryManagement} options={{headerShown: false}}/>
            <Stack.Screen name="Beneficiary" component={Beneficiary} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryWithCityBank" component={BeneficiaryWithCityBank} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryOtherBank" component={BeneficiaryOtherBank} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryTransfer" component={BeneficiaryTransfer} options={{headerShown: false}}/>
            <Stack.Screen name="TransferWithBkash" component={TransferWithBkash} options={{headerShown: false}}/>
            <Stack.Screen name="TransferCategory" component={TransferCategory} options={{headerShown: false}}/>
            <Stack.Screen name="TransferHistory" component={TransferHistory} options={{headerShown: false}}/>
            <Stack.Screen name="CashByCode" component={CashByCode} options={{headerShown: false}}/>
            <Stack.Screen name="TransferToBkash" component={TransferToBkash} options={{headerShown: false}}/>
            <Stack.Screen name="FundTransfer" component={FundTransfer} options={{headerShown: false}}/>
            <Stack.Screen name="OtherBankAccount" component={OtherBankAccount} options={{headerShown: false}}/>
            <Stack.Screen name="FavTransferBkash" component={FavTransferBkash} options={{headerShown: false}}/>
            <Stack.Screen name="Favorite" component={Favorite} options={{headerShown: false}}/>
            <Stack.Screen name="EmailTransfer" component={EmailTransfer} options={{headerShown: false}}/>
            <Stack.Screen name="EmailTransferScreen" component={EmailTransferScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SelectBeneficiary" component={SelectBeneficiary} options={{headerShown: false}}/>
            <Stack.Screen name="ViewBeneficiaryOtherBank" component={ViewBeneficiaryOtherBank} options={{headerShown: false}}/>
            <Stack.Screen name="SecurityVerification" component={SecurityVerification} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

function PaymentTab() {
    return (
        <Stack.Navigator initialRouteName={"Payments"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Payments" component={Payments} options={{headerShown: false}}/>
            <Stack.Screen name="MobileRecharge" component={MobileRecharge} options={{headerShown: false}}/>
            <Stack.Screen name="CityCreditCard" component={CityCreditCard} options={{headerShown: false}}/>
            <Stack.Screen name="Favorite" component={Favorite} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

function AccountTab() {
    return (
        <Stack.Navigator initialRouteName={"Accounts"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Accounts" component={Accounts} options={{headerShown: false}}/>
            <Stack.Screen name="AccountDetails" component={AccountDetails} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

function MoreTab() {
    return (
        <Stack.Navigator initialRouteName={"More"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="More" component={More} options={{headerShown: false}}/>
            <Stack.Screen name="Profile" component={Profile} options={{headerShown: false}}/>
            <Stack.Screen name="ChangeTransPin" component={ChangeTransPin} options={{headerShown: false}}/>
            <Stack.Screen name="ChangeLoginCredential" component={ChangeLoginCredential} options={{headerShown: false}}/>
            <Stack.Screen name="ChangeContactDetails" component={ChangeContactDetails} options={{headerShown: false}}/>
            <Stack.Screen name="UploadSupportDoc" component={UploadSupportDoc} options={{headerShown: false}}/>
        </Stack.Navigator>);
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
            <Stack.Screen name="RegistrationAccount" component={RegistrationAccount} options={{headerShown: false}}/>
            <Stack.Screen name="RegistrationCard" component={RegistrationCard} options={{headerShown: false}}/>
            <Stack.Screen name="LoginConfigureProfile" component={LoginConfigureProfile} options={{headerShown: false}}/>
            <Stack.Screen name="PinLogin" component={PinLogin} options={{headerShown: false}}/>
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

