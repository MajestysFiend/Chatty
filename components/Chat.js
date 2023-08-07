import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const Chat = ({ route, navigation }) => {

    const { name, bgColor } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name });
        navigation.setOptions({ backgroundColor: bgColor });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={{color: '#FFF', fontSize: 20}}>Hello, {name}!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Chat;