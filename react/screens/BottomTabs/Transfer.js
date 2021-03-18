import React, {Component} from "react";
import {Image, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View,FlatList} from "react-native";
import themeStyle from "../../resources/theme.style";
import CommonStyle from "../../resources/CommonStyle";
import {connect} from "react-redux";
import Utility from "../../utilize/Utility";
import FontSize from "../../resources/ManageFontSize";

class Transfer extends Component {
    constructor(props) {
        super(props);
    }

    moveScreen(item) {
        switch (item.id) {
            case "cityBankAcct":
                this.props.navigation.navigate("FundTransfer");
                break;
            case "otherBankAcct":
                this.props.navigation.navigate("OtherBankAccount");
                break;
            case "cashByCode":
                this.props.navigation.navigate("CashByCode");
                break;
            case "emailTransfer":
                this.props.navigation.navigate("EmailTransfer");
                break;
            case "transferToBkash":
                this.props.navigation.navigate("TransferToBkash");
                break;
            case "beneficiaryManagement":
                this.props.navigation.navigate("BeneficiaryManagement");
                break;
            case "favoriteTransfer":
                this.props.navigation.navigate("Favorite",{title:this.props.language.favorite_transferTitle})
                break;
            case "transferHistory":
                this.props.navigation.navigate("TransferCategory");
                break;
        }
    }

    _renderItem = ({item, index}) =>{
        return(
            <TouchableOpacity onPress={()=>{this.moveScreen(item)}}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: (Utility.getDeviceHeight()-Utility.setHeight(110))/4,
                width:Utility.getDeviceWidth()/2,
                borderLeftWidth:1,
                borderBottomWidth:1,
                borderColor:themeStyle.THEME_COLOR
            }}>
                <Image style={{
                    height: Utility.setHeight(30),
                    width: Utility.setWidth(30),
                    marginBottom:15
                }} resizeMode={"contain"}
                       source={item.icon}/>
                <Text style={[CommonStyle.labelStyle, {
                    textAlign:"center",
                    color: themeStyle.THEME_COLOR,
                    fontSize: FontSize.getSize(12),
                }]}>{item.title}</Text>
            </View>
            </TouchableOpacity>
        )
    }

    render() {
        let language = this.props.language;
        return (
            <View style={{flex: 1, backgroundColor: themeStyle.BG_COLOR}}>
                <SafeAreaView/>
                <View style={[CommonStyle.toolbar, {flexDirection: "row"}]}>
                    <Image resizeMode={"contain"}
                           style={{width: Utility.setWidth(90), flexGrow: 0, height: Utility.setHeight(50)}}
                           source={require("../../resources/images/citytouch_header.png")}/>
                    <TouchableOpacity onPress={() => Utility.logout(this.props.navigation, language)}
                                      style={{
                                          width: Utility.setWidth(35),
                                          height: Utility.setHeight(35),
                                          position: "absolute",
                                          right: Utility.setWidth(10),
                                      }}
                                      onPress={() => Utility.logout(this.props.navigation, language)}>
                        <Image resizeMode={"contain"} style={{
                            width: Utility.setWidth(30),
                            height: Utility.setHeight(30),
                        }}
                               source={require("../../resources/images/ic_logout.png")}/>
                    </TouchableOpacity>
                </View>
                <View>
                       <FlatList
                           data={language.transfer_props}
                           renderItem={this._renderItem}
                           numColumns={2}
                           keyExtractor={(item,index)=>index+""}
                       />
                </View>
            </View>
        )
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.langId !== this.props.langId){
            this.props.navigation.setOptions({
                tabBarLabel: this.props.language.transfer
            });
        }
    }
}

const mapStateToProps = (state) => {
    return {
        langId: state.accountReducer.langId,
        language: state.accountReducer.language,
    };
};

export default connect(mapStateToProps)(Transfer);

