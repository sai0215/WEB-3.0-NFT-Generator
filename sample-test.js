const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("nfft",function(){
  it("Should mint and transfer an NFT to the customer", async function (){
    const Nftfolk = await ethers.getContractFactory("Nftfolk");
    const nftfolk = await Nftfolk.deploy();
    await nftfolk.deployed();
    const recipient='0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metadataURI='cid/test.png';

    let balance=await nftfolk.balanceOf(recipient);
    expect(balance).to.equal(0);
    const newlyMintedToken=await nftfolk.payToMint(recipient, metadataURI, {value: ethers.utils.parseEther('0.76')});

    await newlyMintedToken.wait();

    balance = await nftfolk.balanceOf(recipient)
    expect(balance).to.equal(1);

    expect(await nftfolk.isContentOwned(metadataURI)).to.equal(true);
  });
});