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
    TextInput, FlatList, BackHandler, Platform, StatusBar
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import React, {Component} from "react";
import {BusyIndicator} from "../../resources/busy-indicator";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";
import fontStyle from "../../resources/FontStyle";
import Secure from "../../config/Secure";
import Config from "../../config/Config";
import ApiRequest from "../../config/ApiRequest";


class SecurityVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            selectCardType: props.language.select_card,
            selectTypeVal: -1,
            modelSelection: "",
            modalVisible: false,
            modalTitle: "",
            modalData: [],
            cardPin: "",
            errorCardPin: "",
            transactionPin: "",
            errorTransactionPin: "",
            authFlag: props.userDetails.AUTH_FLAG,
            cardNoList:[]
        }
    }

    async getAccount() {
        let userDetails = this.props.userDetails;
        this.setState({isProgress: true});
        let result = await ApiRequest.apiRequest.getAccountDetails(userDetails, {});
        console.log("result", result);
        if (result.STATUS === "0") {
            let response = result.RESPONSE[0];
            console.log("response", response);
            let cardArr = [];
            response.CARD_DTL.map((card) => {
                cardArr.push({
                    label: Utility.maskString(card.ACCOUNT_NO),// + "/" + card.ACCT_TYPE_NM,
                    value: card.ACCOUNT_NO,
                    item: card
                });
            });
            this.setState({cardNoList: cardArr, isProgress: false});
        } else {
            this.setState({isProgress: false});
            Utility.errorManage(result.STATUS, result.MESSAGE, this.props);
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
        const {modelSelection} = this.state;
        console.log("modelSelection is this", item)
        if (modelSelection === "type") {
            this.setState({selectCardType: item.label, selectTypeVal: item.value, modalVisible: false})
        }
    }

    submit(language, navigation) {
        let otpMsg = "", successMsg = "";
        console.log("authFlag", this.state.authFlag)
        if (this.state.authFlag === "CP") {
            if (this.state.selectTypeVal === -1) {
                Utility.alert(language.errorSelectCard);
                return;
            } else if (this.state.cardPin === "") {
                this.setState({errorCardPin: language.errSecurity})
                return;
            }
        } else if (this.state.authFlag === "TP") {
            if (this.state.transactionPin === "") {
                this.setState({
                    errorTransactionPin: language.errorTransactionPin
                })
            }
        }
    }

    cPinView(language) {
        return (
            <View key={"tPinView"} style={{flex: 1, paddingBottom: 30}}>
                <Text style={[CommonStyle.labelStyle, {
                    color: themeStyle.THEME_COLOR,
                    marginStart: 10,
                    marginEnd: 10,
                    marginTop: 6,
                    marginBottom: 4
                }]}>
                    {language.cards}
                    <Text style={{color: themeStyle.THEME_COLOR}}> *</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => this.openModal("type", language.select_card, this.state.cardNoList, language)}>
                    <View style={styles.selectionBg}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: this.state.selectCardType === language.select_card ? themeStyle.SELECT_LABEL : themeStyle.BLACK,
                            flex: 1
                        }]}>
                            {this.state.selectCardType}
                        </Text>
                        <Image resizeMode={"contain"} style={styles.arrowStyle}
                               source={require("../../resources/images/ic_arrow_down.png")}/>
                    </View>
                </TouchableOpacity>

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.cardPin}
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
                        placeholder={language.et_cardPlaceholder}
                        onChangeText={text => this.setState({
                            errorCardPin: "",
                            cardPin: Utility.userInput(text)
                        })}
                        value={this.state.cardPin}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        secureTextEntry={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorCardPin !== "" ?
                    <Text style={{
                        marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.errorCardPin}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text
                    style={{
                        marginStart: 10,
                        marginTop: 10,
                        color: themeStyle.THEME_COLOR
                    }}>*{language.mark_field_mandatory}
                </Text>
            </View>

        )
    }

    tPinView(language) {
        return (
            <View key={"cPinView"} style={{flex: 1}}>
                <View style={{marginStart: 10, marginEnd: 10, marginTop: 10}}>
                    {/* <Text style={[styles.title,{marginBottom:10}]}>{language.transactionPin}</Text>*/}
                    <Text
                        style={[CommonStyle.textStyle, {color: themeStyle.THEME_COLOR}]}>{language.transactionTitle}</Text>
                </View>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.transactionPin}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={language.et_TransPlaceholder}
                        onChangeText={text => this.setState({
                            errorTransactionPin: "",
                            transactionPin: Utility.userInput(text)
                        })}
                        value={this.state.transactionPin}
                        multiline={false}
                        numberOfLines={1}
                        onFocus={() => this.setState({focusUid: true})}
                        onBlur={() => this.setState({focusUid: false})}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        secureTextEntry={true}
                        maxLength={4}/>
                </View>
                {this.state.errorTransactionPin !== "" ?
                    <Text style={{
                        marginStart: 10, color: themeStyle.THEME_COLOR, fontSize: FontSize.getSize(11),
                        fontFamily: fontStyle.RobotoRegular,
                    }}>{this.state.errorTransactionPin}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={{
                    marginStart: 10,
                    marginTop: 20,
                    color: themeStyle.THEME_COLOR
                }}>*{language.mark_field_mandatory}
                </Text>
                <Text style={styles.textView}>{language.notes}:</Text>
                <Text style={styles.textView}>1. Your Transaction PIN should be 4 digits.</Text>
                <Text style={styles.textView}>2. Consecutive 3 wrong attempts will lock</Text>
                <Text style={styles.textView}> your Transaction PIN call 16243 to unlock..</Text>
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
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.security_verification}</Text>
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
                    {this.state.authFlag === "TP" ? this.tPinView(language) : this.cPinView(language)}

                    <View style={{
                        flexDirection: "row",
                        marginStart: Utility.setWidth(10),
                        marginRight: Utility.setWidth(10),
                        marginTop: Utility.setHeight(10)
                    }}>
                        <TouchableOpacity style={{flex: 1}} onPress={() => this.backEvent()}>
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
                                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{language.add}</Text>
                            </View>
                        </TouchableOpacity>
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
                                      data={this.state.modalData} keyExtractor={(item, index) => index+""}
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

    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        if(this.props.userDetails.AUTH_FLAG === "CP"){
            await this.getAccount();
        }
    }
    backEvent() {
        this.props.navigation.goBack();
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
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(14),
    },

}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(SecurityVerification);