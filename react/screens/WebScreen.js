import React, { Component } from "react";
import {
  Text,
  Platform,
  StatusBar,
  View,
  Animated,
  Easing,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";

import { actions } from "../redux/actions";
import { connect } from "react-redux";
import theme from "../resources/theme.style";
import Config from "../config/Config";
import themeStyle from "../resources/theme.style";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import dimen from "../resources/Dimens";
import fontStyle from "../resources/FontStyle";
import FontSize from "../resources/ManageFontSize";

let title = "", load_url = "";

class WebScreen extends Component {

  constructor(props) {
    super(props);
    title = props.route.params.title;
    load_url = props.route.params.load_url;
  }


  async componentDidMount() {
    if (Platform.OS === "android") {
      this._navListener = this.props.navigation.addListener("focus", () => {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor(theme.WHITE);
        StatusBar.setBarStyle("dark-content");
      });
    }
  }


  render() {
    return (
      <View style={styles.viewStyles}>
        <SafeAreaView />

        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          height: hp(dimen.dim_h60),
          backgroundColor: theme.THEME_COLOR,
          alignItems: "center",
        }}>
          <TouchableOpacity
            style={{ marginStart: 10, width: 40, height: 25, alignItems: "center", justifyContent: "center" }}
            onPress={() => this.props.navigation.goBack(null)}>
            <Image style={{ width: 15, height: 17, tintColor: theme.WHITE }}
                   source={Platform.OS === "android" ?
                     require("../resources/images/ic_back_android.png") : require("../resources/images/ic_back_ios.png")} />
          </TouchableOpacity>
          <Text style={{
            flex: 1,
            color: theme.WHITE,
            fontFamily: fontStyle.RobotoMedium,
            fontSize: FontSize.getSize(16),
          }}>{title}</Text>
        </View>

        <WebView
          source={{
            uri: load_url
          }}
          scalesPageToFit={true}
          /*onLoadEnd={this._onLoadEnd}*/
        />



      </View>

    );
  }
}


const styles = {
  viewStyles: {
    flex: 1,
    backgroundColor: themeStyle.BG_COLOR,
  },

};


const mapStateToProps = (state) => {
  return {
    langId: state.accountReducer.langId,
    language: state.accountReducer.lang,
  };
};

export default connect(mapStateToProps)(WebScreen);

