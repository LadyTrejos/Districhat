import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  StyleSheet
} from 'react-native';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loading }>
            <ActivityIndicator size='large'/>
            <StatusBar barStyle="default" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 70
    },
    loading:{
        justifyContent: 'center'
    }
})