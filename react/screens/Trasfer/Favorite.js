import React, {Component} from "react";
import {Platform, StatusBar, View, Image, Text, TouchableOpacity, TouchableHighlight,SafeAreaView, FlatList} from "react-native";

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


/**
 * splash page
 */
let imeiNo = "";

class Favorite extends Component {
    constructor(props) {
        super(props);
        let language = props.language;
        console.log("language",language.bkash_account)
        this.state = {
            data: [
                {
                    id: "profile",
                    title: language.Donation,
                    description:language.transfer_bkash
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
            tabBarLabel: this.props.language.more
        });

       /* if (this.props.userDetails.AUTH_FLAG === "TP") {
            const {data} = this.state;
            let arr = data;
            let obj = {
                id: "changeTransPin",
                title:this.props.language.change_transaction_pin,
                icon: require("../resources/images/ic_credential_management.png")
            }
            arr.push(obj);
            this.setState({data: arr});
        }*/
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate("FavTransferBkash")}>
                <View style={{
                    flexDirection: "row",
                    justifyContent:"space-between",
                    marginTop: 10,
                    marginBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                    alignItems: "center"
                }}>
                   <View style={{flexDirection:"column"}}>
                       <Text style={CommonStyle.midTextStyle}>{item.title}</Text>
                       <Text style={[CommonStyle.textStyle, {
                           flex: 1,
                           color: themeStyle.DIMCOLOR
                       }]}>{item.description}</Text>
                   </View>
                    <Image style={{
                        height: Utility.setHeight(12),
                        width: Utility.setWidth(30),
                        tintColor: "#b5bfc1"
                    }} resizeMode={"contain"}
                           source={require("../../resources/images/arrow_right_ios.png")}/>
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
                <View style={{alignItems:"center",paddingTop:10,paddingBottom:10}}>
                <Text style={styles.title}>{language.favoriteTitle}</Text>
                </View>
                    <View>
                        <Swipeable rightButtons={rightButtons}>
                    <FlatList data={this.state.data}
                              renderItem={this._renderItem}
                              ItemSeparatorComponent={() => this.bottomLine()}
                              ListHeaderComponent={()=> this.bottomLine()}
                              ListFooterComponent={this.bottomLine()}
                              keyExtractor={(item, index) => index + ""}
                    />
                        </Swipeable>
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

