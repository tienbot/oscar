import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import YearPage from './pages/YearPage/YearPage';
import Nominations from './pages/Nominations/Nominations';
import CountryPage from './pages/Country/Country';


function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/oscar" element={<Home />} />
          <Route path="/oscar/year/:year" element={<YearPage />} />
          <Route path="/oscar/nominations/:slug" element={<Nominations />} />
          <Route path="/oscar/countries/:country" element={<CountryPage />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;