# Backpropagation Explained

An interactive teaching app for understanding the 1986 Rumelhart, Hinton & Williams paper "Learning Representations by Back-Propagating Errors."

## Running the App

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory and can be served statically.

## Topics Covered

1. **Introduction** - Overview of the paper and its significance
2. **The Perceptron** - The simplest neural network and its limitations
3. **Hidden Units** - Why intermediate layers enable complex learning
4. **Forward Propagation** - How signals flow through a network
5. **The Sigmoid Function** - The smooth activation that makes learning possible
6. **Error & Loss** - Measuring how wrong predictions are
7. **Gradient Descent** - Finding the minimum by following the slope
8. **The Chain Rule** - The calculus behind backpropagation
9. **Backpropagation** - The complete algorithm
10. **The XOR Problem** - Live training demo solving XOR

## Features

- Beautiful, modern dark UI with warm accents
- Interactive visualizations for each concept
- KaTeX-rendered mathematical formulas with explanations
- Live neural network training for XOR
- Navigable sections with prev/next buttons

## Tech Stack

- React 18 + TypeScript
- Vite for bundling
- Framer Motion for animations
- KaTeX for math rendering
- React Router for navigation

