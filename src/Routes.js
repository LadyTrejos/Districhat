import React from 'react';
import {Router, Stack, Scene, Tabs } from 'react-native-router-flux';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';


import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatWindow from './components/ChatWindow';
import ChatList from './components/ChatList';
import Placeholder from './components/Placeholder';


class TabIcon extends React.Component {
  render() {
    var color = this.props.focused ? '#26418f' : '#8e99f3';
    return (
      <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon color={color} name={this.props.name} type={this.props.type} size={25}/>
      </View>
    );
  }
}

export default class Routes extends React.Component {
	constructor(props){
		super(props);
		this.username = this.props.username;
	}
	render() {
		let {socket} = this.props;
		
		return(
			<Router>
				<Stack key="root">
			    <Scene key='auth' initial={true} hideNavBar={true}>
						<Scene key="signup" component={Signup} title="Signup" socket={socket} hideNavBar={true}/>
						<Scene key="login" component={Login} title="Login" socket={socket} hideNavBar={true}/>
					</Scene>

					<Scene key='main' hideNavBar={true}>
						<Tabs 
							key="tabBar" 
							activeBackgroundColor="#e0e0e0" 
							inactiveBackgroundColor="#f5f5f5" 
							tabBarStyle= {{backgroundColor:"white"}} 
							labelStyle={{fontSize:16, fontWeight:'200'}}
						>
							<Scene key="perfil" title="Perfil" icon={TabIcon} name='user-circle' type='font-awesome' hideNavBar={true}>
								<Scene key={'chatWindow'} path={"/chat/:id/"} component={ChatWindow} title="ChatWindow" user='ladytrejos' roomName='hyt' socket={socket}  hideNavBar={true}/>	
							</Scene>

							<Scene key="chats" title="Chats" icon={TabIcon} name='account-multiple' type='material-community' hideNavBar={true}>
								<Scene key="chatlist" component={ChatList} title="ChatList" rooms={false} username='ladytrejos' socket={socket} hideNavBar={true}/>
							</Scene>

							<Scene key="rooms" title="Salas" icon={TabIcon} name='account-group' type='material-community' hideNavBar={true}>
								<Scene key="roomlist" component={ChatList} title="ChatList" rooms={true} username='ladytrejos' socket={socket} hideNavBar={true}/>
							</Scene>

							<Scene key="pruebas" title="Pruebas" icon={TabIcon} name='music' type='font-awesome' hideNavBar={true}>
								<Scene key="login" component={Login} title="Login" initial={true} socket={socket} hideNavBar={true}/>					
							</Scene>

						</Tabs>
					</Scene>
			</Stack>
		</Router>
			);
	}
}