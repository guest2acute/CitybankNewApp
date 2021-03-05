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
import RadioForm from "react-native-simple-radio-button";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";


class MobileRecharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            SelectOperator: props.language.SelectOperator,
            SelectFromAccount: props.language.selectAccountType,
            SelectName: props.language.selectNickType,
            selectTypeVal: -1,
            selectActCard: props.language.TypeOfTransferArr[0],
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            mobileNumber: "",
            availablebalance:"",
            error_availablebal:"",
            transfer_amount:"",
            error_transferamt:"",
            servicescharge:"",
            grandtotal:"",
            error_grandtotal:"",
            transferamt:"",

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
            Utility.alert(language.noRecord);
        }
    }

    onSelectItem(item) {
        let language = this.props.language;
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "type") {
            this.setState({SelectOperator: item.label, selectTypeVal: item.value, modalVisible: false})
        }
        if (modelSelection === "NickType") {
            this.setState({SelectName: item.label, selectTypeVal: item.value, modalVisible: false})
        }
        else if (modelSelection === "accountType") {
            this.setState({SelectFromAccount: item.label, selectTypeVal: item.value, modalVisible: false})
        }


    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        console.log("selecttype value is this", this.state.selectTypeVal);
        if (this.state.SelectOperator === language.SelectOperator) {
            Utility.alert("Please Select Operator");
            return;
        }else if (this.state.SelectName === language.selectNickType) {
            Utility.alert("Please Select Nick Name");
            return;
        }  else if (this.state.SelectFromAccount === language.selectAccountType) {
            Utility.alert("Please Select From Account");
            return;
        }else if (this.state.transferamt === "") {
            this.setState({error_transferamt: language.errPaymentAmount})
            return;
        }
    }

    getListViewItem = (item) => {
        this.setState({transferamt: item.label})
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
                        onChangeText={text => this.setState({mobileNumber: Utility.input(text, "0123456789")})}
                        value={this.state.mobileNumber}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={14}/>
                </View>
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
                        onPress={() => this.openModal("accountType", language.selectAccountType, language.cardNumber, language)}>
                        <View style={styles.selectionBg}>
                            <Text style={[CommonStyle.midTextStyle, {
                                color: this.state.SelectFromAccount === language.selectAccountType ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                flex: 1
                            }]}>
                                {this.state.SelectFromAccount}
                            </Text>
                            <Image resizeMode={"contain"} style={styles.arrowStyle}
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
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_availablebal: "",
                            availablebalance: Utility.userInput(text)
                        })}
                        value={this.state.availablebalance}
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
                            this.transferamtRef.focus();
                        }}
                        maxLength={13}/>
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_availablebal !== "" ?
                    <Text style={{
                        marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_availablebal}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                <FlatList horizontal={true}
                          data={language.balanceTypeArr}
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
                                      <Text style={[CommonStyle.textStyle, {color: themeStyle.WHITE}]}>{item.label}</Text>
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
                        ref={(ref) => this.transferamtRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_transferamt: "",
                            transferamt: Utility.userInput(text)
                        })}
                        value={this.state.transferamt}
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
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                  {this.state.error_transferamt !== "" ?
                    <Text style={{
                        marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_transferamt}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>


                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.totalServicesCharge}
                    </Text>
                    <TextInput
                        ref={(ref) => this.serviceschargeRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_servicescharge: "",
                            servicescharge: Utility.userInput(text)
                        })}
                        value={this.state.servicescharge}
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
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_servicescharge !== "" ?
                    <Text style={{
                        marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_servicescharge}</Text> : null}
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
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={"00.00"}
                        onChangeText={text => this.setState({
                            error_grandtotal: "",
                            grandtotal: Utility.userInput(text)
                        })}
                        value={this.state.grandtotal}
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
                    <Text style={{paddingLeft: 5}}>BDT</Text>
                </View>
                {this.state.error_grandtotal !== "" ?
                    <Text style={{
                        marginLeft: 5, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.error_grandtotal}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

            </View>
        )
    }

    render() {
        let language = this.props.language;
        return (<View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
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
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.SelectOperator === language.select_type_transfer ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.SelectOperator}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginStart: 10,
                            marginEnd: 10,
                            marginTop: 6,
                            marginBottom: 4
                        }]}>
                            {language.nick_name}
                        </Text>
                        <TouchableOpacity
                            onPress={() => this.openModal("NickType", language.selectNickType, language.nickTypeArr, language)}>
                            <View style={styles.selectionBg}>
                                <Text style={[CommonStyle.midTextStyle, {
                                    color: this.state.SelectName === language.select_type_transfer ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                                    flex: 1
                                }]}>
                                    {this.state.SelectName}
                                </Text>
                                <Image resizeMode={"contain"} style={styles.arrowStyle}
                                       source={require("../../resources/images/ic_arrow_down.png")}/>
                            </View>
                        </TouchableOpacity>
                        {(this.state.selectTypeVal=== 1) ? this.mobileRecharge(language) :null}
                        <Text
                            style={{marginStart: 10, marginTop: 10, color: themeStyle.THEME_COLOR}}>*{language.mark_field_mandatory}
                        </Text>
                        <View style={{marginTop: 10,}}>
                            <Text style={styles.textView}>{language.notes}</Text>
                            <Text style={styles.textView}>1. Minimum recharge amount for postpaid connection</Text>
                            <Text style={styles.textView}> Tk.50/- and for prepaid Tk. 10/-.</Text>
                            <Text style={styles.textView}>2. Maximum recharge amount for postpaid connection</Text>
                            <Text style={styles.textView}> Tk.10000/- and for prepaid Tk. 1000/-.</Text>
                            <Text style={styles.textView}>3. only prepaid recharge is acceptable in Teletalk numbers.</Text>
                            <Text style={styles.textView}>4. Consecutive recharge in the same number require.</Text>
                            <Text style={styles.textView}>minimum 15 minites interval.</Text>
                            <Text style={styles.textView}>if your recharge amount is equivalent to any trigger/bundle</Text>
                            <Text style={styles.textView}>pack amount, a data/minute/bundle pack will be activated </Text>
                            <Text style={styles.textView}>on your mobile.please visit operator website to know more.</Text>
                        </View>

                        {/*=====================================================================================*/}
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
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
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

const styles = {
    arrowStyle: {
        tintColor: themeStyle.BLACK,
        width: Utility.setWidth(35),
        height: Utility.setHeight(30)
    },
    selectionBg: {
        paddingStart: 10,
        paddingBottom: 4,
        paddingTop: 4,
        paddingEnd: 10,
        flexDirection: "row",
        backgroundColor: themeStyle.SELECTION_BG,
        alignItems: "center"
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: Utility.getDeviceWidth() - 30,
        overflow: "hidden",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textView: {
        marginStart: 10, color: themeStyle.THEME_COLOR
    },

}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(MobileRecharge);
