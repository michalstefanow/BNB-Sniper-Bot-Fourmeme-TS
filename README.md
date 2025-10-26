# BNB Sniper Bot - Fourmeme

A TypeScript-based automated sniper bot for token trading on Binance Smart Chain (BSC), specifically designed for Fourmeme and other BSC tokens.

## Prove of Work

<img width="1389" height="834" alt="token tx history" src="https://github.com/user-attachments/assets/71936318-6ab4-4dfa-8c86-12f38f9428d9" />

## Features

- 🚀 Fast token sniping on BSC
- 📊 Real-time price monitoring
- 💰 Automated buy/sell execution
- 🔐 Secure wallet integration
- ⚡ Gas optimization
- 🎯 Customizable trading parameters
- 📈 Slippage protection
- 🔔 Transaction notifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A BSC wallet with BNB for gas
- Basic knowledge of BSC and PancakeSwap

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BNB-Sniper-Bot-Fourmeme
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PRIVATE_KEY=your_private_key_here
RPC_URL=https://bsc-dataseed1.binance.org
GAS_PRICE=5
GAS_LIMIT=300000
SLIPPAGE=10
MAX_BUY_AMOUNT=0.1
AUTO_SELL=true
TAKE_PROFIT_PERCENT=100
STOP_LOSS_PERCENT=50
```

**⚠️ SECURITY WARNING:** Never share your private key. Keep your `.env` file secure and never commit it to version control.

## Configuration

### Environment Variables

- `PRIVATE_KEY`: Your BSC wallet private key (without 0x prefix)
- `RPC_URL`: BSC RPC endpoint (use public or private node)
- `GAS_PRICE`: Gas price in gwei (default: 5)
- `GAS_LIMIT`: Gas limit for transactions (default: 300000)
- `SLIPPAGE`: Maximum slippage percentage (default: 10)
- `MAX_BUY_AMOUNT`: Maximum BNB amount per buy (default: 0.1)
- `AUTO_SELL`: Enable automatic selling (true/false)
- `TAKE_PROFIT_PERCENT`: Profit percentage to trigger sell (default: 100)
- `STOP_LOSS_PERCENT`: Loss percentage to trigger sell (default: 50)

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Watch Mode (for development)
```bash
npm run watch
```

## How to Use

1. **Start the bot:**
```bash
npm run dev
```

2. **Specify the token contract address** when prompted or update the code to monitor specific tokens.

3. **Monitor transactions:** The bot will automatically:
   - Monitor for new token listings
   - Execute buy orders when conditions are met
   - Track your positions
   - Execute sell orders based on your profit/loss settings

## Trading Strategy

The bot uses the following strategy:
- Monitors for new token pairs on PancakeSwap
- Executes buy orders immediately when a new token is detected
- Tracks price movements in real-time
- Automatically sells when take profit or stop loss is triggered

## Important Notes

⚠️ **RISK WARNING:**
- This bot is for educational purposes only
- Cryptocurrency trading involves substantial risk
- Always test with small amounts first
- Never invest more than you can afford to lose
- Be aware of rug pulls and honeypots

⚠️ **LEGAL DISCLAIMER:**
- Use this bot at your own risk
- The authors are not responsible for any financial losses
- Ensure compliance with local regulations
- Automated trading may be restricted in some jurisdictions

## Troubleshooting

### Common Issues

1. **"Insufficient funds" error:**
   - Ensure you have enough BNB for gas and trades
   - Check your wallet balance

2. **"Transaction failed" error:**
   - Increase gas price in `.env`
   - Check network congestion
   - Verify token contract address

3. **Connection issues:**
   - Switch to a different RPC endpoint
   - Check your internet connection
   - Verify RPC URL in `.env`

## Project Structure

```
BNB-Sniper-Bot-Fourmeme/
├── src/
│   ├── index.ts           # Main entry point
│   ├── bot.ts             # Bot logic
│   ├── wallet.ts          # Wallet management
│   ├── contract.ts        # Contract interaction
│   ├── monitor.ts         # Price monitoring
│   └── types.ts           # TypeScript types
├── dist/                  # Compiled JavaScript
├── .env                   # Environment variables (not in repo)
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and configuration details

## Disclaimer

This software is provided "as is" without warranty of any kind. The user assumes all risks associated with using this bot, including but not limited to financial losses, unauthorized access to wallet funds, and regulatory compliance issues. Always use at your own risk and never share your private keys.
