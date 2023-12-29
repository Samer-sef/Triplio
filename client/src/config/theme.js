import { createTheme } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';


export const theme = () => {
    return createTheme({
        palette: {
            primary: {
                light: '#b0bec5',
                main: '#78909c',
                dark: '#546e7a',
                //contrastText: '#fff',
            },
        
            // secondary: {
            //     light: '#ff7961',
            //     main: '#f44336',
            //     dark: '#ba000d',
            //     contrastText: '#000',
            // },
        },
      });
}