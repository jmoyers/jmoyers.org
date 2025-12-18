import { useState } from 'react'
import { motion } from 'framer-motion'
import NavButtons from '../components/NavButtons'

export default function HiddenUnits() {
  const [activeExample, setActiveExample] = useState<'xor' | 'face'>('xor')
  
  return (
    <motion.div 
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 03</div>
        <h1 className="section-title">Hidden Units</h1>
        <p className="section-subtitle">
          The secret sauce: neurons that learn their own representations
        </p>
      </header>

      <h2>Beyond Input and Output</h2>
      <p>
        A single perceptron directly connects inputs to outputs. But as we saw, this limits 
        what it can learn. The key insight is to add <strong>hidden layers</strong>—neurons 
        that sit between input and output, transforming the data into new representations.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ Key Insight from the Paper</div>
        <p>
          <em>"Internal 'hidden' units which are not part of the input or output come to 
          represent important features of the task domain, and the regularities in the task 
          are captured by the interactions of these units."</em>
        </p>
      </div>

      <h2>What Makes Hidden Units Special?</h2>
      <p>
        Unlike perceptrons from Rosenblatt's original work (which had fixed "feature 
        analyzers"), true hidden units <strong>learn what to represent</strong>. They 
        discover useful intermediate features that help solve the task.
      </p>

      <div className="viz-container">
        <div className="viz-title">Multi-Layer Network Architecture</div>
        <div className="viz-canvas">
          <svg viewBox="0 0 500 280" width="500" height="280">
            {/* Layer labels */}
            <text x="60" y="25" fill="var(--text-muted)" fontSize="12" textAnchor="middle" fontFamily="Outfit">Input</text>
            <text x="200" y="25" fill="var(--text-muted)" fontSize="12" textAnchor="middle" fontFamily="Outfit">Hidden</text>
            <text x="340" y="25" fill="var(--text-muted)" fontSize="12" textAnchor="middle" fontFamily="Outfit">Hidden</text>
            <text x="440" y="25" fill="var(--text-muted)" fontSize="12" textAnchor="middle" fontFamily="Outfit">Output</text>
            
            {/* Input layer */}
            {[60, 110, 160, 210].map((y, i) => (
              <circle key={`in-${i}`} cx="60" cy={y} r="18" fill="var(--bg-tertiary)" stroke="var(--accent-tertiary)" strokeWidth="2"/>
            ))}
            
            {/* First hidden layer */}
            {[85, 135, 185].map((y, i) => (
              <circle key={`h1-${i}`} cx="200" cy={y} r="18" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2"/>
            ))}
            
            {/* Second hidden layer */}
            {[110, 160].map((y, i) => (
              <circle key={`h2-${i}`} cx="340" cy={y} r="18" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" strokeWidth="2"/>
            ))}
            
            {/* Output layer */}
            <circle cx="440" cy="135" r="18" fill="var(--bg-tertiary)" stroke="var(--accent-secondary)" strokeWidth="2"/>
            
            {/* Connections - input to hidden 1 */}
            {[60, 110, 160, 210].map((y1) => 
              [85, 135, 185].map((y2) => (
                <line 
                  key={`c1-${y1}-${y2}`}
                  x1="78" y1={y1} x2="182" y2={y2}
                  stroke="var(--border-highlight)" strokeWidth="1" opacity="0.5"
                />
              ))
            )}
            
            {/* Connections - hidden 1 to hidden 2 */}
            {[85, 135, 185].map((y1) => 
              [110, 160].map((y2) => (
                <line 
                  key={`c2-${y1}-${y2}`}
                  x1="218" y1={y1} x2="322" y2={y2}
                  stroke="var(--border-highlight)" strokeWidth="1" opacity="0.5"
                />
              ))
            )}
            
            {/* Connections - hidden 2 to output */}
            {[110, 160].map((y1) => (
              <line 
                key={`c3-${y1}`}
                x1="358" y1={y1} x2="422" y2={135}
                stroke="var(--border-highlight)" strokeWidth="1" opacity="0.5"
              />
            ))}
            
            {/* Layer brackets */}
            <path d="M 175 50 Q 165 135 175 220" fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="4"/>
            <path d="M 225 50 Q 235 135 225 220" fill="none" stroke="var(--accent-primary)" strokeWidth="1" strokeDasharray="4"/>
            
            {/* Labels */}
            <text x="60" y="245" fill="var(--accent-tertiary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">x₁, x₂, x₃, x₄</text>
            <text x="200" y="245" fill="var(--accent-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">learned</text>
            <text x="200" y="260" fill="var(--accent-primary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">features</text>
            <text x="440" y="245" fill="var(--accent-secondary)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">ŷ</text>
          </svg>
        </div>
      </div>

      <h2>The Representation Learning Problem</h2>
      <p>
        Here's the fundamental challenge: we know what inputs are (they're given) and we know 
        what outputs should be (that's our training data). But <strong>we don't know what the 
        hidden units should represent</strong>.
      </p>

      <div className="callout insight">
        <div className="callout-title">The Credit Assignment Problem</div>
        <p>
          When the network produces the wrong output, which weights are at fault? The output 
          layer weights? The hidden layer weights? How do we distribute "blame" across all the 
          connections? This is the credit assignment problem, and it's what backpropagation 
          solves.
        </p>
      </div>

      <h2>How Hidden Units Transform the Problem</h2>
      <p>
        Let's see how hidden units can make an unsolvable problem solvable. Click to toggle 
        between examples:
      </p>

      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <button 
          className={`button ${activeExample === 'xor' ? '' : 'secondary'}`}
          onClick={() => setActiveExample('xor')}
        >
          XOR Example
        </button>
        <button 
          className={`button ${activeExample === 'face' ? '' : 'secondary'}`}
          onClick={() => setActiveExample('face')}
        >
          Feature Learning
        </button>
      </div>

      {activeExample === 'xor' && (
        <div className="viz-container">
          <div className="viz-title">XOR: Hidden Units Create a New Space</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
            <div>
              <svg viewBox="0 0 180 180" width="180" height="180">
                <rect width="180" height="180" fill="var(--bg-tertiary)" rx="8"/>
                <text x="90" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Original Input Space</text>
                
                {/* Points */}
                <circle cx="45" cy="135" r="12" fill="#c9454c"/>
                <circle cx="135" cy="135" r="12" fill="#5cb85c"/>
                <circle cx="45" cy="45" r="12" fill="#5cb85c"/>
                <circle cx="135" cy="45" r="12" fill="#c9454c"/>
                
                <text x="45" cy="140" fill="white" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">0,0</text>
                <text x="135" cy="140" fill="white" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">1,0</text>
                <text x="45" cy="50" fill="white" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">0,1</text>
                <text x="135" cy="50" fill="white" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">1,1</text>
              </svg>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                No line separates classes
              </p>
            </div>
            
            <svg viewBox="0 0 60 60" width="60" height="60">
              <text x="30" y="35" fill="var(--accent-primary)" fontSize="24" textAnchor="middle" fontFamily="Outfit">→</text>
              <text x="30" y="50" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="Outfit">hidden</text>
              <text x="30" y="60" fill="var(--text-muted)" fontSize="9" textAnchor="middle" fontFamily="Outfit">layer</text>
            </svg>
            
            <div>
              <svg viewBox="0 0 180 180" width="180" height="180">
                <rect width="180" height="180" fill="var(--bg-tertiary)" rx="8"/>
                <text x="90" y="20" fill="var(--text-muted)" fontSize="11" textAnchor="middle" fontFamily="Outfit">Transformed Space</text>
                
                {/* Transformed points - now linearly separable */}
                <circle cx="45" cy="135" r="12" fill="#c9454c"/>
                <circle cx="90" cy="45" r="12" fill="#5cb85c"/>
                <circle cx="90" cy="45" r="12" fill="#5cb85c" style={{ transform: 'translate(5px, 5px)' }}/>
                <circle cx="135" cy="135" r="12" fill="#c9454c"/>
                
                {/* Separating line - now works! */}
                <line x1="20" y1="90" x2="160" y2="90" stroke="var(--accent-primary)" strokeWidth="2"/>
                
                <text x="90" y="165" fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">hidden unit outputs</text>
              </svg>
              <p style={{ textAlign: 'center', color: 'var(--accent-success)', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                ✓ Now separable!
              </p>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            The hidden layer learns to map the four input patterns to a new space where a 
            single line <em>can</em> separate them. The key insight: hidden units discover 
            features like "at least one input is on" and "both inputs are on".
          </p>
        </div>
      )}

      {activeExample === 'face' && (
        <div className="viz-container">
          <div className="viz-title">Hierarchical Feature Learning</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '1px',
                padding: '4px'
              }}>
                {Array(64).fill(0).map((_, i) => (
                  <div key={i} style={{ 
                    background: Math.random() > 0.5 ? 'var(--text-muted)' : 'var(--bg-primary)',
                    borderRadius: '1px'
                  }}/>
                ))}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Pixels</span>
            </div>
            
            <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>→</span>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                display: 'flex',
                gap: '0.5rem',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px' }}/>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px', opacity: 0.7 }}/>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px', opacity: 0.4 }}/>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px', opacity: 0.6 }}/>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px', opacity: 0.8 }}/>
                  <div style={{ width: '20px', height: '20px', background: 'var(--accent-tertiary)', borderRadius: '4px', opacity: 0.5 }}/>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Edges</span>
            </div>
            
            <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>→</span>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                display: 'flex',
                gap: '0.5rem'
              }}>
                <div style={{ width: '30px', height: '30px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👁</div>
                <div style={{ width: '30px', height: '30px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👃</div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Parts</span>
            </div>
            
            <span style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>→</span>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                😊
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>Face</span>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            Each layer learns increasingly abstract features. Early layers detect edges, 
            later layers combine edges into parts, and final layers recognize whole objects. 
            <strong>No one programs these features—the network discovers them.</strong>
          </p>
        </div>
      )}

      <h2>The Paper's Architecture</h2>
      <p>
        The 1986 paper describes "layered networks" with specific constraints:
      </p>
      
      <ul>
        <li>A layer of <strong>input units</strong> at the bottom</li>
        <li>Any number of <strong>intermediate (hidden) layers</strong></li>
        <li>A layer of <strong>output units</strong> at the top</li>
        <li>Connections can skip layers (go from layer 1 directly to layer 3)</li>
        <li>No connections within a layer or from higher to lower layers</li>
      </ul>

      <div className="callout">
        <div className="callout-title">Why These Constraints?</div>
        <p>
          These constraints ensure information flows in one direction—from input to output. 
          This makes the math clean: we can compute each layer's values from the previous 
          layer. This is called a <strong>feedforward</strong> network. Later in the paper, 
          the authors show how to extend this to recurrent networks.
        </p>
      </div>

      <h2>Coming Up</h2>
      <p>
        Now that we understand <em>why</em> we need hidden units and <em>what</em> they do, 
        we need to understand <em>how</em> information flows through them. That's forward 
        propagation—the subject of our next section.
      </p>

      <NavButtons currentPath="/hidden-units" />
    </motion.div>
  )
}

