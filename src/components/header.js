import { Link } from 'react-router-dom';
import '../styles/header.scss';
import SVG from './svg';
import { useDispatch, useSelector } from 'react-redux';
import { SHOW_LOGOUT_MODAL, SHOW_SEARCH_MODAL } from '../redux/actions';

export default function Header() {
    const authenticated = useSelector(state => state.authenticated.state);
    const dispatch = useDispatch();
    return (<div className="header-container"> 
       <div className='left-group'>
            <Link to='/' >
                <SVG name='home' color='white' />
            </Link>
        </div>
       <div className='right-group'>
           {(!authenticated)?
                <div className='dropdown-menu-container'>
                    <Link to='/signin' >
                        <SVG name='right-to-bracket' color='white' />
                        <span>Sign in</span>
                    </Link>
                </div>
            :<> <div className='search-container' onClick={()=> dispatch(SHOW_SEARCH_MODAL())}>
                <SVG name='search' color='white' />
            </div>
                <div className='dropdown-menu-container'>
                    <div className='svg-container' >
                        <SVG name='circle-user' color='white' />
                    </div>
                    <div className='dropdown-options shadow'>
                        <Link to='/profile' >
                            <SVG name='user' color='black' />
                            <span>Profile</span>
                        </Link>
                        <button type="butotn" onClick={()=> dispatch(SHOW_LOGOUT_MODAL())}>
                          <SVG name='right-from-bracket' color='black' />
                          <span>Log out</span>  
                        </button>
                    </div>
                </div>
            </>
            }
        </div>
    </div>)
}