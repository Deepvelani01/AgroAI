import { useState } from 'react'

import './index.css'
import Register from './components/Register'
import Login from './components/Login'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home'
import DiseaseDetection from './components/DiseaseDetection'
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import ProtectedRoute from './components/ProtectedRoute';
import DiseaseSolution from './components/DiseaseSolution'
import SelectCrop from './components/selectCrop'
function App() {
  

  return (
    <>
      <AuthProvider>
        <Routes>
    
          <Route path="/Login" element={<Login/>}/>
          <Route path="/" element={ <Register />}/>
          <Route path="/Home" element={
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>} />
          <Route path="/DiseaseDetection" element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
              } />
           <Route path="/DiseaseSolution" element={
              <ProtectedRoute>
                <DiseaseSolution />
              </ProtectedRoute>} 

            />
            <Route path="/selectCrop" element={
              <ProtectedRoute>
                  <SelectCrop />
              </ProtectedRoute>} 

            />
          </Routes>
      </AuthProvider>
     
    </>
  )
}

export default App
