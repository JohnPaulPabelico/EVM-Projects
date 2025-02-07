const hre = require("hardhat");

async function main() {
  const contractFactory = await hre.ethers.getContractFactory("Gold");
  const deployedERC20 = await contractFactory.deploy();

  await deployedERC20.deployed();
  console.log("ERC20 contract deployed to:", deployedERC20.address);

  console.log("Retreiving balance");
  let balance = await deployedERC20.balanceOf(
    await deployedERC20.signer.getAddress()
  );
  balance = balance.div(ethers.BigNumber.from(10).pow(18));
  console.log("Balance before minting:", balance.toString());

  const mintAmount = ethers.utils.parseUnits("100", 18);
  const tx = await deployedERC20.mint(
    await deployedERC20.signer.getAddress(),
    mintAmount
  );
  await tx.wait();

  console.log("Retreiving balance after mint");
  balance = await deployedERC20.balanceOf(
    await deployedERC20.signer.getAddress()
  );
  balance = balance.div(ethers.BigNumber.from(10).pow(18));
  console.log("Balance after minting:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
