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
    : describe("TEST Contract Unit Tests", function () {
          let product, productContract, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]

              const contract = await ethers.getContractFactory("TestProductContract") // Returns a new connection to the Product contract

              productContract = await contract.deploy(
                  "vino bianco",
                  "AA2022L30B59",
                  "materia prima",
                  [FAKE_ADDRESS, FAKE_ADDRESS],
                  [FAKE_HASH, FAKE_HASH]
              )
              product = productContract.connect(deployer) // Returns a new instance of the Product contract connected to player
          })

          describe("Constructor", function () {
              it("Initializes the contract correctly", async () => {
                  const owner = await productContract.i_owner()
                  const contract_type = (await productContract.i_contract_type()).toString()
                  const product_name = (await productContract.i_product_name()).toString()
                  const product_id = (await productContract.i_product_ID()).toString()
                  const parent_contracts = await productContract.getAllParentContracts()
                  const hashes = await productContract.getAllHashes()

                  assert.equal(deployer.address, owner)
                  assert.equal(product_name, "vino bianco")
                  assert.equal(product_id, "AA2022L30B59")
                  assert.equal(contract_type, "materia prima")
                  assert.equal(FAKE_ADDRESS, parent_contracts[0])
                  assert.equal(FAKE_ADDRESS, parent_contracts[1])
                  assert.equal(FAKE_HASH, hashes[0])
                  assert.equal(FAKE_HASH, hashes[1])
              })
          })

          describe("Set/get parent_contract", function () {
              it("Set a parent contract", async () => {
                  await product.addParentContract(FAKE_ADDRESS)
                  const parent_contract = await product.s_parent_contracts(0)
                  assert.equal(FAKE_ADDRESS, parent_contract)
              })
              it("Set/Get multiple parent contracts", async () => {
                  await product.addParentContracts(fake_adr_array)

                  //const parent_counter = await product.getParentCounter()
                  //assert.equal(parent_counter.toString(), 2)

                  const parent_contracts = await product.getAllParentContracts()
                  assert.equal(fake_adr_array[0], parent_contracts[0])
                  assert.equal(fake_adr_array[1], parent_contracts[1])
                  assert.equal(fake_adr_array[2], parent_contracts[2])
                  assert.equal(fake_adr_array[3], parent_contracts[3])
              })
              it("Only allows the owner to add a parent contract", async function () {
                  const connectedContract = await product.connect(FAKE_ADDRESS)
                  expect(connectedContract.addParentContract(fake_adr_array)).to.be.revertedWith(
                      "Product__NotOwner"
                  )
              })
          })

          describe("Set/get one or more hash", function () {
              it("should return the initial IPFS CID", async () => {
                  const args = cidToArgs(cid)
                  const decodedCid = argsToCid(args.hash_function, args.size, args.digest)
                  assert.equal(cid, decodedCid, "The IPFS CID was not encoded/decoded correctly.")
              })
              it("Set/Get one hash MULTIHASH", async () => {
                  const args = cidToArgs(cid)
                  tx = await product.storeCIDAsStruct(
                      "prova",
                      args.hash_function,
                      args.size,
                      args.digest
                  )

                  const x = await product.multihash()
              })

              it("Set/Get more hash MULTIHASH", async () => {
                  const args = cidToArgs(cid)
                  const fake_cid_array = [
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                      ["prova", args.hash_function, args.size, args.digest],
                  ]
                  await product.storeMultiplesCIDAsStruct(fake_cid_array)

                  const x = await product.multihashes(4)
              })
              it("emits event on adding CID HASH", async () => {
                  const args = cidToArgs(cid)

                  const tx = await product.storeCIDStructInTheLog(
                      args.hash_function,
                      args.size,
                      args.digest
                  )
                  const receipt = await tx.wait()
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

                  const tx = await product.multiStoreCIDStructInTheLog(fake_cid_array)
                  //const receipt = await tx.wait()
              })

              it("Set/Get one hash", async () => {
                  //add one hash and check counter
                  await product.addHash(FAKE_HASH)

                  //get an hash
                  const hash = await product.s_ipfsHashes(0)
                  assert.equal(FAKE_HASH, hash)
              })
              it("Set/Get multiple hashes", async () => {
                  await product.addHashes(fake_hash_array)

                  //get all the hashes
                  const fake_array = [FAKE_HASH, FAKE_HASH]
                  const hash_array = await product.getAllHashes()
                  assert.equal(fake_array[1], hash_array[2])
              })
              it("emits event on adding hash", async () => {
                  await expect(product.addHashes(fake_hash_array)).to.emit(
                      product,
                      "HashWrittenIntoContract"
                  )
              })
              it("Only allows the owner to add an hash", async function () {
                  const connectedContract = await product.connect(FAKE_ADDRESS)
                  expect(connectedContract.addHashes(fake_hash_array)).to.be.revertedWith(
                      "Product__NotOwner"
                  )
              })
          })

          describe("No more add allowed if contract closed", function () {
              it("revert add hash", async () => {
                  await product.closeContract()

                  expect(product.addHashes(FAKE_HASH)).to.be.revertedWith(
                      "ProductContract__ContractClosed"
                  )
              })

              it("revert add parent contract", async () => {
                  await product.closeContract()

                  expect(product.addParentContract(FAKE_ADDRESS)).to.be.revertedWith(
                      "ProductContract__ContractClosed"
                  )
              })
          })
      })
