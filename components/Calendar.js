import React, {Component, PropTypes} from "react";
import {Dimensions, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Day from "./Day";
import moment from "moment";
import styles from "./styles";

const DEVICE_WIDTH = Dimensions.get('window').width;
const VIEW_INDEX = 2;

function getNumberOfWeeks(month, weekStart) {
    const firstDay = moment(month).startOf('month').day();
    const offset = (firstDay - weekStart + 7) % 7;
    const days = moment(month).daysInMonth();
    return Math.ceil((offset + days) / 7);
}

export default class Calendar extends Component {
    state = {
        currentMoment: moment(this.props.startDate),
        selectedMoment: moment(this.props.selectedDate),
        rowHeight: null,
        width: DEVICE_WIDTH
    };

    static propTypes = {
        viewForDay: PropTypes.func,
        currentMonth: PropTypes.any,
        customStyle: PropTypes.object,
        dayHeadings: PropTypes.array,
        eventDates: PropTypes.array,
        monthNames: PropTypes.array,
        nextButtonText: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        onDateSelect: PropTypes.func,
        onSwipeNext: PropTypes.func,
        onSwipePrev: PropTypes.func,
        onTouchNext: PropTypes.func,
        onTouchPrev: PropTypes.func,
        onTitlePress: PropTypes.func,
        prevButtonText: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        removeClippedSubviews: PropTypes.bool,
        scrollEnabled: PropTypes.bool,
        selectedDate: PropTypes.any,
        showControls: PropTypes.bool,
        showEventIndicators: PropTypes.bool,
        startDate: PropTypes.any,
        titleFormat: PropTypes.string,
        today: PropTypes.any,
        weekStart: PropTypes.number,
        calendarFormat: PropTypes.string
    };

    static defaultProps = {
        prevEnabled: true,
        nextEnabled: true,
        viewForDay: null,
        customStyle: {},
        dayHeadings: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        eventDates: [],
        monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        nextButtonText: 'Next',
        prevButtonText: 'Prev',
        removeClippedSubviews: true,
        scrollEnabled: false,
        showControls: false,
        showEventIndicators: false,
        startDate: moment().format('YYYY-MM-DD'),
        titleFormat: 'MMMM YYYY',
        weekStart: 1,
        calendarFormat: 'monthly' // weekly or monthly
    };

    componentDidMount() {
        // fixes initial scrolling bug on Android
        setTimeout(() => this.scrollToItem(VIEW_INDEX), 0);
    }

    componentDidUpdate() {
        this.scrollToItem(VIEW_INDEX);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDate && this.props.selectedDate !== nextProps.selectedDate) {
            this.setState({selectedMoment: nextProps.selectedDate});
        }
        if (nextProps.currentMonth) {
            this.setState({currentMoment: moment(nextProps.currentMonth)});
        }
    }

    getStack(currentMoment) {
        if (this.props.scrollEnabled) {
            let i = -VIEW_INDEX;
            const res = [];

            for (i; i <= VIEW_INDEX; i++) {
                if (this.props.calendarFormat === 'monthly') {
                    res.push(moment(currentMoment).add(i, 'month'));
                }
                else {
                    res.push(moment(currentMoment).add(i, 'week'));
                }
            }
            return res;
        }
        return [moment(currentMoment)];
    }

    prepareEventDates(eventDates, events) {
        const parsedDates = {};

        if (events) {
            events.forEach(event => {
                if (event.date) {
                    parsedDates[event.date] = event;
                }
            });
        }
        else {
            eventDates.forEach(event => {
                parsedDates[event] = {};
            });
        }

        return parsedDates;
    }

    selectDate(date) {
        if (typeof this.props.selectedDate === "undefined") {
            this.setState({
                selectedMoment: date,
                currentMoment: date
            });
        }
    }

    selectAndJumpToToday() {
        const today = new Date();
        const newMoment = moment(this.state.currentMonthMoment).set('month', today.getMonth());

        this.setState({
            selectedMoment: today,
            currentMonthMoment: newMoment
        });
    }

    onPrev = () => {
        const newMoment = this.props.calendarFormat === 'monthly' ?
            moment(this.state.currentMoment).subtract(1, 'month') :
            moment(this.state.currentMoment).subtract(1, 'week');

        if (this.props.onTouchPrev) {
            this.props.onTouchPrev(newMoment) && this.setState({currentMoment: newMoment});
        }
        else {
            this.setState({currentMoment: newMoment})
        }
    }

    onNext = () => {
        const newMoment = this.props.calendarFormat === 'monthly'
            ? moment(this.state.currentMoment).add(1, 'month')
            : moment(this.state.currentMoment).add(1, 'week');

        if (this.props.onTouchNext) {
            this.props.onTouchNext(newMoment) && this.setState({currentMoment: newMoment});
        }
        else {
            this.setState({currentMoment: newMoment})
        }
    }

    scrollToItem(itemIndex) {
        const scrollToX = itemIndex * this.state.width;

        if (this.props.scrollEnabled && this._calendar) {
            this._calendar.scrollTo({y: 0, x: scrollToX, animated: false});
        }
    }

    scrollEnded(event) {
        const position = event.nativeEvent.contentOffset.x;
        const currentPage = position / this.state.width;
        const newMoment = this.props.calendarFormat === 'monthly'
            ? moment(this.state.currentMoment).add(currentPage - VIEW_INDEX, 'month')
            : moment(this.state.currentMoment).add(currentPage - VIEW_INDEX, 'week');

        this.setState({currentMoment: newMoment});

        if (currentPage < VIEW_INDEX) {
            this.props.onSwipePrev && this.props.onSwipePrev(newMoment);
        }
        else if (currentPage > VIEW_INDEX) {
            this.props.onSwipeNext && this.props.onSwipeNext(newMoment);
        }
    }

    onWeekRowLayout = (event) => {
        if (this.state.rowHeight !== event.nativeEvent.layout.height) {
            this.setState({rowHeight: event.nativeEvent.layout.height});
        }
    }

    getStartMoment(calFormat, currMoment) {
        const weekStart = this.props.weekStart;
        let res;

        if (calFormat === 'monthly') {
            res = moment(currMoment).startOf('month');
        }
        else {
            // weekly
            let sundayMoment = moment(currMoment).startOf('week');

            if (weekStart > 0) {
                res = moment(currMoment).isoWeekday(weekStart);
                if (res.diff(currMoment) > 0) {
                    res = moment(currMoment).subtract(7, 'day').isoWeekday(weekStart);
                }
            }
            else {
                res = sundayMoment;
            }
        }
        return res;
    }

    renderCalendarView(calFormat, argMoment, eventsMap) {
        let renderIndex = 0,
            weekRows = [],
            days = [];

        const startOfArgMoment = this.getStartMoment(calFormat, argMoment);
        const selectedMoment = moment(this.state.selectedMoment);
        const weekStart = this.props.weekStart;
        const todayMoment = moment(this.props.today);
        const todayIndex = todayMoment.date() - 1;
        const argDaysCount = calFormat === 'monthly' ? argMoment.daysInMonth() : 7;
        const offset = (calFormat === 'monthly') ? (startOfArgMoment.isoWeekday() - weekStart + 7) % 7 : 0;
        const selectedIndex = moment(selectedMoment).date() - 1;

        do {
            const dayIndex = renderIndex - offset;
            const isoWeekday = (renderIndex + weekStart) % 7;
            const thisMoment = moment(startOfArgMoment).add(dayIndex, 'day');

            if (dayIndex >= 0 && dayIndex < argDaysCount) {
                days.push((
                    <Day key={`${renderIndex}`}
                         containerWidth={this.state.width}
                         viewForDay={this.props.viewForDay}
                         startOfMonth={startOfArgMoment}
                         isWeekend={isoWeekday === 0 || isoWeekday === 6}
                         onPress={() => {
                            this.selectDate(thisMoment);
                            this.props.onDateSelect && this.props.onDateSelect(thisMoment ? thisMoment : null, thisMoment ? thisMoment.format(): null);
                         }}
                         caption={`${thisMoment.format('D')}`}
                         current={thisMoment}
                         isToday={todayMoment.format('YYYY-MM-DD') == thisMoment.format('YYYY-MM-DD')}
                         isSelected={selectedMoment.isSame(thisMoment)}
                         event={eventsMap[thisMoment.format('YYYY-MM-DD')] || eventsMap[thisMoment.format('YYYYMMDD')]}
                         showEventIndicators={this.props.showEventIndicators}
                         customStyle={this.props.customStyle}
                    />
                ));
            }
            else {
                days.push(
                    <Day key={`${renderIndex}`}
                         filler
                         current={thisMoment}
                         containerWidth={this.state.width}
                         viewForDay={this.props.viewForDay}
                         customStyle={this.props.customStyle}
                    />
                );
            }
            if (renderIndex % 7 === 6) {
                weekRows.push(
                    <View
                        key={weekRows.length}
                        onLayout={weekRows.length ? undefined : this.onWeekRowLayout}
                        style={[styles.weekRow, this.props.customStyle.weekRow]}
                    >
                        {days}
                    </View>);
                days = [];
                if (dayIndex + 1 >= argDaysCount) {
                    break;
                }
            }
            renderIndex += 1;
        } while (true)
        const containerStyle = [{width: this.state.width}, this.props.customStyle.monthContainer];
        return (
            <View key={`${startOfArgMoment.format('YYYY-MM-DD')}-${calFormat}`}
                  style={containerStyle}
            >
                {weekRows}
            </View>);
    }

    renderHeading() {
        let headings = [];
        let i = 0;

        for (i; i < 7; ++i) {
            const j = (i + this.props.weekStart) % 7;
            const style = j === 0 || j === 6
                ? [styles.weekendHeading, this.props.customStyle.weekendHeading]
                : [styles.dayHeading, this.props.customStyle.dayHeading];
            headings.push(<Text key={i} style={style}>{this.props.dayHeadings[j]}</Text>);
        }

        return (
            <View style={[styles.calendarHeading, this.props.customStyle.calendarHeading]}>
                {headings}
            </View>
        );
    }

    renderTopBar() {
        let localizedMonth = this.props.monthNames[this.state.currentMoment.month()];

        return this.props.showControls
            ? (
                <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
                    <TouchableOpacity
                        style={[styles.controlButton, this.props.customStyle.controlButton]}
                        onPress={this.onPrev}
                    >
                        <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
                            {this.props.prevButtonText}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.title}
                                      onPress={() => this.props.onTitlePress && this.props.onTitlePress()}
                    >
                        <Text style={[styles.titleText, this.props.customStyle.title]}>
                            {localizedMonth} {this.state.currentMoment.year()}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.controlButton, this.props.customStyle.controlButton]}
                        onPress={this.onNext}
                    >
                        <Text style={[styles.controlButtonText, this.props.customStyle.controlButtonText]}>
                            {this.props.nextButtonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            )
            : (
                <View style={[styles.calendarControls, this.props.customStyle.calendarControls]}>
                    <Text style={[styles.title, this.props.customStyle.title]}>
                        {this.state.currentMoment.format(this.props.titleFormat)}
                    </Text>
                </View>
            );
    }

    render() {
        const calendarDates = this.getStack(this.state.currentMoment);
        const eventDatesMap = this.prepareEventDates(this.props.eventDates, this.props.events);
        const numOfWeeks = this.props.calendarFormat === 'weekly' ? 1 :
            getNumberOfWeeks(this.state.currentMonthMoment, this.props.weekStart);

        const content = this.props.scrollEnabled
            ? (
                <ScrollView ref={calendar => this._calendar = calendar}
                            onLayout={(e) => this.setState({width: e.nativeEvent.layout.width})}
                            horizontal
                            scrollEnabled
                            pagingEnabled
                            removeClippedSubviews={this.props.removeClippedSubviews}
                            scrollEventThrottle={1000}
                            showsHorizontalScrollIndicator={false}
                            automaticallyAdjustContentInsets={false}
                            onMomentumScrollEnd={(event) => this.scrollEnded(event)}
                            style={{height: this.state.rowHeight ? this.state.rowHeight * numOfWeeks : null}}
                >
                    {calendarDates.map((date) => this.renderCalendarView(this.props.calendarFormat, moment(date), eventDatesMap))}
                </ScrollView>
            )
            : (
                <View ref={calendar => this._calendar = calendar} onLayout={(e) => this.setState({width: e.nativeEvent.layout.width})}>
                    {calendarDates.map((date) => this.renderCalendarView(this.props.calendarFormat, moment(date), eventDatesMap))}
                </View>
            );

        return (
            <View style={[styles.calendarContainer, this.props.customStyle.calendarContainer]}>
                {this.renderTopBar()}
                {this.renderHeading(this.props.titleFormat)}
                {content}
            </View>
        );
    }
}
