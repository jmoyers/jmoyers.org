import { useState } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function ChainRule() {
  const [w, setW] = useState(0.5)
  
  // Compute the chain: x -> h = sigmoid(w*x) -> y = sigmoid(h) -> E = (y-0.7)^2/2
  const x = 1 // Fixed input
  const target = 0.7
  
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z))
  const h = sigmoid(w * x)
  const y = sigmoid(h)
  const E = 0.5 * Math.pow(y - target, 2)
  
  // Derivatives
  const dE_dy = y - target
  const dy_dh = y * (1 - y)
  const dh_dw = h * (1 - h) * x
  const dE_dw = dE_dy * dy_dh * dh_dw
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 08</div>
        <h1 className="section-title">The Chain Rule</h1>
        <p className="section-subtitle">
          The calculus that lets us trace influence through layers
        </p>
      </header>

      <h2>A Quick Calculus Refresher</h2>
      <p>
        The chain rule is a fundamental tool from calculus that tells us how to take 
        derivatives of <strong>composed functions</strong>—functions applied one after 
        another.
      </p>
      
      <p>
        If <KatexMath>{'y = f(g(x))'}</KatexMath>, then:
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Chain Rule</div>
        <KatexMath block>
          {`\\frac{dy}{dx} = \\frac{dy}{dg} \\cdot \\frac{dg}{dx}`}
        </KatexMath>
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          The derivative of the whole composition equals the product of the derivatives 
          of each step. Rates of change <em>multiply</em> through the chain.
        </p>
      </div>

      <h2>An Everyday Analogy</h2>
      <div className="callout">
        <div className="callout-title">The Gear Analogy</div>
        <p>
          Imagine gears connected in a chain. If gear A turns twice as fast as gear B, 
          and gear B turns three times as fast as gear C, then gear A turns 2 × 3 = 6 
          times as fast as gear C. Rates of change multiply through the chain.
        </p>
      </div>

      <h2>Why This Matters for Neural Networks</h2>
      <p>
        A neural network is exactly a composition of functions: input goes through 
        layer 1, then layer 2, then layer 3, and so on. The error depends on the output, 
        which depends on the hidden layers, which depend on the weights.
      </p>
      
      <p>
        To find <KatexMath>{'\\frac{\\partial E}{\\partial w}'}</KatexMath> for a weight deep in the 
        network, we need to trace through all the intermediate functions—and the chain 
        rule tells us exactly how.
      </p>

      <h2>A Concrete Example</h2>
      <p>
        Let's trace through a simple chain: one weight, one hidden unit, one output.
      </p>

      <div className="viz-container">
        <div className="viz-title">Tracing the Chain: w → h → y → E</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 500 160" width="500" height="160">
            {/* Nodes */}
            <circle cx="60" cy="80" r="25" fill="var(--bg-tertiary)" stroke="var(--accent-tertiary)" strokeWidth="2"/>
            <text x="60" y="85" fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">x=1</text>
            
            <circle cx="180" cy="80" r="25" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2"/>
            <text x="180" y="75" fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">h</text>
            <text x="180" y="90" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{h.toFixed(3)}</text>
            
            <circle cx="300" cy="80" r="25" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" strokeWidth="2"/>
            <text x="300" y="75" fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">y</text>
            <text x="300" y="90" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{y.toFixed(3)}</text>
            
            <rect x="390" y="55" width="60" height="50" rx="8" fill="var(--bg-tertiary)" stroke="var(--accent-success)" strokeWidth="2"/>
            <text x="420" y="75" fill="var(--text-primary)" fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">E</text>
            <text x="420" y="92" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{E.toFixed(4)}</text>
            
            {/* Connections */}
            <line x1="85" y1="80" x2="155" y2="80" stroke="var(--accent-primary)" strokeWidth="2"/>
            <text x="120" y="70" fill="var(--accent-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">w={w.toFixed(2)}</text>
            
            <line x1="205" y1="80" x2="275" y2="80" stroke="var(--border-highlight)" strokeWidth="2"/>
            <text x="240" y="70" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">σ</text>
            
            <line x1="325" y1="80" x2="390" y2="80" stroke="var(--border-highlight)" strokeWidth="2"/>
            <text x="357" y="70" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">loss</text>
            
            {/* Target annotation */}
            <text x="420" y="125" fill="var(--accent-success)" fontSize="10" textAnchor="middle" fontFamily="Outfit">target=0.7</text>
          </svg>
        </div>
        
        <div className="controls">
          <div className="control-group" style={{ flex: 1 }}>
            <span className="control-label">Weight w: {w.toFixed(2)}</span>
            <input 
              type="range" 
              className="slider"
              style={{ width: '100%' }}
              min="-3" 
              max="3" 
              step="0.1"
              value={w}
              onChange={(e) => setW(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <h3>Applying the Chain Rule</h3>
      <p>
        To find how the error changes when we change weight w:
      </p>

      <KatexMath block>
        {`\\frac{\\partial E}{\\partial w} = \\frac{\\partial E}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h} \\cdot \\frac{\\partial h}{\\partial w}`}
      </KatexMath>

      <p>Let's compute each piece:</p>

      <div className="formula-breakdown">
        <div className="formula-part">
          <span className="formula-symbol">∂E/∂y</span>
          <span className="formula-meaning">
            Error gradient at output: <KatexMath>{'y - d = ' + dE_dy.toFixed(3)}</KatexMath>
            <br/>
            <em style={{ color: 'var(--text-muted)' }}>How much does error change if y changes?</em>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">∂y/∂h</span>
          <span className="formula-meaning">
            Sigmoid derivative: <KatexMath>{'y(1-y) = ' + dy_dh.toFixed(3)}</KatexMath>
            <br/>
            <em style={{ color: 'var(--text-muted)' }}>How much does y change if h changes?</em>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">∂h/∂w</span>
          <span className="formula-meaning">
            Hidden unit derivative: <KatexMath>{'h(1-h) \\cdot x = ' + dh_dw.toFixed(3)}</KatexMath>
            <br/>
            <em style={{ color: 'var(--text-muted)' }}>How much does h change if w changes?</em>
          </span>
        </div>
        <div className="formula-part" style={{ background: 'rgba(232, 181, 76, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
          <span className="formula-symbol" style={{ color: 'var(--accent-primary)' }}>∂E/∂w</span>
          <span className="formula-meaning">
            <strong>Product:</strong> <KatexMath>{dE_dy.toFixed(3) + ' \\times ' + dy_dh.toFixed(3) + ' \\times ' + dh_dw.toFixed(3) + ' = ' + dE_dw.toFixed(4)}</KatexMath>
            <br/>
            <em style={{ color: 'var(--text-secondary)' }}>The complete gradient for weight w!</em>
          </span>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">Watch the Gradient Change</div>
        <p>
          Try adjusting w above and notice how the gradient ∂E/∂w changes:
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>When y is close to the target (0.7), the gradient shrinks</li>
          <li>When y is far from target, the gradient grows</li>
          <li>When h is near 0 or 1 (saturated), the gradient shrinks (vanishing gradient!)</li>
        </ul>
      </div>

      <h2>The Key Insight: Errors "Flow Backward"</h2>
      <p>
        Look at the chain rule product again:
      </p>
      
      <KatexMath block>
        {`\\frac{\\partial E}{\\partial w} = \\underbrace{\\frac{\\partial E}{\\partial y}}_{\\text{error at output}} \\cdot \\underbrace{\\frac{\\partial y}{\\partial h}}_{\\text{sensitivity}} \\cdot \\underbrace{\\frac{\\partial h}{\\partial w}}_{\\text{local gradient}}`}
      </KatexMath>
      
      <p>
        We start with the error at the output, then multiply by derivatives as we go 
        <em>backward</em> through the network. The error signal propagates backward 
        through the chain of computations.
      </p>

      <h2>Extending to Deeper Networks</h2>
      <p>
        The beauty of the chain rule is that it extends to any depth. For a weight 
        three layers back:
      </p>
      
      <KatexMath block>
        {`\\frac{\\partial E}{\\partial w} = \\frac{\\partial E}{\\partial y} \\cdot \\frac{\\partial y}{\\partial h_2} \\cdot \\frac{\\partial h_2}{\\partial h_1} \\cdot \\frac{\\partial h_1}{\\partial w}`}
      </KatexMath>
      
      <p>
        Just keep multiplying derivatives as you go backward, layer by layer.
      </p>

      <h2>The Backpropagation Insight</h2>
      <p>
        Rather than computing these chains from scratch for every weight, we can be 
        clever: compute the error signals layer by layer, reusing work as we go. This 
        is exactly what backpropagation does—and it's the subject of our next section.
      </p>

      <div className="callout">
        <div className="callout-title">Historical Note</div>
        <p>
          The chain rule itself is centuries old. What Rumelhart, Hinton, and Williams 
          showed was how to apply it <em>efficiently</em> to neural networks by 
          organizing the computation layer by layer, and that this actually works 
          well for learning useful representations.
        </p>
      </div>

      <NavButtons currentPath="/chain-rule" />
    </motion.div>
  )
}

