## react-native-calendar

A `<Calendar>` component for React Native

Portrait mode only

## Installation

`npm install react-native-calendar --save`

[![Build Status](https://travis-ci.org/christopherdro/react-native-calendar.svg?branch=master)](https://travis-ci.org/christopherdro/react-native-calendar)
[![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)](https://www.npmjs.com/package/react-native-calendar)
[![PyPI](https://img.shields.io/pypi/dm/Django.svg?maxAge=2592000)](https://www.npmjs.com/package/react-native-calendar)

## Usage
```javascript
<Calendar
  scrollEnabled={true}              // False disables swiping. Default: True
  showControls={true}               // False hides prev/next buttons. Default: False
  titleFormat={'MMMM YYYY'}         // Format for displaying current month. Default: 'MMMM YYYY'
  dayHeadings={Array}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  monthNames={Array}                // Defaults to english names of months
  prevButtonText={'Prev'}           // Text for previous button. Default: 'Prev'
  nextButtonText={'Next'}           // Text for next button. Default: 'Next'
  onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
  onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
  onTouchNext={this.onTouchNext}    // Callback for next touch event
  onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
  onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
  eventDates={['2015-07-01']}       // Optional array of moment() parseable dates that will show an event indicator
  today={'2016-16-05'}              // Defaults to today
  startDate={'2015-08-01'}          // The first month that will display. Default: current month
  selectedDate={'2015-08-15'}       // Day to be selected
  customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
  weekStart={1} // Day on which week starts 0 - Sunday, 1 - Monday, 2 - Tuesday, etc, Default: 1
 />
```

## Available custom styles

- calendarContainer
- monthContainer
- calendarControls
- controlButton
- controlButtonText
- title
- calendarHeading
- dayHeading
- weekendHeading
- weekRow
- dayButton
- dayButtonFiller
- day
- eventIndicatorFiller
- eventIndicator
- dayCircleFiller
- currentDayCircle
- currentDayText
- selectedDayCircle
- selectedDayText
- weekendDayText


## TODOS

- [ ] Improve swipe feature
- [ ] Landscape support
- [ ] Language Support

## DEMO
![Demo gif](https://github.com/christopherdro/react-native-calendar-swiper/blob/master/demo.gif)
