
import pandas as pd

class MovingAverageStrategy:
    def __init__(self, short_window=3, long_window=7):
        self.short_window = short_window
        self.long_window = long_window
        self.history = pd.DataFrame(columns=['Close'])

    def generate_signal(self, current_day_data, current_position):
        # Add current day's data to history
        new_row = pd.DataFrame([current_day_data['Close']], columns=['Close'], index=[current_day_data['Date']])
        self.history = pd.concat([self.history, new_row])

        if len(self.history) < self.long_window:
            return 'HOLD'

        # Calculate moving averages
        short_ma = self.history['Close'].rolling(window=self.short_window).mean().iloc[-1]
        long_ma = self.history['Close'].rolling(window=self.long_window).mean().iloc[-1]

        # Generate signal
        if short_ma > long_ma and current_position == 0:
            return 'BUY'
        elif short_ma < long_ma and current_position > 0:
            return 'SELL'
        else:
            return 'HOLD'
