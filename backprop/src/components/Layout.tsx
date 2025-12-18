import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

const sections = [
  { path: '/', label: 'Introduction', number: '01' },
  { path: '/perceptron', label: 'The Perceptron', number: '02' },
  { path: '/hidden-units', label: 'Hidden Units', number: '03' },
  { path: '/forward-prop', label: 'Forward Propagation', number: '04' },
  { path: '/sigmoid', label: 'The Sigmoid Function', number: '05' },
  { path: '/error-function', label: 'Error & Loss', number: '06' },
  { path: '/gradient-descent', label: 'Gradient Descent', number: '07' },
  { path: '/chain-rule', label: 'The Chain Rule', number: '08' },
  { path: '/backpropagation', label: 'Backpropagation', number: '09' },
  { path: '/xor-problem', label: 'The XOR Problem', number: '10' },
]

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <nav className="nav-sidebar">
        <div className="nav-header">
          <div className="nav-title">Backpropagation</div>
          <div className="nav-subtitle">RUMELHART, HINTON & WILLIAMS · 1986</div>
        </div>
        
        <div className="nav-section-label">Foundations</div>
        <ul className="nav-list">
          {sections.slice(0, 4).map((section) => (
            <li key={section.path} className="nav-item">
              <NavLink 
                to={section.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-number">{section.number}</span>
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="nav-section-label">Mathematics</div>
        <ul className="nav-list">
          {sections.slice(4, 8).map((section) => (
            <li key={section.path} className="nav-item">
              <NavLink 
                to={section.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-number">{section.number}</span>
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="nav-section-label">The Algorithm</div>
        <ul className="nav-list">
          {sections.slice(8).map((section) => (
            <li key={section.path} className="nav-item">
              <NavLink 
                to={section.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-number">{section.number}</span>
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

