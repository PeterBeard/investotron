import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { ActionHandler, ChangeEventHandler } from '../types.ts';

interface SimulationProps {
    simulationID: string,
    label: string,
    caption: string,
    dispatchSimulationUpdate: ActionHandler,
    handleLabelChange: ChangeEventHandler,
    children: []
};


function Simulation({ dispatchSimulationUpdate, label, caption, simulationID, handleLabelChange, children }: SimulationProps) {
    function deleteSimulation() {
        dispatchSimulationUpdate({
            type: 'delete',
            state: {
                id: simulationID,
            },
        });
    }

    /*
    function cloneSimulation() {
        // TODO: simulations don't support setting initial state yet
        dispatchSimulationUpdate({
            type: 'clone',
            state: {
                id: simulationID,
            },
        });
    }
    */

    return (
        <Grid container spacing={2} columns={16}>
            <Grid size={16}>
                <Stack spacing={1} direction="row">
                    <p className="caption">
                        { caption }
                    </p>
                </Stack>
            </Grid>
            <Grid size={1}>
                <IconButton aria-label="delete" onClick={deleteSimulation}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
            <Grid size={15}>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        name="simulation-label"
                        size="small"
                        value={label}
                        onChange={handleLabelChange} />
                    { children }
                </Stack>
            </Grid>
        </Grid>
    )
}

export { Simulation };
