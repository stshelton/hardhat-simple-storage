# Hardhat simple storage notes

## Setting up Hard hat

install hardhat with

```
yarn add --dev hardhat
```

init hard hat with

```
Spencers-iMac:test hh setup spencershelton$ yarn hardhat
yarn run v1.22.15
warning package.json: No license field
$ '/Users/spencershelton/Documents/CodeCampSmartContract/test hh setup/node_modules/.bin/hardhat'
888    888                      888 888               888
888    888                      888 888               888
888    888                      888 888               888
8888888888  8888b.  888d888 .d88888 88888b.   8888b.  888888
888    888     "88b 888P"  d88" 888 888 "88b     "88b 888
888    888 .d888888 888    888  888 888  888 .d888888 888
888    888 888  888 888    Y88b 888 888  888 888  888 Y88b.
888    888 "Y888888 888     "Y88888 888  888 "Y888888  "Y888

👷 Welcome to Hardhat v2.11.2 👷‍

? What do you want to do? … 
❯ Create a JavaScript project
  Create a TypeScript project
  Create an empty hardhat.config.js
  Quit
```

after picking project type will ask you a few set up questions:
```
What do you want to do? · Create a JavaScript project
✔ Hardhat project root: · /Users/spencershelton/Documents/CodeCampSmartContract/test hh setup
✔ Do you want to add a .gitignore? (Y/n) · y
✔ Do you want to install this sample project's dependencies with yarn (@nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-network-helpers @nomicfoundation/hardhat-chai-matchers @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan chai ethers hardhat-gas-reporter solidity-coverage @typechain/hardhat typechain @typechain/ethers-v5 @ethersproject/abi @ethersproject/providers)? (Y/n) · y

```

after hardhat is setup if you run yarn hardhat you will get the avialable tasks hardhat provides
```
yarn hardhat
yarn run v1.22.15
warning package.json: No license field
$ '/Users/spencershelton/Documents/CodeCampSmartContract/test hh setup/node_modules/.bin/hardhat'
Hardhat version 2.11.2

Usage: hardhat [GLOBAL OPTIONS] <TASK> [TASK OPTIONS]

GLOBAL OPTIONS:

  --config              A Hardhat config file. 
  --emoji               Use emoji in messages. 
  --flamegraph          Generate a flamegraph of your Hardhat tasks 
  --help                Shows this message, or a task's help if its name is provided 
  --max-memory          The maximum amount of memory that Hardhat can use. 
  --network             The network to connect to. 
  --show-stack-traces   Show stack traces (always enabled on CI servers). 
  --tsconfig            A TypeScript config file. 
  --typecheck           Enable TypeScript type-checking of your scripts/tests 
  --verbose             Enables Hardhat verbose logging 
  --version             Shows hardhat's version. 


AVAILABLE TASKS:

  check                 Check whatever you need
  clean                 Clears the cache and deletes all artifacts
  compile               Compiles the entire project, building all artifacts
  console               Opens a hardhat console
  coverage              Generates a code coverage report for tests
  flatten               Flattens and prints contracts and their dependencies
  gas-reporter:merge
  help                  Prints this message
  node                  Starts a JSON-RPC server on top of Hardhat Network
  run                   Runs a user-defined script after compiling the project
  test                  Runs mocha tests
  typechain             Generate Typechain typings for compiled contracts
  verify                Verifies contract on Etherscan

To get help for a specific task run: npx hardhat help [task]

✨  Done in 3.64s.
```

If youd like to add custom tasks create a task like so 
```
const { task } = require("hardhat/config")

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
        console.log(account.address)
    }
})
```

## How to spin up a local hardhat  network

```
yarn hardhat node
```

to deploy on hardhat node you have to set up a new network in you hardhat config file. you dont have to add accounts because hardhat sets that up for u

```
localHost: {
    url: "http://127.0.0.1:8545/", 
    chainId: 31337,
},
```
then deploy your contract like so
```
yarn hardhat run scripts/deploy.js --network localHost
```

## Using Console to communicate with blockchain

run console task to open up a console to manipulate blockchain directly in your terminal

```
yarn hardhat console --network localhost
```



# Deploy Script notes

Deploy contract with ethers

```
const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed(1)
}
```

You can run any task directly in a deploy script by importing the run package from hard hat
```
const { run } = require("hardhat")
```
You can get info about the current network your on by importing the `network` package

```
const { network } = require("hardhat")
```
 Then you could programically do certain things on specific networks like so

 ```
 if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waitng for 6 blocks")
        //potentially etherscan can take a bit for it to be up on website  so wait some blocks
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
 ```

 

## Networks
So normally you need the rpc url and private key usually to deploy a smart contract so how is this working?

Hardhat comes built in with a hardhat network, a local ehtereum network node designed for development.

When ever you deploy a script it uses hardhat network by default which automatically comes with rpc and private key

We should be specific with the current default network by specifying it in hardhat.config.js

```
module.exports = {
    defaultNetwork: "hardhat",
    solidity: "0.8.9",
}
```

you can change network in command line by specifing network
```
yarn hardhat run scripts/deploy.js --network hardhat
```
if youd like to use a different network such as a test net like rinkeby you need to config that network in the hardhat.config.js
```
rinkeby: {
    url: RINKEBY_RPC_URL,
    accounts: [PRIVATE_KEY],
    chainId: 4,
},
```
now that you configured your another network you can now deploy onto rinkeby
```
yarn hardhat run scripts/deploy.js --network rinkeby
```


## How to verify your contract

You can use a block explorer's api to verifiy a smart contract programically.

With hardhat we can add plugins to hardhat. To make verifying the contract easier we can add `hardhat-etherscan`

```
yarn add --dev @nomiclabs/hardhat-etherscan
```
Next to have hardhat-etherscan work you need to config it within hardhat.config like so
```
etherscan: {
    apiKey: ETHERSCAN_API_KEY,
},
```

You can directly verify a contract thru command line like so
```
yarn hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor arguements"
```

If you'd like to verify your contract programtically through a script use run run package.
```
async function verify(contractAddress, args) {
    console.log("Verifying contract ...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
    //run (first parameter is the subtask of our verify task, second parameter is the object with actual parameters)
}
```

# Basic Testing with hardhat (mochajs)

to get started we create a descibe function. That takes two parameters the name of test and a function

```
describe("SimpleStorage", function () {}
```

inside each descibe blocks we will have a `beforeEach` function.

`beforeEach` - used to set up data before testing occurs

in this instants we set up the smart contract
```
describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
   
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })
}
```

After before each `it` is then used to test specific things within the smart contract

`it` - takes two parameters one descibing the current test and the second is a function where test takes place

in this instants we are testing simplestorage to start with favorite number as 0

```
it("should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.favoriteNumber()
    console.log(currentValue)
    const expectedValue = "0"

    assert.equal(currentValue.toString(), expectedValue)
})
```

next to use assert or expect to determine if the test is correct u must import `chai` [chai docs](https://www.chaijs.com/)

```
yarn add --dev chai
```

to check if two values equal each other u can use `assert.equal()`

```
assert.equal(currentValue.toString(), expectedValue)
```
you can do the same with `expect` like so
```
expect(currentValue.toString()).to.equal(expectedValue)
```

to run test use
```
yarn hardhat test
```
if you'd like to test one specific case use use `--grep` and text that resides within name of `it()`
```
yarn hardhat test --gerp "should start with a favorite number of 0"
```

## Coverage
Coverage task is used to check the tests we created for our smart contract and see if we tested all functions and there corrasponding variables. It will tell us what lines have not been tested for

add to hardhat config file
```
require("solidity-coverage")
```

example out put

```
---------------------|----------|----------|----------|----------|----------------|
File                 |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
---------------------|----------|----------|----------|----------|----------------|
 contracts/          |    33.33 |      100 |       50 |    33.33 |                |
  SimpleStoreage.sol |    33.33 |      100 |       50 |    33.33 |          63,66 |
---------------------|----------|----------|----------|----------|----------------|
All files            |    33.33 |      100 |       50 |    33.33 |                |
---------------------|----------|----------|----------|----------|----------------|
```


## Gas Reporter

Add gas reporter to your project
```
yarn add --dev hardhat-gas-reporter 
```

Next you need to config gas reporter in your hardhat.config.js. This is basic setup that will print gas report to console.

```
gasReporter: {
    enabled: true,
},
```
if you want to go a step further you can output the gas reporter to a file and add the USD price of the gas. To actually get the price in USD we need a coinmarket cap api key
```
gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKCAP_API_KEY,
    //change block chain to see gas prices
    // token: "AVAX",
},
```

gas report will look something like this

```
|      Solc version: 0.8.9      ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
································|····························|·············|······························
|  Methods                      ·               15 gwei/gas                ·       1921.97 usd/eth       │
··················|·············|··············|·············|·············|···············|··············
|  Contract       ·  Method     ·  Min         ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
··················|·············|··············|·············|·············|···············|··············
|  SimpleStorage  ·  addPerson  ·           -  ·          -  ·     112395  ·            2  ·       3.24  │
··················|·············|··············|·············|·············|···············|··············
|  SimpleStorage  ·  store      ·           -  ·          -  ·      43724  ·            2  ·       1.26  │
··················|·············|··············|·············|·············|···············|··············
|  Deployments                  ·                                          ·  % of limit   ·             │
································|··············|·············|·············|···············|··············
|  SimpleStorage                ·           -  ·          -  ·     463034  ·        1.5 %  ·      13.35  │
·-------------------------------|--------------|-------------|-------------|---------------|-------------·

```