import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Day from './Day';

import moment from 'moment';
import styles from './styles';

const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 2;

function getNumberOfWeeks(month) {
  const firstWeek = moment(month).startOf('month').week();
  const lastWeek = moment(month).endOf('month').week();
  return lastWeek - firstWeek + 1;
}

export default class Calendar extends Component {

  state = {
    currentMonthMoment: moment(this.props.startDate),
    selectedMoment: moment(this.props.selectedDate),
    rowHeight: null,
  };

  static propTypes = {
    customStyle: PropTypes.object,
    dayHeadings: PropTypes.array,
    eventDates: PropTypes.array,
    disabledDates: PropTypes.array,
    disabledDays: PropTypes.array,
    monthNames: PropTypes.array,
    nextButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onLongPress: PropTypes.func,
    onDateSelect: PropTypes.func,
    onSwipeNext: PropTypes.func,
    onSwipePrev: PropTypes.func,
    onTouchNext: PropTypes.func,
    onTouchPrev: PropTypes.func,
    prevButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    scrollEnabled: PropTypes.bool,
    selectedDate: PropTypes.any,
    showControls: PropTypes.bool,
    showEventIndicators: PropTypes.bool,
    startDate: PropTypes.any,
    titleFormat: PropTypes.string,
    today: PropTypes.any,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    weekStart: PropTypes.number,
  };

  static defaultProps = {
    customStyle: {},
    width: DEVICE_WIDTH,
    dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    eventDates: [],
    disabledDates: [],
    disabledDays: [],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    nextButtonText: 'Next',
    prevButtonText: 'Prev',
    scrollEnabled: false,
    showControls: false,
    showEventIndicators: false,
    startDate: moment().format('YYYY-MM-DD'),
    titleFormat: 'MMMM YYYY',
    today: moment(),
    minDate: moment(),
    maxDate: moment().add(1,'year'),
    weekStart: 1,
  };

  componentDidMount() {
    // fixes initial scrolling bug on Android
    setTimeout(() => this.scrollToItem(VIEW_INDEX), 0)
  }

  componentDidUpdate() {
    this.scrollToItem(VIEW_INDEX);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate && this.props.selectedDate !== nextProps.selectedDate) {
      this.setState({selectedMoment: nextProps.selectedDate});
    }
  }

  getMonthStack(currentMonth) {
    if (this.props.scrollEnabled) {
      const res = [];
      for (let i = -VIEW_INDEX; i <= VIEW_INDEX; i++) {
        res.push(moment(currentMonth).add(i, 'month'));
      }
      return res;
    }
    return [moment(currentMonth)];
  }

 prepareEventDates(eventDates, events) {
    const parsedDates = {};

    // Dates without any custom properties
    eventDates.forEach(event => {
      const date = moment(event);
      const month = moment(date).startOf('month').format();
      parsedDates[month] = parsedDates[month] || {};
      parsedDates[month][date.date() - 1] = {};
    });

    // Dates with custom properties
    if (events) {
      events.forEach(event => {
        if (event.date) {
            const date = moment(event.date);
            const month = moment(date).startOf('month').format();
            parsedDates[month] = parsedDates[month] || {};
            parsedDates[month][date.date() - 1] = event;
        }
      });
    }
    return parsedDates;
  }
  prepareDisabledDates(disabledDates) {
    const parsedDates = {};

    disabledDates.forEach(disabled => {
      const date = moment(disabled);
      const month = moment(date).startOf('month').format();
      parsedDates[month] = parsedDates[month] || {};
      parsedDates[month][date.date() - 1] = {};
    });

    return parsedDates;
  }

  selectDate(date) {
    if (this.props.selectedDate === undefined) {
      this.setState({ selectedMoment: date });
    }
    this.props.onDateSelect && this.props.onDateSelect(date ? date.format(): null );
  }

  longPress(date) {
      this.props.onLongPress && this.props.onLongPress(date ? date.format(): null );
  }

  onPrev = () => {
    const newMoment = moment(this.state.currentMonthMoment).subtract(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchPrev && this.props.onTouchPrev(newMoment);
  }

  onNext = () => {
    const newMoment = moment(this.state.currentMonthMoment).add(1, 'month');
    this.setState({ currentMonthMoment: newMoment });
    this.props.onTouchNext && this.props.onTouchNext(newMoment);
  }

  scrollToItem(itemIndex) {
    const scrollToX = itemIndex * this.props.width;
    if (this.props.scrollEnabled) {
      this._calendar.scrollTo({ y: 0, x: scrollToX, animated: false });
    }
  }

  scrollEnded(event) {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = position / this.props.width;
    const newMoment = moment(this.state.currentMonthMoment).add(currentPage - VIEW_INDEX, 'month');
    this.setState({ currentMonthMoment: newMoment });

    if (currentPage < VIEW_INDEX) {
      this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
    } else if (currentPage > VIEW_INDEX) {
      this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
    }
  }

  onWeekRowLayout = (event) => {
    if (this.state.rowHeight !== event.nativeEvent.layout.height) {
      this.setState({ rowHeight: event.nativeEvent.layout.height });
    }
  }

  renderMonthView(argMoment, eventsMap, disabledDatesMap) {

    let
      renderIndex = 0,
      weekRows = [],
      days = [],
      startOfArgMonthMoment = argMoment.startOf('month');

    const
      selectedMoment = moment(this.state.selectedMoment),
      weekStart = this.props.weekStart,
      todayMoment = moment(this.props.today),
      todayIndex = todayMoment.date() - 1,
      argMonthDaysCount = argMoment.daysInMonth(),
      argMomentYear = argMoment.format('YYYY'),
      argMomentMonth = argMoment.format('M'),
      offset = (startOfArgMonthMoment.isoWeekday() - weekStart + 7) % 7,
      argMonthIsToday = argMoment.isSame(todayMoment, 'month'),
      selectedIndex = moment(selectedMoment).date() - 1,
      selectedMonthIsArg = selectedMoment.isSame(argMoment, 'month');

    const events = (eventsMap !== null)
      ? eventsMap[argMoment.startOf('month').format()]
      : null;

    const disabledDates = (disabledDatesMap !== null)
      ? disabledDatesMap[argMoment.startOf('month').format()]
      : null;

    const minDate = moment(this.props.minDate);
    const maxDate =  moment(this.props.maxDate);

    do {
      const dayIndex = renderIndex - offset;
      const isoWeekday = (renderIndex + weekStart) % 7;
      const currentDate = moment(startOfArgMonthMoment).set('date', dayIndex + 1);

      if (dayIndex >= 0 && dayIndex < argMonthDaysCount) {
        if(currentDate.isBetween(minDate, maxDate, 'day', '[]'))
        {
          const dayDisabled = this.props.disabledDays.includes(isoWeekday);
          const dateDisabled = !!(disabledDates && disabledDates[dayIndex]);
          if( !dayDisabled && !dateDisabled )
          {
            days.push((
              <Day
                startOfMonth={startOfArgMonthMoment}
                key={`${renderIndex}`}
                onPress={() => this.selectDate(currentDate)}
                onLongPress={() => this.longPress(currentDate)}
                caption={`${dayIndex + 1}`}
                isToday={argMonthIsToday && (dayIndex === todayIndex)}
                isSelected={selectedMonthIsArg && (dayIndex === selectedIndex)}
                event={events && events[dayIndex]}
                showEventIndicators={this.props.showEventIndicators}
                customStyle={this.props.customStyle}
              />
            ));
          } else {
            days.push(<Day
                        key={`${renderIndex}`}
                        caption={`${dayIndex + 1}`}
                        isToday={argMonthIsToday && (dayIndex === todayIndex)}
                        showEventIndicators={this.props.showEventIndicators}
                        disabled
                        customStyle={this.props.customStyle}
                        />);
          }
        } else {
           days.push(<Day
                        key={`${renderIndex}`}
                        caption={`${dayIndex + 1}`}
                        isToday={argMonthIsToday && (dayIndex === todayIndex)}
                        showEventIndicators={this.props.showEventIndicators}
                        disabled
                        customStyle={this.props.customStyle}
                        />);
        }
      } else {
        days.push(<Day key={`${renderIndex}`} filler customStyle={this.props.customStyle} />);
      }
      if (renderIndex % 7 === 6) {
        weekRows.push(
          <View
            key={weekRows.length}
            onLayout={weekRows.length ? undefined : this.onWeekRowLayout}
            style={[styles.weekRow, this.props.customStyle.weekRow]}
          >
            {days}
          </View>);
        days = [];
        if (dayIndex + 1 >= argMonthDaysCount) {
          break;
        }
      }
      renderIndex += 1;
    } while (true)
    const containerStyle = [styles.monthContainer, this.props.customStyle.monthContainer];
    return <View key={argMoment.month()} style={containerStyle}>{weekRows}</View>;
  }

  renderHeading() {
    const headings = [];
    for (let i = 0; i < 7; i++) {
      const j = (i + this.props.weekStart) % 7;
      headings.push(
        <Text
          key={i}
          style={[styles.dayHeading, this.props.customStyle.dayHeading]}
        >
          {this.props.dayHeadings[j]}
        </Text>
      );
    }

    return (
      <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
        {headings}
      </View>
    );
  }

  renderTopBar() {
    return this.props.showControls
    ? (
        <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
          <TouchableOpacity
            style={[styles.controlButton, this.props.customStyle.controlButton]}
            onPress={this.onPrev}
          >
            <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
              {this.props.prevButtonText}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, this.props.customStyle.title]}>
            {this.state.currentMonthMoment.format(this.props.titleFormat)}
          </Text>
          <TouchableOpacity
            style={[styles.controlButton, this.props.customStyle.controlButton]}
            onPress={this.onNext}
          >
            <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
              {this.props.nextButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      )
    : (
      <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
        <Text style={[styles.title, this.props.customStyle.title]}>
          {this.state.currentMonthMoment.format(this.props.titleFormat)}
        </Text>
      </View>
    );
  }

  render() {
    const calendarDates = this.getMonthStack(this.state.currentMonthMoment);
    const eventDatesMap = this.prepareEventDates(this.props.eventDates, this.props.events);
    const numOfWeeks = getNumberOfWeeks(this.state.currentMonthMoment);
    const disabledDatesMap = this.prepareDisabledDates(this.props.disabledDates);

    return (
      <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
        {this.renderTopBar()}
        {this.renderHeading(this.props.titleFormat)}
        {this.props.scrollEnabled ?
          <ScrollView
            ref={calendar => this._calendar = calendar}
            horizontal
            scrollEnabled
            pagingEnabled
            removeClippedSubviews
            scrollEventThrottle={1000}
            showsHorizontalScrollIndicator={false}
            automaticallyAdjustContentInsets
            onMomentumScrollEnd={(event) => this.scrollEnded(event)}
            style={{
              height: this.state.rowHeight ? this.state.rowHeight * numOfWeeks : null,
            }}
          >
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap, disabledDatesMap))}
          </ScrollView>
          :
          <View ref={calendar => this._calendar = calendar}>
            {calendarDates.map((date) => this.renderMonthView(moment(date), eventDatesMap, disabledDatesMap))}
          </View>
        }
      </View>
    );
  }
}
