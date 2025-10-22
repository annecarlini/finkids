import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; /* Para criar o link entre páginas */
import './App.css'
import Homepage from './pages/Home/Homepage'
import Login from './pages/Login/Login'
import Init from './pages/Chooseavatar/Init'
import Phase from './pages/Phasespage/Phase';


function App() {

  return (
   <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/init" element={<Init />} />
        <Route path="/phase" element={<Phase />} />
      </Routes>
    </Router>
   </div>
  )
}

export default App
