 // import './App.css'
import Home from './pages/Home'
import Cart from './pages/Cart' 

import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes, HashRouter } from 'react-router'

function App() {
  
  return (
    <ChakraProvider>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
      </HashRouter>
    </ChakraProvider>
  )
}

export default App
