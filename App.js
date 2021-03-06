import React from "react";
import {createStackNavigator, CardStyleInterpolators} from "@react-navigation/stack";
import {CommonActions, NavigationContainer} from "@react-navigation/native";
import SplashScreen from "./react/screens/SplashScreen";
import {Provider} from "react-redux";
import configureStore from "./react/redux/store/configureStore";
import LoginScreen from "./react/screens/LoginScreen";
import CredentialDetails from "./react/screens/CredentialDetails";
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

import BeneficiaryManagement from "./react/screens/Trasfer/Beneficiary/BeneficiaryManagement";
import Beneficiary from "./react/screens/Trasfer/Beneficiary/Beneficiary";
import BeneficiaryWithCityBank from "./react/screens/Trasfer/Beneficiary/BeneficiaryWithCityBank";
import BeneficiaryOtherBank from "./react/screens/Trasfer/Beneficiary/BeneficiaryOtherBank";
import BeneficiaryTransferMFS from "./react/screens/Trasfer/Beneficiary/BeneficiaryTransferMFS";

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
import EmailTransferScreen from "./react/screens/Trasfer/Beneficiary/EmailTransferScreen";
import EmailTransferDetails from "./react/screens/Trasfer/EmailTransferDetails";

import SelectBeneficiary from "./react/screens/Trasfer/SelectBeneficiary";
import MobileRecharge from "./react/screens/Payments/MobileRecharge";
import ViewBeneficiaryOtherBank from "./react/screens/Trasfer/Beneficiary/ViewBeneficiaryOtherBank";
import CityCreditCard from "./react/screens/Payments/CityCreditCard";
import SecurityVerification from "./react/screens/Trasfer/SecurityVerification";
import SubCategories from "./react/screens/More/SubCategories";
import OTPVerification from "./react/screens/OTPVerification";
import CreditCardActivation from "./react/screens/More/CreditCardActivation";
import cardBlock from "./react/screens/More/cardBlock";
import CardPinReset from "./react/screens/More/CardPinReset";
import TagCreditCardInCityTouch from "./react/screens/More/TagCreditCardInCityTouch";
import ChequeBookManagement from "./react/screens/More/ChequeBookManagement";
import FixedDeposit from "./react/screens/More/FixedDeposit";
import MonthlyDPS from "./react/screens/More/MonthlyDPS";
import PayOrder from "./react/screens/More/PayOrder";

import RequestMonitor from "./react/screens/More/RequestMonitor";
import OtpLockUnlock from "./react/screens/More/OtpLockUnlock";
import ViewDeleteBeneficiary from "./react/screens/Trasfer/Beneficiary/ViewDeleteBeneficiary";
import BeneficiaryOtherCard from "./react/screens/Trasfer/Beneficiary/BeneficiaryOtherCard";
import BeneficiaryEmail from "./react/screens/Trasfer/Beneficiary/BeneficiaryEmail";
import PaymentDetails from "./react/screens/Citypay/PaymentDetails";
import Receipt from "./react/screens/Citypay/Receipt";
import QRMerchantPayment from "./react/screens/More/QRMerchantPayment";
import Otp from "./react/screens/Trasfer/Otp";
import TransferCompleted from "./react/screens/Trasfer/TransferCompleted";
import TransferConfirm from "./react/screens/Trasfer/TransferConfirm";
import AccountStatement from "./react/screens/BottomTabs/AccountStatement";
import ValueAddedServices from "./react/screens/Payments/ValueAddedServices";
import ClubBillPayment from "./react/screens/Payments/ValueAddedServices/ClubBillPayment";
import UtilityBillPayment from "./react/screens/Payments/ValueAddedServices/UtilityBillPayment";


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
            <Tab.Screen name="CityPayTab" component={CityPayTab} listeners={tabBarListeners} options={{
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

function TransferTab() {
    return (
        <Stack.Navigator initialRouteName={"Transfer"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Transfer" component={Transfer} options={{headerShown: false}}/>
            <Stack.Screen name="Beneficiary" component={Beneficiary} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryEmail" component={BeneficiaryEmail} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryManagement" component={BeneficiaryManagement}
                          options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryWithCityBank" component={BeneficiaryWithCityBank}
                          options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryOtherBank" component={BeneficiaryOtherBank} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryTransferMFS" component={BeneficiaryTransferMFS}
                          options={{headerShown: false}}/>
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
            <Stack.Screen name="EmailTransferDetails" component={EmailTransferDetails} options={{headerShown: false}}/>
            <Stack.Screen name="SelectBeneficiary" component={SelectBeneficiary} options={{headerShown: false}}/>
            <Stack.Screen name="ViewBeneficiaryOtherBank" component={ViewBeneficiaryOtherBank}
                          options={{headerShown: false}}/>
            <Stack.Screen name="SecurityVerification" component={SecurityVerification} options={{headerShown: false}}/>
            <Stack.Screen name="BeneficiaryOtherCard" component={BeneficiaryOtherCard} options={{headerShown: false}}/>
            <Stack.Screen name="ViewDeleteBeneficiary" component={ViewDeleteBeneficiary}
                          options={{headerShown: false}}/>
            <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}}/>
            <Stack.Screen name="TransferCompleted" component={TransferCompleted} options={{headerShown: false}}/>
            <Stack.Screen name="TransferConfirm" component={TransferConfirm} options={{headerShown: false}}/>
            <Stack.Screen name="Receipt" component={Receipt} options={{headerShown: false}}/>
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
            <Stack.Screen name="ValueAddedServices" component={ValueAddedServices} options={{headerShown: false}}/>
            <Stack.Screen name="UtilityBillPayment" component={UtilityBillPayment} options={{headerShown: false}}/>
            <Stack.Screen name="ClubBillPayment" component={ClubBillPayment} options={{headerShown: false}}/>
            <Stack.Screen name="TransferConfirm" component={TransferConfirm} options={{headerShown: false}}/>
            <Stack.Screen name="SecurityVerification" component={SecurityVerification} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

function CityPayTab() {
    return (
        <Stack.Navigator initialRouteName={"CityPay"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} options={{headerShown: false}}/>
            <Stack.Screen name="CityPay" component={CityPay} options={{headerShown: false}}/>
            <Stack.Screen name="Receipt" component={Receipt} options={{headerShown: false}}/>
        </Stack.Navigator>);
}


function AccountTab() {
    return (
        <Stack.Navigator initialRouteName={"Accounts"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Accounts" component={Accounts} options={{headerShown: false}}/>
            <Stack.Screen name="AccountStatement" component={AccountStatement} options={{headerShown: false}}/>
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
            <Stack.Screen name="ChangeLoginCredential" component={ChangeLoginCredential}
                          options={{headerShown: false}}/>
            <Stack.Screen name="ChangeContactDetails" component={ChangeContactDetails} options={{headerShown: false}}/>
            <Stack.Screen name="UploadSupportDoc" component={UploadSupportDoc} options={{headerShown: false}}/>
            <Stack.Screen name="CreditCardActivation" component={CreditCardActivation} options={{headerShown: false}}/>
            <Stack.Screen name="cardBlock" component={cardBlock} options={{headerShown: false}}/>
            <Stack.Screen name="CardPinReset" component={CardPinReset} options={{headerShown: false}}/>
            <Stack.Screen name="TagCreditCardInCityTouch" component={TagCreditCardInCityTouch}
                          options={{headerShown: false}}/>
            <Stack.Screen name="ChequeBookManagement" component={ChequeBookManagement} options={{headerShown: false}}/>
            <Stack.Screen name="FixedDeposit" component={FixedDeposit} options={{headerShown: false}}/>
            <Stack.Screen name="MonthlyDPS" component={MonthlyDPS} options={{headerShown: false}}/>
            <Stack.Screen name="SubCategories" component={SubCategories} options={{headerShown: false}}/>
            <Stack.Screen name="PayOrder" component={PayOrder} options={{headerShown: false}}/>
            <Stack.Screen name="RequestMonitor" component={RequestMonitor} options={{headerShown: false}}/>
            <Stack.Screen name="OtpLockUnlock" component={OtpLockUnlock} options={{headerShown: false}}/>
            <Stack.Screen name="QRMerchantPayment" component={QRMerchantPayment} options={{headerShown: false}}/>
            <Stack.Screen name="TransferConfirm" component={TransferConfirm} options={{headerShown: false}}/>
            <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}}/>
            <Stack.Screen name="SecurityVerification" component={SecurityVerification} options={{headerShown: false}}/>
            <Stack.Screen name="PaymentDetails" component={PaymentDetails} options={{headerShown: false}}/>
        </Stack.Navigator>);
}

function Root() {
    return (
        <Stack.Navigator initialRouteName={"AccountStatement"} mode={"modal"} screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
{/*            <Stack.Screen name="AccountStatement" component={AccountStatement} options={{headerShown: false}}/>*/}
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown: false}}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CredentialDetails" component={CredentialDetails} options={{headerShown: false}}/>
            <Stack.Screen name="TermConditionScreen" component={TermConditionScreen} options={{headerShown: false}}/>
            <Stack.Screen name="WebScreen" component={WebScreen} options={{headerShown: false}}/>
            <Stack.Screen name="OTPVerification" component={OTPVerification} options={{headerShown: false}}/>
            <Stack.Screen name="BottomNavigator" component={BottomNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="RegistrationAccount" component={RegistrationAccount} options={{headerShown: false}}/>
            <Stack.Screen name="RegistrationCard" component={RegistrationCard} options={{headerShown: false}}/>
            <Stack.Screen name="LoginConfigureProfile" component={LoginConfigureProfile}
                          options={{headerShown: false}}/>
            <Stack.Screen name="PinLogin" component={PinLogin} options={{headerShown: false}}/>
            <Stack.Screen name="CityPayTab" component={CityPayTab} options={{headerShown: false}}/>
            <Stack.Screen name="Otp" component={Otp} options={{headerShown: false}}/>
            <Stack.Screen name="CityPay" component={CityPay} options={{headerShown: false}}/>
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

