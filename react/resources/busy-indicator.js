import * as React from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import themesStyle from '../resources/theme.style';


export class BusyIndicator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.visible ? (
      <View style={this.props.changeStyle === 1 ? styles.style2 : styles.initStyle} >

          <ActivityIndicator size="large" color={themesStyle.THEME_COLOR} />

       {/*   <Text style={{
              fontFamily: fontStyle.GothamLight,
              color: themesStyle.RED_COLOR_DARK,
              textAlign: 'center',
              fontSize: hp(dimen.dim_h23),
              marginLeft: wp(dimen.dim_w12)
          }}>Please wait...</Text>*/}
      </View>
    ) : null;
  }

}

const styles = StyleSheet.create({
    initStyle: {
        flex: 1,
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        opacity: 0.7
      },
    style2: {
        flex: 1,
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: "center",
        width: "100%",
        opacity: 0.7
    }
});
