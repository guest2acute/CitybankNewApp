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
    TextInput, FlatList
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import moment from "moment";
import MonthPicker from "react-native-month-year-picker";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import RadioForm from "react-native-simple-radio-button";

class CardPinReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectType: props.language.select_reason,
            selectCard: props.language.select_card_number,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            title: props.route.params.title,
            cardStatus: "",
            cardHolderName: "",
            cardType: "",
            pinChangeReason: "",
            error_pinChangeReason: "",
            pinVal: "",
            errorPinVal: "",
            confirmPinNumber: "",
            errorConfirmPinNumber: "",
            cardMaskingNumber: "",
            otp_type: 0,
            error_masking_number:"",

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
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "creditCardType") {
            this.setState({selectCard: item.label, selectTypeVal: item.value, modalVisible: false})
        } else if (modelSelection === "cardBlockType") {
            this.setState({selectType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        if (this.state.selectCard === language.select_card_number) {
            Utility.alert(language.errorSelectCard, language.ok);
        } else if (this.state.cardMaskingNumber === "") {
            this.setState({error_masking_number: language.error_masking_number});
        }else if (this.state.pinChangeReason === "") {
            this.setState({error_pinChangeReason: language.error_pinChangeReason});
        } else if (this.state.pinVal === "") {
            this.setState({errorPinVal: language.error_newPinNumber});
        } else if (this.state.pinVal !== this.state.confirmPinNumber) {
            this.setState({errorConfirmPinNumber: language.errConfirmPin});
        } else {
            this.processRequest(language)
            // Utility.alertWithBack(language.ok_txt, language.success_saved, navigation)
        }
    }

    processRequest(language) {
        let tempArr = [];
        tempArr.push(
            {key: language.credit_card_no, value: this.state.selectCard},
            {key: language.card_status, value: this.state.cardStatus},
            {key: language.card_holder_name, value: this.state.cardHolderName},
            {key: language.card_masking_number, value: this.state.cardMaskingNumber},
            {key: language.pin_change_reason, value: this.state.pinChangeReason},
            {key: language.otp_txt, value: language.otp_props[this.state.otp_type].label},
        ),
            console.log("titile temparray", tempArr)
        this.props.navigation.navigate("TransferConfirm", {
            routeVal: [{name: 'More'}, {name: 'CardPinReset'}],
            routeIndex: 1,
            title: this.state.title,
            transferArray: tempArr,
            screenName: "SecurityVerification"
        });

    }

    cardPINReset(language) {
        return (
            <View key={"cardPINReset"} style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.credit_card_no}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("creditCardType", language.select_card_number, language.cardTypeArr, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectCard === language.select_card_number ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectCard}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.card_status}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.cardStatus}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.card_holder_name}
                    </Text>
                    <Text style={CommonStyle.viewText}>{this.state.cardHolderName}</Text>
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{ flex:1,flexDirection:"row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.card_masking_number}
                    </Text>
                    <Text style={[CommonStyle.viewText, {}]}>37698</Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[{
                            height: Utility.setHeight(25),
                            width: Utility.setWidth(55),
                            borderWidth: 1,
                            marginLeft: 10,
                            paddingVertical: 0,
                            fontFamily: fontStyle.RobotoRegular,
                            fontSize: FontSize.getSize(11),
                            color: themeStyle.BLACK,
                            textAlign: "center"
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            error_masking_number:"",
                            cardMaskingNumber: Utility.input(text, "0123456789")
                        })}
                        value={this.state.cardMaskingNumber}
                        keyboardType={"number-pad"}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={5}/>

                    <Text style={{paddingLeft:10,textAlign: "right"}}>9669</Text>
                </View>
                {this.state.error_masking_number !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_masking_number}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.pin_change_reason}
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
                        placeholder={language.pim_reason_placeholder}
                        onChangeText={text => this.setState({
                            error_pinChangeReason: "",
                            pinChangeReason: Utility.userInput(text)
                        })}
                        value={this.state.pinChangeReason}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.pinValRef.focus();
                        }}
                    />
                </View>
                {this.state.error_pinChangeReason !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_pinChangeReason}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.new_pin_number}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.pinValRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.newPIn_placeholder}
                        onChangeText={text => this.setState({
                            errorPinVal: "",
                            pinVal: Utility.input(text, "0123456789")
                        })}
                        value={this.state.pinVal}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        secureTextEntry={true}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.confirmPinNumberRef.focus();
                        }}
                        maxLength={4}/>
                </View>
                {this.state.errorPinVal !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorPinVal}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <View style={{
                    flexDirection: "row",
                    marginStart: 10,
                    height: Utility.setHeight(50),
                    alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.confirm_pin_number}
                        <Text style={{color: themeStyle.THEME_COLOR}}>*</Text>
                    </Text>
                    <TextInput
                        ref={(ref) => this.confirmPinNumberRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.confirmPin_placeholder}
                        onChangeText={text => this.setState({
                            errorConfirmPinNumber: "",
                            confirmPinNumber: Utility.input(text, "0123456789")
                        })}
                        value={this.state.confirmPinNumber}
                        multiline={false}
                        numberOfLines={1}
                        keyboardType={"number-pad"}
                        contextMenuHidden={true}
                        secureTextEntry={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorConfirmPinNumber !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorConfirmPinNumber}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.otp_txt}
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
                    <Text style={CommonStyle.title}>{this.state.title}</Text>
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
                        {this.cardPINReset(language)}
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
                                              onPress={() => this.submit(language, this.props.navigation)}>
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
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CardPinReset);
