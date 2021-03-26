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
import RadioForm from "react-native-simple-radio-button";

class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isProgress: false,
            nickname: "",
            error_nickname: "",
            isMainScreen: true,
            emailTxt: "",
            errorEmail: "",
            mobileNo: "",
            errorMobileNo: "",
            merchantName: "",
            merchantCity: "",
            paymentAmount: "",
            grandTotal: "",
            billNumber: "",
            storeLabel: "",
            terminalLabel: "",
            remarks: "",
            error_remarks: "",
            errorPaymentAmount: "",
            errorCardPin: "",
            cardPin: "",
            otp_type: 0,
            data: [
                {
                    cardName: "AMEX CITY MAXX DEBIT",
                    cardNumber: "371599****0857",
                    isSelected:true,
                    images: "http://placehold.it/200x200"
                },
                {
                    cardName: "MASTER CARD DEBIT",
                    cardNumber: "371599****0857",
                    isSelected:false,
                    images: "http://placehold.it/200x200"
                },
                {
                    cardName: "VISA PLATINUM",
                    cardNumber: "371599****0857",
                    isSelected:false,
                    images: "http://placehold.it/200x200"
                },
                {
                    cardName: "MASTER CARD DEBIT",
                    cardNumber: "371599****0857",
                    isSelected:false,
                    radio_props: [{label: "", value: 0}],
                    images: "http://placehold.it/200x200"
                },
                {
                    cardName: "VISA PLATINUM",
                    cardNumber: "371599****0857",
                    isSelected:false,
                    images: "http://placehold.it/200x200"
                }
            ]
        }
    }

    otpUpdate( index) {
        console.log("value", index)
        let counter = 0;
        let newArray = [];
        let array = this.state.data;
        array.map((item) => {
            console.log("test count",counter === index)
            if (counter === index) {
                item = {...item, isSelected:true}
            } else {
                item = {...item, isSelected:false}
            }
            console.log("item", item)
            newArray.push(item)
            counter++;
        })

        this.setState({
            data: newArray,
        })

    }

    onSubmit(language, navigation) {
        console.log("submit")
        if (this.state.isMainScreen) {
            if (this.state.paymentAmount === "") {
                console.log("is main screen")
                this.setState({errorPaymentAmount: language.error_payment_ammt});
            } else {
                this.setState({
                    isMainScreen: false
                })
            }
        } else{
            if (this.state.cardPin === "") {
                this.setState({errorCardPin: language.error_card_pin})
            }else{
                this.props.navigation.navigate("Receipt")
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
            console.log("1");
            this.props.navigation.goBack();
        } else {
            console.log("2");
            this.setState({isMainScreen: true})
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
                    />
                </View>
                {this.state.errorPaymentAmount !== "" ?
                    <Text style={CommonStyle.errorStyle}>{this.state.errorPaymentAmount}</Text> : null}
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                <View style={{
                    flexDirection: "row", height: Utility.setHeight(50), marginStart: 10, alignItems: "center",
                    marginEnd: 10,
                }}>
                    <Text style={[CommonStyle.textStyle]}>
                        {language.grandTotal_bdt}
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
                        value={this.state.grandTotal}
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
                        onChangeText={text => this.setState({
                            storeLabel: Utility.userInput(text)
                        })}
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
                        onChangeText={text => this.setState({
                            terminal_label: Utility.userInput(text)
                        })}
                        value={this.state.terminalLabel}
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
        console.log(console.log("otp type is this", item.radio_props));
        return (
            <TouchableOpacity onPress={() => { this.otpUpdate(index)
            }}>
                <View style={[styles.renderView, {height: Utility.setHeight(55), backgroundColor:item.isSelected?"#f5dbdc":"#b2b8ba"}]}>

                    <Image style={{
                        height: Utility.setHeight(55),
                        width: Utility.setWidth(63),
                        borderRadius:5
                    }} resizeMode={"contain"}
                           source={{uri: item.images}}/>
                    <View style={{ flex:1,flexDirection: "column", justifyContent: "center"}}>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.BLACK,
                            fontSize: FontSize.getSize(12),
                            paddingLeft:10,
                        }]}>{item.cardName}</Text>
                        <Text style={[CommonStyle.labelStyle, {
                            color: themeStyle.BLACK,
                            fontSize: FontSize.getSize(12),
                            paddingLeft:10,
                        }]}>{item.cardNumber}</Text>
                    </View>

                    <Image style={{
                        height: Utility.setHeight(20),
                        width: Utility.setWidth(20),
                        marginEnd:10,
                        tintColor:themeStyle.THEME_COLOR,
                    }} resizeMode={"contain"}
                           source={item.isSelected?require("../../resources/images/check.png"):require("../../resources/images/uncheck.png")}/>
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
                    backgroundColor:"#b2b8ba",
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

    /*   componentDidUpdate(prevProps, prevState, snapshot) {
           console.log("this.props.language.account", this.props.language.account);
           if (prevProps.langId !== this.props.langId) {
               this.props.navigation.setOptions({
                   tabBarLabel: this.props.language.transfer
               });
           }
       }*/

}

const styles = {
    renderView: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5,
        marginBottom: 5,
        alignItems: "center",
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