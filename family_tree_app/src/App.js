
import './App.css';

import Login from './components/Login';
import FrontPage from './components/FrontPage';
import Register from './components/Register';
import AddFamily from './components/AddFamily';
import HomePage from './components/HomePage';
import SettingPage from './models/SettingPage';
import AddChild from './models/AddChild';
import ParentsNode from './models/ParentsNode';
import FamilyTree from './models/FamiltTree';
import QuickFamilyTree from './models/QuickFamilyTree';
import EditForm from './models/EditForm';
import {

  Route,
  Routes
} from "react-router-dom";

// element={isLoggedIn ==true ? <UserDetails/> : <Login/>}

function App() {
  const  isLoggedIn = window.localStorage.getItem("loggedIn");
  return (
    <div>
      <Routes>
      <Route  path="/" element={<FrontPage/>}/>
      <Route  path="/addFamily" element={<AddFamily/>}/>
      <Route  path="/login" element={<Login/>}/>
      <Route  path="/homePage" element={<HomePage/>}/>
        <Route path="/register" element={< Register/>}/>
      </Routes>
     
     
      
    
   
   

    </div>
  );
}

export default App;
