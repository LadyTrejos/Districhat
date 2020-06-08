import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import Logo from '../components/Logo';
import Form from '../components/LoginForm';

export default class Login extends React.Component {
    
    render() {
    return (

        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <Logo title="Districhat"/>
                <Form navigation={this.props.navigation}/>
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>¿Aún no tienes una cuenta?</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text style={styles.signupButton}> Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5c6bc0',
      alignItems: 'center',
      justifyContent: 'center',
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
        fontWeight: '500'
    }
  });
