import React, {Component} from "react";
import {
    Platform,
    StatusBar,
    View,
    Image,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    SafeAreaView,
    FlatList,
    Alert
} from "react-native";

import {actions} from "../../../redux/actions";
import {connect} from "react-redux";
import Config from "../../../config/Config";

import themeStyle from "../../../resources/theme.style";
import Utility from "../../../utilize/Utility";
import CommonStyle from "../../../resources/CommonStyle";
import fontStyle from "../../../resources/FontStyle";
import FontSize from "../../../resources/ManageFontSize";
import {AddBeneficiary, DELETEBENF, GETBENF} from "../../Requests/RequestBeneficiary";
import {BusyIndicator} from "../../../resources/busy-indicator";

/**
 * splash page
 */

let screenName, title, benfType;

class ViewDeleteBeneficiary extends Component {
    constructor(props) {
        super(props);
        screenName = this.props.route.params.screenName;
        title = this.props.route.params.addTitle;
        benfType = this.props.route.params.benfType;
        this.state = {
            isProgress: false,
            title: props.route.params.title,
            data: null,
        }
    }

    getBeneficiary() {
        this.setState({isProgress: true});
        GETBENF(this.props.userDetails, benfType, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                data: response
            });
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }


    async componentDidMount() {
        if (Platform.OS === "android") {
            this.focusListener = this.props.navigation.addListener("focus", () => {
                StatusBar.setTranslucent(false);
                StatusBar.setBackgroundColor(themeStyle.THEME_COLOR);
                StatusBar.setBarStyle("light-content");
            });
        }
        this.props.navigation.setOptions({
            tabBarLabel: this.props.language.transfer
        });

        this.getBeneficiary();
    }

    _renderItem = ({item}) => (
        <View style={styles.rowFront}>
            <View style={{flexDirection: "row", justifyContent: "space-between", marginStart: 10, marginEnd: 10}}>
                <Text style={CommonStyle.themeMidTextStyle}>{item.NICK_NAME}</Text>
                <Text style={CommonStyle.themeMidTextStyle}>{item.CURRENCY}</Text>
            </View>
            <View style={{flexDirection: "column", justifyContent: "space-around", marginStart: 10, marginEnd: 10}}>
                {benfType !== "E" && item.TO_ACCT_NM !== "" ?
                    <Text style={CommonStyle.midTextStyle}>{item.TO_ACCT_NM}</Text> : null}
                {benfType !== "E" && item.TO_ACCT_NO !== "" ? <Text style={CommonStyle.textStyle}>{item.TO_ACCT_NO}</Text> : null}
                {item.TO_EMAIL_ID !== "" ?
                    <Text style={CommonStyle.textStyle}>{item.TO_EMAIL_ID}</Text> : null}
                {item.TO_CONTACT_NO !== "" ?
                    <Text style={CommonStyle.textStyle}>{item.TO_CONTACT_NO}</Text> : null}
            </View>
            <TouchableOpacity onPress={() => this.deleteBeneficiary(item)} style={{
                width: 25, position: "absolute",
                right: Utility.setWidth(10),
                top: Utility.setHeight(50),
                height: 25
            }}>
                <Image style={{
                    width: 20,
                    height: 20,
                    tintColor: themeStyle.THEME_COLOR,
                }} resizeMode={"contain"} source={require("../../../resources/images/icon-close.png")}/>
            </TouchableOpacity>
        </View>
    )


    deleteBeneficiary = (item) => {
        console.log("data", item);
        Alert.alert(
            Config.appName,
            this.props.language.deleteAlert,
            [
                {text: this.props.language.no_txt},
                {text: this.props.language.yes_txt, onPress: () => this.deleteValue(item)},
            ]
        );
    }

    deleteValue(item) {
        console.log("item",item);
        this.setState({isProgress: true});
        DELETEBENF(this.props.userDetails, benfType, item, this.props).then(response => {
            console.log("response", response);
            this.setState({
                isProgress: false,
                data: this.state.data.filter(e => e !== item)
            });
            Utility.alert(response.MESSAGE);
        }).catch(error => {
            this.setState({isProgress: false});
            console.log("error", error);
        });
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: "#F5F5F5"}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <TouchableOpacity
                        style={CommonStyle.toolbar_back_btn_touch}
                        onPress={() => this.props.navigation.goBack(null)}>
                        <Image style={CommonStyle.toolbar_back_btn}
                               source={Platform.OS === "android" ?
                                   require("../../../resources/images/ic_back_android.png") :
                                   require("../../../resources/images/ic_back_ios.png")}/>
                    </TouchableOpacity>
                    <Text style={[CommonStyle.title, {flex: 1}]}>{this.state.title}</Text>
                    <TouchableOpacity onPress={() => this.redirect()}
                                      style={{}}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(25),
                            height: Utility.setHeight(25),
                            tintColor: themeStyle.WHITE
                        }}
                               source={require("../../../resources/images/add_icon.png")}/>
                    </TouchableOpacity>
                </View>
                {this.state.data !== null && this.state.data.length > 0 ?
                    <FlatList
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index + ""}
                    /> :
                    this.state.data !== null && this.state.data.length === 0 ?
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                            <Text style={CommonStyle.textStyle}>{language.noBeneficiaryAdded}</Text>
                        </View> : null
                }
                <BusyIndicator visible={this.state.isProgress}/>
            </View>
        );
    }

    redirect() {
        this.props.navigation.navigate(screenName, {title: title});
    }
}


const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingBottom: 7
    },
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(14),
        color: themeStyle.THEME_COLOR
    },
    rowFront: {
        // alignItems: 'center',
        backgroundColor: themeStyle.WHITE,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 10,
        paddingTop: 10,
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 5,
        flex: 1
    },
    rowBack: {
        backgroundColor: "#FF0000",
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: "#F5F5F5",
        borderBottomWidth: 5,
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: Utility.setWidth(75),
    },
    backRightBtnLeft: {
        right: Utility.setWidth(75),
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ViewDeleteBeneficiary);

