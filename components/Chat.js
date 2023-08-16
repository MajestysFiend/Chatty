import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {

    const [messages, setMessages] = useState([]);

    // Uses the name and bgColor states from Start.js
    const { userID, userName, bgColor } = route.params;

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

    const addMessage = async (newMessage) => {
        const newMessageRef = await addDoc(collection(db, "messages"), newMessage);
        if (newMessageRef._id) {
            setMessages([newMessage, ...messages]);
        } else {
            Alert.alert("Unable to add. Please try later");
        }
    }

    useEffect(() => {
        //Displays name state from Start.jsat the top of the screen
        navigation.setOptions({ title: userName });

        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];
            documentsSnapshot.forEach(doc => {
                newMessages.push({
                    id: doc.id, ...doc.data(),
                    createdAt: new Date(doc.data().createdAt.toMillis())
})
            });
            setMessages(newMessages);
        });

        // Clean up code
        return () => {
            if (unsubMessages) unsubMessages();
        }


    }, []);

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Text style={{ color: '#FFF', fontSize: 20, textAlign: 'center', marginTop: 15 }}>Hello, {userName}!</Text>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
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