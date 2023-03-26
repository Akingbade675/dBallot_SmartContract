# Decentralized Ballot Smart Contract

This is a simple voting smart contract built on the Ethereum blockchain. The contract allows for the creation of candidates, voting, and retrieval of voting results. It is built using Solidity, and tested with Hardhat, Chai, and Waffle.


### Installation
1. Clone the repository: ```git clone https://github.com/username/repo-name.git```
2. Install dependencies: ```yarn add```
3. Compile the contracts: ```yarn hardhat compile```
4. Test the contracts: ```yarn hardhat test```


### Usage
<strong>Creating a Ballot</strong>
```javascript
// import the DBallot contract
const DBallot = artifacts.require('DBallot');

// deploy a new instance of the contract
const nextElectionDate = Date.now() + 100000; // 100000 seconds from now
const votingPeriod = 3600; // 1 hour
const ballot = await DBallot.new(nextElectionDate, votingPeriod);
```

<strong>Adding Candidates</strong>
```javascript
// add a candidate to the ballot
const partyName = 'My Party';
const description = 'A description of my party';
const logoUrl = 'https://my-party-logo.com';
await ballot.addCandidate(partyName, description, logoUrl);
```

<strong>Creating a Ballot</strong>
```javascript
// import the DBallot contract
const DBallot = artifacts.require('DBallot');

// deploy a new instance of the contract
const nextElectionDate = Date.now() + 100000; // 100000 seconds from now
const votingPeriod = 3600; // 1 hour
const ballot = await DBallot.new(nextElectionDate, votingPeriod);
```

<strong>Casting Votes</strong>
```javascript
// cast a vote for a candidate
const candidateId = 0; // the id of the candidate to vote for
await ballot.castVote(candidateId);
```

<strong>Retrieving Results</strong>
```javascript
// get the results of the ballot
const results = await ballot.getResults();
console.log(results); // an array of candidate objects, sorted by vote count
```

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
