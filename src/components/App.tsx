import React from 'react';
import NavBar from './NavBar';
import About from './pages/About';
import Gis from './projects/Gis';
import Ron from './projects/Ron';
import Etl from './projects/Etl';
import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router"

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<div/>}/>
        <Route path='About' element={<About/>}/>
        <Route path='m2tw' element={<Etl/>}/>
        <Route path='ron' element={<Ron/>} />
        <Route path='arcgis' element={<Gis/>} />
      </Routes>
      
    </div>
  );
}

export default App;
