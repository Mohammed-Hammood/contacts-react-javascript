import { useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

 
export default function NotFoundPage() {
    const navigate = useNavigate();
    const authenticated = useSelector(state => state.authenticated.state);
    useEffect(()=> {
        if(!authenticated){
          return navigate('/signin');
        }
    }, [authenticated]);
    return (<div className='not-found-page-container'> 
            <div className='warning-container'>
                <div className='required-login'>
                   The Page not found
                </div>
            </div>
    </div>)
}