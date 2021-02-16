/*Example of Expandable ListView in React Native*/
import React, {Component} from 'react';
//import react in our project
import {
    LayoutAnimation,
    Image,
    StyleSheet,
    View,
    Text,
    ScrollView,
    UIManager,
    TouchableOpacity,
    Platform, SafeAreaView, StatusBar,
} from 'react-native';
//import basic react native components
import NestedListView, {NestedRow} from 'react-native-nested-listview'
import CommonStyle from "../resources/CommonStyle";
import themeStyle from "../resources/theme.style";
import Utility from "../utilize/Utility";
import {connect} from "react-redux";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";

const data = [{
    title: 'CityTouch Conventional Banking',
    items: [{
        title: 'Current/Savings Accounts',
        items: [{PRODUCTNAME: 'GENERAL SAVINGS-STAFF A/C', ACCOUNTORCARDNO: '2252742574001'}]
    },
    ]
},
    {
        title: 'CityTouch Islamic Banking',
        items: [{
            title: 'Credit Card Accounts',
            items: [{PRODUCTNAME: 'Gold Staff Dual Primary', ACCOUNTORCARDNO: '376948010808307'},
                {PRODUCTNAME: 'Agora Co-Brand Gold Staff Primary', ACCOUNTORCARDNO: '376948010808307'},
                {PRODUCTNAME: 'Biman Co-Brand Gold Staff Primary', ACCOUNTORCARDNO: '376948010808307'},
                {PRODUCTNAME: 'VISA Classic Debit - Staff', ACCOUNTORCARDNO: '376948010808307'}]
        }]
    }
]

class ExpandList extends Component {
    constructor() {
        super();
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
        this.state = {dataList: data, contentVisible: false};
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
            tabBarLabel: this.props.language.account
        });
    }


    level1(node) {
        return (
            <View style={{
                backgroundColor: themeStyle.THEME_COLOR,
                height: Utility.setHeight(35),
                alignItems: "center",
                marginTop:10,
                paddingStart: 10,
                paddingEnd: 10,
                flexDirection: "row"
            }}>
                <Text
                    style={[CommonStyle.midTextStyle, {color: themeStyle.WHITE}]}>{node.title}</Text>
            </View>)
    }

    level2(node) {
        return (<View>
            <View style={{
                backgroundColor: themeStyle.TITLE_BG,
                height: Utility.setHeight(35),
                alignItems: "center",
                paddingStart: 10,
                paddingEnd: 10,
                flexDirection: "row"
            }}>
                <Text
                    style={[CommonStyle.midTextStyle, {flex: 1}]}>{node.title}</Text>
                <Text style={[CommonStyle.midTextStyle]}>{this.props.language.avail_balance}</Text>
            </View>
        </View>)
    }

    level3(account) {
        return (
            <View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("AccountDetails")}>
                    <View style={{
                        backgroundColor: themeStyle.WHITE,
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 13,
                        marginBottom: 13
                    }}>
                        <Text style={CommonStyle.midTextStyle}>{account.PRODUCTNAME}</Text>
                        <View style={{flexDirection: "row", marginTop: 2}}>
                            <Text style={[CommonStyle.textStyle, {
                                flex: 1,
                                color: themeStyle.DIMCOLOR
                            }]}>{account.ACCOUNTORCARDNO}</Text>
                            <TouchableOpacity onPress={() => this.updateBalance(account, "10000")}>
                                <Text style={[CommonStyle.textStyle, {
                                    color: themeStyle.THEME_COLOR
                                }]}>{account.balance ? account.balance : this.props.language.view_balance}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{height: 1, backgroundColor: themeStyle.SEPARATOR}}/>
            </View>)
    }


    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[styles.toolbar, {marginBottom: 10}]}>
                    <Image resizeMode={"contain"} style={{width: Utility.setWidth(90), height: Utility.setHeight(50)}}
                           source={require("../resources/images/citytouch_header.png")}/>
                    <TouchableOpacity
                        style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                            position: "absolute",
                            right: Utility.setWidth(10),
                            top: Utility.setHeight(15),
                        }}
                        onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(35),
                            height: Utility.setHeight(35),
                        }}
                               source={require("../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                    <Text style={styles.title}>{language.goodEvening}</Text>
                </View>

                <NestedListView
                    data={data}
                    getChildrenName={(node) => 'items'}
                    onNodePressed={(node) => this.setState({contentVisible: !this.state.contentVisible})}
                    renderNode={(node, level, isLastLevel) => {
                        console.log("level", level + "-" + node);
                        return (
                            <NestedRow
                                paddingLeftIncrement={0}
                                level={level}>
                                {level === 1 ? this.level1(node) : level === 2 ? this.level2(node) : this.level3(node)}
                            </NestedRow>
                        )
                    }
                    }
                />

            </View>
        );
    }
}


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: "blue"
    },

    toolbar: {
        justifyContent: "center",
        backgroundColor: themeStyle.THEME_COLOR,
        alignItems: "center",
        paddingBottom: 7
    },
    title: {
        fontFamily: fontStyle.RobotoMedium,
        fontSize: FontSize.getSize(12),
        color: themeStyle.WHITE
    },

});


const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(ExpandList);
