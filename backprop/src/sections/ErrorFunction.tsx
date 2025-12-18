import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function ErrorFunction() {
  const [target, setTarget] = useState(0.8)
  const [prediction, setPrediction] = useState(0.3)
  
  const error = 0.5 * Math.pow(target - prediction, 2)
  const gradient = -(target - prediction) // dE/d(prediction)
  
  // Generate error surface for visualization
  const errorCurve = useMemo(() => {
    const points: string[] = []
    for (let p = 0; p <= 1; p += 0.02) {
      const e = 0.5 * Math.pow(target - p, 2)
      const x = 50 + p * 300
      const y = 180 - e * 300
      points.push(`${x},${y}`)
    }
    return points.join(' ')
  }, [target])
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 06</div>
        <h1 className="section-title">Error & Loss Functions</h1>
        <p className="section-subtitle">
          Measuring how wrong we are—and making it precise
        </p>
      </header>

      <h2>What's an Error Function?</h2>
      <p>
        To train a network, we need to quantify <strong>how wrong</strong> its predictions 
        are. An error function (also called a loss function or cost function) takes the 
        network's output and the correct answer, and produces a single number measuring 
        how far off we are.
      </p>
      
      <p>
        The goal of training is simple: <strong>minimize this number</strong>.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ Mean Squared Error (From the Paper)</div>
        <KatexMath block>
          {`E = \\frac{1}{2} \\sum_j (y_j - d_j)^2`}
        </KatexMath>
        <div className="formula-breakdown" style={{ marginTop: '1rem' }}>
          <div className="formula-part">
            <span className="formula-symbol">E</span>
            <span className="formula-meaning">Total error (what we minimize)</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">yⱼ</span>
            <span className="formula-meaning">Actual output of unit j</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">dⱼ</span>
            <span className="formula-meaning">Desired (target) output of unit j</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">½</span>
            <span className="formula-meaning">Makes the derivative cleaner (optional but convenient)</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">Σⱼ</span>
            <span className="formula-meaning">Sum over all output units</span>
          </div>
        </div>
      </div>

      <h2>Why Squared Error?</h2>
      <p>
        Why square the difference? Why not just use the absolute difference?
      </p>
      
      <ul>
        <li>
          <strong>Squaring amplifies large errors.</strong> An error of 2 contributes 4 to 
          the loss, while an error of 1 contributes only 1. This pushes the network to 
          fix big mistakes first.
        </li>
        <li>
          <strong>Squaring is smooth.</strong> The absolute value function has a "kink" 
          at zero where the derivative is undefined. Squaring gives us a smooth parabola 
          with a well-defined derivative everywhere.
        </li>
        <li>
          <strong>The derivative is simple.</strong> <KatexMath>{'\\frac{d}{dx}(x^2) = 2x'}</KatexMath>, 
          and that ½ out front cancels the 2, giving us just <KatexMath>{'(y - d)'}</KatexMath>.
        </li>
      </ul>

      <h2>Visualizing the Error Surface</h2>
      <p>
        For a single output unit with target value {target.toFixed(1)}, the error forms a 
        parabola. Drag the prediction to see how error changes.
      </p>

      <div className="viz-container">
        <div className="viz-title">Error as a Function of Prediction</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 400 200" width="400" height="200">
            {/* Axes */}
            <line x1="50" y1="180" x2="370" y2="180" stroke="var(--border-highlight)" strokeWidth="1"/>
            <line x1="50" y1="180" x2="50" y2="20" stroke="var(--border-highlight)" strokeWidth="1"/>
            
            {/* Axis labels */}
            <text x="210" y="198" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Prediction (y)</text>
            <text x="25" y="100" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit" transform="rotate(-90, 25, 100)">Error (E)</text>
            
            {/* Scale marks */}
            <text x="50" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">0</text>
            <text x="200" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">0.5</text>
            <text x="350" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">1</text>
            
            {/* Error curve */}
            <polyline 
              points={errorCurve}
              fill="none" 
              stroke="var(--accent-primary)"
              strokeWidth="3"
            />
            
            {/* Target position indicator */}
            <line 
              x1={50 + target * 300} 
              y1="180" 
              x2={50 + target * 300} 
              y2="170"
              stroke="var(--accent-success)"
              strokeWidth="3"
            />
            <text 
              x={50 + target * 300} 
              y="165" 
              fill="var(--accent-success)" 
              fontSize="10" 
              textAnchor="middle"
              fontFamily="Outfit"
            >
              target
            </text>
            
            {/* Current prediction point */}
            <circle 
              cx={50 + prediction * 300} 
              cy={180 - error * 300} 
              r="8" 
              fill="var(--accent-secondary)"
            />
            
            {/* Gradient arrow */}
            {Math.abs(gradient) > 0.05 && (
              <line 
                x1={50 + prediction * 300}
                y1={180 - error * 300}
                x2={50 + prediction * 300 + gradient * 50}
                y2={180 - error * 300}
                stroke="var(--accent-tertiary)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )}
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-tertiary)" />
              </marker>
            </defs>
            
            {/* Vertical dashed line from point to x-axis */}
            <line 
              x1={50 + prediction * 300}
              y1={180 - error * 300}
              x2={50 + prediction * 300}
              y2="180"
              stroke="var(--accent-secondary)"
              strokeWidth="1"
              strokeDasharray="4"
            />
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
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>TARGET</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-success)' }}>{target.toFixed(2)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>ERROR</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-primary)' }}>{error.toFixed(4)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>GRADIENT</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--accent-tertiary)' }}>{gradient.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="controls">
          <div className="control-group" style={{ flex: 1 }}>
            <span className="control-label">Prediction (y): {prediction.toFixed(2)}</span>
            <input 
              type="range" 
              className="slider"
              style={{ width: '100%' }}
              min="0" 
              max="1" 
              step="0.01"
              value={prediction}
              onChange={(e) => setPrediction(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group" style={{ flex: 1 }}>
            <span className="control-label">Target (d): {target.toFixed(2)}</span>
            <input 
              type="range" 
              className="slider"
              style={{ width: '100%' }}
              min="0" 
              max="1" 
              step="0.1"
              value={target}
              onChange={(e) => setTarget(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">The Gradient Points Toward Higher Error</div>
        <p>
          The blue arrow shows the gradient—the direction of <em>increasing</em> error. 
          To minimize error, we move <em>opposite</em> to the gradient. Notice how the 
          gradient is larger when we're further from the target (steeper slope) and 
          zero when we're exactly at the target (flat bottom).
        </p>
      </div>

      <h2>Error Over Multiple Outputs</h2>
      <p>
        Most networks have multiple output units. The total error is simply the sum of 
        squared errors for each output:
      </p>
      
      <KatexMath block>
        {`E = \\frac{1}{2} \\sum_j (y_j - d_j)^2 = \\frac{1}{2}[(y_1 - d_1)^2 + (y_2 - d_2)^2 + \\ldots]`}
      </KatexMath>

      <h2>Error Over Multiple Training Examples</h2>
      <p>
        Training typically involves many input-output pairs. We can either:
      </p>
      
      <ul>
        <li>
          <strong>Update after each example</strong> (online/stochastic learning): Faster 
          updates but noisier gradients
        </li>
        <li>
          <strong>Sum errors over all examples</strong> (batch learning): Smoother 
          gradients but requires more memory
        </li>
      </ul>
      
      <p>
        The paper notes both are valid—the math works the same way.
      </p>

      <h2>The Gradient of Error</h2>
      <p>
        The key quantity for learning is the gradient of error with respect to each 
        weight. For the error function above, the gradient with respect to a specific 
        output is:
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ Error Gradient for Output Units</div>
        <KatexMath block>
          {`\\frac{\\partial E}{\\partial y_j} = -(d_j - y_j) = y_j - d_j`}
        </KatexMath>
        <p style={{ marginTop: '1rem', marginBottom: 0 }}>
          The gradient is simply the difference between actual and desired output. 
          If y is too high (y {'>'} d), the gradient is positive, pushing y down. 
          If y is too low, the gradient is negative, pushing y up.
        </p>
      </div>

      <h2>Why This Matters for Backpropagation</h2>
      <p>
        This gradient at the output layer is where backpropagation <em>starts</em>. 
        It's the "error signal" that flows backward through the network. The chain rule 
        will allow us to propagate this signal through each layer, eventually reaching 
        every weight in the network.
      </p>

      <div className="callout">
        <div className="callout-title">A Simple Interpretation</div>
        <p>
          Think of <KatexMath>{'(y_j - d_j)'}</KatexMath> as the network's "regret" for each 
          output. Positive regret means "I said too much"; negative means "I said too 
          little." Backpropagation spreads this regret back through the network, 
          assigning blame to each connection.
        </p>
      </div>

      <h2>Coming Up</h2>
      <p>
        We know what we're minimizing (the error function) and we have its gradient at 
        the output. But how do we actually <em>use</em> this gradient to update weights? 
        That's gradient descent—the subject of our next section.
      </p>

      <NavButtons currentPath="/error-function" />
    </motion.div>
  )
}

