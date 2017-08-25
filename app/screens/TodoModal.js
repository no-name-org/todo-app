import React from 'react';
import axios from 'axios';
import { View, Picker } from 'react-native';
import { Text, FormInput, FormLabel, Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

export default class TodoModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editId: props.id,
      titleInput: props.title,
      descriptionInput: props.description,
      mode: props.mode,
      users: {},
    }
    this.getUsers();
    this.handlePressAdd = this.handlePressAdd.bind(this);
    this.handlePressEdit = this.handlePressEdit.bind(this);
    this.handlePressDelete = this.handlePressDelete.bind(this);
  }

  getUsers() {
    return axios.get('http://192.168.1.6:3009/admin/users')
    .then(response => {
      const users = response.data;
      this.setState({
        users: users.map(function (user) {
          return {
            id: user.id,
            name: user.name
          }
        })
      })
    })
  }

  handlePressEdit() {
    axios.put(`http://192.168.1.6:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      Actions.pop();
    });
  }

  handlePressAdd() {
    axios.post('http://192.168.1.6:3009/api/todos', {
      title: this.state.titleInput,
      description: this.state.descriptionInput,
      assigned_to: this.state.userInput,
      created_by: this.state.userId
    })
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      Actions.pop();
    });
  }

  handlePressDelete() {
    axios.delete(`http://192.168.1.6:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      Actions.pop();
    });
  }

  render() {
    let users = this.state.users;
    return(
      <View>
        <Text h4 style={{ textAlign: 'center' }}>{this.state.mode === 'add' ? 'Add' : 'Edit'} To-Do Item</Text>
        <FormLabel>Title</FormLabel>
        <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
        <FormLabel>Description</FormLabel>
        <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
        <Picker
          selectedValue={this.state.userInput}
          onValueChange={(itemValue, itemIndex) => this.setState({userInput: itemValue})}>
          {users.map(user => (
            <Picker.Item key={user.id} label={user.name} value={user.id} />
          ))}
        </Picker>
        <Button onPress={this.state.mode === 'add' ? this.handlePressAdd : this.handlePressEdit} title={this.state.mode === 'add' ? 'Add' : 'Save'} buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
        <Button onPress={this.handlePressDelete} title="Delete" buttonStyle={{marginBottom: 5}} backgroundColor="#990000"/>
        <Button onPress={() => this.setState({ modalVisible: false, mode: 'add', descriptionInput: '', titleInput: '', editId: '' })} title="Close" />
      </View>
    )
  }
}
