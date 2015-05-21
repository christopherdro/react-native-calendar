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
 />
```

## TODOS

- [ ] Improve swipe feature
- [ ] Touch Highlighting
- [ ] Landscape support
- [ ] Language Support

## DEMO
![Demo gif](https://github.com/christopherdro/react-native-calendar-swiper/blob/master/demo.gif)

Thanks to @dsibiski and the React Native community for the assistance.
**MIT Licensed**