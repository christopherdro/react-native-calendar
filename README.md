## react-native-calendar

A `<Calendar>` component for React Native

Supports iPhone4+ (Portrait only)

Swiping feature needs to improved when swiping fast.
Suggestions and PR's are welcome!


## Installation

`npm install react-native-calendar --save`

## Usage
```javascript
<Calendar
  scrollEnabled={true}              // False disables swiping. Default: True
  showControls={true}               // False hides prev/next buttons. Default: False
  titleFormat={'MMMM YYYY'}         // Format for displaying current month. Default: 'MMMM YYYY'
  dayHeadings={Array}               // Default: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  prevButtonText={'Prev'}           // Text for previous button. Default: 'Prev'
  nextButtonText={'Next'}           // Text for next button. Default: 'Next
  onDateSelect={(date) => this.onDateSelect(date)} // Callback after date selection
  onTouchPrev={this.onTouchPrev}    // Callback for prev touch event
  onTouchNext={this.onTouchNext}    // Callback for next touch event
  onSwipePrev={this.onSwipePrev}    // Callback for back swipe event
  onSwipeNext={this.onSwipeNext}    // Callback for forward swipe event
  eventDates={['2015-07-01']}       // Optional array of moment() parseable dates that will show an event indicator
  startDate={'2015-08-01'}          // The first month that will display. Default: current month
  selectedDate={'2015-08-15'}       // Day to be selected
  customStyle={{day: {fontSize: 15, textAlign: 'center'}}} // Customize any pre-defined styles
 />
```

## TODOS

- [ ] Improve swipe feature
- [ ] Landscape support
- [ ] Language Support

## DEMO
![Demo gif](https://github.com/christopherdro/react-native-calendar-swiper/blob/master/demo.gif)

Thanks to @dsibiski and the React Native community for the assistance.
**MIT Licensed**
