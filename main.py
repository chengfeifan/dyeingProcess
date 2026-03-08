
import pandas as pd
from backtest_engine import BacktestEngine
from strategies.moving_average import MovingAverageStrategy

def main():
    print("Starting quantitative backtesting platform...")

    # 1. Load Data
    try:
        data = pd.read_csv('data/sample_stock_data.csv')
        data['Date'] = pd.to_datetime(data['Date'])
        data = data.sort_values(by='Date').reset_index(drop=True)
        print("Data loaded successfully.")
    except FileNotFoundError:
        print("Error: data/sample_stock_data.csv not found. Please ensure the data file exists.")
        return

    # 2. Initialize Strategy and Engine
    strategy = MovingAverageStrategy(short_window=3, long_window=7)
    engine = BacktestEngine(initial_capital=100000.0)
    print(f"Initial Capital: {engine.initial_capital}")

    # 3. Run Backtest
    final_value, transactions = engine.run_backtest(data, strategy)
    print("Backtest completed.")

    # 4. Report Results
    print("\n--- Backtest Results ---")
    print(f"Final Portfolio Value: {final_value:.2f}")
    total_return = (final_value - engine.initial_capital) / engine.initial_capital * 100
    print(f"Total Return: {total_return:.2f}%")

    print("\n--- Transactions ---")
    if transactions:
        for t in transactions:
            print(f"Date: {t['date'].strftime('%Y-%m-%d')}, Type: {t['type']}, Symbol: {t['symbol']}, Price: {t['price']:.2f}, Quantity: {t['quantity']}, Capital Remaining: {t['capital']:.2f}")
    else:
        print("No transactions occurred.")

if __name__ == "__main__":
    main()
