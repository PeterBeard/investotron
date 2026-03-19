import { useReducer, useState } from 'react';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { JackpotSimulation } from './JackpotSimulation.tsx';
import { RetirementSimulation } from './RetirementSimulation.tsx';
import { RetirementPensionAccountSimulation } from './RetirementPensionAccountSimulation.tsx';

function SimulationParameters({ setChartState }) {
    const [ simulations, dispatchSimulationUpdate ] = useReducer(
        simulationUpdateReducer,
        []
    );
    const [ years, setYears ] = useState(50);
    const [ startYear, setStartYear ] = useState(new Date().getFullYear());
    const [ simulationType, setSimulationType ] = useState('RetirementSimulation');

    function handleYearsChange(event) {
        setYears(event.target.value);
    }

    function handleStartYearChange(event) {
        setStartYear(event.target.value);
    }

    function handleSimulationTypeChange(event) {
        setSimulationType(event.target.value);
    }

    function simulationUpdateReducer(currSimulationStates, action) {
        switch(action.type) {
            case 'add': {
                return [
                    ...currSimulationStates,
                    action.state,
                ]
            }
            case 'update': {
                return currSimulationStates.map((state) => {
                    if (state.id === action.state.id) {
                        return action.state;
                    } else {
                        return state;
                    }
                });
            }
            case 'clone': {
                // Find the existing state
                const cloneTarget = currSimulationStates.filter((s) => s.id === action.state.id);
                if (cloneTarget.length !== 0) {
                    // Add another copy of this simulation to the list with a new ID
                    const clone = {
                        ...cloneTarget[0],
                        id: crypto.randomUUID(),
                        label: cloneTarget[0].label + ' (clone)',
                    }
                    return simulationUpdateReducer(
                        currSimulationStates,
                        {
                            type: 'add',
                            state: clone,
                        }
                    );

                } else {
                    // If there was no match, do nothing
                    return currSimulationStates;
                }
            }
            case 'delete': {
                return currSimulationStates.filter((state) => state.id !== action.state.id);
            }
            default: {
                throw Error('Unknown action: ' + action.type);
            }
        }
    }

    function updateSimulation() {
        const simulationData = [];

        const xAxis = [];
        for (let y = 0; y <= years; y++) {
            xAxis.push(startYear + y);
        }

        for (const sim of simulations) {
            const data = [];
            data.push(sim.initialState());
            for (let k = 0; k < years; k++) {
                const currentYear = startYear + k;
                data.push(sim.updateState(
                    data[data.length - 1],
                    currentYear
                ));
            }
            simulationData.push({
                data: data.map((d) => Math.round(d.balance * 100.0)/100.0),
                label: sim.label,
            });
        }
        const newChartState = {
            simulationData: simulationData,
            xAxis: xAxis,
        };
        setChartState(newChartState);
    }

    function addNewSimulation() {
        dispatchSimulationUpdate({
            type: 'add',
            state: {
                id: crypto.randomUUID(),
                type: simulationType,
            },
        });
    }

    return (
        <Stack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2} direction="row">
                        <TextField label="Start year" name="start-year" value={startYear} onChange={handleStartYearChange} />
                        <TextField label="Duration (yr)" name="years" value={years} onChange={handleYearsChange} />
                        <Button variant="contained" onClick={ updateSimulation }>Re-run simulations</Button>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2} direction="row">
                        <Divider variant="middle" orientation="vertical" flexItem />
                        <Select
                            labelId="simulation-type-select"
                            id="simulation-type-select"
                            value={simulationType}
                            label="Simulation type"
                            onChange={handleSimulationTypeChange}
                        >
                            <ListSubheader>Retirement accounts</ListSubheader>
                            <MenuItem value={'RetirementSimulation'}>Generic retirement account</MenuItem>
                            <MenuItem value={'RetirementPensionAccountSimulation'}>Pension account (e.g. 401(k))</MenuItem>
                            <ListSubheader>Other investment accounts</ListSubheader>
                            <MenuItem value={'JackpotSimulation'}>Jackpot</MenuItem>
                        </Select>
                        <Button variant="outlined" onClick={ addNewSimulation }>Create new</Button>
                    </Stack>
                </Grid>
            </Grid>
            <Stack spacing={2}>
                { simulations.map((sim) => {
                    switch(sim.type) {
                        case 'JackpotSimulation':
                            return (
                            <>
                            <JackpotSimulation
                                key={ sim.id }
                                simulationID={ sim.id }
                                simulationTypeID={ sim.type }
                                dispatchSimulationUpdate={ dispatchSimulationUpdate }
                            />
                            <Divider orientation="horizontal" flexItem />
                            </>
                            );
                        case 'RetirementSimulation':
                            return (
                            <>
                            <RetirementSimulation
                                key={ sim.id }
                                simulationID={ sim.id }
                                simulationTypeID={ sim.type }
                                dispatchSimulationUpdate={ dispatchSimulationUpdate }
                            />
                            <Divider orientation="horizontal" flexItem />
                            </>
                            );
                        case 'RetirementPensionAccountSimulation':
                            return (
                            <>
                            <RetirementPensionAccountSimulation
                                key={ sim.id }
                                simulationID={ sim.id }
                                simulationTypeID={ sim.type }
                                dispatchSimulationUpdate={ dispatchSimulationUpdate }
                            />
                            <Divider orientation="horizontal" flexItem />
                            </>
                            );
                        default:
                            return (
                            <>
                            <p>Unrecognized simulation type: { sim.type }</p>
                            </>
                        );
                    }
                })
                }
            </Stack>
        </Stack>
    );
}

export { SimulationParameters };
