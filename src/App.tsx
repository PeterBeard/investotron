import { useState } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import './App.css';
import { SimulationChart} from './components/SimulationChart.tsx';
import { SimulationParameters} from './components/SimulationParameters.tsx';
import { WelcomeScreen} from './components/WelcomeScreen.tsx';

function App() {
    const [ chartState, setChartState ] = useState({});
    return (
        <>
            <CssBaseline enableColorScheme />
            <Container maxWidth="xl">
                <Stack spacing={3}>
                    {(!chartState.simulationData ? <WelcomeScreen /> : <SimulationChart chartState={ chartState } />)}
                    <SimulationParameters setChartState={ setChartState } />
                </Stack>
            </Container>
        </>
    )
}

export default App;
