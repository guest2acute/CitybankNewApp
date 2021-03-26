import React, {Component} from "react";
import {
    BackHandler,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import Utility from "../../utilize/Utility";
import {connect} from "react-redux";
import {AddBeneficiary} from "../Requests/RequestBeneficiary";
import {BusyIndicator} from "../../resources/busy-indicator";
import FontSize from "../../resources/ManageFontSize";

class Receipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            customerName: "SIRAJUM MONIR PARVEZ",
            sourceAccount:"519625*****0274",
            error_customerName: "",
            isMainScreen: true,
            emailTxt: "",
            errorEmail: "",
            mobileNo: "",
            errorMobileNo: "",
            sourceAccount:"",
            transactionDate:"",
            cardHolderName:"SIRAJUM MONIR PARVEZ",
            merchantName:"QR - ISTOREBD.NET",
            amount:"1.00",
            type:"Immediate",
            transactionDate:"Thu, Mar 25,2021 05:43:53",
        }
    }

    onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
        } else {

        }
    }

    receiptView(language){
        return(
            <View style={{flex: 1, paddingBottom: 30}}>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{width:  Utility.setWidth(110)}]}>
                        {language.customer_name}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                             alignItems: "flex-start",
                             textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.customerName}
                        multiline={false}
                        editable={this.state.isMainScreen}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{width:  Utility.setWidth(110)}]}>
                        {language.source_account}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.sourceAccount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{width:  Utility.setWidth(110)}]}>
                        {language.cardHolderName}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.cardHolderName}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {width: Utility.setHeight(110)}]}>
                        {language.merchant_name}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.merchantName}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{width: Utility.setHeight(110)}]}>
                        {language.receipt_amount}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.amount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle, {width:  Utility.setWidth(110)}]}>
                        {language.type}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.type}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle,{width:  Utility.setWidth(110)}]}>
                        {language.transaction_date}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-start",
                            textAlign: 'left',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.transactionDate}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>




                <View style={{
                    flexDirection: "row",
                    marginStart: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10),
                    marginTop: Utility.setHeight(20)
                }}>
                    <TouchableOpacity style={{flex: 1}}
                                      onPress={() => this.backEvent()}>
                        <View style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            height: Utility.setHeight(46),
                            borderRadius: Utility.setHeight(23),
                            borderWidth: 1,
                            borderColor: themeStyle.THEME_COLOR
                        }}>
                            <Text
                                style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.another_qr_payment}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{width: Utility.setWidth(20)}}/>

                    <TouchableOpacity style={{flex: 1}}
                                      onPress={() => this.onSubmit(language, this.props.navigation)}>
                        <View style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: Utility.setHeight(46),
                            borderRadius: Utility.setHeight(23),
                            backgroundColor: themeStyle.THEME_COLOR
                        }}><Text
                            style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.isMainScreen ? language.save_share : language.confirm}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={styles.toolbar}>
                    <View style={{flexDirection:"column",justifyContent:"space-between"}}>
                    <Text style={[CommonStyle.title,{textAlign:"center",fontSize: FontSize.getSize(15)}]}>{language.receipt}</Text>
                    <Text style={[CommonStyle.title,{textAlign:"center",fontSize: FontSize.getSize(20),}]}>{language.thank_you}</Text>
                    <Text style={[CommonStyle.title,{textAlign:"center",fontSize: FontSize.getSize(18),}]}>{language.transaction_success}</Text>
                    <Text style={[CommonStyle.title,{textAlign:"center"}]}>{language.approval_id}</Text>
                    </View>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }} source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.receiptView(language)}
                </ScrollView>
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });

            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("this.props.language.account", this.props.language.account);
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }
}

const styles = {
    toolbar: {
        flexDirection: "row",
        justifyContent: "center",
        height: Utility.setHeight(150),
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15
    },
}

const mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(Receipt);