import { ethers } from 'ethers';
import { Config } from './types';

export class Wallet {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private signer: ethers.Wallet;

  constructor(config: Config) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey);
    this.signer = this.wallet.connect(this.provider);
  }

  getAddress(): string {
    return this.wallet.address;
  }

  async getBalance(): Promise<string> {
    const balance = await this.provider.getBalance(this.wallet.address);
    return ethers.formatEther(balance);
  }

  getSigner(): ethers.Wallet {
    return this.signer;
  }

  getProvider(): ethers.JsonRpcProvider {
    return this.provider;
  }

  async sendTransaction(tx: ethers.TransactionRequest): Promise<ethers.TransactionResponse> {
    return await this.signer.sendTransaction(tx);
  }

  async waitForTransaction(hash: string): Promise<ethers.TransactionReceipt | null> {
    return await this.provider.waitForTransaction(hash);
  }

  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice || ethers.parseUnits('5', 'gwei');
  }

  async estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return await this.provider.estimateGas(tx);
  }
}
