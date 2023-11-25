// import {ethers} from "hardhat";
// import {IPositionRouter} from "../typechain-types";

// async function main() {
//   const positionRouterAddress = "0x86869a5328eCb98b938A71AaC450eABC5E06b242";
//   const positionRouter = await ethers.getContractAt("IPositionRouter", positionRouterAddress) as any as IPositionRouter;
//   const executionFee = await positionRouter.minExecutionFee();
//   console.log("executionFee: ", executionFee.toString())

//   // create position example
//   // long BTC with WETH (0.005) with 2x leverage and use cUSD as collateral
//   const wbtcAddress = "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF" //wbtc
//   const collateral = "0x471EcE3750Da237f93B8E339c536989b8978a438" //celo

//   const path = [collateral, wbtcAddress]
//   const indexToken = wbtcAddress
//   const amountIn = "14900000000000000000" // 15 CELO
//   const minOut = 0
//   const sizeDelta = "20423653259033587500000000000000" //USD value of position with the leverage
//   const isLong = true
//   const acceptablePrice =  "37600583670773750000000000000000000"
//   const referralCode = "0x0000000000000000000000000000000000000000000000000000000000000000"
//   const callbackTarget = "0x0000000000000000000000000000000000000000"

//   const tx = await positionRouter.createIncreasePosition(
//     path,
//     indexToken,
//     amountIn,
//     minOut,
//     sizeDelta,
//     isLong,
//     acceptablePrice,
//     executionFee,
//     referralCode,
//     callbackTarget,
//     {value: executionFee}
//   )
//   await tx.wait()
//   console.log("tx: ", tx.hash);


// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

import { ethers } from "hardhat";
import { IPositionRouter } from "../typechain-types";
import { IVault } from "../typechain-types";
import axios from "axios";

async function main() {
  const positionRouterAddress = "0x86869a5328eCb98b938A71AaC450eABC5E06b242";
  const positionRouter = await ethers.getContractAt(
    "IPositionRouter",
    positionRouterAddress
  ) as any as IPositionRouter;

  const vaultAddress = "0xDC3532cc36DB82640361a86aeEA1fCA23884F2E6";
  const vault = await ethers.getContractAt( "IVault", vaultAddress) as any as IVault;

  const executionFee = await positionRouter.minExecutionFee();
  console.log("executionFee: ", executionFee.toString());

  // Fetch data from localhost:5000/signals/(indexToken)
  const indexToken = "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF"; // Replace with the actual index token
  try {
    // const maxPrice = await vault.getMaxPrice(indexToken);
    // console.log("maxPrice: ", maxPrice.toString());
    const response = await axios.get(`http://localhost:5000/signal/${indexToken}`);
    const signalData = response.data[0];
    console.log("Signal data: ", response.data);

    // if (signalData && signalData.marketDirection) {
    //   const marketDirection = signalData.marketDirection;
    //   console.log('Direction:', marketDirection);
    // } else {
    //   console.error('Market direction not found in the response.');
    // }

    let isLongPredict;

    if (signalData && signalData.marketDirection) {
      const marketDirection = signalData.marketDirection;
      console.log('Direction:', marketDirection);

      isLongPredict = marketDirection.toLowerCase() !== 'bearish';
    } else {
      console.error('Market direction not found in the response.');
      isLongPredict = false;
    }

    console.log('isLongPredict:', isLongPredict);
    // Continue with the rest of your script...

    // create position example
    // long BTC with WETH (0.005) with 2x leverage and use cUSD as collateral
    // const wbtcAddress = "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF"; // wbtc
    const collateral = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // celo

    const path = [collateral, indexToken];
    const amountIn = "4000000000000000000"; // 15 CELO
    const minOut = 0;
    const sizeDelta = "20423653259033587500000000000000"; // USD value of position with the leverage
    const isLong = false;
    const acceptablePrice = "37664430000000000000000000000000000";
    const referralCode =
      "0x0000000000000000000000000000000000000000000000000000000000000000";
    const callbackTarget =
      "0x0000000000000000000000000000000000000000";

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
      { value: executionFee }
    );
    await tx.wait();
    
    console.log("tx: ", tx.hash);
  } catch (error) {
    console.error("Error fetching signal data: ", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
