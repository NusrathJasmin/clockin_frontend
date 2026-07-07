import { createTheme } from '@mui/material/styles';
import useDarkMode from './useDarkMode';
import { tableStyleOverrideConstant } from '../helpers/constants';

const useTablestyle = () => {
	const { themeStatus } = useDarkMode();

	const theme = createTheme({
		palette: {
			mode: themeStatus,
			primary: {
				main: '#808080',
			},
		},
		//@ts-ignore
		overrides: tableStyleOverrideConstant,
		components: {
			
			MuiPaper: {
				styleOverrides: {
					root: {
						fontFamily: 'inherit',
						// Uncomment the below lines if needed
						// backgroundColor: 'black',
						// borderRadius: '1000px',
					},
				},
			},
			
			MuiPopover: {
				styleOverrides: {
					paper: {
						borderRadius: '10px',
					},
				},
			},
			MuiMenuItem: {
				styleOverrides: {
					root: {
						fontFamily: 'inherit',
					},
				},
			},
		},
	});

	// tableStyles.js
	const headerStyles = () => ({
		backgroundColor: themeStatus === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#F8F9FD',
		fontWeight: 620,
		fontSize: '0.99rem',
		fontFamily: 'inherit',
		padding: '20px',
		color: themeStatus === 'dark' ? '#e2e8f0' : '#555555',
	});

	const rowStyles = () => (rowData, index) => {
		if (index % 2 !== 0) {
			return {
				backgroundColor: themeStatus !== 'dark' ? '#F5F5F5' : '',
				borderRadius: '10px',
				
			};
		}
		return {};
	};

	return { theme, headerStyles, rowStyles };
};

export default useTablestyle;
