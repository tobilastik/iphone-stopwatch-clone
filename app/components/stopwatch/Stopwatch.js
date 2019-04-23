import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';

function Timer({ interval, style }) {
	const pad = n => (n < 10 ? '0' + n : n);
	const duration = moment.duration(interval);
	const nanoseconds = Math.floor(duration.milliseconds() / 10);
	return (
		<View style={styles.timerContainer}>
			<Text style={style}>{pad(duration.minutes())}:</Text>
			<Text style={style}>{pad(duration.seconds())}.</Text>
			<Text style={style}>{pad(nanoseconds)}</Text>
		</View>
	);
}
function Button({ title, color, backgroundcolor, onPress, disabled }) {
	return (
		<TouchableOpacity
			onPress={() => !disabled && onPress()}
			style={[styles.button, { backgroundColor: backgroundcolor }]}
			activeOpacity={disabled ? 1.0 : 0.7}
		>
			<View style={styles.buttonBorder}>
				<Text style={[styles.buttonTitle, { color }]}>{title}</Text>
			</View>
		</TouchableOpacity>
	);
}
function DisplayButton({ children }) {
	return <View style={styles.displaybutton}>{children}</View>;
}

function LapComponent({ number, interval, fastest, slowest }) {
	const lapStyle = [styles.laptext, fastest && styles.fastest, slowest && styles.slowest];
	return (
		<View style={styles.lapcomponent}>
			<Text style={lapStyle}>Lap {number} </Text>
			<Timer style={[lapStyle, styles.lapTimer]} interval={interval} />
		</View>
	);
}
function LapComponentView({ laps, timer }) {
	const finishedLaps = laps.slice(1);
	let min = Number.MAX_SAFE_INTEGER;
	let max = Number.MIN_SAFE_INTEGER;
	if (finishedLaps.length >= 2) {
		finishedLaps.forEach(lap => {
			if (lap < min) min = lap;
			if (lap > max) max = lap;
		});
	}
	return (
		<ScrollView style={styles.lapScreen}>
			{laps.map((lap, index) => (
				<LapComponent
					number={laps.length - index}
					key={laps.length - index}
					interval={index === 0 ? timer + lap : lap}
					fastest={lap === min}
					slowest={lap === max}
				/>
			))}
		</ScrollView>
	);
}
export default class Stopwatch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			start: 0,
			now: 0,
			laps: [],
		};
	}

  componentWillMount(){
    clearInterval(this.timer)
  }
	start = () => {
		const now = new Date().getTime();
		this.setState({
			start: now,
			now,
			laps: [0],
		});
		this.timer = setInterval(() => {
			this.setState({ now: new Date().getTime() });
		}, 100);
	};
lap = () => {
  const timestamp = new Date().getTime()
  const {laps, now, start} = this.state
  const [firstLap, ...other] = laps
  this.setState({
    laps: [0, firstLap + now - start, ...other],
    start: timestamp,
    now: timestamp
  })
}
stop = () => {
clearInterval(this.timer)
 
  const {laps, now, start} = this.state
  const [firstLap, ...other] = laps
  this.setState({
    laps: [firstLap + now - start, ...other],
    start: 0,
    now: 0
  })
}
reset = () => {
  this.setState({
    laps: [],
    start: 0,
    now: 0
  })
}
resume = () => {
  const now = new Date().getTime()
  this.setState({
    start: now,
    now: now
  })
  this.timer = setInterval(() => {
    this.setState({ now: new Date().getTime() });
  }, 100);
}

	render() {
		const { now, start, laps } = this.state;
		const timer = now - start;
		return (
			<View style={styles.container}>
				<Timer interval={laps.reduce((total, curr) => total + curr, 0) + timer} style={styles.timer} />
				{laps.length === 0 && (
					<DisplayButton>
						<Button title="lap" color="#8b8b90" backgroundcolor="#151515" disabled/>
						<Button title="Start" color="lightgreen" backgroundcolor="#1b361f" onPress={this.start} />
					</DisplayButton>
				)}
				{start > 0 && (
					<DisplayButton>
						<Button title="Lap" color="white" backgroundcolor="dimgray" 
            onPress = {this.lap}/>
						<Button title="Stop" color="#e33935" backgroundcolor="#3c1715" onPress={this.stop} />
					</DisplayButton>
        )}
        {laps.length > 0  && start === 0 && (
					<DisplayButton>
						<Button title="Reset" color="white" backgroundcolor="dimgray" 
            onPress = {this.reset}/>
						<Button title="Start" color="lightgreen" backgroundcolor="#1b361f" onPress={this.resume} />
					</DisplayButton>
				)}
				<LapComponentView laps={laps} timer={timer} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0D0D0D',
		alignItems: 'center',
		paddingTop: 180,
		paddingHorizontal: 20,
	},
	timer: {
		color: 'white',
		fontSize: 90,
		fontWeight: '200',
		width: 110,
	},
	button: {
		width: 75,
		height: 75,
		borderRadius: 37.5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonTitle: {
		fontSize: 18,
	},
	buttonBorder: {
		width: 68,
		height: 68,
		borderRadius: 34.5,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	displaybutton: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginTop: 80,
		marginBottom: 25,
	},
	lapTimer: {
		width: 25,
  },
  laptext:{
    color: 'white',
    fontSize: 18,
    width: 70
  },
	lapcomponent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderColor: 'rgb(21,21,21)',
		borderTopWidth: 1,
		paddingVertical: 11,
	},
	lapScreen: {
		alignSelf: 'stretch',
	},
	fastest: {
		color: '#4bc05f',
	},
	slowest: {
		color: '#cc3531',
	},
	timerContainer: {
		flexDirection: 'row',
	},
});
