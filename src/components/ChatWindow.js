import React from 'react';
import { StyleSheet, View, FlatList, TextInput, Keyboard,
    TouchableHighlight, Text, KeyboardAvoidingView, Alert } from 'react-native';
import { Header } from 'react-native-elements';
  
import ChatItem from './ChatItem';

import { socket } from '../Socket';

export default class ChatWindow extends React.Component {
    constructor(props) {
        super(props);
        this.username = this.props.navigation.getParam('user', 'none')      
        this.roomName = this.props.navigation.getParam('roomName', 'default')
        this.id = this.props.navigation.getParam('id', 'default')
        this.correction = this.props.navigation.getParam('correction', 0)
        this.recuperar = true
        this.state = {
            msg: '',
            username: this.username,
            roomName: this.roomName,
            disabled: true,
            hour: 'none',
            messages: []
        }
    }

    onTyping(text) {
        text = text.trim()
        if (text && text.length >= 1 && text != ' '){
            this.setState({
                disabled: false,
                msg: text
            });
        } else { 
            this.setState({
                disabled: true
            })
        }
    }

    onSendButtonPressed(){
        this.setState({disabled: true})
        var day = new Date();
        day.setSeconds(day.getSeconds() + this.correction);
        var hour = day.getHours();
        var minute = day.getMinutes();
        var seconds = day.getSeconds();
        time = hour + ":" + minute + ":" + seconds;
        console.log('DATE: ',new Date(),'Day: ', day, '\nCorreción: ', this.correction)
        this.setState({hour: time}, () => {
            const data = JSON.parse(JSON.stringify(this.state));
            delete data.messages;
            delete data.disabled;
            socket.emit('message', data, res => {
                if (res.command == 'createRoom' || res.command == 'enterRoom' ){
                    if (res.roomName != this.roomName ){
                        this.props.navigation.navigate('ChangePage', {to:'ChatWindow', id: res.roomName, roomName: res.roomName, user: this.state.username, correction: this.correction} )
                    }
                } else if (res.command == 'sendPrivate'){
                    this.props.navigation.navigate('ChangePage', {to:'ChatWindow', id: res[this.state.username], roomName: res[this.state.username], user: this.state.username, correction: this.correction })
                } else if (res.command == 'showUsers' || res.command == 'listRoom'){
                    this.showList(res.msg)
                } else if (res.command == 'showMethods'){
                    this.showHelp(res.msg)
                }
                
            })
        })
        this.textInput.clear();
        Keyboard.dismiss();
    }

    renderChatItem({item}) {
        return <ChatItem message={item} me={this.username}/>
    }

    keyExtractor = (item, index) => index.toString();

    showList = (datos) => {
        const data = datos.map(item => item.name);
        var joinData = data.join('\n')
        joinData = (joinData) ? joinData : 'No hay más usuarios en línea. '
        const message = {
            username: 'Admin',
            msg: joinData,
            roomName: this.roomName
        }
        this.setState(prevState => ({
            messages: [message, ...prevState.messages]
          }))
    }
    
    showPreviousMessages = () => {
        var newArray = this.state.messages.slice();
        socket.emit('previos', this.roomName, (datos) => {
            const data = datos.previos.map( (item) => {
                var message = {msg: item.msg ,username: item.autor, roomName: this.roomName, hour: item.time}
                newArray.unshift(message);   
            
            })
            this.setState({messages: newArray}, () => {
                if(this.props.navigation.getParam('initial', false)){
                    const message = {
                        username: 'Admin',
                        msg: 'Utilice el comando #help para mostrar todos los comandos disponibles. ',
                        roomName: this.roomName
                    }
                    this.setState(prevState => ({
                        messages: [message, ...prevState.messages]
                    }))
                }
            })
        });
    }

    showHelp = (data) => {
        const message = {
            username: 'Admin',
            msg: data,
            roomName: this.roomName
        }
        this.setState(prevState => ({
            messages: [message, ...prevState.messages]
          }))
    }

    async componentDidMount(){
        socket.on('disconnect', () => {  
            Alert.alert('El servidor se ha desconectado. ')
            this.props.navigation.navigate('Login')
        });

        socket.on('receive', (datos) => {  
            var newArray = this.state.messages.slice();    
            newArray.unshift(datos);   
            this.setState({messages: newArray})
        });

        socket.on('delete', (data) => {
            if (data.roomName == this.roomName){
                Alert.alert('La sala ha sido eliminada por su creador. ')
                this.props.navigation.navigate('ChangePage', {to: 'ChatWindow', id: 'principal', roomName: 'principal', user: this.state.username, correction: this.correction})
            }
        });
        socket.on('private', (data) => {
            this.props.navigation.navigate('ChangePage',{to:'ChatWindow', id: data.roomName, roomName: data.roomName, user: this.state.username, correction: this.correction})
        })

        socket.on('giveMe', ()=>{
            var day = new Date();
            var hour = day.getHours();
            var minute = day.getMinutes();
            var seconds = day.getSeconds();
            time = hour + ":" + minute + ":" + seconds;
            
            socket.emit('calculate', time, res => {
                this.correction = res;
            });
        });
    }

    render() {
        if (this.recuperar){
            this.showPreviousMessages()
            
            this.recuperar = false
        }
        const extraButtonStyle = this.state.disabled ? styles.disabledButton : styles.enabledButton;
        return (
            
            <View style={styles.container}>
                <Header 
                    backgroundColor='#5c6bc0'
                    leftComponent={{ icon: 'arrow-back', color: 'white', onPress: () => this.props.navigation.navigate('ChatList',{username: this.user})}}
                    centerComponent={{ text: this.id, style:{ color:'white', fontSize: 25, fontWeight:'300'}}}

                />
                <FlatList 
                    inverted
                    data={this.state.messages}
                    renderItem={this.renderChatItem.bind(this)}
                    keyExtractor={this.keyExtractor}
                />

                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={40} >
                    <View style={styles.inputBar}>
                        <TextInput 
                            style={styles.textBox}
                            multiline
                            defaultHeight={30}
                            onChangeText={(text) => this.onTyping(text)}
                            ref={input => {this.textInput = input; }}
                        />
                        <TouchableHighlight 
                            style={[styles.sendButton, extraButtonStyle]}
                            disabled={this.state.disabled}
                            onPress={this.onSendButtonPressed.bind(this)}
                        >
                            <Text style={{color: 'white'}}>Enviar</Text>
                        </TouchableHighlight>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    inputBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    textBox: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'gray',
        fontSize: 16,
        paddingHorizontal: 16,
        flex: 1,
        paddingVertical: 10,
        marginLeft: 5,
        marginVertical: 10,
    },
    sendButton: {       
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight:15,
        paddingVertical: 12,
        marginLeft:5,
        marginVertical: 10,
        borderRadius: 15,
        backgroundColor: '#26418f'

    },
    enabledButton: {
        backgroundColor: '#26418f'
    },
    disabledButton: {
        backgroundColor: '#c5cae9'
    }
  });
