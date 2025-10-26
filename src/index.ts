import * as dotenv from 'dotenv';
import { Bot } from './bot';
import { Config } from './types';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateConfig(): Config {
  const requiredVars = ['PRIVATE_KEY', 'RPC_URL'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  return {
    privateKey: process.env.PRIVATE_KEY!,
    rpcUrl: process.env.RPC_URL!,
    gasPrice: parseInt(process.env.GAS_PRICE || '5'),
    gasLimit: parseInt(process.env.GAS_LIMIT || '300000'),
    slippage: parseInt(process.env.SLIPPAGE || '10'),
    maxBuyAmount: parseFloat(process.env.MAX_BUY_AMOUNT || '0.1'),
    autoSell: process.env.AUTO_SELL === 'true',
    takeProfitPercent: parseInt(process.env.TAKE_PROFIT_PERCENT || '100'),
    stopLossPercent: parseInt(process.env.STOP_LOSS_PERCENT || '50')
  };
}

async function main() {
  try {
    // Validate and load configuration
    const config = validateConfig();

    // Initialize bot
    const bot = new Bot(config);
    await bot.initialize();

    // Start the bot
    bot.start();

    // Example: You can add manual trading here
    // Uncomment and modify as needed:
    /*
    const tokenAddress = '0x...'; // Token contract address
    const amount = '0.05'; // BNB amount
    
    console.log('Executing manual buy...');
    await bot.executeManualBuy(tokenAddress, amount);
    */

    // Keep the process running
    process.on('SIGINT', () => {
      console.log('\n[SHUTDOWN] Received SIGINT, stopping bot...');
      bot.stop();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('\n[SHUTDOWN] Received SIGTERM, stopping bot...');
      bot.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the bot
main().catch(console.error);
