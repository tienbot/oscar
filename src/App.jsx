import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
// import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import YearPage from './pages/YearPage/YearPage';
import Nominations from './pages/Nominations/Nominations';
import Country from './pages/Country/Country';
import Film from './pages/Film/Film';



function App() {
  return (
    <Router basename="/oscar">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/year/:year" element={<YearPage />} />
          <Route path="/nominations/:slug" element={<Nominations />} />
          <Route path="/countries/:country" element={<Country />} />
          <Route path="/film/:kinopoiskId" element={<Film />} />
        </Routes>
      </main>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;