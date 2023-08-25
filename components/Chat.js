import { StyleSheet, View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db }) => {

    const [messages, setMessages] = useState([]);

    // Uses the name and bgColor states from Start.js
    const { userID, userName, bgColor, isConnected } = route.params;

    //Adds new message to list of messages
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
    }

    //Changes the colors of the text bubbles 
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    const renderInputToolbar = (props) => {
        if (isConnected) return <InputToolbar {...props} />;
        else return null;
    }

    const addMessage = async (newMessage) => {
        const newMessageRef = await addDoc(collection(db, "messages"), newMessage);
        if (newMessageRef._id) {
            setMessages([newMessage, ...messages]);
        } else {
            Alert.alert("Unable to add. Please try later");
        }
    }

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    };

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
    }

    let unsubMessages;

    useEffect(() => {
        if (unsubMessages) unsubMessages();
        unsubMessages = null;

        if (isConnected === true) {

            //Displays name state from Start.jsat the top of the screen
            navigation.setOptions({ title: userName });

            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        id: doc.id, ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    })
                });
                cacheMessages(newMessages);
                setMessages(newMessages);
            });
        } else {
            //Displays name state from Start.jsat the top of the screen
            navigation.setOptions({ title: userName + ' in Offline Mode' });
            loadCachedMessages();
        }

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }

    }, [isConnected]);

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={{ color: '#FFF', fontSize: 20, textAlign: 'center', marginTop: 15 }}>Hello, {userName}!</Text>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: userName
                }} />

            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Chat;