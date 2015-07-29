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
  MAX_COLUMNS = 7,
  MAX_ROWS = 7,
  DEVICE_WIDTH = Dimensions.get('window').width,
  VIEW_INDEX = 2;

var Calendar = React.createClass({
  propTypes: {
    dayHeadings: PropTypes.array,
    onDateSelect: PropTypes.func,
    scrollEnabled: PropTypes.bool,
    showControls: PropTypes.bool,
    prevButtonText: PropTypes.string,
    nextButtonText: PropTypes.string,
    titleFormat: PropTypes.string,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    eventDates: PropTypes.array,
    startDate: PropTypes.string,
  },

  getDefaultProps() {
    return {
      scrollEnabled: false,
      showControls: false,
      prevButtonText: 'Prev',
      nextButtonText: 'Next',
      titleFormat: 'MMMM YYYY',
      dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      startDate: moment().format('YYYY-MM-DD'),
    }
  },

  getInitialState() {
    return {
      calendarDates: this.getInitialStack(),
      selectedDate: null,
      currentMonth: moment(this.props.startDate).format()
    };
  },

  componentDidMount() {
    this._scrollToItem(VIEW_INDEX);
  },

  getInitialStack() {
    return([
      moment(this.props.startDate).subtract(2, 'month').format(),
      moment(this.props.startDate).subtract(1, 'month').format(),
      moment(this.props.startDate).format(),
      moment(this.props.startDate).add(1, 'month').format(),
      moment(this.props.startDate).add(2, 'month').format()
    ])
  },


  renderTopBar(date) {
    if(this.props.showControls) {
      return (
        <View style={styles.calendarControls}>
          <TouchableOpacity style={styles.controlButton} onPress={this._onPrev}>
            <Text style={styles.controlButtonText}>{this.props.prevButtonText}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {moment(this.state.currentMonth).format(this.props.titleFormat)}
          </Text>
          <TouchableOpacity style={styles.controlButton} onPress={this._onNext}>
            <Text style={styles.controlButtonText}>{this.props.nextButtonText}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.calendarControls}>
          <Text style={styles.title}>{moment(this.state.currentMonth).format(this.props.titleFormat)}</Text>
        </View>
      )
    }
  },

  renderHeading() {
    return (
      <View style={styles.calendarHeading}>
        {this.props.dayHeadings.map((day) => { return (<Text style={styles.dayHeading}>{day}</Text>) })}
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
          days.push(<TouchableWithoutFeedback><View style={styles.dayButton}></View></TouchableWithoutFeedback>);
        } else {
          if(currentDay < daysInMonth) {
            var newDay = moment(dayStart).set('date', currentDay + 1);
            var isToday = (moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day')) ? true : false;
            var hasEvent = false;
            if (this.props.eventDates) {
              for (var x = 0; x < this.props.eventDates.length; x++) {
                hasEvent = moment(this.props.eventDates[x]).isSame(newDay, 'day') ? true : false;
                if (hasEvent) { break; }
              }
            }

            days.push((
              <TouchableOpacity
                onPress={this._selectDate.bind(this, newDay)}>
                  <View style={styles.dayButton}>
                    <Text style={[styles.day, isToday && styles.currentDay]}>{currentDay + 1}</Text>
                    {this.props.eventDates ?
                      <View style={[styles.eventIndicatorFiller, hasEvent && styles.eventIndicator]}></View>
                      : null
                    }
                  </View>
              </TouchableOpacity>
            ));
            currentDay++;
          }
        }
        preFiller++;
      } // row

      if(days.length > 0 && days.length < 7) {
        for (var x = days.length; x < 7; x++) {
          days.push(<TouchableWithoutFeedback><View style={styles.dayButton}></View></TouchableWithoutFeedback>);
        }
        weekRows.push(<View key={weekRows.length} style={styles.weekRow}>{days}</View>);
      } else {
        weekRows.push(<View key={weekRows.length} style={styles.weekRow}>{days}</View>);
      }
    } // column
    return (<View key={moment(newDay).month()} style={styles.calendarContainer}>{weekRows}</View>);
  },

  _prependMonth() {
    var calendarDates = this.state.calendarDates;
    calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
    calendarDates.pop();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[VIEW_INDEX]
    });
  },

  _appendMonth(){
    var calendarDates = this.state.calendarDates;
    calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
    calendarDates.shift();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[VIEW_INDEX]
    });
  },

  _selectDate(date) {
    this.props.onDateSelect && this.props.onDateSelect(date.format());
  },

  _onPrev(){
    this._prependMonth();
    this._scrollToItem(VIEW_INDEX);
    this.props.onTouchPrev && this.props.onTouchPrev();
  },

  _onNext(){
    this._appendMonth();
    this._scrollToItem(VIEW_INDEX);
    this.props.onTouchNext && this.props.onTouchNext();
  },

  _scrollToItem(itemIndex) {
      var scrollToX = itemIndex * DEVICE_WIDTH;
      this.refs.calendar.scrollWithoutAnimationTo(0, scrollToX);
  },

  _scrollEnded(event) {
    var position = event.nativeEvent.contentOffset.x;
    var currentPage = position / DEVICE_WIDTH;

    if (currentPage < VIEW_INDEX) {
      this._prependMonth();
      this._scrollToItem(VIEW_INDEX);
      this.props.onSwipePrev && this.props.onSwipePrev();
    } else if (currentPage > VIEW_INDEX) {
        this._appendMonth();
        this._scrollToItem(VIEW_INDEX);
        this.props.onSwipeNext && this.props.onSwipeNext();
    } else {
        return false;
    }
  },

  render() {
    return (
      <View>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        <ScrollView
          ref='calendar'
          horizontal={true}
          scrollEnabled={this.props.scrollEnabled}
          pagingEnabled={true}
          removeClippedSubviews={true}
          scrollEventThrottle={600}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  controlButton: {
    flex: 1,
    padding: 5,
  },
  controlButtonText: {
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  calendarHeading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  dayHeading: {
    padding: 5,
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    justifyContent: 'flex-start',
  },
  weekRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayButton: {
    padding: 5,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  day: {
    fontSize: 20,
  },
  eventIndicator: {
    marginTop: 6,
    borderColor: '#cccccc',
    borderWidth: 2.5,
    backgroundColor: '#cccccc',
    borderRadius: 2.5,
  },
  eventIndicatorFiller: {
    marginTop: 6,
    borderColor: 'transparent',
    borderWidth: 2.5,
    backgroundColor: 'transparent',
    borderRadius: 2.5,
  },
  currentDay: {
    color: 'red'
  }
});

module.exports = Calendar;
