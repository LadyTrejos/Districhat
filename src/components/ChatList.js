import React, { Component } from 'react';
import {
 StyleSheet,
 Text,
 View,
 ListView,
 TouchableOpacity,
 TextInput,
 Alert,
 AsyncStorage
} from 'react-native';

import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { socket } from '../Socket';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2})

export default class ChatList extends Component {
  constructor(props) {
    super(props)
    this.username = this.props.navigation.getParam('user', 'none') 
    this.rooms = this.props.navigation.getParam('rooms', false)
    this.state = {
      peopleDataSource: ds.cloneWithRows([]),
      loaded: false,
      search: '',
      nombres: ds.cloneWithRows([]),
      hour: 'none'
    }
  }

  buscar = (nombre) => {
    band = 0
    for (i in this.state.nombres._dataBlob.s1){
      word = this.state.nombres._dataBlob.s1[i]
      if (nombre == word.name){
          this.enterChat(nombre)
          band = 0
          break
      }else{
        band = 1
      }
    }
    
    if (band == 1){
      Alert.alert((this.rooms)? 'Sala no encontrada. ': 'Usuario no encontrado. ');
      }
  }

  enterChat(name) {
    const command = (this.rooms) ? '#gR <' + name +'>' : '#\\private <' + name + '>';
    const data = {'msg': command, 'username': this.username, 'roomName': 'principal'}
    socket.emit('message', data, () => {
      this.props.navigation.navigate('ChangePage', {to: 'ChatWindow', roomName: name, user: this.username, id: name, hour:'0:0:0'})
    })
  }

  updateList() {
    if(this.rooms){
      socket.emit('rooms', this.username, (datos) =>{
      const arr = datos.msg.slice()
      this.setState({nombres: ds.cloneWithRows(arr)})
    })
    } else {
      const data = {'msg': '#show users', 'username': this.username, 'roomName': 'principal'}
      socket.emit('message', data, (datos) =>{
        const arr = datos.msg.slice()
        this.setState({nombres: ds.cloneWithRows(arr)})
      })
    }
    
  }

  _getUsername(){
    if (this.username == 'none'){
      AsyncStorage.getItem('username', (errs,result) => {
          if (!errs) {
              if (result !== null) {
                  this.username = result;
                  this.updateList()
              }
           }
      })
  }
    
  }

  render() { 
    this._getUsername()
    return (
      <View style={styles.mainContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.leftHeaderContainer}>
            <Text style={styles.logoText}>DistriChat</Text>
          </View>
          <TouchableOpacity onPress={() => this.updateList()}>
            <View style={styles.rightHeaderContainer}>
              <Icon name="refresh" type= 'material-icons' color='#fff' size={30} style={{padding:5}} />
            </View> 
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerContainer2}>
          <View style={styles.rightHeaderContainer} >
            <TextInput
              style={styles.textInputStyle}
              onChangeText={(text) => this.setState({search: text})}
              placeholder = {(this.rooms) ? 'Buscar sala':'Buscar usuario'}
              value={this.state.search}
              autoCapitalize = 'none'
            />
          </View>
          
          <TouchableOpacity onPress={() => this.buscar(this.state.search)}>
            <View style={styles.rightHeaderContainer}>
              <Icon name="search" color='white' size={30} style={{padding:7}} />
            </View> 
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <ListView
                  initialListSize={5}
                  enableEmptySections={true}
                  dataSource={this.state.nombres}
                  renderRow={(person) => { return this.renderPersonRow(person) }} />
        </View>
      </View>
    );
  }

  renderPersonRow(person){
    return (
      <View style = {styles.listItemContainer}>
        <TouchableOpacity style={{flex:1, flexDirection:'row', padding: 20}} onPress={() => this.enterChat(person.name)}>
          <View style= {styles.iconContainer}>
            <Avatar 
              title = {person.name.charAt(0).toUpperCase()}
              size = 'medium'
              rounded
                    />
          </View>
        
          <View style = {styles.userDetailsContainer}>
    
              <View style={styles.userDetailsContainerWrap}  >
                <View style={styles.nameContainer}>
                    <Text style={styles.logoText2}>{person.name}</Text>
                </View>
              </View>
            
          </View>
      

        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  button: { 
    width: 150,
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
  
  contentContainer: {
    flex: 6,
  },
  
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#5c6bc0",
    alignItems:"center",
    
  },
  
  headerContainer2: {
    flex:0.3,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#7986cb",
    alignItems:"center",
    paddingRight: 5
  },
  
  iconContainer: {
    flex: 1,
    alignItems: "flex-start"
  },
  
  leftHeaderContainer: {
    alignItems: "flex-start",
    flexDirection: "row"
  },
  
  listItemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    
  },
  
  logoText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
    alignItems: "flex-start",
    marginLeft: 10
  },
  
  logoText2: {
    color: "#5c6bc0",
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "flex-start",
    marginLeft: 10,
  },
  
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    height: 24
  },
  
  nameContainer: {
    alignItems: "flex-start",
    flex: 1,
  },
  
  rightHeaderContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  
  userDetailsContainer: {
    flex: 4,
    justifyContent: "center",
    borderBottomColor: "rgba(92,94,94,0.5)",
    borderBottomWidth: 0.25,
  },
  userDetailsContainerWrap: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  
  textInputStyle:{
    height: 30, 
    width:350, 
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginLeft:30
  }
  
});