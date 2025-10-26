export interface Config {
  privateKey: string;
  rpcUrl: string;
  gasPrice: number;
  gasLimit: number;
  slippage: number;
  maxBuyAmount: number;
  autoSell: boolean;
  takeProfitPercent: number;
  stopLossPercent: number;
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface Position {
  tokenAddress: string;
  buyPrice: number;
  buyAmount: number;
  buyTimestamp: number;
  sellPrice?: number;
  sellAmount?: number;
  sellTimestamp?: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amount?: string;
  error?: string;
}

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface TradeSignal {
  tokenAddress: string;
  tradeType: TradeType;
  amount: string;
  timestamp: number;
}
