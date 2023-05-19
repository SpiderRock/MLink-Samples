<img src="https://data-portal.spiderrock.net/imgs/SpiderRock-Horizontal-Logo.png" width="400" alt="SpiderRock">

# Sample App: MLink Analyzer
This project serves as a REST API code example of how to connect to the SpiderRock MLink, which is a data feed for live and delayed data from the SpiderRock MBUS. The application connects to MLink and displays the responses in a grid format allowing a user to select a specific message type and enter queries for more advanced filtering. 

## Installation
To install the relevant packages neccesary to run MLink Analyzer locally, simply clone this repo, navigate to the local directory you cloned to in Terminal or Command Prompt, then execute the following command:

```bash
npm i
```

### Managing Mulitple Environments
To manage multiple development environments easily within this project, we have introduced 'env-cmd'. This allows us to specify a `env.cmdrc` file that defines a JSON dictionary of variables per environment. Then when deploying, our infrastucture code also uses this to deploy per stage. Furthermore, although this is included in this project's `package.json` file, it can alternatively can be installed globally via npm with the folling command:

```bash
npm -g env-cmd
```

## Running Locally
To run this application locally, simply navigate to your local directory and run:

```bash
npm start
```

If managing multiple environments, use env-cmd to declare which stage you wish to run locally by using the following commmand:

```bash
env-cmd -e local npm start
```

## Running Tests
To run tests for MLink Analyzer, simply navigate to your local directory and run:

```bash
  npm test
```