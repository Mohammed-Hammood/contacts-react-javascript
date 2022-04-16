import {useSelector} from 'react-redux';
import { Route, Routes} from 'react-router-dom';
import { useEffect } from 'react';
import { updateMode } from './components/common';
import './styles/main.scss';
import Modal from './components/modals';
import Header from './components/header';
import HomePage from './components/home-page';
import ProfilePage from './components/profile-page';
import ContactPage from './components/contact-page';
import AuthenticationPage from './components/authentication-page';
import NotFoundPage from './components/not-found-page';

function App() {
  const authenticated = useSelector(state => state.authenticated.state);
  useEffect(()=> {
    if(localStorage.getItem('darkMode')!== null && ['light', 'dark'].includes(localStorage.getItem('darkMode'))){
        updateMode(localStorage.getItem('darkMode'));
        }
  }, []);
  //for development
  // const endpoint = "http://127.0.0.1:8000/api/";
  //for production
  const endpoint = "https://apifrontend.pythonanywhere.com/api/";
  return (<>
      <div className="main-content-container" id='main-content-container'>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage endpoint={endpoint} />} />
          <Route path='/signin' element={<AuthenticationPage endpoint={endpoint} />} />
          <Route path='/profile' element={<ProfilePage endpoint={endpoint} />} />
          <Route path='/search' element={<HomePage endpoint={endpoint} />} />
          <Route path='/contact/:contactId' element={<ContactPage endpoint={endpoint} />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
      {(authenticated)?<Modal endpoint={endpoint} />:''}
      <div className='loader-container hidden' id='loader-container'><div></div></div>
      <div onClick={()=> updateMode()} className='darkMode-container' title='Toggle between light/dark mode'><span className='light'></span></div>
      </>
  );
}

export default App;