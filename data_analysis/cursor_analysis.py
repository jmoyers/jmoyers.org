#!/usr/bin/env python3
"""
Cursor Usage Analysis Script
============================

This script analyzes cursor usage data from two CSV files:
1. cursor_usage.csv - Contains date, user, kind, model, tokens, cost
2. cursor_token_usage.csv - Contains detailed token breakdown (input/output/cache)

The script creates visualizations similar to those in the throughput-reconsidered post
and analyzes cache efficiency.
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from datetime import datetime, timedelta
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

# Set up matplotlib style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class CursorAnalyzer:
    def __init__(self, usage_file='src/content/posts/throughput-reconsidered/data/cursor_usage.csv',
                 token_file='src/content/posts/throughput-reconsidered/data/cursor_token_usage.csv',
                 output_dir='src/content/posts/throughput-reconsidered/analysis_output/'):
        """Initialize the analyzer with data files."""
        self.usage_file = usage_file
        self.token_file = token_file
        self.output_dir = output_dir
        
        # Create output directory
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        # Load data
        self.load_data()
        
    def load_data(self):
        """Load and preprocess the CSV data."""
        print("Loading data...")
        
        # Load usage data with dates
        self.usage_df = pd.read_csv(self.usage_file)
        
        # Load token breakdown data
        self.token_df = pd.read_csv(self.token_file)
        
        # Clean and preprocess usage data
        self.clean_usage_data()
        
        # Clean and preprocess token data
        self.clean_token_data()
        
        print(f"Loaded {len(self.usage_df)} usage records and {len(self.token_df)} token records")
        
    def clean_usage_data(self):
        """Clean and preprocess the usage data."""
        # Parse dates
        self.usage_df['datetime'] = pd.to_datetime(self.usage_df['Date'], format='%b %d, %I:%M %p')
        
        # Add year (assuming 2024 since no year in data)
        current_year = datetime.now().year
        self.usage_df['datetime'] = self.usage_df['datetime'].apply(
            lambda x: x.replace(year=current_year)
        )
        
        # Clean tokens column (remove commas and convert to numeric)
        self.usage_df['tokens_clean'] = self.usage_df['Tokens'].astype(str).str.replace(',', '').astype(float)
        
        # Extract numeric cost
        self.usage_df['cost_numeric'] = self.usage_df['Cost'].str.replace('$', '').str.replace('Included', '0').astype(float)
        
        # Create date column for daily aggregation
        self.usage_df['date'] = self.usage_df['datetime'].dt.date
        
        # Filter out errored/zero token entries for most analyses
        self.usage_df_clean = self.usage_df[
            (self.usage_df['tokens_clean'] > 0) & 
            (self.usage_df['Kind'] != 'Errored, Not Charged')
        ].copy()
        
    def clean_token_data(self):
        """Clean and preprocess the token breakdown data."""
        # Convert token columns to numeric
        token_cols = ['Input', 'Output', 'Cache Write', 'Cache Read']
        for col in token_cols:
            self.token_df[col] = self.token_df[col].astype(str).str.replace(',', '').astype(float)
        
        # Calculate total tokens
        self.token_df['total_tokens'] = (
            self.token_df['Input'] + 
            self.token_df['Output'] + 
            self.token_df['Cache Write'] + 
            self.token_df['Cache Read']
        )
        
        # Calculate true I/O tokens (excluding cache)
        self.token_df['true_io_tokens'] = self.token_df['Input'] + self.token_df['Output']
        
        # Calculate cache efficiency metrics
        self.token_df['cache_total'] = self.token_df['Cache Write'] + self.token_df['Cache Read']
        self.token_df['cache_ratio'] = self.token_df['cache_total'] / self.token_df['total_tokens']
        self.token_df['cache_read_ratio'] = self.token_df['Cache Read'] / self.token_df['total_tokens']
        
        # Filter out errored/zero entries
        self.token_df_clean = self.token_df[
            (self.token_df['total_tokens'] > 0) & 
            (self.token_df['Kind'] != 'Errored, Not Charged')
        ].copy()
        
    def correlate_datasets(self):
        """Attempt to correlate the two datasets."""
        print("Attempting to correlate datasets...")
        
        # Try to match by total tokens and model
        correlation_attempts = []
        
        # Group token data by model and total tokens
        token_groups = self.token_df_clean.groupby(['Model', 'total_tokens']).size().reset_index(name='count')
        usage_groups = self.usage_df_clean.groupby(['Model', 'tokens_clean']).size().reset_index(name='count')
        
        # Try to find matches
        merged = pd.merge(
            token_groups, 
            usage_groups, 
            left_on=['Model', 'total_tokens'], 
            right_on=['Model', 'tokens_clean'],
            how='inner'
        )
        
        match_rate = len(merged) / max(len(token_groups), len(usage_groups))
        print(f"Direct token matching rate: {match_rate:.2%}")
        
        # Create synthetic timeline for token data based on order
        self.create_synthetic_timeline()
        
        return merged
        
    def create_synthetic_timeline(self):
        """Create a synthetic timeline for token data based on order and usage patterns."""
        print("Creating synthetic timeline for token data...")
        
        # Get the date range from usage data
        start_date = self.usage_df_clean['datetime'].min()
        end_date = self.usage_df_clean['datetime'].max()
        
        # Create evenly spaced timestamps for token data
        n_records = len(self.token_df_clean)
        time_range = pd.date_range(start=start_date, end=end_date, periods=n_records)
        
        # Add synthetic timestamps (assuming reverse chronological order like usage data)
        self.token_df_clean = self.token_df_clean.copy()
        self.token_df_clean['synthetic_datetime'] = time_range[::-1]  # Reverse for chronological order
        self.token_df_clean['synthetic_date'] = self.token_df_clean['synthetic_datetime'].dt.date
        
    def create_daily_tokens_chart(self):
        """Create daily tokens chart similar to the original."""
        print("Creating daily tokens chart...")
        
        # Daily aggregation of usage data
        daily_usage = self.usage_df_clean.groupby('date').agg({
            'tokens_clean': 'sum',
            'cost_numeric': 'sum'
        }).reset_index()
        
        daily_usage['date'] = pd.to_datetime(daily_usage['date'])
        daily_usage = daily_usage.sort_values('date')
        
        # Create the plot
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
        
        # Tokens plot
        ax1.plot(daily_usage['date'], daily_usage['tokens_clean'], marker='o', linewidth=2, markersize=4)
        ax1.set_ylabel('Daily Tokens')
        ax1.set_title('Daily Cursor Usage - Tokens')
        ax1.grid(True, alpha=0.3)
        
        # Cost plot
        ax2.plot(daily_usage['date'], daily_usage['cost_numeric'], marker='o', linewidth=2, markersize=4, color='red')
        ax2.set_ylabel('Daily Cost ($)')
        ax2.set_xlabel('Date')
        ax2.set_title('Daily Cursor Usage - Cost')
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/daily_tokens_recreated.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return daily_usage
        
    def create_cumulative_tokens_chart(self):
        """Create cumulative tokens chart."""
        print("Creating cumulative tokens chart...")
        
        # Daily aggregation and cumulative sum
        daily_usage = self.usage_df_clean.groupby('date').agg({
            'tokens_clean': 'sum'
        }).reset_index()
        
        daily_usage['date'] = pd.to_datetime(daily_usage['date'])
        daily_usage = daily_usage.sort_values('date')
        daily_usage['cumulative_tokens'] = daily_usage['tokens_clean'].cumsum()
        
        # Create the plot
        plt.figure(figsize=(12, 6))
        plt.plot(daily_usage['date'], daily_usage['cumulative_tokens'], 
                linewidth=2, marker='o', markersize=3)
        plt.ylabel('Cumulative Tokens')
        plt.xlabel('Date')
        plt.title('Cumulative Cursor Token Usage')
        plt.grid(True, alpha=0.3)
        
        # Add milestone markers
        milestones = [1000000, 2000000, 5000000, 10000000]
        for milestone in milestones:
            if daily_usage['cumulative_tokens'].max() >= milestone:
                milestone_date = daily_usage[daily_usage['cumulative_tokens'] >= milestone]['date'].iloc[0]
                plt.axhline(y=milestone, color='red', linestyle='--', alpha=0.5)
                plt.text(milestone_date, milestone, f'{milestone/1000000:.0f}M', 
                        verticalalignment='bottom')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/cumulative_tokens_recreated.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return daily_usage
        
    def create_model_types_chart(self):
        """Create model types distribution chart."""
        print("Creating model types chart...")
        
        # Aggregate by model
        model_usage = self.usage_df_clean.groupby('Model').agg({
            'tokens_clean': 'sum',
            'cost_numeric': 'sum'
        }).reset_index()
        
        model_usage = model_usage.sort_values('tokens_clean', ascending=False)
        
        # Create the plot
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Tokens by model
        ax1.bar(range(len(model_usage)), model_usage['tokens_clean'])
        ax1.set_xlabel('Model')
        ax1.set_ylabel('Total Tokens')
        ax1.set_title('Token Usage by Model')
        ax1.set_xticks(range(len(model_usage)))
        ax1.set_xticklabels(model_usage['Model'], rotation=45, ha='right')
        
        # Cost by model
        ax2.bar(range(len(model_usage)), model_usage['cost_numeric'])
        ax2.set_xlabel('Model')
        ax2.set_ylabel('Total Cost ($)')
        ax2.set_title('Cost by Model')
        ax2.set_xticks(range(len(model_usage)))
        ax2.set_xticklabels(model_usage['Model'], rotation=45, ha='right')
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/model_types_recreated.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return model_usage
        
    def create_requests_per_minute_chart(self):
        """Create requests per minute chart."""
        print("Creating requests per minute chart...")
        
        # Round to nearest minute for grouping
        self.usage_df_clean['minute'] = self.usage_df_clean['datetime'].dt.floor('T')
        
        # Count requests per minute
        requests_per_minute = self.usage_df_clean.groupby('minute').size().reset_index(name='requests')
        
        # Create the plot
        plt.figure(figsize=(12, 6))
        plt.plot(requests_per_minute['minute'], requests_per_minute['requests'], 
                linewidth=1, alpha=0.7)
        plt.ylabel('Requests per Minute')
        plt.xlabel('Time')
        plt.title('Cursor Requests per Minute')
        plt.grid(True, alpha=0.3)
        
        # Add moving average
        window_size = 10
        requests_per_minute['moving_avg'] = requests_per_minute['requests'].rolling(window=window_size).mean()
        plt.plot(requests_per_minute['minute'], requests_per_minute['moving_avg'], 
                linewidth=2, color='red', label=f'{window_size}-minute moving average')
        
        plt.legend()
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/requests_per_minute_recreated.png', dpi=300, bbox_inches='tight')
        plt.show()
        
        return requests_per_minute
        
    def analyze_cache_efficiency(self):
        """Analyze cache read/write patterns and efficiency."""
        print("Analyzing cache efficiency...")
        
        # Cache efficiency metrics
        cache_stats = {
            'total_cache_reads': self.token_df_clean['Cache Read'].sum(),
            'total_cache_writes': self.token_df_clean['Cache Write'].sum(),
            'total_input_tokens': self.token_df_clean['Input'].sum(),
            'total_output_tokens': self.token_df_clean['Output'].sum(),
            'total_true_io': self.token_df_clean['true_io_tokens'].sum(),
            'total_all_tokens': self.token_df_clean['total_tokens'].sum(),
        }
        
        # Calculate ratios
        cache_stats['cache_read_ratio'] = cache_stats['total_cache_reads'] / cache_stats['total_all_tokens']
        cache_stats['cache_write_ratio'] = cache_stats['total_cache_writes'] / cache_stats['total_all_tokens']
        cache_stats['true_io_ratio'] = cache_stats['total_true_io'] / cache_stats['total_all_tokens']
        
        print("\nCache Efficiency Analysis:")
        print(f"Total tokens: {cache_stats['total_all_tokens']:,}")
        print(f"True I/O tokens: {cache_stats['total_true_io']:,} ({cache_stats['true_io_ratio']:.1%})")
        print(f"Cache reads: {cache_stats['total_cache_reads']:,} ({cache_stats['cache_read_ratio']:.1%})")
        print(f"Cache writes: {cache_stats['total_cache_writes']:,} ({cache_stats['cache_write_ratio']:.1%})")
        
        # Create cache efficiency visualization
        self.create_cache_efficiency_chart()
        
        return cache_stats
        
    def create_cache_efficiency_chart(self):
        """Create cache efficiency visualization."""
        print("Creating cache efficiency chart...")
        
        # Create pie chart of token types
        token_types = {
            'Input': self.token_df_clean['Input'].sum(),
            'Output': self.token_df_clean['Output'].sum(),
            'Cache Read': self.token_df_clean['Cache Read'].sum(),
            'Cache Write': self.token_df_clean['Cache Write'].sum(),
        }
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        
        # Pie chart of token distribution
        ax1.pie(token_types.values(), labels=token_types.keys(), autopct='%1.1f%%', startangle=90)
        ax1.set_title('Token Distribution by Type')
        
        # Cache efficiency over time (using synthetic timeline)
        daily_cache = self.token_df_clean.groupby('synthetic_date').agg({
            'Cache Read': 'sum',
            'Cache Write': 'sum',
            'true_io_tokens': 'sum',
            'total_tokens': 'sum'
        }).reset_index()
        
        daily_cache['cache_efficiency'] = (daily_cache['Cache Read'] + daily_cache['Cache Write']) / daily_cache['total_tokens']
        
        ax2.plot(daily_cache['synthetic_date'], daily_cache['cache_efficiency'], marker='o')
        ax2.set_ylabel('Cache Ratio')
        ax2.set_xlabel('Date')
        ax2.set_title('Cache Efficiency Over Time')
        ax2.grid(True, alpha=0.3)
        
        # Cache read vs write comparison
        cache_comparison = self.token_df_clean.groupby('Model').agg({
            'Cache Read': 'sum',
            'Cache Write': 'sum'
        }).reset_index()
        
        x = np.arange(len(cache_comparison))
        width = 0.35
        
        ax3.bar(x - width/2, cache_comparison['Cache Read'], width, label='Cache Read')
        ax3.bar(x + width/2, cache_comparison['Cache Write'], width, label='Cache Write')
        ax3.set_xlabel('Model')
        ax3.set_ylabel('Tokens')
        ax3.set_title('Cache Read vs Write by Model')
        ax3.set_xticks(x)
        ax3.set_xticklabels(cache_comparison['Model'], rotation=45, ha='right')
        ax3.legend()
        
        # True I/O vs Cache tokens scatter
        ax4.scatter(self.token_df_clean['true_io_tokens'], self.token_df_clean['cache_total'], alpha=0.6)
        ax4.set_xlabel('True I/O Tokens')
        ax4.set_ylabel('Cache Tokens')
        ax4.set_title('True I/O vs Cache Tokens')
        ax4.grid(True, alpha=0.3)
        
        # Add diagonal line for reference
        max_tokens = max(self.token_df_clean['true_io_tokens'].max(), self.token_df_clean['cache_total'].max())
        ax4.plot([0, max_tokens], [0, max_tokens], 'r--', alpha=0.5, label='1:1 ratio')
        ax4.legend()
        
        plt.tight_layout()
        plt.savefig(f'{self.output_dir}/cache_efficiency_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()
        
    def create_interactive_dashboard(self):
        """Create an interactive dashboard using Plotly."""
        print("Creating interactive dashboard...")
        
        # Create subplots
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Daily Tokens', 'Model Distribution', 'Cache Efficiency', 'Usage Timeline'),
            specs=[[{"secondary_y": True}, {"type": "pie"}],
                   [{"secondary_y": False}, {"secondary_y": False}]]
        )
        
        # Daily tokens
        daily_usage = self.usage_df_clean.groupby('date').agg({
            'tokens_clean': 'sum',
            'cost_numeric': 'sum'
        }).reset_index()
        
        fig.add_trace(
            go.Scatter(x=daily_usage['date'], y=daily_usage['tokens_clean'], 
                      mode='lines+markers', name='Daily Tokens'),
            row=1, col=1
        )
        
        # Model distribution
        model_usage = self.usage_df_clean.groupby('Model')['tokens_clean'].sum().reset_index()
        fig.add_trace(
            go.Pie(labels=model_usage['Model'], values=model_usage['tokens_clean'], 
                   name="Model Distribution"),
            row=1, col=2
        )
        
        # Cache efficiency
        token_types = {
            'Input': self.token_df_clean['Input'].sum(),
            'Output': self.token_df_clean['Output'].sum(),
            'Cache Read': self.token_df_clean['Cache Read'].sum(),
            'Cache Write': self.token_df_clean['Cache Write'].sum(),
        }
        
        fig.add_trace(
            go.Bar(x=list(token_types.keys()), y=list(token_types.values()), 
                   name="Token Types"),
            row=2, col=1
        )
        
        # Usage timeline
        hourly_usage = self.usage_df_clean.groupby(self.usage_df_clean['datetime'].dt.hour)['tokens_clean'].sum()
        fig.add_trace(
            go.Scatter(x=hourly_usage.index, y=hourly_usage.values, 
                      mode='lines+markers', name='Hourly Usage'),
            row=2, col=2
        )
        
        fig.update_layout(height=800, title_text="Cursor Usage Dashboard")
        fig.write_html(f'{self.output_dir}/interactive_dashboard.html')
        fig.show()
        
    def generate_summary_report(self):
        """Generate a comprehensive summary report."""
        print("Generating summary report...")
        
        # Calculate key metrics
        total_tokens = self.usage_df_clean['tokens_clean'].sum()
        total_cost = self.usage_df_clean['cost_numeric'].sum()
        avg_daily_tokens = self.usage_df_clean.groupby('date')['tokens_clean'].sum().mean()
        
        # Cache metrics
        cache_stats = self.analyze_cache_efficiency()
        
        # Model usage
        model_usage = self.usage_df_clean.groupby('Model')['tokens_clean'].sum().sort_values(ascending=False)
        
        # Date range
        date_range = (self.usage_df_clean['date'].min(), self.usage_df_clean['date'].max())
        
        report = f"""
CURSOR USAGE ANALYSIS REPORT
============================

Analysis Period: {date_range[0]} to {date_range[1]}

OVERALL METRICS:
- Total Tokens: {total_tokens:,}
- Total Cost: ${total_cost:.2f}
- Average Daily Tokens: {avg_daily_tokens:,.0f}
- Total Requests: {len(self.usage_df_clean):,}

CACHE EFFICIENCY:
- True I/O Tokens: {cache_stats['total_true_io']:,} ({cache_stats['true_io_ratio']:.1%})
- Cache Read Tokens: {cache_stats['total_cache_reads']:,} ({cache_stats['cache_read_ratio']:.1%})
- Cache Write Tokens: {cache_stats['total_cache_writes']:,} ({cache_stats['cache_write_ratio']:.1%})

TOP MODELS BY USAGE:
"""
        
        for model, tokens in model_usage.head(5).items():
            report += f"- {model}: {tokens:,} tokens ({tokens/total_tokens:.1%})\n"
        
        report += f"""
KEY INSIGHTS:
- Cache tokens represent {(cache_stats['cache_read_ratio'] + cache_stats['cache_write_ratio']):.1%} of total usage
- Cache reads are {cache_stats['cache_read_ratio']/cache_stats['cache_write_ratio']:.1f}x more frequent than writes
- True I/O represents only {cache_stats['true_io_ratio']:.1%} of total tokens, showing high cache efficiency
"""
        
        # Save report
        with open(f'{self.output_dir}/analysis_report.txt', 'w') as f:
            f.write(report)
        
        print(report)
        
    def run_full_analysis(self):
        """Run the complete analysis pipeline."""
        print("Starting full cursor usage analysis...")
        
        # Correlation analysis
        self.correlate_datasets()
        
        # Create all visualizations
        self.create_daily_tokens_chart()
        self.create_cumulative_tokens_chart()
        self.create_model_types_chart()
        self.create_requests_per_minute_chart()
        self.analyze_cache_efficiency()
        self.create_interactive_dashboard()
        
        # Generate summary report
        self.generate_summary_report()
        
        print(f"\nAnalysis complete! Results saved to {self.output_dir}")


def main():
    """Main function to run the analysis."""
    analyzer = CursorAnalyzer()
    analyzer.run_full_analysis()


if __name__ == "__main__":
    main() 