'use strict';

let React = require('react-native');
let PropTypes = require('ReactPropTypes');
let moment = require('moment');
let _ = require('lodash');

let {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} = React;

let
  MAX_COLUMNS = 7,
  MAX_ROWS = 7,
  DEVICE_WIDTH = Dimensions.get('window').width;

let Day = React.createClass({

  propTypes: {
    newDay: PropTypes.object,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    hasEvent: PropTypes.bool,
    currentDay: PropTypes.number,
    onPress: PropTypes.func,
    usingEvents: PropTypes.bool,
    filler: PropTypes.bool,
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isSelected !== nextProps.isSelected
  },

  _dayCircleStyle(newDay, isSelected, isToday) {
    var dayCircleStyle = [styles.dayCircleFiller];
    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle);
    }
    return dayCircleStyle;
  },

  _dayTextStyle(newDay, isSelected, isToday) {
    var dayTextStyle = [styles.day];
    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText);
    } else if (moment(newDay).day() === 6 || moment(newDay).day() === 0) {
      dayTextStyle.push(styles.weekendDayText);
    }
    return dayTextStyle;
  },

  render() {
    let {
      currentDay,
      newDay,
      isSelected,
      isToday,
      hasEvent,
      usingEvents,
      filler,
    } = this.props;

    if (filler) {
      return (
        <TouchableWithoutFeedback>
          <View style={styles.dayButtonFiller}>
            <Text style={styles.day}></Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => this.props.onPress(newDay)}>
          <View style={styles.dayButton}>
            <View style={this._dayCircleStyle(newDay, isSelected, isToday)}>
              <Text style={this._dayTextStyle(newDay, isSelected, isToday)}>{currentDay + 1}</Text>
            </View>
            {usingEvents ?
              <View style={[styles.eventIndicatorFiller, hasEvent && styles.eventIndicator]}></View>
              : null
            }
          </View>
        </TouchableOpacity>
      );
    }
  }
});

let Calendar = React.createClass({
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
    selectedDate: PropTypes.string,
    customStyle: PropTypes.object,
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
      selectedDate: moment(this.props.selectedDate).format(),
      currentMonth: moment(this.props.startDate).format()
    };
  },

  componentWillMount() {
    this.renderedMonths = [];
  },

  componentDidMount() {
    this._scrollToItem(this._getViewIndex());
  },

  getInitialStack() {
    var initialStack = [];
    if (this.props.scrollEnabled) {
      initialStack.push(moment(this.props.startDate).subtract(2, 'month').format());
      initialStack.push(moment(this.props.startDate).subtract(1, 'month').format());
      initialStack.push(moment(this.props.startDate).format());
      initialStack.push(moment(this.props.startDate).add(1, 'month').format());
      initialStack.push(moment(this.props.startDate).add(2, 'month').format());
    } else {
      initialStack.push(moment(this.props.startDate).format())
    }
    return initialStack;
  },


  renderTopBar(date) {
    if(this.props.showControls) {
      return (
        <View style={this.styles.calendarControls}>
          <TouchableOpacity style={this.styles.controlButton} onPress={this._onPrev}>
            <Text style={this.styles.controlButtonText}>{this.props.prevButtonText}</Text>
          </TouchableOpacity>
          <Text style={this.styles.title}>
            {moment(this.state.currentMonth).format(this.props.titleFormat)}
          </Text>
          <TouchableOpacity style={this.styles.controlButton} onPress={this._onNext}>
            <Text style={this.styles.controlButtonText}>{this.props.nextButtonText}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={this.styles.calendarControls}>
          <Text style={this.styles.title}>{moment(this.state.currentMonth).format(this.props.titleFormat)}</Text>
        </View>
      )
    }
  },

  renderHeading() {
    return (
      <View style={this.styles.calendarHeading}>
        {this.props.dayHeadings.map((day, i) => { return (<Text key={i} style={i == 0 || i == 6 ? this.styles.weekendHeading : this.styles.dayHeading}>{day}</Text>) })}
      </View>
    )
  },

  renderMonthView(date) {
    var dayStart = moment(date).startOf('month').format(),
      daysInMonth = moment(dayStart).daysInMonth(),
      offset = moment(dayStart).get('day'),
      preFiller = 0,
      currentDay = 0,
      weekRows = [],
      renderedMonthView;

    for (var i = 0; i < MAX_COLUMNS; i++) {
      var days = [];
      for (var j = 0; j < MAX_ROWS; j++) {
        if (preFiller < offset) {
          days.push(<Day key={`${i},${j}`} filler={true} />);
        } else {
          if(currentDay < daysInMonth) {
            var newDay = moment(dayStart).set('date', currentDay + 1);
            var isToday = (moment().isSame(newDay, 'month') && moment().isSame(newDay, 'day')) ? true : false;
            var isSelected = (moment(this.state.selectedDate).isSame(newDay, 'month') && moment(this.state.selectedDate).isSame(newDay, 'day')) ? true : false;
            var hasEvent = false;
            if (this.props.eventDates) {
              for (var x = 0; x < this.props.eventDates.length; x++) {
                hasEvent = moment(this.props.eventDates[x]).isSame(newDay, 'day') ? true : false;
                if (hasEvent) { break; }
              }
            }

            days.push((
              <Day
                key={`${i},${j}`}
                onPress={this._selectDate}
                currentDay={currentDay}
                newDay={newDay}
                isToday={isToday}
                isSelected={isSelected}
                hasEvent={hasEvent}
                usingEvents={this.props.eventDates.length > 0 ? true : false}
              />
            ));
            currentDay++;
          }
        }
        preFiller++;
      } // row

      if(days.length > 0 && days.length < 7) {
        for (var x = days.length; x < 7; x++) {
          days.push(<Day key={x} filler={true}/>);
        }
        weekRows.push(<View key={weekRows.length} style={this.styles.weekRow}>{days}</View>);
      } else {
        weekRows.push(<View key={weekRows.length} style={this.styles.weekRow}>{days}</View>);
      }
    } // column

    renderedMonthView = <View key={moment(newDay).month()} style={this.styles.monthContainer}>{weekRows}</View>;
    // keep this rendered month view in case it can be reused without generating it again
    this.renderedMonths.push([date, renderedMonthView])
    return renderedMonthView;
  },

  _getViewIndex() {
    return this.props.scrollEnabled ? 2 : 0;
  },

  _dayCircleStyle(newDay, isSelected, isToday) {
    var dayCircleStyle = [this.styles.dayCircleFiller];
    if (isSelected && !isToday) {
      dayCircleStyle.push(this.styles.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(this.styles.currentDayCircle);
    }
    return dayCircleStyle;
  },

  _dayTextStyle(newDay, isSelected, isToday) {
    var dayTextStyle = [this.styles.day];
    if (isToday && !isSelected) {
      dayTextStyle.push(this.styles.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(this.styles.selectedDayText);
    } else if (moment(newDay).day() === 6 || moment(newDay).day() === 0) {
      dayTextStyle.push(this.styles.weekendDayText);
    }
    return dayTextStyle;
  },

  _prependMonth() {
    var calendarDates = this.state.calendarDates;
    calendarDates.unshift(moment(calendarDates[0]).subtract(1, 'month').format());
    calendarDates.pop();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[this._getViewIndex()]
    });
  },

  _appendMonth(){
    var calendarDates = this.state.calendarDates;
    calendarDates.push(moment(calendarDates[calendarDates.length - 1]).add(1, 'month').format());
    calendarDates.shift();
    this.setState({
      calendarDates: calendarDates,
      currentMonth: calendarDates[this._getViewIndex()]
    });
  },

  _selectDate(date) {
    this.setState({
      selectedDate: date,
    });
    this.props.onDateSelect && this.props.onDateSelect(date.format());
  },

  _onPrev(){
    this._prependMonth();
    this._scrollToItem(this._getViewIndex());
    this.props.onTouchPrev && this.props.onTouchPrev(this.state.calendarDates[this._getViewIndex()]);
  },

  _onNext(){
    this._appendMonth();
    this._scrollToItem(this._getViewIndex());
    this.props.onTouchNext && this.props.onTouchNext(this.state.calendarDates[this._getViewIndex()]);
  },

  _scrollToItem(itemIndex) {
    var scrollToX = itemIndex * DEVICE_WIDTH;
    if (this.props.scrollEnabled) {
      this.refs.calendar.scrollWithoutAnimationTo(0, scrollToX);
    }
  },

  _scrollEnded(event) {
    var position = event.nativeEvent.contentOffset.x;
    var currentPage = position / DEVICE_WIDTH;

    if (currentPage < this._getViewIndex()) {
      this._prependMonth();
      this._scrollToItem(this._getViewIndex());
      this.props.onSwipePrev && this.props.onSwipePrev();
    } else if (currentPage > this._getViewIndex()) {
      this._appendMonth();
      this._scrollToItem(this._getViewIndex());
      this.props.onSwipeNext && this.props.onSwipeNext();
    } else {
      return false;
    }
  },

  _renderedMonth(date) {
    var renderedMonth = null;
    if (moment(this.state.currentMonth).isSame(date, 'month')) {
      renderedMonth = this.renderMonthView(date);
    } else {
      for (var i = 0; i < this.renderedMonths.length; i++) {
        if (moment(this.renderedMonths[i][0]).isSame(date, 'month')) {
          renderedMonth = this.renderedMonths[i][1];
        }
      }
      if (!renderedMonth) { renderedMonth = this.renderMonthView(date); }
    }
    return renderedMonth;
  },

  render() {
    this.styles = _.merge(styles, this.props.customStyle);
    return (
      <View style={this.styles.calendarContainer}>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        {this.props.scrollEnabled ?
          <ScrollView
            ref='calendar'
            horizontal={true}
            scrollEnabled={true}
            pagingEnabled={true}
            removeClippedSubviews={true}
            scrollEventThrottle={600}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets={false}
            onMomentumScrollEnd={(event) => this._scrollEnded(event)}>
              {this.state.calendarDates.map((date) => { return this._renderedMonth(date) })}
          </ScrollView>
          :
          <View ref='calendar'>
            {this.state.calendarDates.map((date) => { return this._renderedMonth(date) })}
          </View>
        }
      </View>
    )
  }
});

var styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH
  },
  calendarControls: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
  controlButton: {
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
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dayHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5
  },
  weekendHeading: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 5,
    color: '#cccccc'
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 5,
    width: DEVICE_WIDTH / 7,
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
  },
  dayButtonFiller: {
    padding: 5,
    width: DEVICE_WIDTH / 7
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc'
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'red',
  },
  selectedDayCircle: {
    backgroundColor: 'black',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: '#cccccc',
  }
});

module.exports = Calendar;
