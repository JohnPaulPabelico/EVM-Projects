const hre = require("hardhat");

async function main() {

  const ERC20 = await hre.ethers.getContractFactory("EbakToken");
  const erc20 = await ERC20.deploy();

  await erc20.deployed();
  console.log("ERC20 contract deployed to:", erc20.address);

  console.log("Retrieving balance");
  let balance = await erc20.balanceOf(await erc20.signer.getAddress());
  balance = balance.div(ethers.BigNumber.from(10).pow(18));
  console.log("Balance before minting:", balance.toString());

  console.log("Minting 100 tokens");
  const mintAmount = ethers.utils.parseUnits("100", 18);
  const tx = await erc20.mint(await erc20.signer.getAddress(), mintAmount);
  await tx.wait();

  balance = await erc20.balanceOf(await erc20.signer.getAddress());
  balance = balance.div(ethers.BigNumber.from(10).pow(18));
  console.log("Balance after minting:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
