import './App.css';
import Alert from './components/Alert';
import About from './components/About';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';


function App() {
  const [Mode, setMode] = useState('light'); // whether dark mode is enabled or not
  const [alert, setAlert] = useState(null);

const showAlert = (message, type) => {
  setAlert({
    msg: message,
    type: type
  });
  setTimeout(() => setAlert(null), 1500);
};

  const toggleMode = () => {
    if (Mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
      showAlert('Dark mode enabled', 'success');
    //  document.title = 'Text Analysis - Dark Mode';
      // setInterval(() => {
      //  document.title = 'Text Analysis is doing great!';
      // }, 2000);
      // setInterval(() => {
      //  document.title = 'Install Text Analysis App';
      //  }, 1500);
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
      showAlert('Light mode enabled', 'success');
    //  document.title = 'Text Analysis - Light Mode';
    }
  }
  return (
    <>
    {/* <Navbar /> Uncomment to test defaultProps */}
    <Router>
     <Navbar title="Text Analysis" aboutText="About Us" mode={Mode} toggleMode={toggleMode}/>
      <Alert alert={alert} />
      <div className="container my-3">
        <switch>     
          {/* /users --> Component 1
              /users/home --> Component 2 */}
           <Routes>
          <Route exact path="/about" element={<About mode={Mode} />} />
          <Route exact path="/" element={<TextForm showAlert={showAlert} heading="Try Text Analysis - Word counter, Character counter, Remove extra spaces" mode={Mode} />} />
        </Routes>
      </switch>
      </div>
    </Router>
    </>
  );
}

export default App;
