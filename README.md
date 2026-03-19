# Investotron

Investotron is a React app that can simulate different investment conditions over time, like planning for retirement or what to do if you win the lottery.

Right now the simulations are very coarse but I've personally found them pretty useful so I'm sharing them here in the hopes that someone else will too.

## Setup
### Prerequisites
You will need:
* [Node.js v24](https://nodejs.org/en/download)

### Install dependencies

Just run `npm install` from the project directory and you should be all set.

```
$ npm install

up to date, audited 263 packages in 477ms

67 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Run it

```
$ npm run dev

> investotron@0.0.1 dev
> vite --port 8888


  VITE v8.0.0  ready in 139 ms

  ➜  Local:   http://127.0.0.1:8888/
  ➜  press h + enter to show help
```

The project is up and running at the shown URL; open it in a browser to start running simulations. You can edit package.json to change the port and other settings as needed.

## Usage

Currently there are three scenarios you can simulate:

* Generic retirement account: make periodic deposits until some future date, then begin withdrawing from the principal + interest
* Pension account: the same as the generic retirement account but optionally includes employer contributions - think 401(k) or RRSP
* Jackpot: start with a large initial deposit and simulate how the money will grow after taxes and other withdrawals
