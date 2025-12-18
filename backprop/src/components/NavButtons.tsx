import { Link } from 'react-router-dom'

const sections = [
  { path: '/', label: 'Introduction' },
  { path: '/perceptron', label: 'The Perceptron' },
  { path: '/hidden-units', label: 'Hidden Units' },
  { path: '/forward-prop', label: 'Forward Propagation' },
  { path: '/sigmoid', label: 'The Sigmoid Function' },
  { path: '/error-function', label: 'Error & Loss' },
  { path: '/gradient-descent', label: 'Gradient Descent' },
  { path: '/chain-rule', label: 'The Chain Rule' },
  { path: '/backpropagation', label: 'Backpropagation' },
  { path: '/xor-problem', label: 'The XOR Problem' },
]

interface NavButtonsProps {
  currentPath: string
}

export default function NavButtons({ currentPath }: NavButtonsProps) {
  const currentIndex = sections.findIndex(s => s.path === currentPath)
  const prev = currentIndex > 0 ? sections[currentIndex - 1] : null
  const next = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null
  
  return (
    <div className="nav-buttons">
      {prev ? (
        <Link to={prev.path} className="nav-button">
          ← {prev.label}
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={next.path} className="nav-button">
          {next.label} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}

