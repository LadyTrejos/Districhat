import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Avatar } from 'react-native-elements';

export default class ChatItem extends Component {
    
    showAvatarOrNot(message, me){
        if (message.username !== me){
            return(
                <Avatar 
                    title={message.username.charAt(0).toUpperCase()}
                    small
                    rounded
                />
            );
            } 
        return <View/>
    }

    render() {
      const message = this.props.message;
      const me = this.props.me;
      const isMyMessage = message.username == me;
      const textContainerExtra = isMyMessage ? styles.textContainerRight : styles.textContainerLeft;
    return (
        <View style={styles.messageContainer}>
            {this.showAvatarOrNot(message, me)}
            
            <View style={[styles.textContainer, textContainerExtra]}>
                
                <Text style={styles.sender}>{message.username}</Text>
                <Text style={styles.message}>{message.msg}</Text>
                <Text style={styles.hour}>{message.hour}</Text>
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection:'row',
        padding: 20,
        //paddingVertical: 30
    },
    textContainer:{
        flexDirection:'column',
        marginLeft: 10,
        marginRight:10,
        flex: 1,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textContainerLeft: {
        alignItems: 'flex-start',
        backgroundColor: '#d5d8d4',
        flexDirection: 'column',
        flexShrink: 1,
        flex:1,
        
    },
    textContainerRight: {
        alignItems: 'flex-end',
        backgroundColor: '#d1d9ff',
        flexDirection: 'column',
        flexShrink: 1,
        flex:1,
    },
    message: {
        fontSize: 17,
        flexShrink: 1,
        flex:0,
        flexDirection: 'row',
    },
    sender: {
        fontWeight: 'bold',
        paddingRight: 10
    },
    hour: {
        color: 'gray',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
});
