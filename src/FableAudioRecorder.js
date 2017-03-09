/* eslint-disable no-console */
import React, { Component } from 'react';
import {
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native';
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import RNFS from 'react-native-fs';
import Sound from "react-native-sound";

import styles from './styles/FableAudioRecorder';

const fileExtension = 'aac';
const initialRecord = 'test.aac';

class FableAudioRecorder extends Component {
	constructor(props) {
		super(props);

		this.state = {
			audioPath: `${AudioUtils.DocumentDirectoryPath}/${initialRecord}`,
			currentTime: 0.0,
			finished: false,
			recording: false,
			recordsList: [],
			stoppedRecording: false
		};

		this._pause = this._pause.bind(this);
		this._record = this._record.bind(this);
		this._stop = this._stop.bind(this);
	}

	componentDidMount() {
		this._getAllRecords();
		this._prepareRecordingPath(this.state.audioPath);

		AudioRecorder.onFinished = data => {
			if (Platform.OS === "ios") {
				this._finishRecording(
					data.status === "OK",
					data.audioFileURL
				);
			}
		};
	}

	_prepareRecordingPath(audioPath) {
		AudioRecorder.prepareRecordingAtPath(audioPath, {
			SampleRate: 22050,
			Channels: 1,
			AudioQuality: "Low",
			AudioEncoding: fileExtension,
			AudioEncodingBitRate: 32000
		});
	}

	async _getAllRecords() {
		const files = [];
		const result = await RNFS.readDir(RNFS.DocumentDirectoryPath);
		result.filter(item => {
			if (item.name === '.DS_Store' || item.name === initialRecord) return false;
			files.push(item.name);

			return true;
		});

		this.setState({ recordsList: files });
	}

	async _record() {
		if (this.state.stoppedRecording) {
			this._prepareRecordingPath(this.state.audioPath);
		}

		this.setState({ recording: true });

		try {
			await AudioRecorder.startRecording();
		} catch (error) {
			console.error(error);
		}
	}

	async _pause() {
		this.setState({ stoppedRecording: false, recording: false });

		try {
			await AudioRecorder.pauseRecording();
		} catch (error) {
			console.error(error);
		}
	}

	async _stop() {
		this.setState({ stoppedRecording: true, recording: false });

		setTimeout(() => {
			const dateTime = moment().format('MM-DD-YYYY hh:mm:ss');
			if (this.state.finished) {
				RNFS.copyFile(
					`${RNFS.DocumentDirectoryPath}/${initialRecord}`,
					`${RNFS.DocumentDirectoryPath}/${dateTime}.${fileExtension}`
				);
				this.setState({ finished: false });
			}
			this._getAllRecords();
		}, 1000);

		try {
			await AudioRecorder.stopRecording();
		} catch (error) {
			console.error(error);
		}
	}

	async _play(item) {
		if (this.state.recording) await this._stop();

		const sound = new Sound(`${RNFS.DocumentDirectoryPath}/${item}`, '', error => {
			if (error) {
				console.log("Failed to load the sound", error);
			}
		});

		setTimeout(() => {
			sound.play(success => {
				if (success) {
					console.log("successfully finished playing");
				} else {
					console.log("playback failed due to audio decoding errors");
				}
			});
		}, 100);
	}

	async _delete(item) {
		await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${item}`);
		this._getAllRecords();
	}

	_finishRecording(didSucceed, filePath) {
		this.setState({ finished: didSucceed });
		console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.controls}>
					<TouchableOpacity onPress={this.state.recording ? this._pause : this._record}>
						<View>
							<Icon
								name={this.state.recording ? "ios-pause" : "ios-radio-button-on"}
								style={[styles.controlIcon, { color: this.state.recording ? 'black' : 'red' }]}
							/>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this._stop}>
						<View>
							<Text style={styles.doneText}>Done</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.recordsList}>
					<ScrollView style={styles.scrollView}>
						{ this.state.recordsList.map((item, index) =>
							<View key={index} style={styles.scrollViewContent}>
								<TouchableOpacity onPress={this._play.bind(this, item)}>
									<Text style={styles.recordItem}>{item}</Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={this._delete.bind(this, item)}>
									<Icon name="ios-trash-outline" style={styles.deleteIcon} />
								</TouchableOpacity>
							</View>
						)}

						{ !this.state.recordsList.length &&
							<View style={styles.noRecords}>
								<Text>No Audio Recorded</Text>
								<Icon name="ios-recording-outline" style={styles.noRecordsIcon} />
							</View>
						}
					</ScrollView>
				</View>
			</View>
		);
	}
}

export default FableAudioRecorder;
