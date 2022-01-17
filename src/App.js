import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Explore from './pages/Explore';
import Offers from './pages/Offers';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
