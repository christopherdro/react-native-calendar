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
    isToday: PropTypes.bool,
    isWeekend: PropTypes.bool,
    onPress: PropTypes.func,
    showEventIndicators: PropTypes.bool,
  }

  dayCircleStyle = (isWeekend, isSelected, isToday, event) => {
    const { customStyle } = this.props;
    const dayCircleStyle = [styles.dayCircleFiller, customStyle.dayCircleFiller];

    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle, customStyle.selectedDayCircle);
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle, customStyle.currentDayCircle);
    }

    if (event) {
      dayCircleStyle.push(styles.hasEventCircle, customStyle.hasEventCircle, event.hasEventCircle)
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

    return filler
    ? (
      <View style={[styles.dayButtonFiller, customStyle.dayButtonFiller]}>
        <TouchableWithoutFeedback style={{flex:1}}>
          <View style={{flex: 1, alignSelf: 'center'}}>
            <Text style={[styles.day, customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      )
    : (
      <View style={[styles.dayButton, customStyle.dayButton]}>
        <TouchableOpacity onPress={this.props.onPress} style={{flex:1}}>
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
        </TouchableOpacity>
      </View>
      );
  }
}
