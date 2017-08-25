import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { ToastAndroid } from 'react-native';
import { ListItem } from 'react-native-elements';

import styles from './styles';

export default class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.item.id,
      title: props.item.title,
      description: props.item.description,
      switched: props.item.switched,
    }
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  toggleSwitch() {
    axios.post(`http://192.168.1.6:3009/api/todos/done`, {
      id: this.state.id,
      done: !this.state.switched,
    })
    .then(response => {
      ToastAndroid.show(response.data, ToastAndroid.SHORT);
      this.setState({
        switched: !this.state.switched,
      })
    });
  }

  toggleEdit() {
    
  }

  render() {
    let item = this.state;
    return (
      <ListItem
        hideChevron={true}
        // onPress={this.editTodo.bind(null, index)}
        onSwitch={this.toggleSwitch}
        switched={item.switched}
        switchButton={true}
        title={item.title}
        subtitle={item.description}
        titleStyle={item.switched ? styles.active : styles.inactiveTitle}
        subtitleStyle={item.switched ? styles.active : styles.inactiveSubtitle}
      />
    );
  }
}

TodoItem.propTypes = {
  item: PropTypes.object,
}
