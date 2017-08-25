import React from 'react';
import axios from 'axios';
import { AsyncStorage, View } from 'react-native';
import { Button, FormInput, FormLabel, Text } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class SignIn extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.handlePressLogin = this.handlePressLogin.bind(this);
    this.state = {
      username: '',
      password: '',
    };
  }

  handlePressLogin() {
    axios.post(`http://192.168.1.6:3009/admin/users/`, {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      let userId = response.data[0].id;
      AsyncStorage.setItem('userId', String(userId));
      this.setState({
        username: '',
        password: '',
      });
    });
    AsyncStorage.getItem('userId').then(value => {
      console.log("Just set up: " + value);
      Actions.home();
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text h4 style={{ textAlign: 'center' }}>Login</Text>
        <FormLabel>Username</FormLabel>
        <FormInput onChangeText={text => this.setState({ username: text })} value={ this.state.username } />
        <FormLabel>Password</FormLabel>
        <FormInput onChangeText={text => this.setState({ password: text })} value={ this.state.password } />
        <Button onPress={this.handlePressLogin} title="Login:" buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
      </View>
    );
  }
}
