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
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import RadioForm from "react-native-simple-radio-button";

class FavTransferBkash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nickname: "",
            bkash_name: "",
            accountNo: "",
            error_accountNo:"",
            focusUid: false,
            isProgress: false,
            selectNicknameType: props.language.select_nickname,
            selectAcctType: props.language.select_acct,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            otp_type: 0,
            availableBalance:"",
            error_Balance:"",
            transferAmount:"",
            errorTransferAmount:"",
            servicesCharge:"",
            error_servicesCharge:"",
            grandTotal:"",
            remarks:"",
            error_remarks:""
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
            Utility.alert(language.noRecord,language.ok);
        }
    }

    onSelectItem(item) {
        const {modelSelection} = this.state;
        if (modelSelection === "type") {
            this.setState({selectNicknameType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
          else if (modelSelection === "bankType") {
            this.setState({selectAcctType: item.label, selectTypeVal: item.value, modalVisible: false})
          }
    }

    async onSubmit(language, navigation) {
        if (this.state.selectNicknameType === language.selectNickType) {
            Utility.alert(language.error_select_nickname,language.ok);
            return;
        }
        else if(this.state.selectAcctType===language.select_acct){
            Utility.alert(language.error_select_from_type,language.ok);
            return;
        }
        else if(this.state.transferAmount===""){
            this.setState({errorTransferAmount:language.errTransferAmt})
            return;
        }else if(this.state.remarks === "") {
            this.setState({error_remarks:language.errRemarks})
            return;
        }
        Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
    }

    accountNoOption(language) {
        return (<View>
            <View style={{flex: 1}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                }]}>
                    {language.nick_name}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.selectNickType, language.nickTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectNicknameType === language.select_type_account ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectNicknameType}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.bkash_account}
                </Text>
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={""}
                    onChangeText={text => this.setState({
                        error_accountNo: "",
                        accountNo: Utility.userInput(text)
                    })}
                    value={this.state.accountNo}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    keyboardType={"number-pad"}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    returnKeyType={"next"}
                    editable={false}
                    onSubmitEditing={(event) => {
                        this.cardnameRef.focus();
                    }}
                    maxLength={13}/>
            </View>
            {this.state.error_accountNo !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_accountNo}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.bkash_name}
                    </Text>
                    <TextInput
                        ref={(ref) => this.cardnameRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            bkash_name: Utility.userInput(text)
                        })}
                        value={this.state.bkash_name}
                        multiline={false}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        editable={false}
                        autoCorrect={false}
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
                    onPress={() => this.openModal("bankType", language.select_from_account, language.cardNumber, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectAcctType === language.select_bank_type ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectAcctType}
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
                <TextInput
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_Balance: "",
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
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            {this.state.error_Balance !==  "" ?
                <Text style={{
                    marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                    fontFamily: fontStyle.RobotoRegular,
                }}>{this.state.error_Balance}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.transfer_amount}
                </Text>
                <TextInput
                    ref={(ref) => this.transferAmountRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        errorTransferAmount: "",
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
                    returnKeyType={"next"}
                    onSubmitEditing={(event) => {
                        this.serviceschargeRef.focus();
                    }}
                    maxLength={13}/>
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            {this.state.errorTransferAmount !==  "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.errorTransferAmount}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.services_charge}
                </Text>
                <TextInput
                    ref={(ref) => this.serviceschargeRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_servicesCharge: "",
                        servicesCharge: Utility.userInput(text)
                    })}
                    value={this.state.servicesCharge}
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
                        this.grandtotalRef.focus();
                    }}
                    maxLength={13}/>
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            {this.state.error_servicesCharge !==  "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.error_servicesCharge}</Text> : null}
            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            <View style={{
                flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                marginEnd: 10,
            }}>
                <Text style={[CommonStyle.textStyle]}>
                    {language.grand_total}
                </Text>
                <TextInput
                    ref={(ref) => this.grandtotalRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={"00.00"}
                    onChangeText={text => this.setState({
                        error_grandtotal: "",
                        grandTotal: Utility.userInput(text)
                    })}
                    value={this.state.grandTotal}
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
                        this.grandTotalRef.focus();
                    }}
                    maxLength={13}/>
                <Text style={{paddingLeft:5}}>BDT</Text>
            </View>
            {this.state.error_grandtotal !==  "" ?
                <Text style={CommonStyle.errorStyle}>{this.state.error_grandtotal}</Text> : null}
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
                    ref={(ref) => this.grandTotalRef = ref}
                    selectionColor={themeStyle.THEME_COLOR}
                    style={[CommonStyle.textStyle, {alignItems: "flex-end", textAlign: 'right',flex: 1,marginLeft:10}]}
                    placeholder={language.et_placeholder}
                    onChangeText={text => this.setState({
                        error_remarks: "",
                        remarks: Utility.userInput(text)
                    })}
                    value={this.state.remarks}
                    multiline={false}
                    numberOfLines={1}
                    onFocus={() => this.setState({focusUid: true})}
                    onBlur={() => this.setState({focusUid: false})}
                    contextMenuHidden={true}
                    placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                    autoCorrect={false}
                    maxLength={13}/>
            </View>
            {this.state.error_remarks !==  "" ?
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
                    radio_props={language.otp_props}
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
            <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
            <View style={{marginStart:10,marginEnd:10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note1}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note2}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note3}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note4}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note5} </Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note6}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note7}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note8}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note9}</Text>
                <Text style={CommonStyle.themeTextStyle}>{language.transferTo_bkash_note10}</Text>
            </View>
        </View>)
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
                    <Text style={CommonStyle.title}>{language.transfer_bkash}</Text>
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
                        {this.accountNoOption(language)}

                        <View style={{
                            flexDirection: "row",
                            marginStart: Utility.setWidth(10),
                            marginRight: Utility.setWidth(10),
                            marginTop: Utility.setHeight(20)
                        }}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.goBack()}>
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
                                              onPress={() => this.onSubmit(language, this.props.navigation)}>
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: Utility.setHeight(46),
                                    borderRadius: Utility.setHeight(23),
                                    backgroundColor: themeStyle.THEME_COLOR
                                }}>
                                    <Text
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.stateVal === 3 ? language.submit_txt : language.next}</Text>
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

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.more
        });
    }
}

const styles = {
    textView:{
        marginStart: 10, color: themeStyle.THEME_COLOR
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(FavTransferBkash);
