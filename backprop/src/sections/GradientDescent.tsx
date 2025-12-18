import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function GradientDescent() {
  const [position, setPosition] = useState(3.5)
  const [learningRate, setLearningRate] = useState(0.3)
  const [history, setHistory] = useState<number[]>([3.5])
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<number | null>(null)
  
  // Simple parabola: f(x) = (x-1)^2 + 0.5
  const f = (x: number) => Math.pow(x - 1, 2) + 0.5
  const df = (x: number) => 2 * (x - 1) // Derivative
  
  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setPosition(prev => {
          const gradient = df(prev)
          const newPos = prev - learningRate * gradient
          setHistory(h => [...h, newPos])
          if (Math.abs(gradient) < 0.01 || newPos < -2 || newPos > 5) {
            setRunning(false)
          }
          return Math.max(-2, Math.min(5, newPos))
        })
      }, 300)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, learningRate])
  
  const reset = () => {
    setRunning(false)
    setPosition(3.5)
    setHistory([3.5])
  }
  
  const step = () => {
    const gradient = df(position)
    const newPos = Math.max(-2, Math.min(5, position - learningRate * gradient))
    setPosition(newPos)
    setHistory(h => [...h, newPos])
  }
  
  // Convert position to SVG coordinates
  const toSvgX = (x: number) => 50 + (x + 2) * 50
  const toSvgY = (y: number) => 180 - y * 35
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 07</div>
        <h1 className="section-title">Gradient Descent</h1>
        <p className="section-subtitle">
          Finding the minimum by following the slope downhill
        </p>
      </header>

      <h2>The Optimization Problem</h2>
      <p>
        We have an error function that tells us how wrong the network is. We want to 
        find weights that minimize this error. But with potentially millions of weights, 
        we can't just try all possibilities.
      </p>
      
      <p>
        <strong>Gradient descent</strong> is an iterative algorithm that finds the minimum 
        by repeatedly taking small steps in the direction that decreases the error most.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Gradient Descent Update Rule</div>
        <KatexMath block>
          {`w_{new} = w_{old} - \\eta \\frac{\\partial E}{\\partial w}`}
        </KatexMath>
        <div className="formula-breakdown" style={{ marginTop: '1rem' }}>
          <div className="formula-part">
            <span className="formula-symbol">w</span>
            <span className="formula-meaning">Any weight in the network</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">η</span>
            <span className="formula-meaning">Learning rate (step size)—a small positive number</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">∂E/∂w</span>
            <span className="formula-meaning">Partial derivative of error with respect to this weight</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">−</span>
            <span className="formula-meaning">Minus sign: move opposite to gradient (downhill)</span>
          </div>
        </div>
      </div>

      <h2>The Intuition: Rolling Downhill</h2>
      <p>
        Imagine you're blindfolded on a hilly landscape and want to reach the lowest 
        valley. You can't see, but you can feel the slope under your feet. The strategy 
        is simple: always step in the direction that goes most steeply downhill.
      </p>

      <div className="viz-container">
        <div className="viz-title">Gradient Descent in 1D</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 400 200" width="400" height="200">
            {/* Draw the function curve */}
            <path
              d={`M ${Array.from({length: 141}, (_, i) => {
                const x = -2 + i * 0.05
                return `${toSvgX(x)},${toSvgY(f(x))}`
              }).join(' L ')}`}
              fill="none"
              stroke="var(--accent-primary)"
              strokeWidth="3"
            />
            
            {/* Minimum marker */}
            <circle cx={toSvgX(1)} cy={toSvgY(f(1))} r="5" fill="var(--accent-success)"/>
            <text x={toSvgX(1)} y={toSvgY(f(1)) + 20} fill="var(--accent-success)" fontSize="10" textAnchor="middle" fontFamily="Outfit">minimum</text>
            
            {/* History trail */}
            {history.slice(0, -1).map((x, i) => (
              <circle 
                key={i}
                cx={toSvgX(x)} 
                cy={toSvgY(f(x))} 
                r="4" 
                fill="var(--accent-tertiary)"
                opacity={0.3 + (i / history.length) * 0.4}
              />
            ))}
            
            {/* Current position */}
            <circle 
              cx={toSvgX(position)} 
              cy={toSvgY(f(position))} 
              r="10" 
              fill="var(--accent-secondary)"
            />
            
            {/* Gradient arrow */}
            {Math.abs(df(position)) > 0.1 && (
              <>
                <line 
                  x1={toSvgX(position)}
                  y1={toSvgY(f(position)) - 20}
                  x2={toSvgX(position) - df(position) * 15}
                  y2={toSvgY(f(position)) - 20}
                  stroke="var(--accent-tertiary)"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <text 
                  x={toSvgX(position) - df(position) * 8}
                  y={toSvgY(f(position)) - 28}
                  fill="var(--accent-tertiary)"
                  fontSize="9"
                  textAnchor="middle"
                  fontFamily="Outfit"
                >
                  step
                </text>
              </>
            )}
            
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-tertiary)" />
              </marker>
            </defs>
            
            {/* Axis labels */}
            <text x="200" y="198" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">weight value</text>
          </svg>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '0.75rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>POSITION</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{position.toFixed(2)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ERROR</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--accent-primary)' }}>{f(position).toFixed(3)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>GRADIENT</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--accent-tertiary)' }}>{df(position).toFixed(2)}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>STEPS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>{history.length - 1}</div>
          </div>
        </div>
        
        <div className="controls">
          <button className="button" onClick={() => setRunning(r => !r)}>
            {running ? 'Pause' : 'Run'}
          </button>
          <button className="button secondary" onClick={step} disabled={running}>
            Single Step
          </button>
          <button className="button secondary" onClick={reset}>
            Reset
          </button>
          <div className="control-group">
            <span className="control-label">Learning Rate: {learningRate.toFixed(2)}</span>
            <input 
              type="range" 
              className="slider"
              min="0.05" 
              max="1.0" 
              step="0.05"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <h2>The Learning Rate Matters</h2>
      <p>
        The learning rate η controls how big each step is. This choice is crucial:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', margin: '1.5rem 0' }}>
        <div className="callout warning" style={{ margin: 0 }}>
          <div className="callout-title">Too Large</div>
          <p>
            Steps are so big we might overshoot the minimum and bounce around, or even 
            diverge (error gets worse). Try setting η {'>'} 0.8 above and watch what happens.
          </p>
        </div>
        <div className="callout" style={{ margin: 0 }}>
          <div className="callout-title">Too Small</div>
          <p>
            We make steady progress but very slowly. Training takes forever. Worse, we 
            might get stuck in shallow local minima.
          </p>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">Finding the Right Balance</div>
        <p>
          The 1986 paper doesn't specify a best learning rate—it depends on the problem. 
          Modern techniques like Adam and learning rate scheduling adaptively adjust the 
          rate during training. But the core idea of following the negative gradient 
          remains the same.
        </p>
      </div>

      <h2>From 1D to Many Dimensions</h2>
      <p>
        The visualization above shows gradient descent with one weight. Real networks 
        have thousands or millions of weights, so the "error landscape" is high-dimensional. 
        But the principle is the same: compute the gradient (now a vector of partial 
        derivatives), and step in the opposite direction.
      </p>

      <KatexMath block>
        {`\\vec{w}_{new} = \\vec{w}_{old} - \\eta \\nabla E`}
      </KatexMath>

      <p>
        Here <KatexMath>{'\\nabla E'}</KatexMath> (nabla E) is the <strong>gradient vector</strong>—
        all the partial derivatives stacked together. Each weight gets updated based on 
        how much it contributes to the error.
      </p>

      <h2>The Key Question</h2>
      <p>
        Gradient descent tells us <em>how to use</em> the gradients. But there's a 
        crucial question we haven't answered:
      </p>
      
      <p style={{ 
        fontSize: '1.2rem', 
        fontStyle: 'italic', 
        textAlign: 'center', 
        color: 'var(--accent-primary)',
        margin: '2rem 0' 
      }}>
        How do we compute ∂E/∂w for weights in the hidden layers?
      </p>
      
      <p>
        For output layer weights, the gradient is straightforward—the error is defined 
        directly in terms of the outputs. But hidden layer weights affect the error 
        only <em>indirectly</em>, through their influence on later layers.
      </p>
      
      <p>
        This is where the <strong>chain rule</strong> comes in—the mathematical tool 
        that lets us trace influence through composed functions.
      </p>

      <NavButtons currentPath="/gradient-descent" />
    </motion.div>
  )
}

