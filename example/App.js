import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Calendar from './components/Calendar';
import moment from 'moment';

const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f7f7f7',
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment().format(),
    };
  }

  render() {
    const AppColors = {
      luql: {
        pink: '#F22169',
        grey: '#DAE0E3',
        white: '#FFFFFF',
        black: '#000000'
      }
    };

    const customStyle = {
      title: {
        fontSize: 20,
      },
      day: {
        fontSize: 12,
        textAlign: 'center',
      },
      currentDayText: {
        color: AppColors.luql.black,
      },
      calendarControls: {
        backgroundColor: AppColors.luql.white,
      },
      calendarHeading: {
        backgroundColor: AppColors.luql.grey,
      },
      selectedDayCircle: {
        backgroundColor: AppColors.luql.pink,
      },
      currentDayCircle: {
        backgroundColor: AppColors.luql.pink,
      },
      monthContainer: {
        backgroundColor: AppColors.luql.white,
      },
    };

    return (
      <View style={styles.container}>
        <Calendar
          customStyle={customStyle}
          titleFormat={'MMMM'}
          dayHeadings={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          scrollEnabled={true}
        />
        <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
      </View>

    );
  }
}

module.exports = App;
