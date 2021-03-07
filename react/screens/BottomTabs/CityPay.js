import React, {Component} from "react";
import {
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Utility from "../../utilize/Utility";
import {BusyIndicator} from "../../resources/busy-indicator";
import FontSize from "../../resources/ManageFontSize";


class CityPay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrId: "",
            isProgress: false
        }
    }

    onSuccess = e => {
        if (e.type === "QR_CODE") {
            Utility.alert("data-" + e.data);
            //this.scanner.reactivate();
        } else {
            Utility.alert(e.type + "-" + e.data);
        }
        console.log("e.data", e);
    };

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
                    <Text style={CommonStyle.title}>{language.city_pay}</Text>
                </View>
                <View style={{
                    paddingLeft: Utility.setWidth(20),
                    paddingRight: Utility.setWidth(20),
                    paddingTop: 5,
                    paddingBottom: Utility.setHeight(5),
                    justifyContent: "center",
                    backgroundColor: themeStyle.BG_COLOR,
                    width: Utility.getDeviceWidth()
                }}>
                    <Text style={CommonStyle.labelStyle}>{language.scanQrCode}</Text>
                </View>
                <View style={{flex: 1}}>
                    <QRCodeScanner
                        onRead={this.onSuccess}
                        cameraStyle={styles.cameraStyle}
                        flashMode={RNCamera.Constants.FlashMode.auto}
                        reactivate
                        ref={(node) => {
                            this.scanner = node
                        }}
                    />

                    {this.bottomView(language)}

                </View>

                <BusyIndicator visible={this.state.isProgress}/>
            </View>)
    }

    submit(language) {
        if (this.state.qrId === "") {
            Utility.alert(language.errorQRId);
        } else {

        }
    }

    bottomView(language) {
        return (<View key={"bottomView"} style={styles.bottomView}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    marginLeft: Utility.setWidth(10),
                    marginRight: Utility.setWidth(10)
                }}>
                    <View style={{flexDirection: "row"}}>
                        <Image style={{flex: 1, height: Utility.setHeight(40)}}
                               source={require("../../resources/images/american.jpg")} resizeMode={"contain"}/>
                        <Image style={{flex: 1, height: Utility.setHeight(40)}}
                               source={require("../../resources/images/visa_qr.jpg")} resizeMode={"contain"}/>
                        <Image style={{flex: 1, height: Utility.setHeight(40)}}
                               source={require("../../resources/images/mastercard.jpg")} resizeMode={"contain"}/>
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
                    <View style={{marginTop: 10, marginBottom: 10}}>
                        <Text style={[CommonStyle.midTextStyle, {
                            color: themeStyle.THEME_COLOR,
                            marginBottom: 5
                        }]}>{language.note}</Text>
                        <Text
                            style={[CommonStyle.textStyle, {fontSize: FontSize.getSize(11),}]}>{language.scanQrNote}</Text>
                    </View>
                </View>

            </ScrollView>
        </View>)
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
            tabBarLabel: this.props.language.city_pay
        });
    }
}

let styles = {
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
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
    cameraStyle: {
        height: '100%',
        width: '100%',
    },
    textView: {
        marginStart: 10, color: themeStyle.BLACK
    },
    bottomView: {
        maxHeight: Utility.getDeviceHeight() / 4,
        position: "absolute", bottom: 0, paddingLeft: Utility.setWidth(20), paddingRight: Utility.setWidth(20),
        paddingTop: Utility.setHeight(10),
        paddingBottom: Utility.setHeight(10), backgroundColor: themeStyle.BG_COLOR, width: Utility.getDeviceWidth()
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(CityPay);

