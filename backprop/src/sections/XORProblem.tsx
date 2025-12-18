import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
// KatexMath import removed - not used in this file
import NavButtons from '../components/NavButtons'

// Simple neural network implementation for XOR
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

function sigmoidDerivative(y: number): number {
  return y * (1 - y)
}

interface NetworkState {
  // 2 inputs, 2 hidden, 1 output
  weightsIH: number[][] // [2][2]
  biasH: number[]       // [2]
  weightsHO: number[]   // [2]
  biasO: number
}

function initNetwork(): NetworkState {
  return {
    weightsIH: [
      [Math.random() * 2 - 1, Math.random() * 2 - 1],
      [Math.random() * 2 - 1, Math.random() * 2 - 1]
    ],
    biasH: [Math.random() * 2 - 1, Math.random() * 2 - 1],
    weightsHO: [Math.random() * 2 - 1, Math.random() * 2 - 1],
    biasO: Math.random() * 2 - 1
  }
}

function forward(network: NetworkState, inputs: number[]): { hidden: number[], output: number } {
  const hidden = [
    sigmoid(inputs[0] * network.weightsIH[0][0] + inputs[1] * network.weightsIH[0][1] + network.biasH[0]),
    sigmoid(inputs[0] * network.weightsIH[1][0] + inputs[1] * network.weightsIH[1][1] + network.biasH[1])
  ]
  const output = sigmoid(hidden[0] * network.weightsHO[0] + hidden[1] * network.weightsHO[1] + network.biasO)
  return { hidden, output }
}

function train(network: NetworkState, lr: number): { newNetwork: NetworkState, error: number } {
  const xorData = [
    { inputs: [0, 0], target: 0 },
    { inputs: [0, 1], target: 1 },
    { inputs: [1, 0], target: 1 },
    { inputs: [1, 1], target: 0 }
  ]
  
  let totalError = 0
  const newNetwork = JSON.parse(JSON.stringify(network)) as NetworkState
  
  for (const { inputs, target } of xorData) {
    // Forward pass
    const hidden = [
      sigmoid(inputs[0] * network.weightsIH[0][0] + inputs[1] * network.weightsIH[0][1] + network.biasH[0]),
      sigmoid(inputs[0] * network.weightsIH[1][0] + inputs[1] * network.weightsIH[1][1] + network.biasH[1])
    ]
    const output = sigmoid(hidden[0] * network.weightsHO[0] + hidden[1] * network.weightsHO[1] + network.biasO)
    
    // Error
    const error = target - output
    totalError += error * error
    
    // Output delta
    const deltaO = error * sigmoidDerivative(output)
    
    // Hidden deltas
    const deltaH = [
      sigmoidDerivative(hidden[0]) * deltaO * network.weightsHO[0],
      sigmoidDerivative(hidden[1]) * deltaO * network.weightsHO[1]
    ]
    
    // Update weights
    newNetwork.weightsHO[0] += lr * deltaO * hidden[0]
    newNetwork.weightsHO[1] += lr * deltaO * hidden[1]
    newNetwork.biasO += lr * deltaO
    
    newNetwork.weightsIH[0][0] += lr * deltaH[0] * inputs[0]
    newNetwork.weightsIH[0][1] += lr * deltaH[0] * inputs[1]
    newNetwork.biasH[0] += lr * deltaH[0]
    
    newNetwork.weightsIH[1][0] += lr * deltaH[1] * inputs[0]
    newNetwork.weightsIH[1][1] += lr * deltaH[1] * inputs[1]
    newNetwork.biasH[1] += lr * deltaH[1]
  }
  
  return { newNetwork, error: totalError / 4 }
}

export default function XORProblem() {
  const [network, setNetwork] = useState<NetworkState>(initNetwork)
  const [epoch, setEpoch] = useState(0)
  const [errorHistory, setErrorHistory] = useState<number[]>([])
  const [running, setRunning] = useState(false)
  const [learningRate, setLearningRate] = useState(2.0)
  const intervalRef = useRef<number | null>(null)
  
  const predictions = [
    forward(network, [0, 0]).output,
    forward(network, [0, 1]).output,
    forward(network, [1, 0]).output,
    forward(network, [1, 1]).output
  ]
  
  const targets = [0, 1, 1, 0]
  
  const step = useCallback(() => {
    const { newNetwork, error } = train(network, learningRate)
    setNetwork(newNetwork)
    setEpoch(e => e + 1)
    setErrorHistory(h => [...h.slice(-99), error])
    
    if (error < 0.001) {
      setRunning(false)
    }
  }, [network, learningRate])
  
  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(step, 50)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, step])
  
  const reset = () => {
    setRunning(false)
    setNetwork(initNetwork())
    setEpoch(0)
    setErrorHistory([])
  }
  
  const currentError = errorHistory[errorHistory.length - 1] || 0
  const solved = currentError < 0.01 && epoch > 0
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 10</div>
        <h1 className="section-title">The XOR Problem</h1>
        <p className="section-subtitle">
          Watch backpropagation solve the problem that defeated perceptrons
        </p>
      </header>

      <h2>The Challenge</h2>
      <p>
        Remember the XOR problem? A single perceptron can't solve it because no straight 
        line separates the outputs. But a network with hidden units can transform the 
        inputs into a space where they <em>are</em> separable.
      </p>

      <div className="callout">
        <div className="callout-title">From the Paper</div>
        <p>
          <em>"The simplest interesting task is one in which there are just two input 
          units (which can each be on or off) and a single output which should be on 
          if the two input units are in different states... This is a simple task that 
          cannot be done without hidden units."</em>
        </p>
      </div>

      <h2>Live Training</h2>
      <p>
        Click "Train" to watch a 2-2-1 network (2 inputs, 2 hidden units, 1 output) 
        learn XOR through backpropagation. The network starts with random weights and 
        gradually learns the correct pattern.
      </p>

      <div className="viz-container">
        <div className="viz-title">
          Neural Network Learning XOR
          {solved && <span style={{ color: 'var(--accent-success)', marginLeft: '1rem' }}>✓ Solved!</span>}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Network visualization */}
          <div>
            <svg viewBox="0 0 250 200" width="250" height="200">
              {/* Input layer */}
              <circle cx="40" cy="60" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-tertiary)" strokeWidth="2"/>
              <text x="40" y="65" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">x₁</text>
              
              <circle cx="40" cy="140" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-tertiary)" strokeWidth="2"/>
              <text x="40" y="145" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">x₂</text>
              
              {/* Hidden layer */}
              <circle cx="125" cy="50" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2"/>
              <text x="125" y="55" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">h₁</text>
              
              <circle cx="125" cy="150" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2"/>
              <text x="125" y="155" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">h₂</text>
              
              {/* Output */}
              <circle cx="210" cy="100" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" strokeWidth="2"/>
              <text x="210" y="105" fill="var(--text-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">y</text>
              
              {/* Connections with thickness based on weight magnitude */}
              {/* Input to hidden */}
              <line x1="58" y1="60" x2="107" y2="50" stroke="var(--accent-primary)" strokeWidth={Math.abs(network.weightsIH[0][0]) + 0.5} opacity="0.6"/>
              <line x1="58" y1="140" x2="107" y2="50" stroke="var(--accent-primary)" strokeWidth={Math.abs(network.weightsIH[0][1]) + 0.5} opacity="0.6"/>
              <line x1="58" y1="60" x2="107" y2="150" stroke="var(--accent-primary)" strokeWidth={Math.abs(network.weightsIH[1][0]) + 0.5} opacity="0.6"/>
              <line x1="58" y1="140" x2="107" y2="150" stroke="var(--accent-primary)" strokeWidth={Math.abs(network.weightsIH[1][1]) + 0.5} opacity="0.6"/>
              
              {/* Hidden to output */}
              <line x1="143" y1="50" x2="192" y2="100" stroke="var(--accent-secondary)" strokeWidth={Math.abs(network.weightsHO[0]) + 0.5} opacity="0.6"/>
              <line x1="143" y1="150" x2="192" y2="100" stroke="var(--accent-secondary)" strokeWidth={Math.abs(network.weightsHO[1]) + 0.5} opacity="0.6"/>
            </svg>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
              Line thickness = weight magnitude
            </p>
          </div>
          
          {/* Truth table */}
          <div>
            <table style={{ width: '100%', fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>x₁</th>
                  <th>x₂</th>
                  <th>Target</th>
                  <th>Output</th>
                  <th>✓</th>
                </tr>
              </thead>
              <tbody>
                {[[0, 0], [0, 1], [1, 0], [1, 1]].map((inputs, i) => {
                  const pred = predictions[i]
                  const target = targets[i]
                  const correct = Math.abs(pred - target) < 0.3
                  return (
                    <tr key={i}>
                      <td>{inputs[0]}</td>
                      <td>{inputs[1]}</td>
                      <td>{target}</td>
                      <td style={{ color: correct ? 'var(--accent-success)' : 'var(--accent-secondary)' }}>
                        {pred.toFixed(2)}
                      </td>
                      <td>{correct ? '✓' : '✗'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Error graph */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ERROR OVER TIME</div>
          <svg viewBox="0 0 400 80" width="100%" height="80" style={{ background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
            {errorHistory.length > 1 && (
              <polyline
                points={errorHistory.map((e, i) => 
                  `${(i / 99) * 390 + 5},${75 - Math.min(e, 0.5) * 140}`
                ).join(' ')}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2"
              />
            )}
            {/* Y-axis labels */}
            <text x="5" y="15" fill="var(--text-muted)" fontSize="9" fontFamily="JetBrains Mono">0.5</text>
            <text x="5" y="75" fill="var(--text-muted)" fontSize="9" fontFamily="JetBrains Mono">0</text>
          </svg>
        </div>
        
        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>EPOCH</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem' }}>{epoch}</div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>ERROR</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: solved ? 'var(--accent-success)' : 'var(--accent-primary)' }}>
              {currentError.toFixed(4)}
            </div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>STATUS</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: solved ? 'var(--accent-success)' : running ? 'var(--accent-tertiary)' : 'var(--text-muted)' }}>
              {solved ? 'Solved!' : running ? 'Training...' : 'Ready'}
            </div>
          </div>
        </div>
        
        <div className="controls">
          <button className="button" onClick={() => setRunning(r => !r)}>
            {running ? 'Pause' : 'Train'}
          </button>
          <button className="button secondary" onClick={step} disabled={running}>
            Single Step
          </button>
          <button className="button secondary" onClick={reset}>
            Reset
          </button>
          <div className="control-group">
            <span className="control-label">Learning Rate: {learningRate.toFixed(1)}</span>
            <input 
              type="range" 
              className="slider"
              min="0.5" 
              max="5" 
              step="0.5"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <h2>What the Hidden Units Learn</h2>
      <p>
        The paper shows that the network finds an elegant solution. One hidden unit 
        learns to detect "at least one input is on" (OR-like), and the other learns 
        to detect "both inputs are on" (AND-like). The output unit then computes 
        "OR but not AND"—exactly XOR!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1.5rem 0' }}>
        <div className="callout" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>h₁</div>
          <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
            Learns something like<br/><strong>x₁ OR x₂</strong>
          </p>
        </div>
        <div className="callout" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>h₂</div>
          <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
            Learns something like<br/><strong>x₁ AND x₂</strong>
          </p>
        </div>
        <div className="callout" style={{ margin: 0, textAlign: 'center', borderLeftColor: 'var(--accent-secondary)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>y</div>
          <p style={{ marginBottom: 0, fontSize: '0.9rem' }}>
            Computes<br/><strong>h₁ AND NOT h₂</strong>
          </p>
        </div>
      </div>

      <div className="callout insight">
        <div className="callout-title">Emergent Representations</div>
        <p>
          <strong>No one programmed these features.</strong> The network discovered, through 
          gradient descent alone, that decomposing XOR into OR and AND was the right 
          representation. This is the power of backpropagation: it finds useful internal 
          representations automatically.
        </p>
      </div>

      <h2>Local Minima: A Practical Note</h2>
      <p>
        Sometimes the network gets stuck and error stops decreasing. This is a 
        <strong> local minimum</strong>—a point where all directions lead uphill, but 
        it's not the global best solution. Click "Reset" and train again; different 
        random starting weights often find better solutions.
      </p>
      
      <p>
        The paper notes: <em>"Experience with many tasks shows that the network very 
        rarely gets stuck in poor local minima that are significantly worse than the 
        global minimum."</em>
      </p>

      <h2>Conclusion: Why This Paper Matters</h2>
      <p>
        This 1986 paper demonstrated that backpropagation could train multi-layer 
        networks to discover useful internal representations. It didn't just solve 
        XOR—it opened the door to learning complex functions, recognizing patterns, 
        and building the foundations of modern deep learning.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Legacy</div>
        <p>
          Every modern neural network—from image classifiers to language models—uses 
          backpropagation or variants of it. The core ideas from this paper remain 
          unchanged: forward pass, error measurement, backward pass, weight updates. 
          The scale has grown from XOR to systems with billions of parameters, but 
          the algorithm Rumelhart, Hinton, and Williams described is still at the heart.
        </p>
      </div>

      <h2>Going Further</h2>
      <p>
        The paper goes beyond what we've covered here, discussing:
      </p>
      <ul>
        <li><strong>Family trees:</strong> Learning semantic relationships between people</li>
        <li><strong>Recurrent networks:</strong> Extending to sequences and time</li>
        <li><strong>Symmetric networks:</strong> Networks where weights are tied</li>
      </ul>
      
      <p>
        If you want to dive deeper, the full paper is available in this project 
        folder, and the original "Parallel Distributed Processing" books provide 
        extensive exploration of these ideas.
      </p>

      <div className="callout">
        <div className="callout-title">Thank You for Reading</div>
        <p style={{ marginBottom: 0 }}>
          You've now walked through one of the most influential papers in computer 
          science history. The concepts here—gradients, chain rules, representations—
          are the vocabulary of modern AI. May this foundation serve you well as you 
          explore further.
        </p>
      </div>

      <NavButtons currentPath="/xor-problem" />
    </motion.div>
  )
}

