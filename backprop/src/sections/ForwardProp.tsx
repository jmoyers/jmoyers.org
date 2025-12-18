import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import KatexMath from '../components/Math'
import NavButtons from '../components/NavButtons'

export default function ForwardProp() {
  const [step, setStep] = useState(0)
  const [animating, setAnimating] = useState(false)
  
  // Simple network: 2 inputs, 2 hidden, 1 output
  const inputs = [1, 0]
  const weightsIH = [[0.5, 0.4], [-0.3, 0.6]] // [hidden][input]
  const biasH = [0.1, -0.2]
  const weightsHO = [0.7, -0.5]
  const biasO = 0.2
  
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x))
  
  // Compute forward pass
  const hiddenSums = [
    inputs[0] * weightsIH[0][0] + inputs[1] * weightsIH[0][1] + biasH[0],
    inputs[0] * weightsIH[1][0] + inputs[1] * weightsIH[1][1] + biasH[1]
  ]
  const hiddenOutputs = hiddenSums.map(sigmoid)
  const outputSum = hiddenOutputs[0] * weightsHO[0] + hiddenOutputs[1] * weightsHO[1] + biasO
  const finalOutput = sigmoid(outputSum)

  useEffect(() => {
    if (animating && step < 4) {
      const timer = setTimeout(() => setStep(s => s + 1), 1200)
      return () => clearTimeout(timer)
    } else if (step >= 4) {
      setAnimating(false)
    }
  }, [step, animating])

  const runAnimation = () => {
    setStep(0)
    setAnimating(true)
  }
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 04</div>
        <h1 className="section-title">Forward Propagation</h1>
        <p className="section-subtitle">
          How signals flow from input to output through a neural network
        </p>
      </header>

      <h2>The Forward Pass</h2>
      <p>
        Before we can learn, we need to understand how a network produces its output. 
        Given an input, information flows forward through the network layer by layer. 
        Each neuron computes a weighted sum of its inputs and applies an 
        <strong> activation function</strong>.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Two-Step Computation (From the Paper)</div>
        <p>The paper describes two equations for computing each unit's output:</p>
        
        <h3 style={{ marginTop: '1rem' }}>Equation 1: Weighted Sum</h3>
        <KatexMath block>
          {`x_j = \\sum_i y_i w_{ji}`}
        </KatexMath>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          The total input to unit <em>j</em> is the sum of all incoming signals, each 
          multiplied by its connection weight.
        </p>
        
        <h3>Equation 2: Activation</h3>
        <KatexMath block>
          {`y_j = \\frac{1}{1 + e^{-x_j}}`}
        </KatexMath>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
          The output of unit <em>j</em> is the sigmoid function applied to the weighted sum.
          (We'll explore why sigmoid in the next section.)
        </p>
      </div>

      <h2>Watch It Happen</h2>
      <p>
        Let's trace through a forward pass step by step. Click the button to watch 
        the computation flow through the network.
      </p>

      <div className="viz-container">
        <div className="viz-title">Forward Pass Animation</div>
        <div className="viz-canvas" style={{ flexDirection: 'column', gap: '1.5rem' }}>
          <svg viewBox="0 0 500 220" width="500" height="220">
            {/* Background grid */}
            <defs>
              <pattern id="fwdGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border-color)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            
            {/* Layer labels */}
            <text x="60" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Input</text>
            <text x="220" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Hidden</text>
            <text x="380" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Output</text>
            
            {/* Connections - input to hidden */}
            <line x1="85" y1="70" x2="195" y2="70" stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 1 ? 2 : 1} opacity={step >= 1 ? 1 : 0.5}/>
            <line x1="85" y1="70" x2="195" y2="150" stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 1 ? 2 : 1} opacity={step >= 1 ? 1 : 0.5}/>
            <line x1="85" y1="150" x2="195" y2="70" stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 1 ? 2 : 1} opacity={step >= 1 ? 1 : 0.5}/>
            <line x1="85" y1="150" x2="195" y2="150" stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 1 ? 2 : 1} opacity={step >= 1 ? 1 : 0.5}/>
            
            {/* Connections - hidden to output */}
            <line x1="245" y1="70" x2="355" y2="110" stroke={step >= 3 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 3 ? 2 : 1} opacity={step >= 3 ? 1 : 0.5}/>
            <line x1="245" y1="150" x2="355" y2="110" stroke={step >= 3 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth={step >= 3 ? 2 : 1} opacity={step >= 3 ? 1 : 0.5}/>
            
            {/* Input nodes */}
            <circle cx="60" cy="70" r="22" fill={step >= 0 ? "var(--accent-tertiary)" : "var(--bg-tertiary)"} opacity="0.9"/>
            <text x="60" y="75" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">{inputs[0]}</text>
            
            <circle cx="60" cy="150" r="22" fill={step >= 0 ? "var(--accent-tertiary)" : "var(--bg-tertiary)"} opacity="0.9"/>
            <text x="60" y="155" fill="white" fontSize="14" textAnchor="middle" fontFamily="JetBrains Mono">{inputs[1]}</text>
            
            {/* Hidden nodes */}
            <circle cx="220" cy="70" r="22" fill={step >= 2 ? "var(--accent-primary)" : "var(--bg-tertiary)"} stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <text x="220" y="75" fill={step >= 2 ? "var(--bg-primary)" : "var(--text-primary)"} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
              {step >= 2 ? hiddenOutputs[0].toFixed(2) : "h₁"}
            </text>
            
            <circle cx="220" cy="150" r="22" fill={step >= 2 ? "var(--accent-primary)" : "var(--bg-tertiary)"} stroke={step >= 1 ? "var(--accent-primary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <text x="220" y="155" fill={step >= 2 ? "var(--bg-primary)" : "var(--text-primary)"} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
              {step >= 2 ? hiddenOutputs[1].toFixed(2) : "h₂"}
            </text>
            
            {/* Output node */}
            <circle cx="380" cy="110" r="22" fill={step >= 4 ? "var(--accent-secondary)" : "var(--bg-tertiary)"} stroke={step >= 3 ? "var(--accent-secondary)" : "var(--border-highlight)"} strokeWidth="2"/>
            <text x="380" y="115" fill={step >= 4 ? "white" : "var(--text-primary)"} fontSize="12" textAnchor="middle" fontFamily="JetBrains Mono">
              {step >= 4 ? finalOutput.toFixed(2) : "out"}
            </text>
            
            {/* Weight labels */}
            {step >= 1 && (
              <>
                <text x="130" y="55" fill="var(--accent-primary)" fontSize="9" fontFamily="JetBrains Mono">w={weightsIH[0][0]}</text>
                <text x="130" y="120" fill="var(--accent-primary)" fontSize="9" fontFamily="JetBrains Mono">w={weightsIH[0][1]}</text>
              </>
            )}
            
            {step >= 3 && (
              <>
                <text x="300" y="80" fill="var(--accent-primary)" fontSize="9" fontFamily="JetBrains Mono">w={weightsHO[0]}</text>
                <text x="300" y="140" fill="var(--accent-primary)" fontSize="9" fontFamily="JetBrains Mono">w={weightsHO[1]}</text>
              </>
            )}
            
            {/* Step indicator */}
            <text x="470" y="110" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">
              Step {step}/4
            </text>
          </svg>
          
          {/* Step description */}
          <div style={{ 
            background: 'var(--bg-tertiary)', 
            padding: '1rem', 
            borderRadius: '8px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}>
            {step === 0 && <span>Ready to start. Input values: x₁ = {inputs[0]}, x₂ = {inputs[1]}</span>}
            {step === 1 && <span>Computing weighted sums for hidden layer...</span>}
            {step === 2 && (
              <span>
                Hidden layer outputs after sigmoid: h₁ = σ({hiddenSums[0].toFixed(2)}) = {hiddenOutputs[0].toFixed(3)}, 
                h₂ = σ({hiddenSums[1].toFixed(2)}) = {hiddenOutputs[1].toFixed(3)}
              </span>
            )}
            {step === 3 && <span>Computing weighted sum for output layer...</span>}
            {step === 4 && (
              <span>
                Final output: σ({outputSum.toFixed(2)}) = <strong>{finalOutput.toFixed(3)}</strong>
              </span>
            )}
          </div>
        </div>
        
        <div className="controls">
          <button className="button" onClick={runAnimation} disabled={animating}>
            {animating ? 'Running...' : 'Run Forward Pass'}
          </button>
          <button className="button secondary" onClick={() => setStep(s => Math.min(s + 1, 4))} disabled={animating}>
            Step →
          </button>
          <button className="button secondary" onClick={() => setStep(0)}>
            Reset
          </button>
        </div>
      </div>

      <h2>Breaking Down the Math</h2>
      <p>
        Let's trace through the actual numbers for the first hidden unit:
      </p>

      <div className="formula-breakdown">
        <div className="formula-part">
          <span className="formula-symbol">Step 1</span>
          <span className="formula-meaning">
            <strong>Weighted sum:</strong> Multiply each input by its weight and sum up
            <br/>
            <code>x_h₁ = (1 × 0.5) + (0 × 0.4) + 0.1 = 0.6</code>
          </span>
        </div>
        <div className="formula-part">
          <span className="formula-symbol">Step 2</span>
          <span className="formula-meaning">
            <strong>Apply sigmoid:</strong> Squash the result to (0, 1)
            <br/>
            <code>y_h₁ = σ(0.6) = 1/(1 + e⁻⁰·⁶) ≈ 0.646</code>
          </span>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">Why This Matters for Learning</div>
        <p>
          Forward propagation gives us the network's prediction. The difference between 
          this prediction and the correct answer is the <strong>error</strong>. 
          Backpropagation will flow this error backwards to update the weights—but it 
          needs to know exactly how each weight contributed to the final output. That's 
          why we need smooth, differentiable functions like the sigmoid.
        </p>
      </div>

      <h2>Layer-by-Layer Processing</h2>
      <p>
        A key property of feedforward networks: <strong>each layer's computation only 
        depends on the previous layer</strong>. This means:
      </p>
      
      <ul>
        <li>Units within a layer can be computed in parallel</li>
        <li>We process layers sequentially from input to output</li>
        <li>Information flows strictly forward (no loops or backwards connections)</li>
      </ul>

      <div className="callout">
        <div className="callout-title">Notation in the Paper</div>
        <p>
          The paper uses <KatexMath>{'y_i'}</KatexMath> for the output of unit <em>i</em>, 
          <KatexMath>{'w_{ji}'}</KatexMath> for the weight from unit <em>i</em> to unit <em>j</em>, 
          and <KatexMath>{'x_j'}</KatexMath> for the total input to unit <em>j</em>. This notation 
          emphasizes that weights "belong to" their destination unit.
        </p>
      </div>

      <h2>Next: The Sigmoid Function</h2>
      <p>
        We've seen that each neuron applies the sigmoid function to its weighted sum. 
        But why sigmoid? What makes it special for learning? The next section dives 
        into this crucial piece of the puzzle.
      </p>

      <NavButtons currentPath="/forward-prop" />
    </motion.div>
  )
}

