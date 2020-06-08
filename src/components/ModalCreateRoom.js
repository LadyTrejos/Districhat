import React from 'react';
import {Modal, Text, TouchableHighlight, View, Alert,StyleSheet, Dimensions} from 'react-native';


export default class ModalCreateRoom extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isVisible: this.props.isVisible
        }
    }

  setModalVisible(visible) {
    this.setState({isVisible: visible});
  }

  render() {
    return (
        <Modal
            visible={this.state.isVisible}
            //onBackDropPress={onBackDropPress}
        >
            <View style={styles.container}>
                <View style={styles.smallContainerView}>
                    <Text style={styles.titleText}>Photo</Text>
                    <View style={styles.separatorLine}/>

                </View>
            </View>
        </Modal>
    );
  }
}
const {height, width} = Dimensions.get('window');
const MODAL_HEIGHT = height / 3;
const styles = StyleSheet.create({
    container: {
        height: MODAL_HEIGHT,
        width: '100%',
        backgroundColor: 'rgb(245,245,245)',
        borderRadius: 5
    },
    smallContainerView: {
        width: '100%',
        height: MODAL_HEIGHT / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        color:'black',
        marginBottom: 4,
        fontSize: 16,
        fontWeight: 'bold'
    },
    separatorLine: {
        width:'100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor:'blue',
        position: 'absolute',
        bottom: 0
    }
});