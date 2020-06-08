import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';

import Header from '../components/Header';

export default class Chat extends React.Component {
    render() {
      const { refreshing = false } = this.props;

      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <Header text={this.props.chatWithUser}>
            {this.props.inChatRoom && (
              <TouchableOpacity onPress={this.props.backToUsers}>
                <View style={styles.leave_button}>
                  <Text style={styles.leave_button_text}>Leave</Text>
                </View>
              </TouchableOpacity>
            )}
          </Header>

          <View style={styles.body}>
            <ScrollView
              style={styles.messages}
              contentContainerStyle={styles.scroll_container}
              ref={this.props.setScrollViewRef}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.refreshing}
                  onRefresh={this.props.loadPreviousMessages}
                />
              }>
              <FlatList data={this.props.messages} renderItem={this.renderItem} />
            </ScrollView>

            {this.props.chatWithUserIsTyping && (
              <View style={styles.typing_indicator}>
                <Text style={styles.typing_indicator_text}>
                  {this.props.chatWithUser} is typing...
                </Text>
              </View>
            )}

            <View style={styles.message_box}>
              <TextInput
                style={styles.text_field}
                multiline={true}
                onChangeText={this.props.updateMessage}
                value={this.props.message}
                placeholder="Type your message..."
              />

              <View style={styles.button_container}>
                {this.props.inChatRoom && (
                  <TouchableOpacity onPress={this.props.sendMessage}>
                    <View style={styles.send_button}>
                      <Text style={styles.send_button_text}>Send</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      );
    }

    renderItem = ({ item }) => {
        let box_style = item.isCurrentUser ? 'current_user_msg' : 'other_user_msg';
        let username_style = item.isCurrentUser
          ? 'current_user_username'
          : 'other_user_username';
  
        return (
          <View key={item.key} style={styles.msg}>
            <View style={styles.msg_wrapper}>
              <View style={styles.username}>
                <Text style={[styles.username_text, styles[username_style]]}>
                  {item.username}
                </Text>
              </View>
              <View style={[styles.msg_body, styles[box_style]]}>
                <Text style={styles[`${box_style}_text`]}>{item.msg}</Text>
              </View>
            </View>
          </View>
        );
      };