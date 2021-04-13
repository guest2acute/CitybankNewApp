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
    Alert, Dimensions, SectionList
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
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import {unicodeToChar} from "../Requests/CommonRequest";

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
            updateTitle: props.route.params.title,
            data: [{
                title: 'Favorite Transaction',
                items: [{ id: 0,title: 'Send Money To Main'},
                    { id: 1,title: 'Transfer to Other Account'}, { id: 2,title: 'Send To Son'}
                ]
            },
                {
                    title: 'Favorite Payments',
                    items: [{id: 0,title: 'Pay Internet Vendor'}]
                }
            ],
            contentVisible: false
        }
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

    level1(node) {
        return (
            <View key={"level1"} style={styles.level2}>
                <Text
                    style={[CommonStyle.midTextStyle, {}]}>{unicodeToChar(node.title)}</Text>
            </View>)
    }

    deleteValue(data,items) {
        console.log(this.state.data)
        let tempArray=[];
        let object=null;

        for (let i=0; i < data.length; i++) {
            console.log("items array",data[i].items)
            let filterArray = data[i].items.filter(e => e.id !== items.id)
             object = {title: data[i].title,items:filterArray};
            tempArray.push(object);
        }
        console.log("tempArray",tempArray)
        this.setState({
            data:tempArray
        })
    }


    level2(node) {
        return (
            <View style={styles.rowFront}>
                <Text
                    style={[CommonStyle.midTextStyle, {flex: 1}]}>{unicodeToChar(node.title)}</Text>
                <TouchableOpacity onPress={() => this.deleteValue(this.state.data,node)}  style={{
                    width: 25,
                    height: 25,
                }}>
                    <Image style={{
                        width: 20,
                        height: 20,
                        tintColor: themeStyle.THEME_COLOR,
                    }} resizeMode={"contain"} source={require("../../resources/images/icon-close.png")}/>
                </TouchableOpacity>
            </View>
        )
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
                <View>
                    <NestedListView
                        data={this.state.data}
                        getChildrenName={(node) => 'items'}
                        onNodePressed={(node) => this.setState({contentVisible: !this.state.contentVisible})}
                        renderNode={(node, level, isLastLevel) => {
                            return (
                                <NestedRow
                                    paddingLeftIncrement={0}
                                    level={level}>
                                    {level === 1 ? this.level1(node) : level === 2 ? this.level2(node) : null}
                                </NestedRow>
                            )
                        }
                        }
                    />
                </View>
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
    level1: {
        backgroundColor: themeStyle.THEME_COLOR,
        height: Utility.setHeight(35),
        alignItems: "center",
        paddingStart: 10,
        paddingEnd: 10,
        flexDirection: "row",
        marginTop: 10,
    },
    level2: {
        backgroundColor: themeStyle.TITLE_BG,
        height: Utility.setHeight(35),
        alignItems: "center",
        paddingStart: 10,
        paddingEnd: 10,
        marginTop: 10,
        flexDirection: "row"
    },
    level3: {
        backgroundColor: themeStyle.WHITE,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 13,
        marginBottom: 13
    },
    rowFront: {
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: themeStyle.WHITE,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        flex: 1
    }
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

