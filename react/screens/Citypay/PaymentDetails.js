import React, {Component} from "react";
import {
    BackHandler, FlatList,
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
import {CARDUPDATE, QRPAYMENT} from "../Requests/QRRequest";
import {VerifyCard, VERIFYCARDPINDETAIL} from "../Requests/CommonRequest";

let response;

class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        response = props.route.params.response;
        this.state = {
            isProgress: false,
            isMainScreen: true,
            merchantName: response.MERNAME59,
            merchantCity: response.MERCITY60,
            paymentAmount: response.TRANAMOUNT54,
            grandTotal: response.TRANAMOUNT54,
            billNumber: response.BILLNUMBER6201,
            storeLabel: response.STORELABEL6203,
            terminalLabel: response.TERLABEL6207,
            remarks: "",
            error_remarks: "",
            errorPaymentAmount: "",
            errorCardPin: "",
            cardPin: "",
            conAmt: "",
            tipAmt: "",
            email:"",
            errorTipAmt: "",
            data: response.CARD_LIST,
            cardDetails: response.CARD_LIST.length > 0 ? response.CARD_LIST[0] : null
        }
    }

    selectCard(index) {
        let counter = 0;
        let newArray = [];
        let array = this.state.data;
        array.map((item) => {
            if (counter === index) {
                item = {...item, ACTIVE: "Y"};
                this.setState({cardDetails: item});
            } else {
                item = {...item, ACTIVE: "N"};
            }

            newArray.push(item);
            counter++;
        })

        this.setState({
            data: newArray,
        })

    }

    async onSubmit(language, navigation) {
        if (this.state.isMainScreen) {
            if (this.state.paymentAmount === "") {
                this.setState({errorPaymentAmount: language.error_payment_ammt});
            } else {
                this.setState({
                    isMainScreen: false
                })
            }
        } else {
            if (this.state.cardPin === "") {
                this.setState({errorCardPin: language.error_card_pin})
            } else {
                await this.VerifyCard();
            }
        }
    }

    backAction = () => {
        this.backEvent();
        return true;
    }

    backEvent() {
        const {isMainScreen} = this.state;
        if (isMainScreen) {
            this.props.navigation.goBack();
        } else {
            this.setState({isMainScreen: true});
        }
    }

    async VerifyCard() {
        this.setState({isProgress: true});
        await VERIFYCARDPINDETAIL(this.state.cardDetails.UNMASK_CARD_NO, this.state.cardPin, this.props)
            .then((response) => {
                console.log("response", response);
                this.qrPayment();
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    async qrPayment() {
        await QRPAYMENT(this.props.userDetails, this.props.route.params.qrVal, this.state.cardDetails, this.state.remarks,
            this.state.conAmt !== "" ? this.state.conAmt : "0.0",
            this.state.tipAmt !== "" ? this.state.tipAmt : "0.0", response, this.props)
            .then((response) => {
                console.log("response", response);
                this.setState({
                    isProgress: false,
                });
                this.props.navigation.navigate("Receipt");
            }, (error) => {
                this.setState({isProgress: false});
                console.log("error", error);
            });
    }

    getConAmt() {
        if (response.hasOwnProperty("TIPINDICATOR55") && response.TIPINDICATOR55 === "02") {
            this.setState({conAmt: response.CONFEEFIXED56});
        } else if (response.hasOwnProperty("TIPINDICATOR55") && response.TIPINDICATOR55 === "03") {
            let amt = this.state.paymentAmount * (response.CONFEEPERCENTAGE57 / 100);
            this.setState({conAmt: amt});
        }
    }


    paymentDetails(language) {
        return (
            <View style={{flex: 1, paddingBottom: 30}}>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.merchant_name}
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
                            merchantName: text
                        })}
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
                    <Text style={[CommonStyle.textStyle]}>
                        {language.merchant_city}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            merchantCity: Utility.userInput(text)
                        })}
                        value={this.state.merchantCity}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    /></View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.payment_amount}
                        {response.POIMETHOD01 !== "12" ?
                            <Text style={{color: themeStyle.THEME_COLOR}}> *</Text> : null}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            errorPaymentAmount: "",
                            paymentAmount: Utility.input(text, "1234567890.")
                        }, () => {
                            this.getConAmt()
                        })}
                        value={this.state.paymentAmount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        editable={response.POIMETHOD01 !== "12"}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    />
                </View>
                {this.state.errorPaymentAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorPaymentAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {response.hasOwnProperty("TIPINDICATOR55") && response.TIPINDICATOR55 !== "" ?
                    <View><View style={{
                        flexDirection: "row",
                        marginStart: 10,
                        marginEnd: 10,
                        height: Utility.setHeight(50),
                        alignItems: "center"
                    }}>
                        <Text style={[CommonStyle.textStyle, {flex: 1}]}>{language.conAmt}</Text>
                        <Text style={CommonStyle.textStyle}>{this.state.conAmt}</Text>
                    </View><View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                    </View> : null
                }
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.bill_number}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.billNumber}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                    />
                </View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.store_label}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.storeLabel}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    /></View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.terminal_label}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        value={this.state.terminalLabel}
                        multiline={false}
                        editable={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                    /></View>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                {response.hasOwnProperty("ADDICONDATAREQ6209") && response.ADDICONDATAREQ6209 !== "" ?
                    <View>
                        <View>
                            <View style={{
                                flexDirection: "row",
                                marginStart: 10,
                                marginEnd: 10,
                                height: Utility.setHeight(50),
                                alignItems: "center"
                            }}>
                                <Text style={[CommonStyle.textStyle, {flex: 1}]}>{language.mobile}</Text>
                                <Text style={CommonStyle.textStyle}>{this.props.userDetails.MOBILE_NO}</Text>
                            </View>
                            <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                        </View>
                        {response.ADDICONDATAREQ6209 !== "" ?
                            <View>
                                <View style={{
                                    flexDirection: "row",
                                    marginStart: 10,
                                    marginEnd: 10,
                                    height: Utility.setHeight(50),
                                    alignItems: "center"
                                }}>
                                    <Text style={[CommonStyle.textStyle, {flex: 1}]}>{language.email}</Text>
                                    <Text style={CommonStyle.textStyle}>{this.state.email}</Text>
                                </View>
                                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                            </View> : null}
                    </View>
                    : null
                }

                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.remarks}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
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
                        maxLength={30}/>
                </View>
                {this.state.error_remarks !== "" ?
                    <Text style={CommonStyle.errorStyle
                    }>{this.state.error_remarks}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text style={CommonStyle.mark_mandatory}>*{language.mark_field_mandatory}</Text>
                <View style={{marginStart: 10, marginEnd: 10}}>
                    <Text style={CommonStyle.themeMidTextStyle}>{language.notes}</Text>
                    <Text style={CommonStyle.themeTextStyle}>{language.payment_details_note1}</Text>
                </View>
            </View>
        )
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => {
                this.selectCard(index)
            }}>
                <View style={[styles.renderView, {
                    height: Utility.setHeight(55),
                    backgroundColor: item.isSelected ? "#f5dbdc" : "#b2b8ba"
                }]}>

                    <Image style={{
                        height: Utility.setHeight(55),
                        width: Utility.setWidth(63),
                        borderRadius: 5
                    }} resizeMode={"contain"}
                           source={{uri: "http://placehold.it/200x200"}}/>
                    <View style={{flex: 1, flexDirection: "column", justifyContent: "center"}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.BLACK,
                            fontSize: FontSize.getSize(12),
                            paddingLeft: 10,
                        }]}>{item.CARD_NAME}</Text>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.BLACK,
                            fontSize: FontSize.getSize(12),
                            paddingLeft: 10,
                        }]}>{item.SOURCE_NO}</Text>
                    </View>

                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                        marginEnd: 10,
                        tintColor: themeStyle.THEME_COLOR,
                    }} resizeMode={"contain"}
                           source={item.ACTIVE === "Y" ? require("../../resources/images/check.png") : require("../../resources/images/uncheck.png")}/>
                </View>
            </TouchableOpacity>
        )
    }

    bottomLine() {
        return (<View style={{
            height: 1,
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#D3D1D2"
        }}/>)

    }

    nextPaymentDetails(language) {
        return (
            <View>
                <View style={[{
                    backgroundColor: "#b2b8ba",
                    height: Utility.setHeight(50),
                    justifyContent: "center",
                    alignItems: "center"
                }]}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(12),
                    }]}>{language.payment_card}</Text>
                </View>
                <FlatList scrollEnabled={false}
                          data={this.state.data}
                          renderItem={this._renderItem}
                    // ItemSeparatorComponent={() => this.bottomLine()}
                    // ListFooterComponent={this.bottomLine()}
                          keyExtractor={(item, index) => index + ""}
                />
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.payment_amount}
                    </Text>
                    <TextInput
                        selectionColor={themeStyle.THEME_COLOR}
                        style={[CommonStyle.textStyle, {
                            alignItems: "flex-end",
                            textAlign: 'right',
                            flex: 1,
                            marginLeft: 10
                        }]}
                        placeholder={""}
                        onChangeText={text => this.setState({
                            errorPaymentAmount: "",
                            paymentAmount: Utility.userInput(text)
                        })}
                        value={this.state.paymentAmount}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        editable={false}
                    />
                </View>
                {this.state.errorPaymentAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorPaymentAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                {response.hasOwnProperty("TIPINDICATOR55") && response.TIPINDICATOR55 === "01" ? <View>
                    <View style={{
                        flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                        marginEnd: 10,
                    }}>
                        <Text style={[CommonStyle.textStyle]}>
                            {language.tipAmt}
                        </Text>
                        <TextInput
                            selectionColor={themeStyle.THEME_COLOR}
                            style={[CommonStyle.textStyle, {
                                alignItems: "flex-end",
                                textAlign: 'right',
                                flex: 1,
                                marginLeft: 10
                            }]}
                            placeholder={language.et_placeholder}
                            onChangeText={text => this.setState({
                                errorTipAmt: "",
                                tipAmt: Utility.input(text, "1234567890.")
                            })}
                            value={this.state.tipAmt}
                            multiline={false}
                            numberOfLines={1}
                            contextMenuHidden={true}
                            placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                            autoCorrect={false}
                            maxLength={10}/>
                    </View>
                    {this.state.errorTipAmt !== "" ?
                        <Text style={CommonStyle.errorStyle
                        }>{this.state.errorTipAmt}</Text> : null}
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>

                </View> : null}
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={CommonStyle.textStyle}>
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
                        placeholder={language.et_TransPlaceholder}
                        onChangeText={text => this.setState({
                            errorCardPin: "",
                            cardPin: Utility.userInput(text)
                        })}
                        value={this.state.cardPin}
                        multiline={false}
                        numberOfLines={1}
                        contextMenuHidden={true}
                        keyboardType={"number-pad"}
                        secureTextEntry={true}
                        placeholderTextColor={themeStyle.PLACEHOLDER_COLOR}
                        autoCorrect={false}
                        maxLength={4}/>
                </View>
                {this.state.errorCardPin !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorCardPin}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <Text
                    style={CommonStyle.mark_mandatory
                    }>*{language.mark_field_mandatory}
                </Text>
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
                        onPress={() => this.backEvent()}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.payment_details}</Text>
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

                {this.state.isMainScreen ? this.paymentDetails(language) : this.nextPaymentDetails(language)}
                <View style={{
                    flexDirection: "row",
                    marginStart: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10),
                    marginTop: Utility.setHeight(20),
                    marginBottom: Utility.setHeight(20),
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
                            borderColor: themeStyle.THEME_COLOR,
                            backgroundColor: themeStyle.WHITE
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
                        }}><Text
                            style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}> {language.next} </Text>
                        </View>
                    </TouchableOpacity>
                </View>

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
            tabBarLabel: this.props.language.city_pay
        });

    }

    componentWillUnmount() {
        if (Platform.OS === "android") {
            BackHandler.removeEventListener(
                "hardwareBackPress", this.backAction)
        }
    }

}

const styles =
    {
        renderView: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 5,
            marginBottom: 5,
            alignItems: "center"
        }
    }


const mapStateToProps = (state) => {
        return {
            userDetails: state.accountReducer.userDetails,
            langId: state.accountReducer.langId,
            language: state.accountReducer.language,
        };
    }
;

export default connect(mapStateToProps)(PaymentDetails);