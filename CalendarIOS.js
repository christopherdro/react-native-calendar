'use strict';

var React = require('react-native');
var PropTypes = require('ReactPropTypes');
var Dimensions = require('Dimensions');
var moment = require('moment');

var {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} = React;

var 
  DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  MAX_COLUMNS = 7,
  MAX_ROWS = 7,
  DEVICE_WIDTH = Dimensions.get('window').width,
  _currentMonthIndex = 2;

var Calendar = React.createClass({
  propTypes: {
    onDateSelect: PropTypes.func,
    scrollEnabled: PropTypes.bool,
    showControls: PropTypes.bool,
    prevButtonText: PropTypes.string,
    nextButtonText: PropTypes.string,
    titleFormat: PropTypes.string,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
  },

  getDefaultProps() {
    return {
      scrollEnabled: false,
      showControls: false,
      prevButtonText: 'Prev',
      nextButtonText: 'Next',
      titleFormat: 'MMMM YYYY'
    }
  },
  getInitialState() {
    return {
     calendarDates: [
        moment().subtract(2, 'month').format(),
        moment().subtract(1, 'month').format(), 
        moment().format(), 
        moment().add(1, 'month').format(),
        moment().add(2, 'month').format()
      ],
      selectedDate: null,
      currentMonth: moment().format()
    };
  },

  componentDidMount() {
    this._scrollToItem(_currentMonthIndex);
  },

  renderHeading() {
    return (
      <View style={styles.calendarHeading}>
        {DAYS.map((day) => { return (<Text style={styles.dayListDay}>{day}</Text>) })}
      </View>
    )
  },

  renderControls(date) {
    return (
      <View style={styles.calendarControls}>
        <TouchableOpacity onPress={this._onPrev.bind(this)}>
          <Text style={styles.controlButton}>{this.props.prevButtonText}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {moment(this.state.currentMonth).format(this.props.titleFormat)}
        </Text>
        <TouchableOpacity onPress={this._onNext.bind(this)}>
          <Text style={styles.controls}>{this.props.nextButtonText}</Text>
        </TouchableOpacity>
      </View>
    )
  },

  renderMonthView(date) {
  
    var dayStart = moment(date).startOf('month').format(),
      daysInMonth = moment(dayStart).daysInMonth(),
      offset = moment(dayStart).get('day'),
      preFiller = 0,
      currentDay = 0,
      weekRows = [];

    for (var i = 0; i < MAX_COLUMNS; i++) {
      var days = [];
      for (var j = 0; j < MAX_ROWS; j++) {
        if (preFiller < offset) {
          days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
        } else {
          if(currentDay < daysInMonth) {
            var newDay = moment(dayStart).set('date', currentDay + 1);
            var isToday = (moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day')) ? true : false;
            
            days.push((
              <TouchableOpacity
                onPress={this._selectDate.bind(this, newDay)}>
                <Text style={[styles.dayListDay, isToday && styles.currentDay]}>{currentDay + 1}</Text>
              </TouchableOpacity>
            ));
            currentDay++;
          } 
        } 
        preFiller++;
      } // row

      if(days.length > 0 && days.length < 7) {
        for (var x = days.length; x < 7; x++) {
          days.push(<TouchableWithoutFeedback><Text style={styles.dayListDay}></Text></TouchableWithoutFeedback>);
        }        
        weekRows.push(<View key={weekRows.length} style={styles.dayList}>{days}</View>);
      } else {
        weekRows.push(<View key={weekRows.length} style={styles.dayList}>{days}</View>);
      }
    } // column 
    return (<View key={moment(newDay).month()} style={styles.calendarContainer}>{weekRows}</View>);
  },

  _onPrev(){
    this._prependMonth();
    this._scrollToItem(_currentMonthIndex);
  },
  
  _onNext(){
    this._appendMonth();
    this._scrollToItem(_currentMonthIndex);
  },

  _prependMonth() {
    var calendarDates = this.state.calendarDates;
    
    calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
    calendarDates.pop();
    
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[_currentMonthIndex]
    });
  },

  _appendMonth(){
    var calendarDates = this.state.calendarDates;
    
    calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
    calendarDates.shift();
    
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[_currentMonthIndex]
    });
  },

  _selectDate(date) {
    console.log(date.format());
  },

  _scrollToItem(itemIndex) {
      var scrollToX = itemIndex * DEVICE_WIDTH;
      this.refs.calendar.scrollWithoutAnimationTo(0, scrollToX);
  },
  
  _scrollEnded(event) {
    var position = event.nativeEvent.contentOffset.x;
    var currentPage = position / DEVICE_WIDTH;

    if (currentPage < _currentMonthIndex) {
      this._prependMonth();
      this._scrollToItem(_currentMonthIndex);
    } else if (currentPage > _currentMonthIndex) {
        this._appendMonth();
        this._scrollToItem(_currentMonthIndex);
    } else {
        return false;
    }
  },

  render() {

    return (
      <View>
        {this.props.showControls && this.renderControls()}
        {this.renderHeading(this.props.titleFormat)}
        <ScrollView
          ref='calendar'
          horizontal={true}
          scrollEnabled={this.props.scrollEnabled}
          pagingEnabled={true}
          removeClippedSubviews={true}
          scrollEventThrottle={600}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => this._scrollEnded(event)}>
          {this.state.calendarDates.map((date) => { return this.renderMonthView(date) })}
        </ScrollView>
      </View>
    )
  }
});
  
var styles = StyleSheet.create({
  calendarContainer: {
    width: DEVICE_WIDTH
  },
  calendarControls: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    marginTop: 30
  },
  controlButton: {
    flex: 0.1,
    fontSize: 15,
  },
  title: {
    flex: 0.8,
    textAlign: 'center',
    fontSize: 20
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
  dayListDay: {
    padding: 5,
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    justifyContent: 'flex-start'
  },
  currentDay: {
    color: 'red'
  }
});

module.exports = Calendar;