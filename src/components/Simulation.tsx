import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';


function Simulation(props) {
    function deleteSimulation() {
        props.dispatchSimulationUpdate({
            type: 'delete',
            state: {
                id: props.simulationID,
            },
        });
    }

    function cloneSimulation() {
        // TODO: simulations don't support setting initial state yet
        props.dispatchSimulationUpdate({
            type: 'clone',
            state: {
                id: props.simulationID,
            },
        });
    }

    return (
        <Grid container spacing={2} columns={16}>
            <Grid size={16}>
                <Stack spacing={1} direction="row">
                    <p className="caption">
                        { props.caption }
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
                        value={props.label}
                        onChange={props.handleLabelChange} />
                    { props.children }
                </Stack>
            </Grid>
        </Grid>
    )
}

export { Simulation };
