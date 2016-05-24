const React = require('react-native')
const PropTypes = require('ReactPropTypes')
const styles = require('./styles')

const {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} = React

module.exports = React.createClass({

  propTypes: {
    isSelected: PropTypes.bool,
    isToday: PropTypes.bool,
    hasEvent: PropTypes.bool,
    caption: PropTypes.any,
    onPress: PropTypes.func,
    isWeekend: PropTypes.bool,
    filler: PropTypes.bool,
    customStyle: PropTypes.object,
  },

  getDefaultProps() {
    return {
      customStyle: {},
    }
  },

  _dayCircleStyle(isWeekend, isSelected, isToday) {
    var dayCircleStyle = [styles.dayCircleFiller, this.props.customStyle.dayCircleFiller]
    if (isSelected && !isToday) {
      dayCircleStyle.push(styles.selectedDayCircle)
      dayCircleStyle.push(this.props.customStyle.selectedDayCircle)
    } else if (isSelected && isToday) {
      dayCircleStyle.push(styles.currentDayCircle)
      dayCircleStyle.push(this.props.customStyle.currentDayCircle)
    }
    return dayCircleStyle
  },

  _dayTextStyle(isWeekend, isSelected, isToday) {
    var dayTextStyle = [styles.day, this.props.customStyle.day]
    if (isToday && !isSelected) {
      dayTextStyle.push(styles.currentDayText)
      dayTextStyle.push(this.props.customStyle.currentDayText)
    } else if (isToday || isSelected) {
      dayTextStyle.push(styles.selectedDayText)
      dayTextStyle.push(this.props.customStyle.selectedDayText)
    } else if (isWeekend) {
      dayTextStyle.push(styles.weekendDayText)
      dayTextStyle.push(this.props.customStyle.weekendDayText)
    }
    return dayTextStyle
  },

  render() {
    let {
      caption,
      isWeekend,
      isSelected,
      isToday,
      hasEvent,
      usingEvents,
      filler,
    } = this.props

    if (filler) {
      return (
        <TouchableWithoutFeedback>
          <View style={[styles.dayButtonFiller, this.props.customStyle.dayButtonFiller]}>
            <Text style={[styles.day, this.props.customStyle.day]} />
          </View>
        </TouchableWithoutFeedback>
      )
    } else {

      return (
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={[styles.dayButton, this.props.customStyle.dayButton]}>
            <View style={this._dayCircleStyle(isWeekend, isSelected, isToday)}>
              <Text style={this._dayTextStyle(isWeekend, isSelected, isToday)}>{caption}</Text>
            </View>
            {usingEvents &&
              <View style={[
                styles.eventIndicatorFiller,
                this.props.customStyle.eventIndicatorFiller,
                hasEvent && styles.eventIndicator,
                hasEvent && this.props.customStyle.eventIndicator]} />
            }
          </View>
        </TouchableOpacity>
      )
    }
  }
})
