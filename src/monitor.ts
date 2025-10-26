import { Contract } from './contract';
import { Position, TradeSignal } from './types';

export class Monitor {
  private contract: Contract;
  private positions: Map<string, Position> = new Map();
  private updateInterval: number;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(contract: Contract, updateInterval: number = 5000) {
    this.contract = contract;
    this.updateInterval = updateInterval;
  }

  /**
   * Add a new position to monitor
   */
  addPosition(position: Position): void {
    this.positions.set(position.tokenAddress, position);
  }

  /**
   * Start monitoring all positions
   */
  startMonitoring(callback: (signal: TradeSignal) => void): void {
    this.intervalId = setInterval(async () => {
      for (const [tokenAddress, position] of this.positions.entries()) {
        if (position.sellPrice) {
          continue; // Already sold
        }

        const currentPrice = await this.contract.getTokenPrice(tokenAddress);
        
        if (currentPrice > 0) {
          const profitPercent = ((currentPrice - position.buyPrice) / position.buyPrice) * 100;
          
          console.log(`Token: ${tokenAddress.slice(0, 10)}... | Current: ${currentPrice} BNB | Profit: ${profitPercent.toFixed(2)}%`);
        }
      }
    }, this.updateInterval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Get all active positions
   */
  getPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  /**
   * Get a specific position
   */
  getPosition(tokenAddress: string): Position | undefined {
    return this.positions.get(tokenAddress);
  }

  /**
   * Update a position
   */
  updatePosition(tokenAddress: string, position: Partial<Position>): void {
    const existing = this.positions.get(tokenAddress);
    if (existing) {
      this.positions.set(tokenAddress, { ...existing, ...position });
    }
  }

  /**
   * Remove a position
   */
  removePosition(tokenAddress: string): void {
    this.positions.delete(tokenAddress);
  }
}
