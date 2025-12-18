import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function Sigmoid() {
  const [x, setX] = useState(0)
  
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
  const sigmoidDerivative = (x: number) => {
    const s = sigmoid(x)
    return s * (1 - s)
  }
  
  // Generate curve points
  const curvePoints = useMemo(() => {
    const points: string[] = []
    for (let i = -6; i <= 6; i += 0.1) {
      const xPos = 200 + i * 30
      const yPos = 180 - sigmoid(i) * 160
      points.push(`${xPos},${yPos}`)
    }
    return points.join(' ')
  }, [])
  
  const derivPoints = useMemo(() => {
    const points: string[] = []
    for (let i = -6; i <= 6; i += 0.1) {
      const xPos = 200 + i * 30
      const yPos = 180 - sigmoidDerivative(i) * 160 * 4 // Scale up for visibility
      points.push(`${xPos},${yPos}`)
    }
    return points.join(' ')
  }, [])
  
  const currentY = sigmoid(x)
  const currentDeriv = sigmoidDerivative(x)
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 05</div>
        <h1 className="section-title">The Sigmoid Function</h1>
        <p className="section-subtitle">
          A smooth, differentiable function that makes learning possible
        </p>
      </header>

      <h2>Why Not Just Use Thresholds?</h2>
      <p>
        The original perceptron used a hard threshold: output 1 if the sum is positive, 
        0 otherwise. This creates a <strong>step function</strong>—it jumps instantly 
        from 0 to 1.
      </p>
      
      <p>
        The problem? <strong>We can't take derivatives of jumps.</strong> And as we'll 
        see, backpropagation requires derivatives to figure out how to adjust weights. 
        A tiny change in weights near the threshold causes a huge change in output, 
        making learning unstable.
      </p>

      <div className="callout warning">
        <div className="callout-title">The Derivative Problem</div>
        <p>
          A step function has a derivative of zero everywhere except at the threshold, 
          where it's undefined (infinite). This means gradient-based learning gets no 
          useful signal about how to improve.
        </p>
      </div>

      <h2>The Sigmoid: A Smooth Alternative</h2>
      <p>
        The sigmoid function (also called the logistic function) provides a smooth 
        S-shaped curve that transitions gradually from 0 to 1:
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Sigmoid Function</div>
        <KatexMath block>
          {`\\sigma(x) = \\frac{1}{1 + e^{-x}}`}
        </KatexMath>
        <div className="formula-breakdown" style={{ marginTop: '1rem' }}>
          <div className="formula-part">
            <span className="formula-symbol">e</span>
            <span className="formula-meaning">Euler's number ≈ 2.718, the base of natural logarithms</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">-x</span>
            <span className="formula-meaning">Negating x flips the curve to rise from left to right</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">1/(1+...)</span>
            <span className="formula-meaning">Ensures output is always between 0 and 1</span>
          </div>
        </div>
      </div>

      <h2>Explore the Sigmoid</h2>
      <p>
        Drag the slider to see how the sigmoid transforms different input values. 
        Notice how the derivative (the slope) is largest in the middle and approaches 
        zero at the extremes.
      </p>

      <div className="viz-container">
        <div className="viz-title">Sigmoid Function & Its Derivative</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 400 200" width="400" height="200">
            {/* Grid lines */}
            <line x1="20" y1="100" x2="380" y2="100" stroke="var(--border-color)" strokeWidth="1"/>
            <line x1="200" y1="10" x2="200" y2="190" stroke="var(--border-color)" strokeWidth="1"/>
            
            {/* Y-axis labels */}
            <text x="15" y="25" fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">1</text>
            <text x="15" y="105" fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">0.5</text>
            <text x="15" y="185" fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">0</text>
            
            {/* X-axis labels */}
            <text x="20" y="115" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">-6</text>
            <text x="200" y="115" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">0</text>
            <text x="380" y="115" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">6</text>
            
            {/* Derivative curve */}
            <polyline 
              points={derivPoints}
              fill="none" 
              stroke="var(--accent-tertiary)"
              strokeWidth="2"
              opacity="0.5"
            />
            
            {/* Sigmoid curve */}
            <polyline 
              points={curvePoints}
              fill="none" 
              stroke="var(--accent-primary)"
              strokeWidth="3"
            />
            
            {/* Current point on sigmoid */}
            <circle 
              cx={200 + x * 30} 
              cy={180 - currentY * 160} 
              r="8" 
              fill="var(--accent-secondary)"
            />
            
            {/* Tangent line at current point */}
            <line 
              x1={200 + x * 30 - 30}
              y1={180 - currentY * 160 + currentDeriv * 30}
              x2={200 + x * 30 + 30}
              y2={180 - currentY * 160 - currentDeriv * 30}
              stroke="var(--accent-secondary)"
              strokeWidth="2"
              strokeDasharray="4"
            />
            
            {/* Vertical line to show x position */}
            <line 
              x1={200 + x * 30}
              y1={180 - currentY * 160}
              x2={200 + x * 30}
              y2={180}
              stroke="var(--accent-secondary)"
              strokeWidth="1"
              strokeDasharray="2"
            />
            
            {/* Legend */}
            <line x1="280" y1="25" x2="310" y2="25" stroke="var(--accent-primary)" strokeWidth="3"/>
            <text x="315" y="28" fill="var(--text-secondary)" fontSize="10" fontFamily="Outfit">σ(x)</text>
            
            <line x1="280" y1="40" x2="310" y2="40" stroke="var(--accent-tertiary)" strokeWidth="2" opacity="0.5"/>
            <text x="315" y="43" fill="var(--text-secondary)" fontSize="10" fontFamily="Outfit">σ'(x)</text>
          </svg>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>INPUT</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem' }}>{x.toFixed(2)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>OUTPUT σ(x)</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-primary)' }}>{currentY.toFixed(3)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>DERIVATIVE σ'(x)</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-tertiary)' }}>{currentDeriv.toFixed(3)}</div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group" style={{ flex: 1 }}>
            <span className="control-label">Input value (x): {x.toFixed(1)}</span>
            <input 
              type="range" 
              className="slider"
              style={{ width: '100%' }}
              min="-5" 
              max="5" 
              step="0.1"
              value={x}
              onChange={(e) => setX(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <h2>The Magical Derivative</h2>
      <p>
        Here's something beautiful about the sigmoid: its derivative has a remarkably 
        simple form:
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ Sigmoid Derivative</div>
        <KatexMath block>
          {`\\frac{d\\sigma}{dx} = \\sigma(x) \\cdot (1 - \\sigma(x))`}
        </KatexMath>
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          The derivative can be computed <em>from the output itself</em>. If we already 
          computed σ(x) during forward propagation, we get the derivative almost for free!
        </p>
      </div>

      <h3>Deriving It (Calculus Review)</h3>
      <p>
        For those curious, here's where this comes from. We use the quotient rule:
      </p>

      <div className="formula-breakdown">
        <div className="formula-part">
          <span className="formula-symbol">1</span>
          <span className="formula-meaning">
            Start with <KatexMath>{'\\sigma(x) = \\frac{1}{1 + e^{-x}}'}</KatexMath>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">2</span>
          <span className="formula-meaning">
            Rewrite as <KatexMath>{'\\sigma(x) = (1 + e^{-x})^{-1}'}</KatexMath>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">3</span>
          <span className="formula-meaning">
            Apply chain rule: <KatexMath>{'\\frac{d\\sigma}{dx} = -(1 + e^{-x})^{-2} \\cdot (-e^{-x})'}</KatexMath>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">4</span>
          <span className="formula-meaning">
            Simplify: <KatexMath>{'= \\frac{e^{-x}}{(1 + e^{-x})^2}'}</KatexMath>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">5</span>
          <span className="formula-meaning">
            Factor: <KatexMath>{'= \\frac{1}{1 + e^{-x}} \\cdot \\frac{e^{-x}}{1 + e^{-x}} = \\sigma(x)(1 - \\sigma(x))'}</KatexMath>
          </span>
        </div>
      </div>

      <h2>Why the Derivative Matters</h2>
      <p>
        The derivative tells us <strong>how sensitive the output is to changes in the 
        input</strong>. This is crucial for learning:
      </p>
      
      <ul>
        <li>
          <strong>Near x = 0:</strong> Derivative is maximum (0.25). Small weight changes 
          have noticeable effects. Learning is fast.
        </li>
        <li>
          <strong>Far from zero:</strong> Derivative approaches 0. The unit is "saturated"—
          very confident in its output. Learning slows down.
        </li>
      </ul>

      <div className="callout insight">
        <div className="callout-title">The Vanishing Gradient Problem</div>
        <p>
          When units become saturated (derivative ≈ 0), error signals can't flow back 
          through them effectively. In deep networks, this can prevent early layers from 
          learning. This "vanishing gradient" problem motivated later innovations like 
          ReLU activations and residual connections.
        </p>
      </div>

      <h2>Properties That Make Sigmoid Useful</h2>
      
      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Benefit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Output in (0, 1)</td>
            <td>Can interpret as probability</td>
          </tr>
          <tr>
            <td>Smooth everywhere</td>
            <td>Derivative exists at all points</td>
          </tr>
          <tr>
            <td>Monotonically increasing</td>
            <td>Larger inputs → larger outputs</td>
          </tr>
          <tr>
            <td>Simple derivative</td>
            <td>Fast to compute during backprop</td>
          </tr>
          <tr>
            <td>Symmetric around 0.5</td>
            <td>σ(x) + σ(-x) = 1</td>
          </tr>
        </tbody>
      </table>

      <h2>Coming Up</h2>
      <p>
        Now we understand how to compute outputs (forward propagation) and why we need 
        smooth functions (to get derivatives). Next, we'll define exactly what we mean 
        by "error"—the measure we're trying to minimize.
      </p>

      <NavButtons currentPath="/sigmoid" />
    </motion.div>
  )
}

