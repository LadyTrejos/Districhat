import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export default class Logo extends React.Component {
  render() {
    return (

        <View style={styles.container}>
            <Image 
                style={{width: 50, height: 50}}
                source={require('../images/logo.png')}/>
            <Text style={styles.logoText}>{this.props.title}</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    logoText: {
        marginVertical: 15,
        fontSize: 30,
        color: 'white',
        fontWeight: '500'
    }
  });