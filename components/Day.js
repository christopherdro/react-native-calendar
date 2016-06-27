import React, { Component, PropTypes } from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import styles from './styles';

export default class Day extends Component {
  static defaultProps = {
    customStyle: {},
  }

  static propTypes = {
    caption: PropTypes.any,
    customStyle: PropTypes.object,
    filler: PropTypes.bool,
    hasEvent: PropTypes.bool,
    isEnabled: PropTypes.bool,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    usingEvents: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, isEnabled) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (!isEnabled) {
      dayTextStyle.push(styles.disabledDayText, customStyle.disabledDayText);
    } else if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }
    return dayTextStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      hasEvent,
      isEnabled,
      isSelected,
      isToday,
      isWeekend,
      usingEvents,
    } = this.props;

    return filler
    ? (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
    : (
      <TouchableOpacity disabled={!isEnabled} onPress={this.props.onPress}>
        <View style={[styles.dayButton, customStyle.dayButton]}>
          <View style={this.dayCircleStyle(isWeekend, isSelected, isToday)}>
            <Text style={this.dayTextStyle(isWeekend, isSelected, isToday, isEnabled)}>{caption}</Text>
          </View>
          {usingEvents &&
            <View style={[
              styles.eventIndicatorFiller,
              customStyle.eventIndicatorFiller,
              hasEvent && styles.eventIndicator,
              hasEvent && customStyle.eventIndicator]}
            />
          }
        </View>
      </TouchableOpacity>
    );
  }
}
