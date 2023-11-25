import { config as dotEnvConfig } from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotEnvConfig();

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    celo: {
      url: process.env.CELO_RPC_URL || '',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
};

export default config;

