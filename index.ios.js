var React = require('react-native');
var moment = require('moment');
var Dimensions = require('Dimensions');

var {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} = React;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  MAX_COLUMNS = 7,
  MAX_ROWS = 7

class CalendarSwiper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarDates: [moment().add(5, 'month').format(), moment().add(6, 'month').format(),moment().add(7, 'month').format(), moment().add(8, 'month').format()],
      selectedDate: null,
    }
  }

  renderMonthView(date) {
  
    var dayStart = moment(date).startOf('month').format(),
      daysInMonth = moment(dayStart).daysInMonth(),
      offset = moment(dayStart).get('day'),
      preFiller = 0,
      postFiller = 7 - (moment(dayStart).endOf('month').get('day') + 1),
      currentDay = 0,
      weekRows = [];

    for (var i = 0; i < MAX_COLUMNS; i++) {
      var days = [];
      for (var j = 0; j < MAX_ROWS; j++) {  
        if (preFiller >= offset) {
          if(currentDay < daysInMonth) {
            days.push((
              <TouchableOpacity
                onPress={this._selectDate.bind(this, moment(dayStart).set('date', currentDay + 1))}>
                <Text style={styles.dayListDay}>{currentDay+1}</Text>
              </TouchableOpacity>
            ));
            currentDay++; 
          } 
        } else {
            days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
          }
        preFiller++;  
      }

      if(weekRows.length < Math.ceil((daysInMonth + offset) / 7) && days.length < 7) {
        for (var x = 0; x < postFiller; x++) {
          days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
        }        
        weekRows.push(<View style={[styles.dayList, styles.lastRow]}>{days}</View>);
      } else {
        weekRows.push(<View style={styles.dayList}>{days}</View>);
      }
    }
    
    return (
      <View ref="InnerScrollView" style={styles.calendarContainer} ref={moment(dayStart).format('YYYY-MM')}>

        <View style={styles.calendarControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {moment(date).format('MMMM YYYY')}
          </Text>
          
          <TouchableOpacity style={styles.controls}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarHeading}>
          {DAYS.map((day) => {
            return (<Text style={styles.dayListDay}>{day}</Text>) })}
        </View>

        {weekRows}
      </View>
    );
  }

  _selectDate(date) {
    console.log(date.format());
  }

  render() {
    return (
      <ScrollView
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        scrollEventThrottle={300}
        onMomentumScrollEnd={() => { console.log(this.refs)}}>
        {this.state.calendarDates.map((date) => { return this.renderMonthView(date) })}
      </ScrollView>
    )
  }
};
  var styles = StyleSheet.create({
    calendarContainer: {
      marginTop: 20,
      width: Dimensions.get('window').width
    },
    title: {
      textAlign: 'center',
      flex: 2,
    },
    calendarControls: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10
    },
    controlButton: {
      flex: 0.1
    },
    title: {
      flex: 0.8,
      textAlign: 'center'
    },
    calendarHeading: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 2,
      borderBottomWidth: 2
    },
    dayList: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    lastRow: {
      backgroundColor: 'red'
    },
    dayListDay: {
      padding: 5,
      flex: 1,
      textAlign: 'center',
      fontSize: 20,
      justifyContent: 'flex-start'
    },
    currentDay: {
      color: '#FF3333'
    }
  });

AppRegistry.registerComponent('CalendarSwiper', () => CalendarSwiper);