import { useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { Simulation } from './Simulation.tsx';

interface SimulationState {
    balance: number,
    deposit: number,
    depositFrequency: string,
    inflateDeposits: boolean,
    withdrawal: number,
    withdrawalStartYear: number,
    readonly interestRate: number,
    readonly inflationRate: number,
};

interface PartialSimulationState {
    label?: string,
    balance?: number,
    deposit?: number,
    depositFrequency?: string,
    inflateDeposits?: boolean,
    withdrawal?: number,
    withdrawalStartYear?: number,
    readonly interestRate?: number,
    readonly inflationRate?: number,
}

function RetirementSimulation({ simulationID, simulationTypeID, dispatchSimulationUpdate }) {
    const [ label, setLabel ] = useState('Retirement');
    const [ balance, setBalance ] = useState(35_000);
    const [ deposit, setDeposit ] = useState(300);
    const [ depositFrequency, setDepositFrequency ] = useState('semiweekly');
    const [ inflateDeposits, setInflateDeposits ] = useState(true);
    const [ withdrawal, setWithdrawal ] = useState(50_000);
    const [ withdrawalStartYear, setWithdrawalStartYear ] = useState(2055);
    const [ inflationRate, setInflationRate ] = useState(2.5);
    const [ interestRate, setInterestRate ] = useState(8);

    function handleLabelChange(event) {
        const newLabel = event.target.value;
        setLabel(newLabel)
        updateSimulationState({label: newLabel});
    }

    function handleDepositChange(event) {
        const newDeposit = Number(event.target.value);
        setDeposit(newDeposit);
        updateSimulationState({deposit: newDeposit});
    }

    function handleBalanceChange(event) {
        const newBalance = Number(event.target.value);
        setBalance(newBalance);
        updateSimulationState({balance: newBalance});
    }

    function handleWithdrawalChange(event) {
        const newWithdrawal = Number(event.target.value);
        setWithdrawal(newWithdrawal);
        updateSimulationState({withdrawal: newWithdrawal});
    }

    function handleWithdrawalStartYearChange(event) {
        const newWithdrawalStartYear = Number(event.target.value);
        setWithdrawalStartYear(newWithdrawalStartYear);
        updateSimulationState({withdrawalStartYear: newWithdrawalStartYear});
    }

    function handleDepositFrequencyChange(event) {
        const newDepositFrequency = event.target.value;
        setDepositFrequency(newDepositFrequency);
        updateSimulationState({depositFrequency: newDepositFrequency});
    }

    function handleInflateDepositsChange(event) {
        const newInflateDeposits = event.target.checked;
        setInflateDeposits(newInflateDeposits);
        updateSimulationState({inflateDeposits: newInflateDeposits});
    }

    function handleInflationRateChange(event) {
        const newInflationRate = Number(event.target.value);
        setInflationRate(newInflationRate);
        updateSimulationState({inflationRate: newInflationRate});
    }

    function handleInterestRateChange(event) {
        const newInterestRate = Number(event.target.value);
        setInterestRate(newInterestRate);
        updateSimulationState({interestRate: newInterestRate});
    }

    function updateSimulationState(newState: PartialSimulationState) {
        function initialState(): SimulationState {
            return {
                balance: (newState.balance === undefined ? balance : newState.balance),
                deposit: (newState.deposit === undefined ? deposit : newState.deposit),
                depositFrequency: (newState.depositFrequency === undefined ? depositFrequency : newState.depositFrequency),
                inflateDeposits: (newState.inflateDeposits === undefined ? inflateDeposits : newState.inflateDeposits),
                withdrawal: (newState.withdrawal === undefined ? withdrawal : newState.withdrawal),
                withdrawalStartYear: (newState.withdrawalStartYear === undefined ? withdrawalStartYear : newState.withdrawalStartYear),
                interestRate: (newState.interestRate === undefined ? interestRate : newState.interestRate),
                inflationRate: (newState.inflationRate === undefined ? inflationRate : newState.inflationRate),
            };
        }

        function updateState(previousState: SimulationState, currentYear: number): SimulationState {
            let depositCount = 1;
            if (previousState.depositFrequency === 'weekly') {
                depositCount = 52;
            } else if (previousState.depositFrequency === 'semiweekly') {
                depositCount = 26;
            } else if (previousState.depositFrequency === 'bimonthly') {
                depositCount = 24;
            } else if (previousState.depositFrequency === 'monthly') {
                depositCount = 12;
            }
            const totalDeposits = (currentYear < previousState.withdrawalStartYear ? depositCount * previousState.deposit : 0);
            const totalWithdrawals = (currentYear >= previousState.withdrawalStartYear ? previousState.withdrawal : 0);
            const newBalance = previousState.balance * (1 + previousState.interestRate / 100.0) + totalDeposits - totalWithdrawals;
            return {
                ...previousState,
                balance: Math.max(newBalance, 0),
                deposit: (previousState.inflateDeposits ? previousState.deposit * (1 + previousState.inflationRate / 100.0) : previousState.deposit),
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
            caption="A retirement account where you make periodic deposits until a specific year, then gradually withdraw the money"
            dispatchSimulationUpdate={dispatchSimulationUpdate}
            simulationID={simulationID}
            label={label}
            handleLabelChange={handleLabelChange}>
            <Stack spacing={1} direction="row">
                <Tooltip title="Amount of money you currently have invested">
                    <TextField
                        label="Starting balance ($)"
                        name="starting-balance"
                        size="small"
                        value={balance}
                        onChange={handleBalanceChange} />
                </Tooltip>
                <Tooltip title="How much money you plan to deposit each week, month, etc.">
                    <TextField
                        label="Deposit ($)"
                        name="deposit"
                        size="small"
                        value={deposit}
                        onChange={handleDepositChange} />
                </Tooltip>
                <Tooltip placement="top" title="How often you plan to deposit the amount in the deposit box">
                    <Select
                        labelId="deposit-frequency-select"
                        id="deposit-frequency-select"
                        size="small"
                        value={depositFrequency}
                        label="Deposit frequency"
                        onChange={handleDepositFrequencyChange}
                    >
                        <MenuItem value={'weekly'}>Weekly</MenuItem>
                        <MenuItem value={'semiweekly'}>Every 2 weeks</MenuItem>
                        <MenuItem value={'monthly'}>Monthly</MenuItem>
                        <MenuItem value={'annually'}>Annually</MenuItem>
                    </Select>
                </Tooltip>
                <Tooltip title="If checked, the deposit amount is increased each year to match inflation">
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            name="inflate-deposits"
                            size="small"
                            checked={inflateDeposits}
                            onChange={handleInflateDepositsChange} />}
                            label="Adjust deposits for inflation?" />
                    </FormGroup>
                </Tooltip>
                <Tooltip title="Total amount of money you expect to withdraw each year. This amount will increase each year based on the inflation rate entered">
                    <TextField
                        label="Annual withdrawal ($)"
                        name="annual-withdrawal"
                        size="small"
                        value={withdrawal}
                        onChange={handleWithdrawalChange} />
                </Tooltip>
                <Tooltip title="What year you expect to begin withdrawing money. Deposits will stop at the beginning of this year and inflation-adjusted withdrawals will begin">
                    <TextField
                        label="Withdrawal start year"
                        name="withdrawal-start-year"
                        size="small"
                        value={withdrawalStartYear}
                        onChange={handleWithdrawalStartYearChange} />
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

export { RetirementSimulation };
