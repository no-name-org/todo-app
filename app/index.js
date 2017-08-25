// import { AppRegistry } from 'react-native';
// import App from './app/index';
//
// AppRegistry.registerComponent('testapp', () => App);

import React from 'react';
import { AsyncStorage, AppRegistry, FlatList, Modal, StyleSheet, ToastAndroid, View, Picker } from 'react-native';
import {
  Button,
  FormInput,
  FormLabel,
  Header,
  Icon,
  List,
  ListItem,
  Text
} from 'react-native-elements';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.editTodo = this.editTodo.bind(this);
    this.getTodos = this.getTodos.bind(this);
    this.handlePressAdd = this.handlePressAdd.bind(this);
    this.handlePressEdit = this.handlePressEdit.bind(this);
    this.handlePressDelete = this.handlePressDelete.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.handlePressLogin = this.handlePressLogin.bind(this);

    this.state = {
      userId: '',
      username: '',
      password: '',
      titleInput: '',
      descriptionInput: '',
      modalTodo: false,
      modalLogin: false,
      refreshing: false,
      userInput: '',
      editId: null,
      mode: 'add',
      todoItems: [],
      users: []
    };
  }

  componentDidMount() {
    this.getTodos();
    this.getUsers();
  }

  getTodos() {
    this.setState({ refreshing: true });
    //192.168.1.6
    return axios.get('http://10.19.13.242:3009/api/todos')
    .then(response => {
      const todos = response.data;

      this.setState({
        refreshing: false,
        todoItems: todos.map(function (todo) {
          return {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            switched: !!todo.done
          };
        })
      });
    })
    .catch(err => {
      this.setState({ refreshing: false });
      ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
    });
  }

  getUsers() {
    return axios.get('http://10.19.13.242:3009/admin/users')
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

  handlePressLogin() {
    axios.post(`http://10.19.13.242:3009/admin/users/`, {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      ToastAndroid.show(response.data.username, ToastAndroid.SHORT);
      let userId = response.data[0].id;
      AsyncStorage.setItem('userId', String(userId));
      this.setState({
        username: '',
        password: '',
        modalLogin: false,
      }, () => {
        this.getTodos();
      });
    });
  }

  handlePressEdit() {
    axios.put(`http://10.19.13.242:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      this.setState({
        descriptionInput: '',
        modalTodo: false,
        titleInput: '',
        userInput: '',
        editId: null,
        mode: 'add'
      }, () => {
        this.getTodos();
      });
    });
  }

  handlePressAdd() {
    const todoItems = this.state.todoItems.concat();
    const payload = {
      title: this.state.titleInput,
      description: this.state.descriptionInput,
      assigned_to: this.state.userInput,
      created_by: this.state.userId
    };

    axios.post('http://10.19.13.242:3009/api/todos', payload)
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      this.setState({
        descriptionInput: '',
        modalTodo: false,
        titleInput: '',
        userInput: ''
      })
    })
    .catch(err => ToastAndroid.show(err.response.data.error, ToastAndroid.LONG))
    .then(this.getTodos);
  }

  handlePressDelete() {
    axios.delete(`http://10.19.13.242:3009/api/todos/${this.state.editId}`, {
      title: this.state.titleInput,
      description: this.state.descriptionInput
    })
    .then(response => {
      ToastAndroid.show(response.data.message, ToastAndroid.SHORT);

      this.setState({
        descriptionInput: '',
        modalTodo: false,
        titleInput: '',
        editId: null,
        mode: 'add'
      }, () => {
        this.getTodos();
      });
    });
  }

  toggleSwitch(index) {
    AsyncStorage.getItem("userId").then((value) => {
      console.log("passed");
      console.log(value);
      this.setState({"userId": value});
    }).done();
    const { todoItems } = this.state;
    const todoItem = todoItems[index];

    this.setState({
      todoItems: [
        ...todoItems.slice(0, index),
        {
          ...todoItem,
          switched: !todoItem.switched
        },
        ...todoItems.slice(index + 1)
      ]
    });
  }

  editTodo(index) {
    const todo = this.state.todoItems[index];

    this.setState({
      modalTodo: true,
      titleInput: todo.title,
      descriptionInput: todo.description,
      mode: 'edit',
      editId: todo.id
    });
  }

  renderRow({ item, index }) {
    return (
      <ListItem
        hideChevron={true}
        onPress={this.editTodo.bind(null, index)}
        onSwitch={this.toggleSwitch.bind(null, index)}
        subtitle={item.description}
        subtitleStyle={{ color: item.switched ? '#009C6B' : '#a3a3a3' }}
        switched={item.switched}
        switchButton={true}
        title={item.title}
        titleStyle={{ color: item.switched ? '#009C6B' : '#000000' }}
      />
    );
  }

  render() {
    let users = this.state.users;
    return (
      <View>
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({ modalLogin: false })}
          transparent={false}
          visible={this.state.modalLogin}>
          <View>
            <Text h4 style={{ textAlign: 'center' }}>Login</Text>
            <FormLabel>Username</FormLabel>
            <FormInput onChangeText={text => this.setState({ username: text })} value={this.state.username} />
            <FormLabel>Password</FormLabel>
            <FormInput onChangeText={text => this.setState({ password: text })} value={this.state.password} />
            <Button onPress={this.handlePressLogin} title="Login" buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          onRequestClose={() => this.setState({ modalTodo: false, mode: 'add' })}
          transparent={false}
          visible={this.state.modalTodo}>
          <View>
            <Text h4 style={{ textAlign: 'center' }}>{this.state.mode === 'add' ? 'Add' : 'Edit'} To-Do Item</Text>
            <FormLabel>Title</FormLabel>
            <FormInput onChangeText={text => this.setState({ titleInput: text })} value={this.state.titleInput} />
            <FormLabel>Description</FormLabel>
            <FormInput onChangeText={text => this.setState({ descriptionInput: text })} value={this.state.descriptionInput} />
            <Picker selectedValue={this.state.userInput} onValueChange={(itemValue, itemIndex) => this.setState({userInput: itemValue})}>
              {users.map(user => (
                <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
            </Picker>
            <Button onPress={this.state.mode === 'add' ? this.handlePressAdd : this.handlePressEdit} title={this.state.mode === 'add' ? 'Add' : 'Save'} buttonStyle={{ marginBottom: 5 }} backgroundColor="#009C6B"/>
            <Button onPress={this.handlePressDelete} title="Delete" buttonStyle={{marginBottom: 5}} backgroundColor="#990000"/>
            <Button onPress={() => this.setState({ modalTodo: false, mode: 'add', descriptionInput: '', titleInput: '', editId: '' })} title="Close" />
          </View>
        </Modal>

        <Header
          leftComponent={{ icon: 'menu' , onPress: () => this.setState({ modalLogin: true })}}
          centerComponent={{ text: 'To-Do List' }}
          rightComponent={{ icon: 'add', onPress: () => this.setState({ modalTodo: true }) }}
        />
        <List containerStyle={{ marginTop: 70 }}>
          <FlatList
            data={this.state.todoItems}
            keyExtractor={item => item.id}
            onRefresh={this.getTodos}
            refreshing={this.state.refreshing}
            renderItem={this.renderRow}
          />
        </List>
      </View>
    );
  }
}
