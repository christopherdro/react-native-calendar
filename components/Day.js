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
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isThurs: PropTypes.bool,
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    isInRange: PropTypes.bool,
    isStartRange: PropTypes.bool,
    isEndRange: PropTypes.bool,
    onPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayButtonStyle = (isInRange, isThurs) => {
    const { customStyle } = this.props;
    const dayButtonStyle = [styles.dayButton, customStyle.dayButton];

    // if (isThurs) {
    //  dayButtonStyle.push(styles.thursButton);
    // }

    return dayButtonStyle;
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, isStartRange, isEndRange, event) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if (isSelected) {
      if (isToday) {
        dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
      } else {
        dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
      }
    }

    if (isStartRange || isEndRange) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
    }

    if (event) {
      if (isSelected) {
        dayCircleStyle.push(styles.hasEventDaySelectedCircle,
          customStyle.hasEventDaySelectedCircle, event.hasEventDaySelectedCircle);
      } else {
        dayCircleStyle.push(styles.hasEventCircle,
          customStyle.hasEventCircle, event.hasEventCircle);
      }
    }
    return dayCircleStyle;
  }

  dayTextStyle = (isWeekend, isSelected, isToday, isInRange, isStartRange, isEndRange, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    // } else if (isWeekend) {
    //  dayTextStyle.push(styles.weekendDayText, customStyle.weekendDayText);
    }
    if (isInRange || isStartRange || isEndRange) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    }

    if (event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText);
    }
    return dayTextStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      event,
      isWeekend,
      isThurs,
      isSelected,
      isToday,
      isInRange,
      isStartRange,
      isEndRange,
      showEventIndicators,
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
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={this.dayButtonStyle(isInRange, isThurs)}>
            {
              (isInRange || isEndRange) && !isStartRange ?
                <View style={styles.selectedRangeBar} /> :
                <View style={styles.emptyRangeBar} />
            }
            {
              (isInRange || isStartRange) && !isEndRange ?
                <View style={styles.selectedRangeBar} /> :
                <View style={styles.emptyRangeBar} />
            }
            <View
              style={this.dayCircleStyle(isWeekend, isSelected,
              isToday, isStartRange, isEndRange, event)}
            >
              <Text style={this.dayTextStyle(isWeekend, isSelected, isToday, isInRange, event)}>
                {caption}
              </Text>
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
