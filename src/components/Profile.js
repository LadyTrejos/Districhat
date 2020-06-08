import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, AsyncStorage } from 'react-native';
import { Avatar } from 'react-native-elements';
import Loading from '../pages/Loading';
import {socket} from '../Socket';
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.props = this.props;
    this.state = {
      username: ''
    }
    
  };
  LogoutButton = () => { 
    const message = {msg: '#exit',
            username: this.state.username,
            roomName: 'principal',
            hour: '0:0:0'}
    socket.emit('message', message, ()=>{
      this.props.navigation.navigate('Login')
    })
  }
  

  _getUsername = async () => {
    return await AsyncStorage.getItem('username');
  };

  update() {
    this._getUsername()
    .then((data) => {
      this.setState({username: data})
  })
  }
  
  render() {
    if (this.state.username == ''){
      this.update()
      return(
        <Loading />
      );
    } else {
      return (
          <View style={{flex: 1, backgroundColor:'#5c6bc0'}}>
            <View style={[styles.container,{flex:0.4}]}>
              <Avatar 
                  title={this.state.username.charAt(0).toUpperCase()}
                  size = 'xlarge'
                  rounded
              />
            </View>
            <View style={styles.container}>
              <Text style={styles.logoText}>{this.state.username}</Text>
            </View>
            <View style={[styles.container,{flex:0.3}]}>
              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.logoText2} onPress={this.LogoutButton}> Cerrar sesión </Text>
              </TouchableOpacity>
            </View>
          </View>
    );
  }
  }
}

const styles = StyleSheet.create({
    container: {
      justifyContent:'flex-end' ,
      alignItems: 'center',
      backgroundColor: '#5c6bc0'
    },
    container2: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5c6bc0'
    },
    
    logoText: {
      fontSize: 50,
      color: 'white',
      fontWeight: '500',
      alignItems:'center'
    },
    logoText2:{
      fontSize: 30,
      color: 'white',
      fontWeight: '500',
      alignItems:'center'

    },
    sendButton: {       
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 50,
      paddingRight:50,
      paddingVertical: 12,
      marginLeft:5,
      marginVertical: 20,
      borderRadius: 20,
      backgroundColor: '#26418f'

  },
  });