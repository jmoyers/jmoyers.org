import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Introduction from './sections/Introduction'
import Perceptron from './sections/Perceptron'
import HiddenUnits from './sections/HiddenUnits'
import ForwardProp from './sections/ForwardProp'
import Sigmoid from './sections/Sigmoid'
import ErrorFunction from './sections/ErrorFunction'
import GradientDescent from './sections/GradientDescent'
import ChainRule from './sections/ChainRule'
import Backpropagation from './sections/Backpropagation'
import XORProblem from './sections/XORProblem'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Introduction />} />
        <Route path="/perceptron" element={<Perceptron />} />
        <Route path="/hidden-units" element={<HiddenUnits />} />
        <Route path="/forward-prop" element={<ForwardProp />} />
        <Route path="/sigmoid" element={<Sigmoid />} />
        <Route path="/error-function" element={<ErrorFunction />} />
        <Route path="/gradient-descent" element={<GradientDescent />} />
        <Route path="/chain-rule" element={<ChainRule />} />
        <Route path="/backpropagation" element={<Backpropagation />} />
        <Route path="/xor-problem" element={<XORProblem />} />
      </Routes>
    </Layout>
  )
}

export default App

