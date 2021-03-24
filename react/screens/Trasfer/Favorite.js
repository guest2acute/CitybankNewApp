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
    Alert, Dimensions
} from "react-native";

import {actions} from "../../redux/actions";
import {connect} from "react-redux";
import Config from "../../config/Config";

import themeStyle from "../../resources/theme.style";
import Utility from "../../utilize/Utility";
import CommonStyle from "../../resources/CommonStyle";
import fontStyle from "../../resources/FontStyle";
import FontSize from "../../resources/ManageFontSize";
import StorageClass from "../../utilize/StorageClass";
import Swipeable from 'react-native-swipeable-row';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

/**
 * splash page
 */
let imeiNo = "";

class Favorite extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        console.log("language", language.bkash_account)
        this.state = {
            data: [
                {
                    id: 0,
                    title: language.Donation,
                    description: language.transfer_bkash
                },
                {
                    id: 1,
                    title: language.Donation,
                    description: language.transfer_bkash
                }
            ],
            updateTitle: props.route.params.title
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
            tabBarLabel: this.props.language.transfer
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


    _renderItem = (data, rowMap) => (
        <View>
            <TouchableOpacity
                // onPress={() => rowMap[data.item.id].closeRow()}
                style={styles.rowFront}>
                <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginStart: 10,
                        marginEnd: 10
                    }}>
                        <Text style={CommonStyle.textStyle}>{data.item.title}</Text>
                        <Text style={CommonStyle.textStyle}>{data.item.description}</Text>
                    </View>
                    <View>
                        <Image style={{
                            height: Utility.setHeight(12),
                            width: Utility.setWidth(30),
                            tintColor: "#b5bfc1"
                        }} resizeMode={"contain"}
                               source={require("../../resources/images/arrow_right_ios.png")}/>
                    </View>
                </View>
            </TouchableOpacity>
        </View>

    )

    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    deleteRow = (data, rowMap) => {
        Alert.alert(
            Config.appName,
            this.props.language.deleteAlert,
            [
                {text: this.props.language.no_txt},
                {text: this.props.language.yes_txt, onPress: () => this.deleteValue(data)},
            ]
        );
    }

    deleteValue(data) {
        const filterArray = this.state.data.filter(e => e.id !== data.item.id)
        this.setState({data: filterArray})
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
                                   require("../../resources/images/ic_back_android.png") : require("../../resources/images/ic_back_ios.png")}/>
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
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems: "center", paddingTop: 10, paddingBottom: 10}}>
                    <Text style={styles.title}>{language.favoriteTitle}</Text>
                </View>
                    <SwipeListView
                         disableRightSwipe={true}
                        data={this.state.data}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index + ""}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={styles.rowBack} onStartShouldSetResponder={
                                () => this.closeRow(rowMap, data.item.id)
                            }>
                               {/* <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnLeft]}
                                    onPress={() => this.closeRow(rowMap, data.item.id)}
                                >
                                    <Text style={styles.backTextWhite}>Close</Text>
                                </TouchableOpacity>*/}
                                <TouchableOpacity
                                    style={[styles.backRightBtn, styles.backRightBtnRight]}
                                    onPress={() => this.deleteRow(data, rowMap)}
                                >
                                    <Image style={{
                                        height: Utility.setHeight(22),
                                        width: Utility.setWidth(30),
                                        tintColor: themeStyle.WHITE
                                    }} resizeMode={"contain"}
                                           source={require("../../resources/images/trash.png")}/>
                                </TouchableOpacity>
                            </View>
                        )}
                        leftOpenValue={75}
                        // rightOpenValue={-300}
                        rightOpenValue={-Utility.getDeviceWidth()}
                    />
            </View>
        );
    }
}

const styles = {
    viewStyles: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: themeStyle.BG_COLOR,
    },
    rowBack: {
        backgroundColor: themeStyle.THEME_COLOR,
        flex: 1,
        // paddingLeft: 25,
    },
    backRightBtn: {
        backgroundColor: "yellow",
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnRight: {
        backgroundColor: themeStyle.THEME_COLOR,
        right: 0,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backTextWhite: {
        color: '#FFF',
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
        flex:1,
        backgroundColor: themeStyle.WHITE,
        borderBottomColor: themeStyle.SEPARATOR,
        borderTopColor: themeStyle.SEPARATOR,
        borderTopWidth: 1,
        justifyContent: "center",
        borderBottomWidth: 1,
        height: 50,
    },
}


const mapStateToProps = (state) => {
    return {
        userDetails: state.accountReducer.userDetails,
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};
const rightButtons = [
    <TouchableOpacity style={{
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 20
    }}><Text>Delete</Text></TouchableOpacity>,
];

export default connect(mapStateToProps)(Favorite);

