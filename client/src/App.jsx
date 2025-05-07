import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/Login'
import LoadingPage from './pages/LoadingPage'
import QuizPage from './pages/QuizPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/waiting-room' element={<LoadingPage/>}/>
          <Route path='/quiz' element={<QuizPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
