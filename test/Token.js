const {ethers} = require('hardhat')
const {expect} = require('chai')
const {ZeroAddress} = require("ethers");

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}
describe('Token', () => {

    const ZeroAddress = '0x0000000000000000000000000000000000000000'
    let token, accounts, deployer, receiver, exchange

    beforeEach(async () => {
        const Token = await ethers.getContractFactory('Token')
        token = await Token.deploy('Moh Token', 'MOH', '1000000')
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        receiver = accounts[1]
        exchange = accounts[2]
    })

    describe('Deployment', () => {
        const name = 'Moh Token'
        const symbol = 'MOH'
        const decimals = '18'
        const totalSupply = tokens(1000000)

        it('has correct name', async () => {
            expect(await token.name()).to.equal(name)
        })

        it('has correct symbol', async () => {
            expect(await token.symbol()).to.equal(symbol)
        })

        it('has correct decimals', async () => {
            expect(await token.decimals()).to.equal(decimals)
        })

        it('has correct total supply', async () => {
            expect(await token.totalSupply()).to.equal(totalSupply)
        })

        it('assigns total supply to deployer', async () => {
            expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
        })
    })

    describe('Sending Token', () => {

        describe('Success', () => {
            let amount, tx, result
            beforeEach(async () => {
                amount = tokens(100)
                tx = await token.connect(deployer).transfer(receiver.address, amount)
                result = await tx.wait()
            })

            it('transfers token balances', async () => {
                expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
                expect(await token.balanceOf(receiver.address)).to.equal(amount)
            })

            it('emits a Transfer event', async () => {
                // console.log(result.value)
                // expect(result.events[0].event).to.equal('Transfer')
            })
        })

        describe('Failure', () => {
            it('rejects insufficient token balances ', async () => {
                const invalidAmount = tokens(100000000) // 100M
                await expect(await token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
            })

            it('rejects invalid recipient', async () => {
                const invalidAmount = tokens(100)
                await expect(await token.connect(deployer).transfer(ZeroAddress, invalidAmount)).to.be.reverted
            })
        })

    })

    describe('Approving Token', () => {

        let amount, tx, result
        beforeEach(async () => {
            amount = tokens(100)
            tx = await token.connect(deployer).approve(exchange.address, amount)
            result = await tx.wait()
        })

        describe('Success', () => {
            it('allocates an allowance for delegated token spending', async () => {
                expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
            })

            it('emits an Approval event', async () => {
                // console.log(result)
                // expect(result.events[0].event).to.equal('Transfer')
            })
        })

        describe('Failure', () => {
            it('rejects invalid spender', async () => {
                const invalidAmount = tokens(100)
                await expect(await token.connect(deployer).transfer(ZeroAddress, invalidAmount)).to.be.reverted
            })
        })
    })

    // describe('Delegated Token Transfer', () => {
    //     let amount, tx, result
    //     beforeEach(async () => {
    //         amount = tokens(100)
    //         tx = await token.connect(deployer).approve(exchange.address, amount)
    //         result = await tx.wait()
    //     })
    //
    //     describe('Success', () => {
    //         beforeEach(async () => {
    //             tx = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
    //             result = await tx.wait()
    //         })
    //
    //         it('transfers tokens balances', async () => {
    //             expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
    //             expect(await token.balanceOf(receiver.address)).to.equal(amount)
    //         })
    //
    //         it('resets the allowance', async () => {
    //             expect(await token.allowance(deployer.address, exchange.address)).to.equal(0)
    //         })
    //
    //         it('emits a Transfer event', async () => {
    //             console.log(result.value)
    //             // expect(result.events[0].event).to.equal('Transfer')
    //         })
    //     })
    //
    //     describe('Failure', () => {
    //         it('rejects invalid spender', async () => {
    //             const invalidAmount = tokens(1000000)
    //             await expect(await token.connect(deployer).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
    //         })
    //     })
    // })
})