import React from 'react';
import { StyleSheet, YellowBox, BackHandler, ToastAndroid, Platform, AsyncStorage, Text } from 'react-native';
import { createBottomTabNavigator, createSwitchNavigator, createStackNavigator, createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements';

import { socket } from './src/Socket';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';
import AuthLoading from './src/pages/AuthLoading';
import ChatWindow from './src/components/ChatWindow';
import ChatList from './src/components/ChatList';
import Loading from './src/pages/Loading';
import ChangePage from './src/pages/ChangePage';
import Profile from './src/components/Profile';


console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClear: false
    }
  };
  
  async _clearInfo() {
    await AsyncStorage.clear();
  };

  async componentDidMount(){
    this._clearInfo()
    .then(() => setTimeout(() => {this.setState({isClear: true})} , 100)
    )
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    socket.on('connect', () => {
      console.log('connected');
      console.log(socket.id);
    });
    
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
      'Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground.'
    ]);
  }

  handleBackButton(){
    ToastAndroid.show('Not allowed', ToastAndroid.SHORT);
    return true;
  }

  render() {
    if(this.state.isClear){
      return (
        <AppContainer uriPrefix={prefix}/>
      );
    } else {
      return (<Loading /> );
    }
    
  }
}

const AuthStackNavigator = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Signup: {
      screen: Signup
    }
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none'
  }
)

const AppStackNavigator = createMaterialBottomTabNavigator(
  {
    ChatWindow: {
      screen: createStackNavigator({
        ChatWindow: ChatWindow,
        ChangePage: ChangePage
      },
      {
        initialRouteName: 'ChatWindow',
        headerMode: 'none'
      }
      ),
      key: 'hola',
      path: 'chat/:id',
      navigationOptions: {
        tabBarLabel: <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Reciente</Text>,
        tabBarIcon: ({ tintColor }) => (
          <Icon size={23} name='chat' type='material-communityicons' style={{ color: tintColor }} />
        )}
    },
    ChatList: {
      screen: ChatList,
      navigationOptions: {
        tabBarLabel: <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Chats</Text>,
        tabBarIcon: ({ tintColor }) => (
          <Icon size={23} name='account-multiple' type='material-community' style={{ color: tintColor }} />
        )}
    },
    RoomList: {
      screen: ChatList, 
      params: { rooms: true },
      navigationOptions: {
        tabBarLabel: <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Salas</Text>,
        tabBarIcon: ({ tintColor }) => (
          <Icon size={23} name='account-group' type='material-community' style={{ color: tintColor }} />
        )}
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Perfil</Text>,
        tabBarIcon: ({ tintColor }) => (
          <Icon size={23} name='user-circle' type='font-awesome' style={{ color: tintColor }} />
        )}
    }  
  },
  {
    initialRouteName: 'ChatWindow',
    activeColor: '#5c6bc0',
    inactiveColor: 'gray',
    barStyle: { backgroundColor: 'white' },
    labeled: true,
    
  }
)

const prefix = Platform.OS == 'android' ? 'mychat://mychat' : 'mychat://';

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoading,
    App: AppStackNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
