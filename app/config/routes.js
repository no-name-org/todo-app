import React from 'react';
import { AsyncStorage } from 'react-native';
import { Router, Stack, Scene, Tabs, TabBarBottom } from 'react-native-router-flux';

import SignIn from '../screens/SignIn'
import UserTasks from '../screens/UserTasks';
import CreatedTasks from '../screens/CreatedTasks';
import TodoModal from '../screens/TodoModal';

const TabIcon = ({ selected, title }) => {
  return (
    <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
  );
}

export const AuthStack = () => (
  <Router>
    <Stack key="root">
      <Scene key="login" component={SignIn} hideNavBar={ true } />
      <Scene key="home" tabs={true} tabBarPosition={'bottom'} tabBarStyle={{backgroundColor: '#009C6B'}} >
        <Scene key="myTasks" title="My Tasks" icon={TabIcon} inital={true} >
          <Scene key="myTasks1" title="My Tasks" component={UserTasks} hideNavBar={true} />
        </Scene>
        <Scene key="createdTasks" icon="Created Tasks" icon={TabIcon} >
          <Scene key="createTasks1" title="Created Tasks" component={CreatedTasks} hideNavBar={true} />
        </Scene>
      </Scene>
      <Scene key="todoModal" component={TodoModal} direction="vertical" hideNavBar={true} />
    </Stack>
  </Router>
);
