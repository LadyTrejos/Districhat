import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { socket } from '../Socket';

var genero = [
    {label: 'Hombre', value: 0},
    {label: 'Mujer', value: 1},
    {label: 'Otro', value: 2}
];

export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            lastName: '',
            username: '',
            password: '',
            confirmPassword: '',
            age: '',
            gender: '',
            errors: {
                name: '',
                lastName: '',
                username: '',
                password: '',
                confirmPassword: '',
                age: '',
                gender: ''
            }
        };
    }

    EndName = (field, errorText) => {
        this.setState({[field]: this.state[field].trim()}, () => {
            //Regex para permitir solo letras y espacios
            var pattern = /^[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+([ ]?[a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da]+)*$/gi
            var result = pattern.test(this.state[field])
            
            var errorString = ''

            if(this.state[field] == ''){
                errorString += 'Introduce tu '+ errorText.toLowerCase() + '.'
            } else {
                if(!result){
                    errorString += errorText + ' no válido. \n'
                }
        
            }

            this.setState(prevState => ({
                errors: {
                    ...prevState.errors,
                    [field]: errorString
                }
            }))


        })
        
    }

    EndUsername(){
        //Regex para admitir letras, números, guiones y punto
        this.setState({username: this.state.username.toLowerCase()}, () => {
            var pattern = /^[a-z]+([\.\-\_]?[a-z0-9]+)*$/gi
            var result = pattern.test(this.state.username)
            
            var errorString = ''

            if(this.state.username == ''){
                errorString += 'Este campo no debe ir vacío. \nUsarás estos datos cuando entres.'
            } else {
                if(!result){
                    errorString += 'Usuario no válido. \n'
                }
        
                if(this.state.username.length < 8){
                    errorString += 'El usuario debe tener mínimo 8 caracteres. \n'
                }
            }

            this.setState(prevState => ({
                errors: {
                    ...prevState.errors,
                    username: errorString
                }
            }))
            })
    }

    EndPassword = (label) => {
        
        const other = (label == 'password') ? 'confirmPassword' : 'password'
        var errOther = this.state.errors[other]
        var errLabel = this.state.errors[label]

        if (this.state[label].length < 6 ){
            errLabel = 'Introduce una contraseña de al menos 6 caracteres. '
        } else { 
            if(this.state[other] != ''){
                const confirm = this.validatePassword(this.state.password, this.state.confirmPassword)
                if(!confirm){
                    errLabel = 'Las contraseñas no coinciden. '
                } else {
                    errOther = ''
                    errLabel = ''
                }
            }
        }
      
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                [label]: errLabel,
                [other]: errOther
            }
        }))
    }

    validatePassword(password, confirmPassword) {
        if (password == confirmPassword) {
            return true
        } else { return false}
         
    }

    EmptyInput = () => {
        var err = 0;
        //Crear una copia por valor del estado
        const atributes = JSON.parse(JSON.stringify(this.state));
        delete atributes.errors;
        var errors = {}

        for (label in atributes){
            if (atributes[label].length == 0){
                err += 1
                errors[label] = 'Este campo no puede estar vacío. '
                //this.refs.name.focus()
            } else {
                errors[label] = ''
            }
        }
        this.setState({errors})
        return err
    }

    registerButton = () => {
        if(this.state.age < 13){
            Alert.alert('Lo sentimos, no podemos procesar tu registro. ')
        } 
        else {
            if (!this.EmptyInput()) {
                let data = this.state
                delete data.confirmPassword;
                socket.emit('signUp', data, (res)=>{
                    Alert.alert(res.err)
                    if(res.out){
                        this.props.navigation.navigate('Login');
                    } else {
                        this.setState(prevState => ({
                            errors: {
                                ...prevState.errors,
                                username: res.err
                            }
                        }))
                    }
                    
                })
            } else {
                Alert.alert('Debe completar todos los campos. ')
            }
        }

        
        
    }

    OnlyLetters(text){
        //\u00f1 --> ñ   \u00d1 --> Ñ             Á     É    Í     Ó     Ú 
        return text.replace(/[^a-z\u00f1\u00d1\u00c1\u00c9\u00cd\u00d3\u00da ]/gi, '')
    }

    OnChangeNum(text){
        this.setState({
            age: text.replace(/[^0-9]/g, ''),
        });
    }

    OnChangeUsername(text){
        this.setState({
            username: text.replace(/[^A-Za-z0-9\.\-\_]/g, '')
        });
    }

    


    render() {
        //Para cambiar el estilo de los TextInput dependiendo si tiene error o no
        const styleName = (this.state.errors.name == '') ? styles.inputBox : styles.errorInputBox;
        const styleLastName = (this.state.errors.lastName == '') ? styles.inputBox : styles.errorInputBox;
        const styleUsername = (this.state.errors.username == '') ? styles.inputBox : styles.errorInputBox;
        const stylePassword = (this.state.errors.password == '') ? styles.inputBox : styles.errorInputBox;
        const styleConfirmPassword = (this.state.errors.confirmPassword == '') ? styles.inputBox : styles.errorInputBox;
        const styleAge = (this.state.errors.age == '') ? styles.inputBox : styles.errorInputBox;

        return (
        <ScrollView style={styles.container}>
            <Text style={styles.labelText}>Nombre: </Text>
            <TextInput 
                style={styleName} 
                placeholder="Nombre" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white"
                onChangeText={(input) => {
                    input = this.OnlyLetters(input)
                    this.setState({name:input})
                }}
                onEndEditing={() => this.EndName('name', 'Nombre')}
                value={this.state.name}
                ref='textinput'
            />
            <Text style={styles.errorMessage}>{this.state.errors.name}</Text>

            <Text style={styles.labelText}>Apellido: </Text>
            <TextInput 
                style={styleLastName} 
                placeholder="Apellido" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white"
                onChangeText={(input) => {
                    input = this.OnlyLetters(input)
                    this.setState({lastName:input})
                }}
                onEndEditing={() => this.EndName('lastName', 'Apellido')}
                value={this.state.lastName}
                ref='textinput'
            />
            <Text style={styles.errorMessage}>{this.state.errors.lastName}</Text>

            <Text style={styles.labelText}>Nombre de usuario: </Text>
            <TextInput 
                style={styleUsername} 
                placeholder="Usuario" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white" 
                autoCapitalize="none"
                onChangeText={(input) => this.OnChangeUsername(input)}
                onEndEditing={this.EndUsername.bind(this)}
                maxLength={20}
                value={this.state.username}
            />
            <Text style={styles.errorMessage}>{this.state.errors.username}</Text>
            
            <Text style={styles.labelText}>Contraseña: </Text>
            <TextInput 
                style={stylePassword} 
                placeholder="Contraseña" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white" 
                autoCapitalize="none" 
                secureTextEntry={true}
                onChangeText={(input) => this.setState({password:input})}
                onEndEditing={() => this.EndPassword('password')}
                value={this.state.password}
            />
            <Text style={styles.errorMessage}>{this.state.errors.password}</Text>

            <Text style={styles.labelText}>Confirmar contraseña: </Text>
            <TextInput 
                style={styleConfirmPassword} 
                placeholder="Confirmar contraseña" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white" 
                autoCapitalize="none" 
                secureTextEntry={true}
                onChangeText={(input) => this.setState({confirmPassword:input})}
                onEndEditing={() => this.EndPassword('confirmPassword')}
                value={this.state.confirmPassword}
            />
            <Text style={styles.errorMessage}>{this.state.errors.confirmPassword}</Text> 
            
            <Text style={styles.labelText}>Edad: </Text>
            <TextInput 
                style={styleAge} 
                placeholder="Edad" 
                placeholderTextColor='#9fa8da' 
                selectionColor="white"
                onChangeText={(age) => this.OnChangeNum(age)}
                maxLength={2}
                value={this.state.age}
            />
            <Text style={styles.errorMessage}>{this.state.errors.age}</Text>

            <Text style={styles.labelText}>Género: </Text>
            <RadioForm 
                radio_props={genero}
                initial={-1}
                onPress={(value) => this.setState({gender: value})}
                formHorizontal={true}
                buttonColor={'#ffffff'}
                labelStyle={{fontSize: 16, color: 'white', paddingHorizontal:25}}
                selectedButtonColor={'#ffffff'}
                selectedLabelColor={'#ffffff'}
            />
            <Text style={styles.errorMessage}>{this.state.errors.gender}</Text>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={this.registerButton}>Registrarse</Text>
            </TouchableOpacity>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    contentContainerStyle: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    labelText: {
        fontSize: 18,
        color: 'white',
    },
    inputBox: {
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
    errorMessage: {
        fontSize: 16,
        color:'#ef9a9a'
    },
    errorInputBox: {
        width: 300,
        height: 50,
        backgroundColor: '#8e99f3',
        borderRadius: 25,
        borderColor: '#ef9a9a',
        borderWidth: 3,
        paddingHorizontal: 16,
        fontSize: 20,
        marginVertical: 10,
        color: 'white'
    },
  });
