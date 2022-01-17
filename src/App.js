import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/profile' element={<SignIn />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  );
}

export default App;
