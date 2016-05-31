/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Calendar from 'react-native-calendar'
import moment from 'moment'

var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
var customMonthHeadings = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]

class CalendarExample extends Component {

  componentWillMount() {
    this.setState({
      selectedDate: moment().format()
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Calendar
          ref="calendar"
          eventDates={['2016-05-03', '2016-05-13','2016-05-23','2016-05-01','2016-05-18']}
          showControls={true}
          dayHeadings={customDayHeadings}
          titleFormat={'MMMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          onDateSelect={(date) => this.setState({selectedDate: date})}
          scrollEnabled={false}
          monthHeadings={customMonthHeadings}
          />
        <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('CalendarExample', () => CalendarExample);
