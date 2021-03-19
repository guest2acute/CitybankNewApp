import React, {Component} from "react";
import {Platform, StatusBar, View, Image, Text, TouchableOpacity, SafeAreaView, FlatList} from "react-native";

import {actions} from "../redux/actions";
import {connect} from "react-redux";
import Config from "../config/Config";
import themeStyle from "../resources/theme.style";
import Utility from "../utilize/Utility";
import CommonStyle from "../resources/CommonStyle";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";
import StorageClass from "../utilize/StorageClass";

/**
 * splash page
 */
let imeiNo = "";

class TransferHistory extends Component {
    constructor(props) {
        console.log("transfer history is this")
        super(props);
        let language = props.language;
        this.state = {
            data: [
                {
                    description: "Self Account Transfer to 2702240346001",
                    amount: "10.00",
                    date: "8-FEB-2021 06:36:21 PM"
                },
                {
                    description: "Self Account Transfer to 2252595128001",
                    amount: "470.00",
                    date: "7-APR-2019 11:06:50 PM"
                },
                {
                    description: "Self Account Transfer to 2401969529001",
                    amount: "500.00",
                    date: "31-MARCH-2019 03:53:15 PM"
                },
                {
                    description: "Self Account Transfer to 2702240346001",
                    amount: "500.00",
                    date: "27-MARCH-2019 07:36:21 PM"
                }
            ]
        }
    }

    /**
     * redirect to landing screen
     */

    async componentDidMount() {
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

    async redirectProfile() {
        let loginPref = await StorageClass.retrieve(Config.LoginPref);
        console.log("profile", loginPref);
        if (loginPref === null || loginPref === "") {
            loginPref = "0";
        }
        this.props.navigation.navigate("Profile", {loginPref: loginPref});
    }

    _renderItem = ({item, index}) => {
        return (
                <View style={{flexDirection:"row",justifyContent:"space-between",
                    width: Utility.getDeviceWidth(),
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: index % 2 === 0 ? null : themeStyle.SEPARATOR
                }}>
                    <View style={{flex:0.8,flexDirection:"column",marginStart:10,marginEnd:10}}>
                    <Text style={[CommonStyle.textStyle, {
                    }]}>{item.description}</Text>
                    <Text style={[CommonStyle.textStyle, {
                        fontSize: FontSize.getSize(12),
                        color:themeStyle.PLACEHOLDER_COLOR
                    }]}>
                        {item.date}
                    </Text>
                    </View>
                    <View style={{flex:0.2}}>
                    <Text style={[CommonStyle.textStyle, {
                        color:themeStyle.THEME_COLOR,marginStart:10,marginEnd:10,textAlign:"center"
                    }]}>{item.amount}</Text>
                    </View>
                </View>
        )
    }

    render() {
        let language = this.props.language;
        console.log("render titile",language.transfer_title)
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={CommonStyle.title}>{language.transfer_history}</Text>
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
                               source={require("../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={[CommonStyle.selectionBg,{flexDirection:"row",justifyContent:"space-between",paddingTop:10,paddingBottom:10}]}>
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
                    <View>
                    <FlatList data={this.state.data}
                              renderItem={this._renderItem}
                              //ItemSeparatorComponent={() => this.bottomLine()}
                              //ListFooterComponent={this.bottomLine()}
                              keyExtractor={(item, index) => index + ""}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(TransferHistory);

