import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function WelcomeScreen() {
    return (
        <Box>
            <Typography variant="h1" gutterBottom>Welcome to Investotron</Typography>
            <Typography variant="body1">
                To get started, pick a simulation type from the list below and start playing around with the numbers!
            </Typography>
            <Typography variant="body1">
                Once you're happy with the numbers you've entered, use the "re-run simulations" button to see a chart with the results plotted over time.
            </Typography>
        </Box>
    );
}

export { WelcomeScreen };
