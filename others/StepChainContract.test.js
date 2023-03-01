const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { FacetCutAction } = require("hardhat-deploy/dist/types")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const multihashes = require("multihashes")

const FAKE_ADDRESS = "0x0000000000000000000000000000000000001234"
const FAKE_HASH = "QmVQw4eH5i91nvzzTmm3bf89nzsvw9vqVd3qD5J2Bo1qLH"
const cid = "QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvs8u"

const fake_adr_array = [FAKE_ADDRESS, FAKE_ADDRESS, FAKE_ADDRESS, FAKE_ADDRESS, FAKE_ADDRESS]
const fake_hash_array = [FAKE_HASH, FAKE_HASH, FAKE_HASH, FAKE_HASH, FAKE_HASH]

const stringToBytes = function (string) {
    return ethers.utils.formatBytes32String(string)
}
const bytesToString = function (hexString) {
    return ethers.utils.toUtf8String(hexString)
}
const cidToArgs = (cid) => {
    const mh = multihashes.fromB58String(Buffer.from(cid))
    return {
        hash_function: "0x" + Buffer.from(mh.slice(0, 1)).toString("hex"),
        size: "0x" + Buffer.from(mh.slice(1, 2)).toString("hex"),
        digest: "0x" + Buffer.from(mh.slice(2)).toString("hex"),
    }
}

const argsToCid = (hashFunction, size, digest) => {
    const hashHex = hashFunction.slice(2) + size.slice(2) + digest.slice(2)
    const hashBytes = Buffer.from(hashHex, "hex")
    return multihashes.toB58String(hashBytes)
}

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("STEPCHAIN Contract Unit Tests", function () {
          let product, productContract, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              //await deployments.fixture(["productContract"]) // Deploys modules with the tags "productContract"

              const contract = await ethers.getContractFactory("StepChainContract") // Returns a new connection to the Product contract

              productContract = await contract.deploy("CHAIN ID", "CHAIN STEP", "COMPANY NAME")
              product = productContract.connect(deployer) // Returns a new instance of the Product contract connected to player
          })

          describe("Constructor", function () {
              it("Initializes the contract correctly", async () => {
                  const owner = await productContract.i_owner()
                  const company_name = (await productContract.i_company_name()).toString()
                  const chain_id = (await productContract.i_chain_id()).toString()
                  const chain_step = (await productContract.i_chain_step()).toString()

                  assert.equal(deployer.address, owner)
                  assert.equal(company_name, "COMPANY NAME")
                  assert.equal(chain_id, "CHAIN ID")
                  assert.equal(chain_step, "CHAIN STEP")
              })
          })

          describe("Set/get one or more hash", function () {
              it("should return the initial IPFS CID", async () => {
                  const args = cidToArgs(cid)
                  const decodedCid = argsToCid(args.hash_function, args.size, args.digest)
                  assert.equal(cid, decodedCid, "The IPFS CID was not encoded/decoded correctly.")
              })
              it("emits event on adding multiple CID HASH", async () => {
                  const args = cidToArgs(cid)
                  const fake_cid_array = [
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                  ]

                  const tx = await product.multiStoreCidStructInTheLog(
                      "PROVACATEGORIA",
                      "PROVAPRODOTTOID",
                      fake_cid_array
                  )
                  const receipt = await tx.wait()

                  //console.log("evento")
                  //console.log(receipt.events.args)
              })
              it("emits event on adding multiple CID HASH BYTES", async () => {
                  const args = cidToArgs(cid)
                  const fake_cid_array = [
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                  ]

                  const tx = await product.multiStoreCidStructInTheLogBytes(
                      stringToBytes("PROVACATEGORIA"),
                      stringToBytes("PROVAPRODOTTOID"),
                      fake_cid_array
                  )
                  const receipt = await tx.wait()

                  //console.log("evento")
                  //console.log(receipt.events.args)
              })
              it("emit event on adding batch", async () => {
                  batch = {
                      category: "CATEGORY",
                      product_id: "PRODUCTID",
                      parent_id: [[FAKE_ADDRESS, FAKE_ADDRESS]],
                      product_name: "PROVANOME",
                      uom: "UNITADIMISURA",
                      quantity: 3,
                  }

                  const tx = await product.publishBatch(
                      batch.category,
                      batch.product_id,
                      batch.parent_id,
                      batch.product_name,
                      batch.uom,
                      batch.quantity
                  )
                  const receipt = await tx.wait()
              })
              it("emit event on adding batch bytes", async () => {
                  parent_prod_id = stringToBytes("PARENTPRODID")
                  batch = {
                      category: stringToBytes("CATEGORY"),
                      product_id: stringToBytes("PRODUCTID"),
                      parent: [[FAKE_ADDRESS, parent_prod_id]],
                      product_name: stringToBytes("PROVANOME"),
                      uom: stringToBytes("UNITADIMISURA"),
                      quantity: 3,
                  }

                  const tx = await product.publishBatchBytes(
                      batch.category,
                      batch.product_id,
                      batch.parent,
                      batch.product_name,
                      batch.uom,
                      batch.quantity
                  )
                  const receipt = await tx.wait()
                  console.log(bytesToString(receipt.events[0].args.product_name))
              })
          })
      })
