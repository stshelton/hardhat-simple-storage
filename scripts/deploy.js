// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
//run allows us to  run any hardhat task (to view all tasks type yarn hardhat in console)
//network gives u access to current network we are using
const { ethers, run, network } = require("hardhat")

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )

    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed(1)
    //whats the private key
    //whats the rpc url (aka what block chain)
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    //How is this working you may ask?
    // Hardhat comes built- in with hardhat network , a local ehtereum network node designed for development
    // change network by adding --network at end of command line call with network name

    //JS TIP in javascript if you just call a variable in an if statement, it automatically checks if varible exists
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waitng for 6 blocks")
        //potentially etherscan can take a bit for it to be up on website  so wait some blocks
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }
    //how to check if its a live network
    //console.log(network.config)

    const currentValue = await simpleStorage.favoriteNumber()
    console.log(`current value is ${currentValue}`)

    //update currentValue
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updateValue = await simpleStorage.favoriteNumber()
    console.log(`Update Value is: ${updateValue}`)
}

//only verify when working with live network, hard hat defaults to local network
async function verify(contractAddress, args) {
    console.log("Verifying contract ...")
    //one common issue with verifing contract is etherscan could have already verified it before which will cause an error and whole script to end
    //best way to fix that is by adding try catch so we can check if message is about being verified
    //if so then we can continue script if not then stop script show error
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
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
