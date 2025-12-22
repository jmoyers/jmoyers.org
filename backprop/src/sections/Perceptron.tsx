import { useState } from "react";
import { motion } from "framer-motion";
import KatexMath from "../components/Math";
import NavButtons from "../components/NavButtons";

export default function Perceptron() {
  const [weights, setWeights] = useState([0.5, 0.5]);
  const [bias, setBias] = useState(-0.7);
  const [inputs, setInputs] = useState([1, 1]);

  const weightedSum = inputs[0] * weights[0] + inputs[1] * weights[1] + bias;
  const output = weightedSum > 0 ? 1 : 0;

  return (
    <motion.div
      className="section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="section-header">
        <div className="section-number">SECTION 02</div>
        <h1 className="section-title">The Perceptron</h1>
        <p className="section-subtitle">
          The simplest neural network—and its fundamental limitation
        </p>
      </header>

      <h2>What is a Perceptron?</h2>
      <p>
        A perceptron is the simplest possible neural network: a single
        artificial neuron. Invented by Frank Rosenblatt in 1958, it was one of
        the first algorithms that could actually <em>learn</em> from data.
      </p>

      <p>
        The perceptron takes multiple inputs, multiplies each by a{" "}
        <strong>weight</strong>
        (representing importance), adds them up along with a{" "}
        <strong>bias</strong>, and outputs 1 if the total is positive, 0
        otherwise.
      </p>

      <div className="key-concept">
        <div className="key-concept-title">✦ The Perceptron Formula</div>
        <KatexMath block>
          {`\\text{output} = \\begin{cases} 1 & \\text{if } \\sum_i w_i x_i + b > 0 \\\\ 0 & \\text{otherwise} \\end{cases}`}
        </KatexMath>
        <div className="formula-breakdown" style={{ marginTop: "1rem" }}>
          <div className="formula-part">
            <span className="formula-symbol">xᵢ</span>
            <span className="formula-meaning">
              Input values (what we're feeding in)
            </span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">wᵢ</span>
            <span className="formula-meaning">
              Weights (how important each input is)
            </span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">b</span>
            <span className="formula-meaning">
              Bias (shifts the decision threshold)
            </span>
          </div>
          <div className="formula-part">
            <span className="formula-symbol">Σ</span>
            <span className="formula-meaning">
              Sum up all the weighted inputs
            </span>
          </div>
        </div>
      </div>

      <h2>Interactive Perceptron</h2>
      <p>
        Try adjusting the weights and bias below to see how the perceptron
        classifies different inputs. Can you make it compute AND? OR? XOR?
      </p>

      <div className="viz-container">
        <div className="viz-title">Single Perceptron Visualization</div>
        <div
          className="viz-canvas"
          style={{ flexDirection: "column", gap: "2rem" }}
        >
          <svg viewBox="0 0 400 200" width="400" height="200">
            {/* Input nodes */}
            <circle
              cx="60"
              cy="60"
              r="25"
              fill="var(--bg-tertiary)"
              stroke="var(--accent-tertiary)"
              strokeWidth="2"
            />
            <text
              x="60"
              y="65"
              fill="var(--text-primary)"
              fontSize="14"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
            >
              x₁={inputs[0]}
            </text>

            <circle
              cx="60"
              cy="140"
              r="25"
              fill="var(--bg-tertiary)"
              stroke="var(--accent-tertiary)"
              strokeWidth="2"
            />
            <text
              x="60"
              y="145"
              fill="var(--text-primary)"
              fontSize="14"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
            >
              x₂={inputs[1]}
            </text>

            {/* Bias node */}
            <circle
              cx="200"
              cy="30"
              r="15"
              fill="var(--bg-tertiary)"
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <text
              x="200"
              y="34"
              fill="var(--text-muted)"
              fontSize="10"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
            >
              b
            </text>

            {/* Connections with weights */}
            <line
              x1="85"
              y1="60"
              x2="175"
              y2="100"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
            <text
              x="120"
              y="70"
              fill="var(--accent-primary)"
              fontSize="12"
              fontFamily="JetBrains Mono"
            >
              w₁={weights[0].toFixed(2)}
            </text>

            <line
              x1="85"
              y1="140"
              x2="175"
              y2="100"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
            <text
              x="120"
              y="155"
              fill="var(--accent-primary)"
              fontSize="12"
              fontFamily="JetBrains Mono"
            >
              w₂={weights[1].toFixed(2)}
            </text>

            <line
              x1="200"
              y1="45"
              x2="200"
              y2="75"
              stroke="var(--text-muted)"
              strokeWidth="1"
              strokeDasharray="4"
            />

            {/* Neuron */}
            <circle
              cx="200"
              cy="100"
              r="30"
              fill="var(--bg-tertiary)"
              stroke="var(--accent-secondary)"
              strokeWidth="3"
            />
            <text
              x="200"
              y="95"
              fill="var(--text-primary)"
              fontSize="10"
              textAnchor="middle"
              fontFamily="Outfit"
            >
              Σ + b
            </text>
            <text
              x="200"
              y="110"
              fill="var(--text-muted)"
              fontSize="9"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
            >
              {weightedSum.toFixed(2)}
            </text>

            {/* Output connection */}
            <line
              x1="230"
              y1="100"
              x2="300"
              y2="100"
              stroke={
                output ? "var(--accent-success)" : "var(--accent-secondary)"
              }
              strokeWidth="3"
            />

            {/* Output node */}
            <circle
              cx="330"
              cy="100"
              r="25"
              fill={
                output ? "var(--accent-success)" : "var(--accent-secondary)"
              }
              opacity="0.9"
            />
            <text
              x="330"
              y="105"
              fill="white"
              fontSize="18"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontWeight="bold"
            >
              {output}
            </text>
          </svg>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span className="control-label">Input x₁</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`button ${inputs[0] === 0 ? "" : "secondary"}`}
                  onClick={() => setInputs([0, inputs[1]])}
                  style={{ flex: 1 }}
                >
                  0
                </button>
                <button
                  className={`button ${inputs[0] === 1 ? "" : "secondary"}`}
                  onClick={() => setInputs([1, inputs[1]])}
                  style={{ flex: 1 }}
                >
                  1
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span className="control-label">Input x₂</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className={`button ${inputs[1] === 0 ? "" : "secondary"}`}
                  onClick={() => setInputs([inputs[0], 0])}
                  style={{ flex: 1 }}
                >
                  0
                </button>
                <button
                  className={`button ${inputs[1] === 1 ? "" : "secondary"}`}
                  onClick={() => setInputs([inputs[0], 1])}
                  style={{ flex: 1 }}
                >
                  1
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="control-group">
            <span className="control-label">
              Weight w₁: {weights[0].toFixed(2)}
            </span>
            <input
              type="range"
              className="slider"
              min="-2"
              max="2"
              step="0.1"
              value={weights[0]}
              onChange={(e) =>
                setWeights([parseFloat(e.target.value), weights[1]])
              }
            />
          </div>
          <div className="control-group">
            <span className="control-label">
              Weight w₂: {weights[1].toFixed(2)}
            </span>
            <input
              type="range"
              className="slider"
              min="-2"
              max="2"
              step="0.1"
              value={weights[1]}
              onChange={(e) =>
                setWeights([weights[0], parseFloat(e.target.value)])
              }
            />
          </div>
          <div className="control-group">
            <span className="control-label">Bias: {bias.toFixed(2)}</span>
            <input
              type="range"
              className="slider"
              min="-2"
              max="2"
              step="0.1"
              value={bias}
              onChange={(e) => setBias(parseFloat(e.target.value))}
            />
          </div>
        </div>
      </div>

      <h2>What Can a Perceptron Learn?</h2>
      <p>
        A perceptron can learn any <strong>linearly separable</strong>{" "}
        function—that is, any classification where you can draw a straight line
        (or hyperplane in higher dimensions) to separate the classes.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
          margin: "2rem 0",
        }}
      >
        <div className="viz-container" style={{ margin: 0 }}>
          <div className="viz-title">AND Gate ✓</div>
          <svg
            viewBox="0 0 150 150"
            width="150"
            height="150"
            style={{ margin: "0 auto", display: "block" }}
          >
            <circle cx="30" cy="120" r="12" fill="#c9454c" />
            <circle cx="120" cy="120" r="12" fill="#c9454c" />
            <circle cx="30" cy="30" r="12" fill="#c9454c" />
            <circle cx="120" cy="30" r="12" fill="#5cb85c" />
            <line
              x1="0"
              y1="-45"
              x2="150"
              y2="105"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
          </svg>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              margin: 0,
              fontSize: "0.9rem",
            }}
          >
            Output 1 only when both inputs are 1
          </p>
        </div>

        <div className="viz-container" style={{ margin: 0 }}>
          <div className="viz-title">OR Gate ✓</div>
          <svg
            viewBox="0 0 150 150"
            width="150"
            height="150"
            style={{ margin: "0 auto", display: "block" }}
          >
            <circle cx="30" cy="120" r="12" fill="#c9454c" />
            <circle cx="120" cy="120" r="12" fill="#5cb85c" />
            <circle cx="30" cy="30" r="12" fill="#5cb85c" />
            <circle cx="120" cy="30" r="12" fill="#5cb85c" />
            <line
              x1="0"
              y1="45"
              x2="150"
              y2="195"
              stroke="var(--accent-primary)"
              strokeWidth="2"
            />
          </svg>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-secondary)",
              margin: 0,
              fontSize: "0.9rem",
            }}
          >
            Output 1 when at least one input is 1
          </p>
        </div>
      </div>

      <h2>The Limitation: XOR</h2>
      <p>
        In 1969, Marvin Minsky and Seymour Papert proved in their book
        "Perceptrons" that a single perceptron <strong>cannot</strong> learn the
        XOR function. This finding led to the first "AI winter"—a period of
        reduced funding and interest in neural networks.
      </p>

      <div className="callout warning">
        <div className="callout-title">The XOR Problem</div>
        <p>
          XOR (exclusive or) outputs 1 when exactly one input is 1. The four
          cases are arranged in a pattern where no single straight line can
          separate the 1s from the 0s.
        </p>
        <table style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>x₁</th>
              <th>x₂</th>
              <th>XOR Output</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>0</td>
              <td>1</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout insight">
        <div className="callout-title">Why This Matters</div>
        <p>
          The XOR limitation isn't just academic—it represents a whole class of
          problems that require understanding <em>relationships</em> between
          inputs, not just the inputs themselves. Recognizing faces,
          understanding language, playing games—these all require non-linear
          boundaries that a single perceptron cannot create.
        </p>
      </div>

      <h2>The Way Forward</h2>
      <p>
        The solution was known even then: add more layers. A network with hidden
        layers can create complex, non-linear decision boundaries. But the
        question was: <em>how do you train the hidden layers?</em>
      </p>

      <p>
        With just input and output, you know what you want. But what should the
        hidden units represent? What values should they output? The
        backpropagation algorithm, which we'll build up to in the coming
        sections, provides the elegant answer.
      </p>

      <NavButtons currentPath="/perceptron" />
    </motion.div>
  );
}
