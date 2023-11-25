import {ethers} from "hardhat";
import {IPositionRouter} from "../typechain-types";

async function main() {
  const positionRouterAddress = "0x86869a5328eCb98b938A71AaC450eABC5E06b242";
  const positionRouter = await ethers.getContractAt("IPositionRouter", positionRouterAddress) as any as IPositionRouter;
  const executionFee = await positionRouter.minExecutionFee();
  console.log("executionFee: ", executionFee.toString())

  // create position example
  // long BTC with WETH (0.005) with 2x leverage and use cUSD as collateral
  const wbtcAddress = "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF" //wbtc
  const collateral = "0x471EcE3750Da237f93B8E339c536989b8978a438" //celo

  const path = [collateral, wbtcAddress]
  const indexToken = wbtcAddress
  const amountIn = "14900000000000000000" // 15 CELO
  const minOut = 0
  const sizeDelta = "20423653259033587500000000000000" //USD value of position with the leverage
  const isLong = true
  const acceptablePrice =  "37600583670773750000000000000000000"
  const referralCode = "0x0000000000000000000000000000000000000000000000000000000000000000"
  const callbackTarget = "0x0000000000000000000000000000000000000000"

  const tx = await positionRouter.createIncreasePosition(
    path,
    indexToken,
    amountIn,
    minOut,
    sizeDelta,
    isLong,
    acceptablePrice,
    executionFee,
    referralCode,
    callbackTarget,
    {value: executionFee}
  )
  await tx.wait()
  console.log("tx: ", tx.hash);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});