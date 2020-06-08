import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  StyleSheet
} from 'react-native';

export default class AuthLoading extends React.Component {
  constructor(props) {
    super(props);
  }

  // Fetch the token from storage then navigate to our appropriate place
  _getData = async () => {
    const data = await AsyncStorage.getItem('username');
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(data ? 'App' : 'Auth', {data});
  };

  // Render any loading content that you like here
  render() {
    //this._socketAsyn()
    this._getData();
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