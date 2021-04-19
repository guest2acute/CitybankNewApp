import React, {Component} from "react";
import {connect} from "react-redux";
import {
    BackHandler, FlatList,
    Image, Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text, TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import Utility from "../../../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import QRCodeScanner from "react-native-qrcode-scanner";
import {RNCamera} from "react-native-camera";
import {BusyIndicator} from "../../../resources/busy-indicator";

class OtherQRPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            SelectFromAccount: props.language.select_from_account,
            title: props.route.params.title,
            selectFromAccountTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            amount: "",
            error_amount: "",
            availableBalance: "",
            remarks: "",
            error_remarks: "",
            otp_type: 0,
            stateVal: 0,
            type: props.route.params.type,
            isProgress: false
        }
    }

    openModal(option, title, data, language) {
        if (data.length > 0) {
            this.setState({
                modelSelection: option,
                modalTitle: title,
                modalData: data, modalVisible: true
            });
        } else {
            Utility.alert(language.noRecord, language.ok);
        }
    }

    onSelectItem(item) {
        let language = this.props.language;
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "operatorType") {
            this.setState({SelectOperatorName: item.label, selectOperatorTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({SelectFromAccount: item.label, selectFromAccountTypeVal: item.value, modalVisible: false})
        }
    }

    async changeCard(cardCode) {
        this.setState({
            stateVal: cardCode
        })
    }

    generateQR(language) {
        if (this.state.SelectFromAccount === language.select_from_account) {
            Utility.alert(language.error_select_from_type, language.ok);
        } else if (this.state.amount === "") {
            this.setState({error_amount: language.error_amount})
        } else if (this.state.remarks === "") {
            this.setState({error_remarks: language.errRemarks})
        } else {
            this.processRequest(language)
        }
    }

    processRequest(language) {
        let tempArr = [];
        tempArr.push(
            {key: language.fromAccount, value: this.state.SelectFromAccount},
            {key: language.available_bal, value: this.state.availableBalance},
            {key: language.cash_amount, value: this.state.amount},
            {key: language.remarks, value: this.state.remarks},
            {key: language.otpType, value: language.otp_props[this.state.otp_type].label},
        )
        console.log("temp Array ", tempArr)

        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Payments'}, {name: 'OtherQRPayment'}],
            routeIndex: 1,
            title: this.state.title,
            transferArray: tempArr,
            screenName: "SecurityVerification",
            transType: "payments"
        });

    }

    onSuccess = e => {
        console.log("event", e);
    };

    bottomView(language) {
        return (<View key={"bottomView"} style={styles.bottomViewStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    marginLeft: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10)
                }}>
                </View>
                <View style={{
                    flexDirection: "row", alignItems: "center", marginTop: 10,
                }}>
                    <Text style={CommonStyle.midTextStyle}>{language.qrId}</Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            flex: 1,
                            marginLeft: 20,
                            borderColor: themeStyle.PLACEHOLDER_COLOR,
                            borderWidth: 1,
                            paddingLeft: 10,
                            height: Utility.setHeight(40)
                        }]}
                        placeholder={language.et_qr}
                        onChangeText={text => this.setState({
                            qrId: Utility.userInput(text)
                        })}
                        value={this.state.qrId}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"done"}
                        onSubmitEditing={(event) => {
                            this.submit(language)
                        }}
                        maxLength={30}/>
                </View>

                <View style={{marginTop: 10, marginBottom: 0}}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.THEME_COLOR,
                        marginBottom: 5
                    }]}>{language.note}</Text>
                    <Text
                        style={[CommonStyle.textStyle, {color:themeStyle.THEME_COLOR,fontSize: FontSize.getSize(11),}]}>{language.scan_note1}</Text>
                </View>

            </ScrollView>
        </View>)
    }


    individualPayment(language) {
        return (
            <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                    {
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.fromAccount}
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                        </Text>
                    }
                    <TouchableOpacity
                        onPress={() => this.openModal("accountType", language.select_from_account, language.cardNumber, language)}>
                        <View style={CommonStyle.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.SelectFromAccount === language.select_from_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.SelectFromAccount}
                            </Text>
                            <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                   source={require("../../../resources/images/ic_arrow_down.png")}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.available_bal}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.availableBalance}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.cash_amount}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.enter_amount}
                        onChangeText={text => this.setState({
                            error_amount: "",
                            amount: Utility.userInput(text)
                        })}
                        value={this.state.amount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={() => {
                            this.remarksRef.focus();
                        }}
                        maxLength={30}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_amount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_amount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.remarks}
                        <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.remarksRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_remarks}
                        onChangeText={text => this.setState({
                            error_remarks: "",
                            remarks: Utility.userInput(text)
                        })}
                        value={this.state.remarks}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={100}/>
                </View>
                {this.state.error_remarks !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.otpType}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>

                    <RadioForm
                        key={this.state.otp_type}
                        radio_props={language.otp_props}
                        initial={this.state.otp_type}
                        buttonSize={9}
                        selectedButtonColor={themeStyle.THEME_COLOR}
                        formHorizontal={true}
                        labelHorizontal={true}
                        borderWidth={1}
                        buttonColor={themeStyle.GRAY_COLOR}
                        labelColor={themeStyle.BLACK}
                        labelStyle={[CommonStyle.textStyle, {marginRight: 10}]}
                        style={{marginStart: 5, marginTop: 10, marginLeft: Utility.setWidth(20)}}
                        animation={true}
                        onPress={(value) => {
                            this.setState({otp_type: value});
                        }}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>

                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.individual_payment1}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.individual_payment2}</Text>
                </View>

                <TouchableOpacity style={{flex: 1}}
                                  onPress={() => this.generateQR(language)}>
                    <View style={{
                        alignSelf: "center",
                        justifyContent: "center",
                        height: Utility.setHeight(46),
                        width: Utility.getDeviceWidth() / 2.5,
                        borderRadius: Utility.setHeight(23),
                        marginBottom: 10,
                        marginTop: 40,
                        backgroundColor: themeStyle.THEME_COLOR
                    }}>
                        <Text
                            style={[CommonStyle.midTextStyle, {
                                color: themeStyle.WHITE,
                                textAlign: "center"
                            }]}>{language.generate_qr_code_button}</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    receiveMoney(language) {
        return (
            <View>
                <Text style={[CommonStyle.labelStyle,styles.scanQrCodeText]}>{language.scanQrCode}</Text>
            <QRCodeScanner
                onRead={this.onSuccess}
                flashMode={RNCamera.Constants.FlashMode.auto}
                bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable}>
                        <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                }
            />
                {this.bottomView(language)}
            </View>
        )
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={CommonStyle.toolbar}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                    >
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>

                <View style={[CommonStyle.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10, height: Utility.setHeight(40),
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            flex: 1,
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={{
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(12),
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }}>{language.generate_qr_code}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            flex: 1,
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={{
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(12),
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }}>{this.state.type === "Group" ? language.payment_txt : language.receive_money}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        {this.state.stateVal === 0 ? this.individualPayment(language) : this.receiveMoney(language)}
                    </View>
                </ScrollView>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({modalVisible: false})
                    }}>
                    <View style={CommonStyle.centeredView}>
                        <View style={CommonStyle.modalView}>
                            <View style={{
                                width: "100%",
                                backgroundColor: themeStyle.THEME_COLOR,
                                height: Utility.setHeight(30),
                                justifyContent: "center"
                            }}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    textAlign: "center",
                                    color: themeStyle.WHITE,
                                }]}>{this.state.modalTitle}</Text>
                            </View>

                            <FlatList style={{backgroundColor: themeStyle.WHITE, width: "100%"}}
                                      data={this.state.modalData} keyExtractor={(item, index) => index + ""}
                                      renderItem={({item}) =>
                                          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
                                              <View
                                                  style={{height: Utility.setHeight(35), justifyContent: "center"}}>
                                                  <Text
                                                      style={[CommonStyle.textStyle, {
                                                          color: themeStyle.THEME_COLOR,
                                                          marginStart: 10
                                                      }]}>{item.label}</Text>
                                              </View>
                                          </TouchableOpacity>
                                      }
                                      ItemSeparatorComponent={this.renderSeparator}/>
                        </View>
                    </View>
                </Modal>
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
            tabBarLabel: this.props.language.payments
        });
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        this.props.navigation.goBack();
    }

}

let styles = {
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    bottomViewStyle:{
        // maxHeight: Utility.getDeviceHeight() / 4,
        position: "absolute", bottom: 0, paddingLeft: Utility.setWidth(20), paddingRight: Utility.setWidth(20),
        paddingTop: Utility.setHeight(20),
        paddingBottom: Utility.setHeight(10), backgroundColor: themeStyle.BG_COLOR, width: Utility.getDeviceWidth()
    },
    scanQrCodeText: {
        paddingLeft: Utility.setWidth(20),
        paddingRight: Utility.setWidth(20),
         paddingTop: 5,
         paddingBottom: Utility.setHeight(5),
         justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
        zIndex:1,
        width: Utility.getDeviceWidth()
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(OtherQRPayment);