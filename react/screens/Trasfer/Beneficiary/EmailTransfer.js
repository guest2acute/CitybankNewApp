import React, {Component} from "react";
import {FlatList, Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import themeStyle from "../../../resources/theme.style";
import CommonStyle from "../../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../../utilize/Utility";
import FontSize from "../../../resources/ManageFontSize";
import fontStyle from "../../../resources/FontStyle";

class EmailTransfer extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        this.state = {
            options: [
                {id: 0, title: props.language.ownAccount, selected: false},
                {id: 1, title: props.language.cityAccount, selected: true},
            ],
            data: [
                {
                    nickname: "Ebad Vai",
                    transferAmount: "10.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "8-FEB-2021 06:36:21 PM"
                },
                {
                    nickname: "Masvm",
                    transferAmount: "470.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "7-APR-2019 11:06:50 PM"
                },
                {
                    nickname: "Onn bkash",
                    transferAmount: "500.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "31-MARCH-2019 03:53:15 PM"
                },
                {
                    nickname: "test",
                    transferAmount: "500.00",
                    beneficiary_email_address: "test123@gmail.com",
                    ValidTill: "27-MARCH-2019 07:36:21 PM"
                }
            ],
            stateVal: 0,
        }
    }


    async changeCard(cardCode) {
        this.setState({
            stateVal: cardCode
        })
    }

    _renderItem = ({item, index}) => {
        return (
             <TouchableOpacity onPress={()=>this.props.navigation.navigate("EmailTransferDetails")}>
            <View style={{
                flexDirection: "row", justifyContent: "space-between",
                width: Utility.getDeviceWidth(),
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
            }}>
                <View style={{flex: 0.8, flexDirection: "column", marginStart: 10, marginEnd: 10}}>
                    <Text style={[CommonStyle.textStyle, {}]}>{item.nickname}</Text>
                    <Text style={[CommonStyle.textStyle, {}]}>{item.beneficiary_email_address}</Text>
                    <Text style={[CommonStyle.textStyle, {
                        fontSize: FontSize.getSize(12),
                        color: themeStyle.PLACEHOLDER_COLOR
                    }]}>
                        {item.ValidTill}
                    </Text>
                </View>
                <View style={{flex: 0.2,justifyContent:"center"}}>
                    <Text style={[CommonStyle.textStyle, {
                        color: themeStyle.THEME_COLOR, marginStart: 10, marginEnd: 10, textAlign: "center",alignItems:"center"
                    }]}>{item.transferAmount}</Text>
                </View>
            </View>
             </TouchableOpacity>
        )
    }


    sendOption(language) {
        return (
            <View style={{marginTop: 10, marginStart: 10, marginEnd: 10}}>
                <Text>{language.send_message}</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("EmailTransferScreen")}>
                    <View style={{
                        marginStart: 10, marginEnd: 10, marginTop: 10, borderColor: themeStyle.BORDER,
                        borderRadius: 5,
                        overflow: "hidden",
                        width: Utility.setWidth(100),
                        alignItems: 'center',
                        borderWidth: 2
                    }}>
                        <Image style={{
                            height: Utility.setHeight(50),
                            width: Utility.setWidth(50),
                            marginTop: 20,
                            marginBottom: 20,
                            marginStart: 20,
                            marginEnd: 20,
                            alignSelf: "flex-start"
                        }} resizeMode={"contain"}
                               source={require("../../../resources/images/message.png")}/>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }

    waitingOption(language) {
        return (
            <View style={{}}>
                <View style={[CommonStyle.selectionBg, {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    paddingBottom: 10
                }]}>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK
                    }]}>
                        {language.description}
                    </Text>
                    <Text style={[CommonStyle.midTextStyle, {
                        color: themeStyle.BLACK,
                    }]}>
                        {language.amount}
                    </Text>
                </View>
                <FlatList data={this.state.data}
                          renderItem={this._renderItem}
                          keyExtractor={(item, index) => index + ""}
                />

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
                    <Text style={CommonStyle.title}>{language.email_transfer}</Text>
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
                <View style={[styles.headerLabel, {
                    marginTop: 10, marginStart: 10,
                    marginEnd: 10,
                }]}>
                    <TouchableOpacity
                        onPress={() => this.changeCard(0)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),,
                            paddingLeft: 70,
                            paddingRight: 70,
                            justifyContent: "center",
                            borderBottomLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            borderTopLeftRadius: this.state.stateVal === 1 ? 3 : 0,
                            backgroundColor: this.state.stateVal === 0 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 0 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.send}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.changeCard(1)}
                        style={{
                            height: "100%",
                            //width: Utility.setWidth(65),
                            paddingLeft: 70,
                            paddingRight: 70,
                            justifyContent: "center",
                            borderBottomRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            borderTopRightRadius: this.state.stateVal === 1 ? 5 : 0,
                            backgroundColor: this.state.stateVal === 1 ? themeStyle.THEME_COLOR : "#F4F4F4",
                        }}>
                        <Text style={[styles.langText, {
                            fontFamily: fontStyle.RobotoMedium,
                            fontSize: FontSize.getSize(11),
                            color: this.state.stateVal === 1 ? themeStyle.WHITE : themeStyle.BLACK
                        }]}>{this.props.language.waiting}</Text>
                    </TouchableOpacity>
                </View>
                {this.state.stateVal === 0 ? this.sendOption(language) : this.waitingOption(language)}
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
            tabBarLabel: this.props.language.transfer
        });
    }
}

const styles = {
    headerLabel: {
        flexDirection: "row",
        //backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(40),
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeStyle.WHITE,
        overflow: "hidden"
    },

}
const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(EmailTransfer);

