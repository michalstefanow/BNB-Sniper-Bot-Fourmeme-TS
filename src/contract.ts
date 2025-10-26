import { ethers } from 'ethers';
import { Token, TradeResult, TradeType, Config } from './types';
import { Wallet } from './wallet';

export class Contract {
  private wallet: Wallet;
  private config: Config;
  
  // PancakeSwap Router V2 Address (BSC Mainnet)
  private readonly ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  private readonly WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
  
  private router: ethers.Contract;

  // PancakeSwap Router ABI (simplified for swap functions)
  private readonly ROUTER_ABI = [
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function WETH() external pure returns (address)'
  ];

  constructor(wallet: Wallet, config: Config) {
    this.wallet = wallet;
    this.config = config;
    this.router = new ethers.Contract(
      this.ROUTER_ADDRESS,
      this.ROUTER_ABI,
      wallet.getSigner()
    );
  }

  /**
   * Get the estimated output amount for a trade
   */
  async getAmountsOut(amountIn: string, path: string[]): Promise<string[]> {
    const amounts = await this.router.getAmountsOut(amountIn, path);
    return amounts.map(amount => amount.toString());
  }

  /**
   * Calculate minimum output amount with slippage
   */
  calculateMinAmount(amount: string, slippage: number): string {
    const amountBigInt = BigInt(amount);
    const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 100));
    return (amountBigInt * slippageMultiplier / BigInt(10000)).toString();
  }

  /**
   * Buy tokens with BNB
   */
  async buyTokens(tokenAddress: string, bnbAmount: string): Promise<TradeResult> {
    try {
      const path = [this.WBNB_ADDRESS, tokenAddress];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      // Get expected output
      const amounts = await this.getAmountsOut(
        ethers.parseEther(bnbAmount).toString(),
        path
      );
      
      const minAmountOut = this.calculateMinAmount(amounts[1], this.config.slippage);

      const tx = await this.router.swapExactETHForTokens(
        minAmountOut,
        path,
        this.wallet.getAddress(),
        deadline,
        { value: ethers.parseEther(bnbAmount) }
      );

      await this.wallet.waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        amount: amounts[1]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Sell tokens for BNB
   */
  async sellTokens(tokenAddress: string, tokenAmount: string): Promise<TradeResult> {
    try {
      const path = [tokenAddress, this.WBNB_ADDRESS];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      // Get expected output
      const amounts = await this.getAmountsOut(tokenAmount, path);
      
      const minAmountOut = this.calculateMinAmount(amounts[1], this.config.slippage);

      const tx = await this.router.swapExactTokensForETH(
        tokenAmount,
        minAmountOut,
        path,
        this.wallet.getAddress(),
        deadline
      );

      await this.wallet.waitForTransaction(tx.hash);

      return {
        success: true,
        txHash: tx.hash,
        amount: amounts[1]
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Get the price of a token in BNB
   */
  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      const path = [tokenAddress, this.WBNB_ADDRESS];
      const oneToken = ethers.parseUnits('1', 18).toString();
      const amounts = await this.getAmountsOut(oneToken, path);
      return parseFloat(ethers.formatEther(amounts[1]));
    } catch (error) {
      console.error('Error getting token price:', error);
      return 0;
    }
  }

  getRouterAddress(): string {
    return this.ROUTER_ADDRESS;
  }

  getWBNBAddress(): string {
    return this.WBNB_ADDRESS;
  }
}
