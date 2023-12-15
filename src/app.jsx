import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Productivity } from './productivity/productivity';
import { Breaktime } from './breaktime/breaktime';
import { AuthState } from './login/authState';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import './custom.scss';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
  const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
  const [authState, setAuthState] = React.useState(currentAuthState);

  return (
    <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header className='container-fluid'>
          <nav className='navbar fixed-top navbar-dark'>
            <a className="navbar-brand" href="#">
              <img src="Logo.png" height={25} />
              <span className="navbar-text">Productivity Manager</span>
            </a>
            <menu className='navbar-nav'>
              <li className='nav-item'>
                <NavLink className='nav-link' to=''>
                  Login
                </NavLink>
              </li>
              {authState === AuthState.Authenticated && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='productivity'>
                    Productivity
                  </NavLink>
                </li>
              )}
              {authState === AuthState.Authenticated && (
                <li className='nav-item'>
                  <NavLink className='nav-link' to='breaktime'>
                    Breaktime
                  </NavLink>
                </li>
              )}
            </menu>
          </nav>
        </header>

        <Routes>
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={(userName, authState) => {
                  setAuthState(authState);
                  setUserName(userName);
                }}
              />
            }
            exact
          />
          <Route path='/productivity' element={<Productivity userName={userName} />} />
          <Route path='/breaktime' element={<Breaktime />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="m-3">
          <hr />
          <div className="d-flex justify-content-between">
            <span className="text-reset">Michael Davenport</span>
            <a href="https://github.com/19mdavenport/cs260startup">GitHub</a>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;
