import { TextInput } from 'react-native'
const MyTextInput = (props) => (
    <TextInput
        autoCompleteType='username'
        onChangeText={text => onChangeText(text)}
        disableFullscreenUI={true}
        keyboardType='default'
        {...props}
    />
)
