import React from 'react';
import axios from 'axios';
import { AsyncStorage, FlatList, ToastAndroid, View } from 'react-native';
import { Header, List } from 'react-native-elements';

import TodoItem from '../components/TodoItem'

export default class UserTasks extends React.Component {
  constructor(props, ctx) {
    super(props, ctx);

    this.getTodos = this.getTodos.bind(this);
    this.renderRow = this.renderRow.bind(this);

    this.state = {
      editId: null,
      refreshing: false,
      todoItems: [],
      users: [],
    };
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    AsyncStorage.getItem('userId').then(value => {
      console.log(value);
      this.setState({ refreshing: true });
      return axios.get(`http://192.168.1.6:3009/api/todos/userTasks/${value}`)
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
        ToastAndroid.show(err.toString(), ToastAndroid.LONG);
      });
    });
  }

  renderRow({index, item}) {
    return(
      <TodoItem item={item} />
    );
  }

  render() {
    let users = this.state.users;
    return (
      <View>
        <Header
          centerComponent={{ text: 'To-Do List' }}
          rightComponent={{ icon: 'add', onPress: () => this.setState({ modalVisible: true }) }}
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
