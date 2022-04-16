import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SET_USER, UPDATE_USER, DELETE_USER, AUTHENTICATION_ERROR } from '../redux/actions';
import '../styles/profile-page.scss';
import { loaderHandle } from './common';
import SVG from './svg';

export default function ProfilePage(props) {
    const authenticated = useSelector(state => state.authenticated.state);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const hostname = props.endpoint;
    useEffect(() => {
        if(authenticated){
            const url = `${hostname}user`;
            loaderHandle();
            fetch(url, {
                method:"GET",
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                },
            })
            .then(res => {
                if(res.status === 200){
                    return res.json();
                }else if(res.status === 401){dispatch(AUTHENTICATION_ERROR());}
            })
            .then(data => {
                loaderHandle('hide');
                if(data){dispatch(SET_USER(data));}  
                else {return navigate('/signin');}
                })
            .catch(err => console.log(err));
        }else{return navigate("/signin");}
    }, [authenticated, hostname]);
    return (<div className='profile-page-container'> 
           
                <div className='container'>                    
                    <div className='image-container'>
                        <SVG name='user' color='black' />
                        <div className='dropdown-menu-container'>
                            <div className='svg-container' >
                                <SVG name='ellipsis' color='black' />
                            </div>
                            <div className='dropdown-options'>
                                <ul className='options-list' id={`options-list`} >
                                    <li onClick={()=> {dispatch(UPDATE_USER())}}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                                    <li onClick={()=> {dispatch(DELETE_USER())}}><SVG name='trash' color='black' /> <span>Delete</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='card' id={user.id}  >
                        <div className='first-group-container'>
                            <div className='name'>
                                <SVG name='user' color='black' />
                                <span>{user.first_name} {user.last_name}</span><span className='username'>({user.username})</span>
                            </div>
                        </div>{(user.email)?
                        <div className='email'>
                            <SVG name='envolope' color='black' />
                            <span>{user.email}</span> 
                        </div>
                        :""}
                    </div>
                </div>
         
    
    </div>)
}