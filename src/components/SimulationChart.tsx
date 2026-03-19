import { LineChart } from '@mui/x-charts/LineChart';

function SimulationChart({ chartState }) {
    if (!chartState.simulationData) {
        return (
            <div>
                <p>Create a new simulation and start modifying the numbers to get started!</p>
            </div>
        );
    } else {
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 2,
        })
        return (
            <LineChart
                xAxis={[{
                    data: chartState.xAxis,
                    valueFormatter: (v) => v.toString(),
                }]}
                yAxis={[{
                    valueFormatter: (v) => formatter.format(v),
                }]}
                series={chartState.simulationData.map((simulation) => {return {
                    data: simulation.data,
                    label: simulation.label,
                };})}
                height={600}
            />
        );
    }
}

export { SimulationChart };
