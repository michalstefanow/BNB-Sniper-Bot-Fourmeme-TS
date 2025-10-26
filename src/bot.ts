import { Wallet } from './wallet';
import { Contract } from './contract';
import { Monitor } from './monitor';
import { Config, Token, Position, TradeType } from './types';
import { ethers } from 'ethers';

export class Bot {
  private wallet: Wallet;
  private contract: Contract;
  private monitor: Monitor;
  private config: Config;
  private isRunning: boolean = false;

  constructor(config: Config) {
    this.config = config;
    this.wallet = new Wallet(config);
    this.contract = new Contract(this.wallet, config);
    this.monitor = new Monitor(this.contract);
  }

  /**
   * Initialize the bot
   */
  async initialize(): Promise<void> {
    const address = this.wallet.getAddress();
    const balance = await this.wallet.getBalance();

    console.log('=== BNB Sniper Bot Initialized ===');
    console.log(`Wallet Address: ${address}`);
    console.log(`Balance: ${balance} BNB`);
    console.log(`Max Buy Amount: ${this.config.maxBuyAmount} BNB`);
    console.log(`Slippage: ${this.config.slippage}%`);
    console.log(`Take Profit: ${this.config.takeProfitPercent}%`);
    console.log(`Stop Loss: ${this.config.stopLossPercent}%`);
    console.log('===================================\n');
  }

  /**
   * Buy a token
   */
  async buyToken(tokenAddress: string, bnbAmount?: string): Promise<Position | null> {
    const amount = bnbAmount || this.config.maxBuyAmount.toString();

    console.log(`\n[BUY] Attempting to buy ${tokenAddress}...`);
    console.log(`Amount: ${amount} BNB`);

    const result = await this.contract.buyTokens(tokenAddress, amount);

    if (!result.success) {
      console.error(`[BUY FAILED] ${result.error}`);
      return null;
    }

    console.log(`[BUY SUCCESS] Transaction: ${result.txHash}`);

    const currentPrice = await this.contract.getTokenPrice(tokenAddress);

    const position: Position = {
      tokenAddress,
      buyPrice: currentPrice,
      buyAmount: parseFloat(amount),
      buyTimestamp: Date.now()
    };

    this.monitor.addPosition(position);
    
    return position;
  }

  /**
   * Sell a token
   */
  async sellToken(tokenAddress: string): Promise<boolean> {
    const position = this.monitor.getPosition(tokenAddress);
    
    if (!position) {
      console.error(`[SELL] No position found for ${tokenAddress}`);
      return false;
    }

    console.log(`\n[SELL] Attempting to sell ${tokenAddress}...`);

    // For now, we'll sell all tokens. In a real implementation, you'd need to track token balance
    const currentPrice = await this.contract.getTokenPrice(tokenAddress);
    
    // This is a simplified sell - in reality you'd need the actual token balance
    const tokenAmount = ethers.parseEther('1').toString(); // Placeholder
    const result = await this.contract.sellTokens(tokenAddress, tokenAmount);

    if (!result.success) {
      console.error(`[SELL FAILED] ${result.error}`);
      return false;
    }

    console.log(`[SELL SUCCESS] Transaction: ${result.txHash}`);
    
    this.monitor.updatePosition(tokenAddress, {
      sellPrice: currentPrice,
      sellAmount: parseFloat(ethers.formatEther(result.amount || '0')),
      sellTimestamp: Date.now()
    });

    return true;
  }

  /**
   * Start the bot
   */
  start(): void {
    if (this.isRunning) {
      console.log('Bot is already running');
      return;
    }

    this.isRunning = true;
    console.log('\n[START] Bot is now running...\n');

    // Start monitoring positions
    this.monitor.startMonitoring((signal) => {
      console.log(`[SIGNAL] ${signal.tradeType} ${signal.tokenAddress}`);
    });
  }

  /**
   * Stop the bot
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Bot is not running');
      return;
    }

    this.monitor.stopMonitoring();
    this.isRunning = false;
    console.log('[STOP] Bot stopped');
  }

  /**
   * Get all positions
   */
  getPositions(): Position[] {
    return this.monitor.getPositions();
  }

  /**
   * Manual trade example
   */
  async executeManualBuy(tokenAddress: string, amount: string): Promise<void> {
    await this.buyToken(tokenAddress, amount);
  }
}
