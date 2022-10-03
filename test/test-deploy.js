const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

describe("SimpleStorage", function () {
    let simpleStorageFactory, simpleStorage
    //tell us what to do before its
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    //
    it("should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.favoriteNumber()
        console.log(currentValue)
        const expectedValue = "0"

        //makeing suer the curreent value and expected value is the same
        assert.equal(currentValue.toString(), expectedValue)
        //same thing ^
        //expect(currentValue.toString()).to.equal(expectedValue)
    })
    //if you want to run only one test at  time use yarn hardhat test --grep "store" or anything that is in first paramter
    //or can add .only to it
    it("should update when we call store", async function () {
        const expectedValue = "7"
        const tranasactionResponse = await simpleStorage.store(expectedValue)
        await tranasactionResponse.wait(1)

        const currentValue = await simpleStorage.favoriteNumber()
        assert.equal(currentValue.toString(), expectedValue)
    })

    //testing last part of contract
    it("add people in contract", async function () {
        const addPersonResponse = await simpleStorage.addPerson("Spence", 23)
        await addPersonResponse.wait(1)

        //with custom sturcts in js it will return as tupple essentially
        const { favoriteNumber, name } = await simpleStorage.people(0)
        console.log(`person ${favoriteNumber}`)
        assert.equal(favoriteNumber.toString(), "23")
        assert.equal(name.toString(), "Spence")
    })

    //testing dictionary
    // it("testing dictionary", async function () {
    //     const addPersonResponse = await simpleStorage.addPerson("Spence", 23)
    //     await addPersonResponse.wait(1)

    //     //with custom sturcts in js it will return as tupple essentially
    //     const { favoriteNumber, name } = await simpleStorage.people(0)
    //     const number = await simpleStorage.nameToFavoriteNumber.call(
    //         favoriteNumber
    //     )
    //     console.log(`person ${number}`)
    //     assert.equal(number.toString(), "23")
    // })
})
