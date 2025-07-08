#!/bin/bash

# Setup script for Cursor usage analysis

echo "Setting up Python analysis environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python 3.8 or later."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run the analysis
echo "Running cursor usage analysis..."
python cursor_analysis.py

echo "Analysis complete! Check the analysis_output directory for results." 