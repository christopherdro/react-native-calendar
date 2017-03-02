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
    disabled: PropTypes.bool,
    event: PropTypes.object,
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    onPress: PropTypes.func,
    onLongPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayCircleStyle = (isSelected, isToday, event) => {
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

  dayTextStyle = (isDisabled, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayTextStyle = [styles.day, customStyle.day];

    if (isDisabled) {
      dayTextStyle.push(styles.disabledDayText, customStyle.disabledDayText);
    } else if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText, customStyle.currentDayText);
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText, customStyle.selectedDayText);
    }

    if (event) {
      dayTextStyle.push(styles.hasEventText, customStyle.hasEventText, event.hasEventText)
    }
    return dayTextStyle;
  }

  render() {
    let { caption, customStyle } = this.props;
    const {
      filler,
      disabled,
      event,
      isSelected,
      isToday,
      showEventIndicators,
    } = this.props;

    if(filler) {
      return (
        <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
          <Text style={[styles.day, customStyle.day]} />
        </View>
      );
    } else {
      if(disabled) {
        return (
          <View style={[styles.dayButton, customStyle.dayButton]}>
            <View style={this.dayCircleStyle(isSelected, isToday, event)}>
              <Text style={this.dayTextStyle(disabled, isSelected, isToday, event)}>{caption}</Text>
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
        );
      } else {
        return (
         <TouchableOpacity
          onPress={this.props.onPress}
          onLongPress={this.props.onLongPress}
          style={[styles.dayButton, customStyle.dayButton]}>
          <View style={this.dayCircleStyle(isSelected, isToday, event)}>
            <Text style={this.dayTextStyle(disabled, isSelected, isToday, event)}>{caption}</Text>
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
          </TouchableOpacity>
        );
      }
    }
  }
}
