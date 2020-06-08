import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, StatusBar, AsyncStorage } from 'react-native';
import Logo from '../components/Logo';
import Register from '../components/Register';

export default class Login extends React.Component {
    
    onLoginButtonPressed(){
        this.props.navigation.navigate('Login');
    }

    render() {
    return (
        <SafeAreaView style={{flex: 1}}> 
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} translucent={true} />
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <Logo title="Registro"/>
                    <Register navigation={this.props.navigation}/>
                    <View style={styles.signupTextCont}>
                        <Text style={styles.signupText}>¿Ya tienes una cuenta?</Text>
                        <TouchableOpacity onPress={this.onLoginButtonPressed.bind(this)}>
                            <Text style={styles.signupButton}> Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5c6bc0',
      alignItems: 'center',
      justifyContent: 'center'
    },
    signupTextCont: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: '#aab6fe',
        fontSize: 18,
        fontWeight: '100'
    },
    signupButton: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    }
  });
