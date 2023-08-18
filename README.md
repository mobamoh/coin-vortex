# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat node
npx hardhat compile
npx hardhat run --network localhost scripts/deploy.js

npx hardhat console --network localhost

const token = await ethers.getContractAt("Token", "address")
token.address

const accounts = await ethers.getSigners()
const balance = await ethers.provider.getBalance(account[0].address)
balance.toString()
ethers.utils.formatEther(balance.toString())

npx hardhat test
```
