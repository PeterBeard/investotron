import { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import {Simulation} from './Simulation.tsx';

import type { ActionHandler, ChangeEvent, SimulationData } from '../types.ts';

interface JackpotSimulationState extends SimulationData {
    withdrawal: number,
    readonly interestRate: number,
    readonly inflationRate: number,
};

interface PartialState { 
    label?: string,
    deposit?: number,
    withdrawal?: number,
    federalTaxRate?: number,
    stateTaxRate?: number,
    inflationRate?: number,
    interestRate?: number,
    immediateExpenditures?: number,
};

interface JackpotProps {
    simulationID: string,
    simulationTypeID: string,
    dispatchSimulationUpdate: ActionHandler,
};

function JackpotSimulation({ simulationID, simulationTypeID, dispatchSimulationUpdate }: JackpotProps) {
    const [ label, setLabel ] = useState('Jackpot');
    const [ deposit, setDeposit ] = useState(1_000_000);
    const [ withdrawal, setWithdrawal ] = useState(25_000);
    const [ federalTaxRate, setFederalTaxRate ] = useState(37);
    const [ stateTaxRate, setStateTaxRate ] = useState(0);
    const [ inflationRate, setInflationRate ] = useState(2.5);
    const [ interestRate, setInterestRate ] = useState(8);
    const [ immediateExpenditures, setImmediateExpenditures ] = useState(100_000);

    function handleLabelChange(event: ChangeEvent) {
        const newLabel = event.target.value;
        setLabel(newLabel)
        updateSimulationState({label: newLabel});
    }

    function handleDepositChange(event: ChangeEvent) {
        const newDeposit = Number(event.target.value);
        setDeposit(newDeposit);
        updateSimulationState({deposit: newDeposit});
    }

    function handleWithdrawalChange(event: ChangeEvent) {
        const newWithdrawal = Number(event.target.value);
        setWithdrawal(newWithdrawal);
        updateSimulationState({withdrawal: newWithdrawal});
    }

    function handleImmediateExpendituresChange(event: ChangeEvent) {
        const newImmediateExpenditures = Number(event.target.value);
        setImmediateExpenditures(newImmediateExpenditures);
        updateSimulationState({immediateExpenditures: newImmediateExpenditures});
    }

    function handleFederalTaxRateChange(event: ChangeEvent) {
        const newFederalTaxRate = Number(event.target.value);
        setFederalTaxRate(newFederalTaxRate);
        updateSimulationState({federalTaxRate: newFederalTaxRate});
    }

    function handleStateTaxRateChange(event: ChangeEvent) {
        const newStateTaxRate = Number(event.target.value);
        setStateTaxRate(newStateTaxRate);
        updateSimulationState({stateTaxRate: newStateTaxRate});
    }

    function handleInflationRateChange(event: ChangeEvent) {
        const newInflationRate = Number(event.target.value);
        setInflationRate(newInflationRate);
        updateSimulationState({inflationRate: newInflationRate});
    }

    function handleInterestRateChange(event: ChangeEvent) {
        const newInterestRate = Number(event.target.value);
        setInterestRate(newInterestRate);
        updateSimulationState({interestRate: newInterestRate});
    }

    function updateSimulationState(newState: PartialState) {
        const newDeposit = (newState.deposit === undefined ? deposit : newState.deposit) * (1 - ((newState.federalTaxRate === undefined ? federalTaxRate: newState.federalTaxRate) / 100.0 + (newState.stateTaxRate === undefined ? stateTaxRate : newState.stateTaxRate) / 100.0));
        function initialState(): JackpotSimulationState {
            return {
                balance: newDeposit - (newState.immediateExpenditures === undefined ? immediateExpenditures : newState.immediateExpenditures),
                withdrawal: (newState.withdrawal === undefined ? withdrawal : newState.withdrawal),
                interestRate: (newState.interestRate === undefined ? interestRate : newState.interestRate),
                inflationRate: (newState.inflationRate === undefined ? inflationRate : newState.inflationRate),
            };
        }

        function updateState(previousState: JackpotSimulationState): JackpotSimulationState {
            const newBalance = previousState.balance * (1 + previousState.interestRate / 100.0) - previousState.withdrawal;
            return {
                ...previousState,
                balance: Math.max(newBalance, 0),
                withdrawal: previousState.withdrawal * (1 + previousState.inflationRate / 100.0),
            };
        }
        
        dispatchSimulationUpdate({
            type: 'update',
            state: {
                id: simulationID,
                type: simulationTypeID,
                label: (newState.label === undefined ? label : newState.label),
                initialState: initialState,
                updateState: updateState,
            },
        });
    }

    return (
        <Simulation
            caption="A single large deposit like lottery winnings, a large inheritance, etc."
            dispatchSimulationUpdate={dispatchSimulationUpdate}
            simulationID={simulationID}
            label={label}
            handleLabelChange={handleLabelChange}>
            <Stack spacing={1} direction="row">
                <Tooltip title="Total amount of the jackpot before taxes and other distributions">
                    <TextField
                        label="Jackpot amount ($)"
                        name="jackpot-amount"
                        size="small"
                        value={deposit}
                        onChange={handleDepositChange} />
                </Tooltip>
                <Tooltip title="Federal tax rate - a jackpot should be large enough that the top income tax rate is a good approximation">
                    <TextField
                        label="Federal tax rate (%)"
                        name="federal-tax-rate"
                        size="small"
                        value={federalTaxRate}
                        onChange={handleFederalTaxRateChange} />
                </Tooltip>
                <Tooltip title="State tax rate - some states (e.g. California) don't tax lottery winnings so this will vary depending on where you live">
                    <TextField
                        label="State tax rate (%)"
                        name="state-tax-rate"
                        size="small"
                        value={stateTaxRate}
                        onChange={handleStateTaxRateChange} />
                </Tooltip>
                <Tooltip title="Total amount of money you expect to withdraw each year. This amount will increase each year based on the inflation rate entered">
                    <TextField
                        label="Annual withdrawal ($)"
                        name="annual-withdrawal"
                        size="small"
                        value={withdrawal}
                        onChange={handleWithdrawalChange} />
                </Tooltip>
                <Tooltip title="Any money you expect to spend right away, maybe to pay off debts or donate to charity">
                    <TextField
                        label="Immediate expenditures ($)"
                        name="immediate-expenditures"
                        size="small"
                        value={immediateExpenditures}
                        onChange={handleImmediateExpendituresChange} />
                </Tooltip>
                <Tooltip title="Average rate of inflation; the historical average is about 2.5%">
                    <TextField
                        label="Inflation rate (%)"
                        name="inflation-rate"
                        size="small"
                        value={inflationRate}
                        onChange={handleInflationRateChange} />
                </Tooltip>
                <Tooltip title="Average rate of return you expect based on how you invest the money. The stock market tends to return about 8% per year on average, for example">
                    <TextField
                        label="Interest rate (%)"
                        name="interest-rate"
                        size="small"
                        value={interestRate}
                        onChange={handleInterestRateChange} />
                </Tooltip>
            </Stack>
        </Simulation>
    );
}

export { JackpotSimulation };
