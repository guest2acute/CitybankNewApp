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


class TransferCategory extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        console.log("language",language.bkash_account)
        this.state = {
            data: [
                {
                    id: "profile",
                    title: language.transfer_owncbl_acct,
                },
                {
                    id: "changeContact",
                    title: language.transfer_othercbl_acct,
                },
                {
                    id: "changePassword",
                    title: language.transfer_otherbank_acct,
                },
                {
                    id: "changeLoginPIN",
                    title: language.transfer_bkash,
                },
                {
                    id: "UploadDoc",
                    title: language.cash_by_code,
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

    moveScreen(item) {
        console.log(item)
        this.props.navigation.navigate("TransferHistory");
        /*switch (item.id) {
            case "profile":
                console.log("item",item.id)
                this.props.navigation.navigate("TransferHistory");
                break;
            case "changeTransPin":
                this.props.navigation.navigate("TransferHistory");
                break;
            case "changePassword":
                this.props.navigation.navigate("TransferHistory");
                break;
            case "changeLoginPIN":
                this.props.navigation.navigate("TransferHistory");
                break;
            case "changeContact":
                this.props.navigation.navigate("TransferHistory");
                break;
            case "UploadDoc":
                this.props.navigation.navigate("TransferHistory");
                break;
        }*/
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
        console.log("item is this ",item)
        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate("TransferHistory")}>
                <View style={{
                    flexDirection: "row",
                    marginTop: 17,
                    marginBottom: 17,
                    paddingLeft: 10,
                    paddingRight: 10,
                    alignItems: "center"
                }}>
                    <Text style={[CommonStyle.labelStyle, {
                        color: themeStyle.THEME_COLOR,
                        fontSize: FontSize.getSize(12),
                        flex: 1,
                    }]}>{item.title}</Text>
                    <Image style={{
                        height: Utility.setHeight(12),
                        width: Utility.setWidth(30),
                        tintColor: "#b5bfc1"
                    }} resizeMode={"contain"}
                           source={require("../resources/images/arrow_right_ios.png")}/>
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

    render() {
        let language = this.props.language;
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
                    <Text style={CommonStyle.title}>{language.transfer_title}</Text>
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
                <View style={{alignItems:"center",paddingTop:10}}>
                <Text style={styles.title}>{language.transfer_subtitle}</Text>
                    <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
                </View>
                    <View>
                    <FlatList data={this.state.data}
                              renderItem={this._renderItem}
                              ItemSeparatorComponent={() => this.bottomLine()}
                              ListFooterComponent={this.bottomLine()}
                              keyExtractor={(item, index) => index + ""}
                    />
                </View>
            </View>
        );
    }
}


const styles = {
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(14),
        color: themeStyle.THEME_COLOR
    },
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(TransferCategory);

