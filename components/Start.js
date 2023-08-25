import { useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';

const Start = ({ navigation, isConnected }) => {
    const auth = getAuth();

    const [name, setName] = useState();
    const [bgColor, setBgColor] = useState('');

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", { userID: result.user.uid, userName: name, bgColor: bgColor, isConnected: true });
                Alert.alert(name + " signed in successfully!");
            })
            .catch(() => {
                Alert.alert("Unable to sign in, try later again.");
            })
    }

    const signInUserOffline = () => {
        isConnected === false;

        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("Chat", { userID: result.user.uid, userName: name, bgColor: bgColor, isConnected: false });
                Alert.alert(name + " signed in offline successfully!");
            })
            .catch(() => {
                Alert.alert("Unable to sign in, try later again.");
            })
    }

    return (
        <View>
            <ImageBackground style={styles.imgBackground}
                resizeMode='cover'
                source={require('../assets/backgroundImage.png')}>
                <Text style={{
                    fontSize: 60, marginTop: 50, textAlign: 'center', color: '#FFF', fontWeight: 600
                }}>Chatty</Text>
                <View style={{ flex: 1, justifyContent: 'flex-end', padding: 15 }}>
                    <View style={styles.container}>
                        <TextInput
                            style={styles.textInput}
                            value={name}
                            onChangeText={setName}
                            placeholder='Your Name'
                            placeholderTextColor="#757083"
                        />

                        <Text style={{ marginTop: 15, fontSize: 16, fontWeight: 300 }}>Choose Background Color:</Text>
                        <View style={styles.rowContainer}>
                            <TouchableOpacity onPress={() => setBgColor('#090C08')}><View style={styles.colorContainerBlack}></View></TouchableOpacity>
                            <TouchableOpacity onPress={() => setBgColor('#474056')}><View style={styles.colorContainerGrey}></View></TouchableOpacity>
                            <TouchableOpacity onPress={() => setBgColor('#8A95A5')}><View style={styles.colorContainerBlue}></View></TouchableOpacity>
                            <TouchableOpacity onPress={() => setBgColor('#B9C6AE')}><View style={styles.colorContainerGreen}></View></TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={signInUser}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>Start Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={signInUserOffline}
                        >
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600 }}>Start Chat in Offline Mode</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15,
        width: "88%",
        marginBottom: 40

    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        opacity: .5
    },
    button: {
        width: "88%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#757083',
        padding: 15,
        fontSize: 16,
        fontWeight: 600,
        marginBottom: 15
    },
    imgBackground: {
        width: '100%',
        height: '100%'
    },
    colorContainer: {
        height: 50
    },
    colorContainerBlack: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#090C08'
    },
    colorContainerGrey: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#474056'
    },
    colorContainerBlue: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#8A95A5'
    },
    colorContainerGreen: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B9C6AE'
    }
});
export default Start;