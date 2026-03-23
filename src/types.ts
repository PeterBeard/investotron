/* Common types for objects used throughout the app */

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;
type ChangeEventHandler = (e: ChangeEvent) => void;

interface SimulationData {
    balance: number,
}

interface StubSimulationState {
    id: string,
    label: string,
}

interface SimulationState extends StubSimulationState {
    type: string,
    initialState: () => SimulationData,
    updateState: (data: SimulationData, year: number) => SimulationData,
};

interface SimulationAction {
    type: string,
    state: StubSimulationState,
};

type ActionHandler = (action: SimulationAction) => void;

interface ChartState {
    simulationData: [{
        data: number[],
        label: string,
    }],
    xAxis: [number],
};

export type {
    ActionHandler,
    ChangeEvent,
    ChangeEventHandler,
    ChartState,
    SimulationAction,
    SimulationData,
    SimulationState,
    StubSimulationState,
};
