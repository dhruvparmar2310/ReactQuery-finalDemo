import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './main.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import User from './pages/User'
import RegistrationForm from './pages/RegistrationForm'

function App () {
  return (
    <>
      <Router>
        <nav className='navbar'>
          <ul>
            <li>
              <Link to='/'>UserList</Link>
            </li>
            <li>
              <Link to='/registration-form'>Resgistration</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path='/' element={<User />} />
          <Route path='/registration-form' element={<RegistrationForm />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
