import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function Backpropagation() {
  const [phase, setPhase] = useState<'forward' | 'error' | 'backward' | 'update'>('forward')
  const [step, setStep] = useState(0)
  
  const phases = ['forward', 'error', 'backward', 'update'] as const
  const phaseLabels = {
    forward: 'Forward Pass',
    error: 'Compute Error',
    backward: 'Backward Pass',
    update: 'Update Weights'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 3) {
        setStep(s => s + 1)
      } else {
        const currentIndex = phases.indexOf(phase)
        if (currentIndex < phases.length - 1) {
          setPhase(phases[currentIndex + 1])
          setStep(0)
        }
      }
    }, 1500)
    return () => clearTimeout(timer)
  }, [step, phase])

  const reset = () => {
    setPhase('forward')
    setStep(0)
  }
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 09</div>
        <h1 className="section-title">Backpropagation</h1>
        <p className="section-subtitle">
          The complete algorithm that revolutionized neural network training
        </p>
      </header>

      <h2>Putting It All Together</h2>
      <p>
        We now have all the pieces. Backpropagation is the algorithm that combines:
      </p>
      <ul>
        <li><strong>Forward propagation</strong> to compute outputs</li>
        <li><strong>Error computation</strong> to measure how wrong we are</li>
        <li><strong>The chain rule</strong> to propagate error backward</li>
        <li><strong>Gradient descent</strong> to update weights</li>
      </ul>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Backpropagation Algorithm</div>
        <ol style={{ marginBottom: 0 }}>
          <li><strong>Forward pass:</strong> Compute all unit outputs from input to output</li>
          <li><strong>Compute error:</strong> Compare output to target using loss function</li>
          <li><strong>Backward pass:</strong> Propagate error gradients from output to input</li>
          <li><strong>Update weights:</strong> Adjust each weight proportional to its gradient</li>
        </ol>
      </div>

      <h2>The Algorithm in Action</h2>
      <div className="viz-container">
        <div className="viz-title">Backpropagation Animation</div>
        
        {/* Phase indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          {phases.map((p, i) => (
            <div 
              key={p}
              style={{ 
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                background: phase === p ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: phase === p ? 'var(--bg-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 500
              }}
            >
              {i + 1}. {phaseLabels[p]}
            </div>
          ))}
        </div>
        
        <div className="viz-canvas">
          <svg viewBox="0 0 500 200" width="500" height="200">
            {/* Network structure */}
            {/* Input layer */}
            <circle cx="60" cy="70" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 0 ? "var(--accent-tertiary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <circle cx="60" cy="130" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 0 ? "var(--accent-tertiary)" : "var(--border-highlight)"} strokeWidth="2"/>
            
            {/* Hidden layer */}
            <circle cx="180" cy="60" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 1 ? "var(--accent-primary)" : phase === 'backward' && step >= 1 ? "var(--accent-secondary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <circle cx="180" cy="100" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 1 ? "var(--accent-primary)" : phase === 'backward' && step >= 1 ? "var(--accent-secondary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <circle cx="180" cy="140" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 1 ? "var(--accent-primary)" : phase === 'backward' && step >= 1 ? "var(--accent-secondary)" : "var(--border-highlight)"} strokeWidth="2"/>
            
            {/* Output layer */}
            <circle cx="300" cy="100" r="20" fill="var(--bg-tertiary)" stroke={phase === 'forward' && step >= 2 ? "var(--accent-success)" : phase === 'error' || (phase === 'backward' && step === 0) ? "var(--accent-secondary)" : "var(--border-highlight)"} strokeWidth="2"/>
            
            {/* Connections with animation based on phase */}
            {/* Input to hidden */}
            {[70, 130].map(y1 => [60, 100, 140].map(y2 => (
              <line 
                key={`ih-${y1}-${y2}`}
                x1="80" y1={y1} x2="160" y2={y2}
                stroke={
                  phase === 'forward' && step >= 1 ? "var(--accent-primary)" :
                  phase === 'backward' && step >= 2 ? "var(--accent-secondary)" :
                  phase === 'update' ? "var(--accent-success)" :
                  "var(--border-highlight)"
                }
                strokeWidth={phase === 'update' ? 3 : 1}
                opacity={0.6}
              />
            )))}
            
            {/* Hidden to output */}
            {[60, 100, 140].map(y1 => (
              <line 
                key={`ho-${y1}`}
                x1="200" y1={y1} x2="280" y2={100}
                stroke={
                  phase === 'forward' && step >= 2 ? "var(--accent-primary)" :
                  phase === 'backward' && step >= 1 ? "var(--accent-secondary)" :
                  phase === 'update' ? "var(--accent-success)" :
                  "var(--border-highlight)"
                }
                strokeWidth={phase === 'update' ? 3 : 1}
                opacity={0.6}
              />
            ))}
            
            {/* Target and error visualization */}
            {(phase === 'error' || phase === 'backward') && (
              <>
                <rect x="360" y="75" width="80" height="50" rx="8" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" strokeWidth="2"/>
                <text x="400" y="95" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Error</text>
                <text x="400" y="112" fill="var(--accent-secondary)" fontSize="13" textAnchor="middle" fontFamily="JetBrains Mono">E = 0.12</text>
                
                <line x1="320" y1="100" x2="360" y2="100" stroke="var(--accent-secondary)" strokeWidth="2" strokeDasharray="4"/>
              </>
            )}
            
            {/* Backward arrows */}
            {phase === 'backward' && (
              <>
                {step >= 0 && (
                  <path d="M 355 100 L 325 100" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                )}
                {step >= 1 && (
                  <>
                    <path d="M 275 95 L 205 65" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                    <path d="M 275 100 L 205 100" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                    <path d="M 275 105 L 205 135" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                  </>
                )}
                {step >= 2 && (
                  <>
                    <path d="M 155 65 L 85 75" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                    <path d="M 155 135 L 85 125" stroke="var(--accent-secondary)" strokeWidth="2" markerEnd="url(#backArrow)"/>
                  </>
                )}
              </>
            )}
            
            <defs>
              <marker id="backArrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-secondary)" />
              </marker>
            </defs>
            
            {/* Labels */}
            <text x="60" y="170" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">Input</text>
            <text x="180" y="175" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">Hidden</text>
            <text x="300" y="145" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="Outfit">Output</text>
          </svg>
        </div>
        
        {/* Phase description */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          {phase === 'forward' && (
            <p style={{ marginBottom: 0 }}>
              <strong>Forward Pass:</strong> Input signals propagate through the network. 
              Each layer computes weighted sums and applies the sigmoid function.
            </p>
          )}
          {phase === 'error' && (
            <p style={{ marginBottom: 0 }}>
              <strong>Compute Error:</strong> Compare the network's output to the target. 
              Calculate E = ½(y - d)² for each output unit.
            </p>
          )}
          {phase === 'backward' && (
            <p style={{ marginBottom: 0 }}>
              <strong>Backward Pass:</strong> Error gradients flow backward through the 
              network. Each layer receives and propagates error signals using the chain rule.
            </p>
          )}
          {phase === 'update' && (
            <p style={{ marginBottom: 0 }}>
              <strong>Update Weights:</strong> Each weight is adjusted: w ← w - η · ∂E/∂w. 
              Connections that contributed to the error are changed to reduce it.
            </p>
          )}
        </div>
        
        <div className="controls">
          <button className="button" onClick={reset}>
            Restart Animation
          </button>
        </div>
      </div>

      <h2>The Backward Pass: Computing δ</h2>
      <p>
        The paper introduces a key quantity called <KatexMath>{'\\delta_j'}</KatexMath> (delta), 
        which measures <strong>how much unit j contributed to the error</strong>:
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Delta Rule</div>
        <p><strong>For output units:</strong></p>
        <KatexMath block>
          {`\\delta_j = (d_j - y_j) \\cdot y_j(1 - y_j)`}
        </KatexMath>
        
        <p style={{ marginTop: '1rem' }}><strong>For hidden units:</strong></p>
        <KatexMath block>
          {`\\delta_j = y_j(1 - y_j) \\sum_k \\delta_k w_{kj}`}
        </KatexMath>
        
        <div className="formula-breakdown" style={{ marginTop: '1rem' }}>
          <div className="formula-part">
            <span className="formula-symbol">δⱼ</span>
            <span className="formula-meaning">Error signal for unit j</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">yⱼ(1-yⱼ)</span>
            <span className="formula-meaning">Sigmoid derivative at unit j</span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">Σₖ δₖwₖⱼ</span>
            <span className="formula-meaning">Sum of error signals from units that j connects to, weighted by connections</span>
          </div>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">The Key Insight</div>
        <p>
          For hidden units, we don't know the "desired" output directly. But we can 
          compute how much each hidden unit contributed to errors in the next layer. 
          A hidden unit's error is the <em>weighted sum of the errors it caused</em>, 
          scaled by how sensitive its output was to its input.
        </p>
      </div>

      <h2>The Weight Update</h2>
      <p>
        Once we have δ for every unit, updating the weights is straightforward:
      </p>

      <KatexMath block>
        {`\\Delta w_{ji} = \\eta \\cdot \\delta_j \\cdot y_i`}
      </KatexMath>

      <div className="formula-breakdown">
        <div className="formula-part">
          <span className="formula-symbol">Δwⱼᵢ</span>
          <span className="formula-meaning">Change to the weight from unit i to unit j</span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">η</span>
          <span className="formula-meaning">Learning rate</span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">δⱼ</span>
          <span className="formula-meaning">Error signal at the receiving unit</span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">yᵢ</span>
          <span className="formula-meaning">Output of the sending unit</span>
        </div>
      </div>

      <p>
        The change to a weight depends on two things: how much the receiving unit 
        contributed to the error (δⱼ) and how active the sending unit was (yᵢ). 
        If both are large, the connection was important and gets a big adjustment.
      </p>

      <h2>The Complete Algorithm</h2>
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
        <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>// For each training example:</div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'var(--accent-tertiary)' }}>1. FORWARD PASS</div>
          <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
            For each layer from input to output:<br/>
            &nbsp;&nbsp;xⱼ = Σᵢ yᵢwⱼᵢ<br/>
            &nbsp;&nbsp;yⱼ = σ(xⱼ)
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'var(--accent-tertiary)' }}>2. COMPUTE OUTPUT ERROR</div>
          <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
            For each output unit j:<br/>
            &nbsp;&nbsp;δⱼ = (dⱼ - yⱼ) · yⱼ(1 - yⱼ)
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'var(--accent-tertiary)' }}>3. BACKWARD PASS</div>
          <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
            For each layer from output-1 to input:<br/>
            &nbsp;&nbsp;δⱼ = yⱼ(1 - yⱼ) · Σₖ δₖwₖⱼ
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--accent-tertiary)' }}>4. UPDATE WEIGHTS</div>
          <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)' }}>
            For each weight wⱼᵢ:<br/>
            &nbsp;&nbsp;wⱼᵢ ← wⱼᵢ + η · δⱼ · yᵢ
          </div>
        </div>
      </div>

      <h2>Why It Works</h2>
      <p>
        The paper proves that this procedure performs <strong>gradient descent</strong> 
        on the error surface. Each weight update moves in the direction that most 
        reduces the error. Over many iterations, the network converges toward a 
        configuration that minimizes errors on the training data.
      </p>

      <div className="callout">
        <div className="callout-title">Computational Efficiency</div>
        <p>
          The backward pass takes about the same time as the forward pass. This is 
          remarkable: we get exact gradients for <em>all</em> weights in just two 
          passes through the network. This efficiency is what makes training deep 
          networks practical.
        </p>
      </div>

      <h2>Coming Up</h2>
      <p>
        We've now covered the complete backpropagation algorithm. In the final section, 
        we'll see it in action on the classic XOR problem—watching a network learn 
        to solve a problem that stumped the field for decades.
      </p>

      <NavButtons currentPath="/backpropagation" />
    </motion.div>
  )
}

