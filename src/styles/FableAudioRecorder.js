import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F8F8"
	},
	controls: {
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		height: 250,
		marginHorizontal: 40
	},
	controlIcon: {
		fontSize: 70,
		color: 'red'
	},
	deleteIcon: {
		fontSize: 25,
		marginRight: 20
	},
	doneText: {
		fontSize: 16
	},
	scrollView: {
		paddingHorizontal: 20,
		marginTop: 10
	},
	scrollViewContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomColor: '#E9E9E9',
		borderBottomWidth: 1,
		paddingVertical: 20
	},
	recordsList: {
		backgroundColor: 'white',
		flex: 1
	},
	recordItem: {
		fontWeight: '600'
	},
	noRecords: {
		alignItems: 'center',
		marginTop: 50
	},
	noRecordsIcon: {
		fontSize: 50
	}
});

export default styles;
