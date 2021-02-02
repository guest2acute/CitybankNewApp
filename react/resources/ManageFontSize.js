import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {Dimensions} from "react-native";
const deviceHeight = Dimensions.get('window').height;

export default class ManageFontSize{
    static getSize(size){
        return RFValue(size, 600);
    }
}

// const getFontSize = (size) => {
//     return (
//      RFValue(size)
//     );
// }
//
// export default getFontSize;
