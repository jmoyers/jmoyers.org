import { motion } from 'framer-motion'
import NavButtons from '../components/NavButtons'

export default function Introduction() {
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 01</div>
        <h1 className="section-title">Learning Representations by Back-Propagating Errors</h1>
        <p className="section-subtitle">
          The 1986 paper that revolutionized how neural networks learn
        </p>
      </header>

      <h2>The Big Idea</h2>
      <p>
        In 1986, David Rumelhart, Geoffrey Hinton, and Ronald Williams published a paper that 
        would become one of the most cited works in computer science. Their key insight was 
        surprisingly elegant: <strong>we can teach a network by working backwards from its mistakes</strong>.
      </p>
      
      <div className="key-concept">
        <div className="key-concept-title">✦ Core Insight</div>
        <p>
          If we know how wrong the network's output is, we can trace that error backwards 
          through the network, layer by layer, to figure out how each connection contributed 
          to the mistake—and then adjust those connections to do better next time.
        </p>
      </div>

      <h2>Why This Matters</h2>
      <p>
        Before this paper, neural networks faced a fundamental limitation. Simple networks 
        (called perceptrons) could only learn patterns that were <em>linearly separable</em>—
        essentially, problems where you could draw a straight line to separate the answers.
      </p>
      
      <p>
        Many real-world problems aren't this simple. The classic example is XOR (exclusive or): 
        given two binary inputs, output 1 if exactly one of them is 1. This seemingly trivial 
        problem defeated the early neural networks of the 1960s.
      </p>

      <div className="viz-container">
        <div className="viz-title">The XOR Problem: No Single Line Works</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 300 300" width="300" height="300">
            {/* Grid */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2a2a32" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="300" height="300" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="50" y1="250" x2="270" y2="250" stroke="#4a4a52" strokeWidth="2"/>
            <line x1="50" y1="250" x2="50" y2="30" stroke="#4a4a52" strokeWidth="2"/>
            
            {/* Labels */}
            <text x="160" y="285" fill="#6b6660" fontSize="12" textAnchor="middle" fontFamily="Outfit">Input 1</text>
            <text x="20" y="140" fill="#6b6660" fontSize="12" textAnchor="middle" fontFamily="Outfit" transform="rotate(-90, 20, 140)">Input 2</text>
            
            {/* Points - XOR pattern */}
            {/* (0,0) = 0, (0,1) = 1, (1,0) = 1, (1,1) = 0 */}
            <circle cx="80" cy="220" r="15" fill="#c9454c" opacity="0.9"/> {/* 0,0 → 0 */}
            <circle cx="220" cy="220" r="15" fill="#5cb85c" opacity="0.9"/> {/* 1,0 → 1 */}
            <circle cx="80" cy="80" r="15" fill="#5cb85c" opacity="0.9"/> {/* 0,1 → 1 */}
            <circle cx="220" cy="80" r="15" fill="#c9454c" opacity="0.9"/> {/* 1,1 → 0 */}
            
            {/* Point labels */}
            <text x="80" y="225" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">0</text>
            <text x="220" y="225" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">1</text>
            <text x="80" y="85" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">1</text>
            <text x="220" y="85" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">0</text>
            
            {/* Multiple attempted lines - shows none can work */}
            <line x1="30" y1="150" x2="270" y2="150" stroke="#e8b54c" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5"/>
            <line x1="150" y1="30" x2="150" y2="270" stroke="#e8b54c" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5"/>
            <line x1="30" y1="270" x2="270" y2="30" stroke="#e8b54c" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.5"/>
            <text x="150" y="150" fill="#e8b54c" fontSize="24" textAnchor="middle" dominantBaseline="middle" fontFamily="Georgia, serif" opacity="0.7">?</text>
          </svg>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem', marginBottom: 0 }}>
          No straight line can separate the green (1) from red (0) outputs
        </p>
      </div>

      <h2>The Solution: Hidden Layers</h2>
      <p>
        The solution was to add <strong>hidden layers</strong>—intermediate neurons between 
        input and output that could learn to represent the problem in a new way. But this 
        created a new puzzle: how do you train these hidden neurons when you only know what 
        the final output should be?
      </p>
      
      <div className="callout insight">
        <div className="callout-title">The Credit Assignment Problem</div>
        <p>
          When a network makes a mistake, which of the thousands of connections is at fault? 
          How much blame goes to each? This is the <em>credit assignment problem</em>, and 
          backpropagation solves it elegantly using calculus.
        </p>
      </div>

      <h2>What We'll Learn</h2>
      <p>
        This interactive guide will take you through the complete backpropagation algorithm, 
        building intuition at each step:
      </p>
      
      <ul>
        <li><strong>The Perceptron</strong> — The simplest neural network, and why it's limited</li>
        <li><strong>Hidden Units</strong> — How intermediate layers can transform problems</li>
        <li><strong>Forward Propagation</strong> — How signals flow through a network</li>
        <li><strong>The Sigmoid Function</strong> — A smooth, differentiable activation</li>
        <li><strong>Error Functions</strong> — Measuring how wrong we are</li>
        <li><strong>Gradient Descent</strong> — Finding the bottom of a valley</li>
        <li><strong>The Chain Rule</strong> — The calculus that makes it all work</li>
        <li><strong>Backpropagation</strong> — Putting it all together</li>
        <li><strong>The XOR Problem</strong> — Watching a network learn</li>
      </ul>

      <h2>The Paper's Authors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', margin: '2rem 0' }}>
        <div className="callout" style={{ margin: 0 }}>
          <strong>David Rumelhart</strong>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Cognitive psychologist at UC San Diego, pioneer in connectionist approaches to cognition.
          </p>
        </div>
        <div className="callout" style={{ margin: 0 }}>
          <strong>Geoffrey Hinton</strong>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Often called the "godfather of deep learning." Later won the 2024 Nobel Prize in Physics.
          </p>
        </div>
        <div className="callout" style={{ margin: 0 }}>
          <strong>Ronald Williams</strong>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Computer scientist who developed foundational ideas in reinforcement learning.
          </p>
        </div>
      </div>

      <div className="callout">
        <div className="callout-title">Historical Note</div>
        <p>
          While this 1986 paper popularized backpropagation, the mathematical ideas had 
          appeared earlier. Notably, Paul Werbos described the algorithm in his 1974 PhD 
          thesis, and Yann LeCun independently developed similar ideas in 1985. The Rumelhart 
          paper's impact came from clearly demonstrating its power for learning representations.
        </p>
      </div>

      <NavButtons currentPath="/" />
    </motion.div>
  )
}

