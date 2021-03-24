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
    TextInput, FlatList, Platform, StatusBar, BackHandler
} from "react-native";
import themeStyle from "../../../resources/theme.style";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import CommonStyle from "../../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../../resources/busy-indicator";
import Utility from "../../../utilize/Utility";
import {AddBeneficiary, VERIFYBKASHAC} from "../../Requests/RequestBeneficiary";
import {MoreDetails} from "../../Requests/CommonRequest";

class BeneficiaryTransferMFS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selMFS: props.language.selMfs,
            selMFSVal: -1,
            nickname: "",
            accountNo: "",
            error_nickname: "",
            error_accountNo: "",
            isMainScreen: true,
            modalVisible: false,
            updateTitle: props.route.params.title
        }
    }

    async onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
            if (this.state.selMFSVal === -1) {
                Utility.alert(language.errorSelMFSVal,language.ok);
            } else if (this.state.nickname === "") {
                this.setState({error_nickname: language.require_nickname});
            } else if (this.state.accountNo.length < 11) {
                this.setState({error_accountNo: language.errBkash})
            } else{
                this.verifybKashAct();
            }
        } else {
            this.beneficiaryAdd();
        }
    }

    verifybKashAct() {
        const {accountNo, nickname} = this.state;
        this.setState({isProgress: true});
        VERIFYBKASHAC(this.props.userDetails, accountNo, this.props).then(response => {
            this.setState({
                isProgress: false,
                isMainScreen: false
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    beneficiaryAdd() {
        const {accountNo, nickname} = this.state;
        this.setState({isProgress: true});
        let accountDetails = {ACCOUNT:accountNo,ADDRESS:"",CONTACTNUMBER:accountNo,ACCOUNTNAME:nickname};
        AddBeneficiary(accountDetails, "W", this.props.userDetails, nickname, accountNo, "", "",this.props, "A").then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
            }, () => this.props.navigation.navigate("SecurityVerification", {
                REQUEST_CD: response.REQUEST_CD,
                transType: "W",
                actNo: accountNo,
                resetScreen: this.resetScreen
            }));
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    resetScreen = (flag) => {
        if (flag) {
            this.setState({
                selMFS: this.props.language.selMfs,
                selMFSVal: -1,
                nickname: "",
                accountNo: "",
                isMainScreen: true,
            });
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
        if (modelSelection === "mfsType") {
            this.setState({selMFS: item.label, selMFSVal: item.value, modalVisible: false})
        }
    }

    accountNoOption(language) {
        return (
            <View>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.mfsTxt}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("mfsType", language.selMfs, language.mfsList, language)}>
                    <View style={CommonStyle.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selMFSVal === -1 ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selMFS}
                        </Text>
                        <Image resizeMode={"contain"} style={CommonStyle.arrowStyle}
                               source={require("../../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.nick_name}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.isMainScreen ? language.please_enter : ""}
                        onChangeText={text => this.setState({
                            error_nickname: "",
                            nickname: text
                        })}
                        value={this.state.nickname}
                        multiline={false}
                        editable={this.state.isMainScreen}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        returnKeyType={"next"}
                        onSubmitEditing={(event) => {
                            this.accountNoRef.focus();
                        }}
                    />
                </View>
                {this.state.error_nickname !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_nickname}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row",
                    height: Utility.setHeight(50),
                    marginStart: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.bkash_account}
                        <Text style={{color: themeStyle.THEME_COLOR}}>{this.state.isMainScreen ? "*" : ""}</Text>
                    </Text>

                    {/*<TouchableOpacity onPress={() => this.props.navigation.navigate("BeneficiaryMobileNumber")}>
                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                       marginLeft: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                       //alignItems: "flex-end",
                        //alignSelf:"flex-end"
                    }} resizeMode={"contain"}
                           source={require("../../resources/images/ic_beneficiary.png")}/>
                </TouchableOpacity>*/}
                    <TextInput
                        ref={(ref) => this.accountNoRef = ref}
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={this.state.isMainScreen ? language.bkash_account : ""}
                        onChangeText={text => this.setState({
                            error_accountNo: "",
                            accountNo: Utility.input(text, "0123456789")
                        })}
                        value={this.state.accountNo}
                        multiline={false}
                        editable={this.state.isMainScreen}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={11}/>
                </View>
                {this.state.error_accountNo !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.error_accountNo}</Text> : null}

                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {this.state.isMainScreen ?
                    <View><Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}
                    </Text>
                        <Text style={[CommonStyle.midTextStyle, {
                            marginLeft: 10,
                            color: themeStyle.THEME_COLOR
                        }]}>{language.notes}:</Text>
                        <Text style={{
                            marginStart: 10,
                            color: themeStyle.THEME_COLOR
                        }}>{language.onlybKashTxt}</Text></View> : null}
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
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") : require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{this.state.updateTitle}</Text>
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
                        }}
                               source={require("../../../resources/images/ic_logout.png")}/>
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
                                        style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{this.state.isMainScreen ? language.next : language.confirm}</Text>
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

            BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
        }

        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {isMainScreen} = this.state;
        if (isMainScreen) {
            console.log("1");
            this.props.navigation.goBack();
        } else {
            console.log("2");
            this.setState({isMainScreen: true})
        }
    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener("hardwareBackPress", this.backAction);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.langId !== this.props.langId) {
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(BeneficiaryTransferMFS);
