import React from 'react';
import NavBar from './NavBar';
import Home from '../pages/Home';
import About from '../pages/About';
import Projects from '../pages/Projects';
import Blog from '../pages/Blog';
import Gis from '../projects/Gis';
import Ron from '../projects/Ron';
import Etl from '../projects/Etl';
import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router"

function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='About' element={<About/>}/>
        <Route path='Projects' element={<Projects/>}/>
        <Route path='Blog' element={<Blog/>}/>
        <Route path='m2tw' element={<Etl/>}/>
        <Route path='ron' element={<Ron/>} />
        <Route path='arcgis' element={<Gis/>} />
      </Routes>
    </div>
  );
}

export default App;
