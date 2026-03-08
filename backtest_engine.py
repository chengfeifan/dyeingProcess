
import pandas as pd

class BacktestEngine:
    def __init__(self, initial_capital=100000.0):
        self.initial_capital = initial_capital
        self.capital = initial_capital
        self.positions = {}  # {symbol: quantity}
        self.transactions = []  # List of dicts: {'date', 'symbol', 'type', 'price', 'quantity', 'value', 'capital'}

    def run_backtest(self, data, strategy):
        for index, row in data.iterrows():
            date = row['Date']
            close_price = row['Close']
            symbol = 'STOCK' # Simplified for a single stock example

            # Allow the strategy to make decisions
            signal = strategy.generate_signal(row, self.positions.get(symbol, 0))

            if signal == 'BUY':
                # For simplicity, buy a fixed quantity
                quantity = 100
                cost = quantity * close_price
                if self.capital >= cost:
                    self.capital -= cost
                    self.positions[symbol] = self.positions.get(symbol, 0) + quantity
                    self.transactions.append({
                        'date': date,
                        'symbol': symbol,
                        'type': 'BUY',
                        'price': close_price,
                        'quantity': quantity,
                        'value': cost,
                        'capital': self.capital
                    })
                    # print(f"{date}: BUY {quantity} of {symbol} at {close_price}. Capital: {self.capital}")
            elif signal == 'SELL':
                if self.positions.get(symbol, 0) > 0:
                    quantity = self.positions[symbol] # Sell all
                    revenue = quantity * close_price
                    self.capital += revenue
                    self.positions[symbol] = 0
                    self.transactions.append({
                        'date': date,
                        'symbol': symbol,
                        'type': 'SELL',
                        'price': close_price,
                        'quantity': quantity,
                        'value': revenue,
                        'capital': self.capital
                    })
                    # print(f"{date}: SELL {quantity} of {symbol} at {close_price}. Capital: {self.capital}")

        final_portfolio_value = self.capital
        for symbol, quantity in self.positions.items():
            # Assuming last close price for current valuation
            final_portfolio_value += quantity * data.iloc[-1]['Close']
            
        return final_portfolio_value, self.transactions
