import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if (isSelected) {
      if (isToday) {
        dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
      } else {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
      }
    }

    if (event) {
      if (isSelected) {
        dayCircleStyle.push(styles.hasEventDaySelectedCircle, customStyle.hasEventDaySelectedCircle, event.hasEventDaySelectedCircle);
      } else {
        dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle, event.hasEventCircle);
      }
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }

    if (event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText)
    }
    return dayTextStyle;
  }

  dayButtonStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    let dayButtonStyle, dayWidth;

    if (customStyle.hasOwnProperty('dayButton') && StyleSheet.flatten(customStyle.dayButton).hasOwnProperty('width')) {
      dayButtonStyle = [styles.dayButton, customStyle.dayButton];
    } else {
      dayWidth = Dimensions.get('window').width / 7;
      dayButtonStyle = [styles.dayButton, customStyle.dayButton, {width: dayWidth}];
    }

    if (isWeekend) {
      dayButtonStyle.push(styles.weekendDayButton, customStyle.weekendDayButton);
    }
    return dayButtonStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      event,
      isWeekend,
      isSelected,
      isToday,
      showEventIndicators,
    } = this.props;

    let dayButtonFillerStyle, dayWidth;
    if (customStyle.hasOwnProperty('dayButtonFiller') && StyleSheet.flatten(customStyle.dayButtonFiller).hasOwnProperty('width')) {
      dayButtonFillerStyle = [styles.dayButtonFiller, customStyle.dayButtonFiller];
    } else {
      dayWidth = Dimensions.get('window').width / 7;
      dayButtonFillerStyle = [styles.dayButtonFiller, customStyle.dayButtonFiller, {width: dayWidth}];
    }

    return filler
      ? (
        <TouchableWithoutFeedback>
          <View style={dayButtonFillerStyle}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
      : (
        <TouchableOpacity
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
        >
          <View style={this.dayButtonStyle(isWeekend, isSelected, isToday, event)}>
            <View style={this.dayCircleStyle(isWeekend, isSelected, isToday, event)}>
              <Text style={this.dayTextStyle(isWeekend, isSelected, isToday, event)}>{caption}</Text>
            </View>
            {showEventIndicators &&
            <View style={[
              styles.eventIndicatorFiller,
              customStyle.eventIndicatorFiller,
              event && styles.eventIndicator,
              event && customStyle.eventIndicator,
              event && event.eventIndicator]}
            />
            }
          </View>
        </TouchableOpacity>
      );
  }
}
