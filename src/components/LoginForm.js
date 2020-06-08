import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { socket } from '../Socket';
import { Icon } from 'react-native-elements';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            icon: 'visibility',
            secure: 'true'
        }
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('username', this.state.username);
    };

    LoginButton = () => { 
        const data = JSON.parse(JSON.stringify(this.state));
        delete data.secure;
        delete data.icon;
        socket.emit('signIn', data, res=>{
            if (res.out == true){
                this._signInAsync()
                this.props.navigation.navigate('ChatWindow', {roomName: res.room, user: this.state.username, id: res.room, initial: true})
            } else {
                Alert.alert(res.err)
            }
        })
    }

    EyeIcon = () => { 
        let iconVisible = (this.state.icon == 'visibility') ? 'visibility-off':'visibility';
        this.setState({icon:iconVisible})
        let passwordVisible = (this.state.secure == 'true') ? 'false':'true';
        this.setState({secure:passwordVisible})
    }
  
    render() {
    return (
        <View style={styles.container}>
            <View style={styles.boxContainer}>
                <TextInput 
                    style={styles.inputBox} 
                    placeholder="Usuario" 
                    placeholderTextColor='#c5cae9' 
                    selectionColor="white" 
                    autoCapitalize="none"
                    onChangeText={(input) => this.setState({username:input})}
                    value={this.state.user}
                />
                <Icon
                    name='face'
                    color='white'
                    size={35}
                />
            </View>
            <View style={styles.boxContainer}>
                <TextInput 
                    style={styles.inputBox} 
                    placeholder="Contraseña" 
                    placeholderTextColor='#c5cae9' 
                    selectionColor="white" 
                    autoCapitalize="none" 
                    secureTextEntry={this.state.secure == 'true'}
                    onChangeText={(input) => this.setState({password:input})}
                    value={this.state.password}
                />
                <Icon
                    name={this.state.icon}
                    color='white'
                    size={35}
                    onPress={this.EyeIcon}
                />
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={this.LoginButton}>Entrar</Text>
            </TouchableOpacity>

        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    inputBox: {
        flex: 1,
        width: 300,
        height: 50,
        backgroundColor: '#8e99f3',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 20,
        marginVertical: 10,
        color: 'white'
    },
    button: { 
        width: 100,
        borderRadius: 25,
        backgroundColor: '#26418f',
        marginVertical: 10,
        paddingVertical: 12
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center'
    },
    boxContainer:{
        flexDirection: 'row',
        justifyContent:"center", 
        alignItems:"center"
    }
  });
