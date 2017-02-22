import { Dimensions, StyleSheet } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#f7f7f7',
  },
  monthContainer: {
    width: DEVICE_WIDTH,
  },
  calendarControls: {
    flexDirection: 'row',
  },
  controlButton: {
  },
  controlButtonText: {
    margin: 20,
    fontSize: 15,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    margin: 15,
  },
  calendarHeading: {
    flexDirection: 'row',
  },
  dayHeading: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  weekendHeading: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    padding: 7,
    width: DEVICE_WIDTH / 7,
  },
  thursButton: {
    width: Math.round(DEVICE_WIDTH / 7 * 4 ) - DEVICE_WIDTH / 7 * 3 , //dumb hack to fix irrational number spacing
  },
  dayButtonInRange: {
    backgroundColor: '#FDBAD1',
  },
  dayButtonFiller: {
    padding: 7,
    width: DEVICE_WIDTH / 7,
  },
  day: {
    fontSize: 16,
    alignSelf: 'center',
  },
  eventIndicatorFiller: {
    marginTop: 3,
    borderColor: 'transparent',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventIndicator: {
    backgroundColor: '#cccccc',
  },
  dayCircleFiller: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  currentDayCircle: {
    backgroundColor: 'red',
  },
  currentDayText: {
    color: 'red',
  },
  selectedDayCircle: {
    backgroundColor: 'black',
  },
  hasEventCircle: {
  },
  hasEventDaySelectedCircle: {
  },
  hasEventText: {
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekendDayText: {
    color: 'black',
  },
});

export default styles;
