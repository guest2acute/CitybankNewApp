import {connect} from "react-redux";
import {
    I18nManager,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput, FlatList, Platform, StatusBar
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";


class MobileRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            SelectOperator: props.language.SelectOperator,
            SelectFromAccount: props.language.select_from_account,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            mobileNumber: "",
            errorMobile: "",
            availableBalance: "",
            error_availableBal: "",
            transfer_amount: "",
            error_transferAmount: "",
            servicesCharge: "",
            grandTotal: "",
            error_grandTotal: "",
            transferAmount: "",
            otp_type:0,

        }
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    marginStart: 5,
                    marginEnd: 5,
                    backgroundColor: themeStyle.SEPARATOR,
                }}
            />
        );
    };

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
        if (modelSelection === "type") {
            this.setState({SelectOperator: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "accountType") {
            this.setState({SelectFromAccount: item.label, selectAccountTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        if (this.state.SelectOperator === language.SelectOperator) {
            Utility.alert(language.error_select_operator, language.ok);
        } else if (!Utility.ValidateMobileNumber(this.state.mobileNumber)) {
            this.setState({errorMobile: language.error_mobile_number})
            return;
        } else if (this.state.SelectFromAccount === language.select_from_account) {
            Utility.alert(language.error_select_from_type, language.ok);
        } else if (this.state.transferAmount === "") {
            this.setState({error_transferAmount: language.errPaymentAmount})
        }
        else{
            this.processRequest(language)
        }
    }

    processRequest(language,val) {
        let tempArr = [];
        tempArr.push(
            {key: language.operatorType, value: this.state.SelectOperator},
            {key: language.phoneNumber, value: this.state.mobileNumber},
            {key: language.connectionType, value: language.connectionType_props[this.state.otp_type].label},
            {key: language.fromAccount, value: this.state.SelectFromAccount},
            {key: language.available_bal, value: this.state.availableBalance},
            {key: language.totalAmount, value: this.state.transferAmount},
            {key: language.totalServicesCharge, value: this.state.servicesCharge},
            {key: language.grand_total, value: this.state.grandTotal},
        )


        console.log("tempArr is this==>",tempArr)
        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'Payments'},{name: 'MobileRecharge'}],
            routeIndex: 1,
            title: language.mobileRecharge,
            transferArray:tempArr,
            screenName:"SecurityVerification"
        });


       /* this.props.navigation.navigate("SecurityVerification", {
            REQUEST_CD: "",
            transType: "fund",
            routeVal: [{name: 'Payments'}, {name: 'MobileRecharge'}],
            routeIndex: 1
        })*/
    }

    getListViewItem = (item) => {
        this.setState({transferAmount: item.label})
    }

    mobileRecharge(language) {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.phoneNumber}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"01********"}
                        onChangeText={text => this.setState({
                            errorMobile: "",
                            mobileNumber: Utility.input(text, "0123456789")
                        })}
                        value={this.state.mobileNumber}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={11}/>
                </View>
                {this.state.errorMobile !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorMobile}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.connectionType}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <RadioForm
                        radio_props={language.connectionType_props}
                        initial={0}
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
                <View style={{flex: 1}}>
                    {<Text style={[CommonStyle.labelStyle, {
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
                                   source={require("../../resources/images/ic_arrow_down.png")}/>
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
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {/* <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.available_bal}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_availableBal: "",
                            availableBalance: Utility.userInput(text)
                        })}
                        value={this.state.availableBalance}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.transferAmountRef.focus();
                        }}
                        maxLength={13}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_availableBal !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_availableBal}</Text> : null}*/}

                <FlatList horizontal={true}
                          data={language.smallBalanceTypeArr}
                          renderItem={({item}) =>
                              <View>
                                  <TouchableOpacity onPress={this.getListViewItem.bind(this, item)} style={{
                                      marginRight: 10,
                                      marginLeft: 10,
                                      marginTop: 10,
                                      borderRadius: 3,
                                      padding: 7,
                                      flexDirection: 'row',
                                      justifyContent: "space-around",
                                      backgroundColor: themeStyle.THEME_COLOR
                                  }}>
                                      <Text
                                          style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}>{item.label}</Text>
                                  </TouchableOpacity>
                              </View>
                          }
                />

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.totalAmount}
                    </Text>
                    <TextInput
                        ref={(ref) => this.transferAmountRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_transferAmount: "",
                            transferAmount: Utility.userInput(text)
                        })}
                        value={this.state.transferAmount}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={30}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_transferAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_transferAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.totalServicesCharge}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.servicesCharge}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.grand_total}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.grandTotal}</Text>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.mobileRecharge}</Text>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flex: 1, paddingBottom: 30}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.operatorType}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("type", language.select_operator_type, language.operatorsTypeArr, language)}>
                            <View style={CommonStyle.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.SelectOperator === language.SelectOperator ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.SelectOperator}
                                </Text>
                                <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                        {(this.state.selectTypeVal === 1) ? this.mobileRecharge(language) : null}
                        <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                        <View style={{marginStart: 10, marginEnd: 10, marginTop: 10}}>
                            <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note1}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note2}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note3}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note4}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note5}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note6}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note7}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note8}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note9}</Text>
                            <Text style={CommonStyle.themeTextStyle}>{language.mobile_recharge_note10}</Text>
                        </View>

                        {/*=====================================================================================*/}
                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.goBack(null)}>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.THEME_COLOR}]}>{language.back_txt}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{width: Utility.setWidth(20)}}/>

                            <TouchableOpacity style={{flex: 1}}
                                              onPress={() => this.submit(language, this.props.navigation)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.next}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

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
                                      data={this.state.modalData} keyExtractor={(item, index) => item.key}
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
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        )
    }

    componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        // bottom tab management
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.payments
        });
    }
}


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(MobileRecharge);
