import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SIGIN } from "../redux/actions";
import {useNavigate } from 'react-router-dom';
import '../styles/authentication-page.scss';
import { clearInputs, handleInputChanges} from './common';

export default function AuthenticationPage(props) {
    const [active, setActive] = useState('signin');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authenticated = useSelector(state => state.authenticated.state);
    const hostname = props.endpoint; 
    useEffect(()=> {
        if(authenticated){return navigate('/');}
    }, [authenticated]);
    const handleSubmit = (event)=> {
        event.preventDefault();
        const username = event.target[0].value.trim();
        if(active==='signup'){
            const firstname = event.target[1].value.trim();
            const lastname = event.target[2].value.trim();
            const email = event.target[3].value.trim();
            const password = event.target[4].value.trim();
            const data = {username:username, password:password, email:email, last_name:lastname, first_name:firstname};
            if(username.length > 2 && password.length > 8 && email.length > 0 && firstname.length > 0 && lastname.length > 0 ){
                const url = `${hostname}signup`;
                fetch(url, {
                        method:"POST",
                        headers:{'Content-Type': 'application/json'},
                        body:JSON.stringify(data)
                    })
                .then(res => {return res.json();})
                .then(data => {
                    if(data.token){dispatch(SIGIN(data));
                    return navigate('/profile');}
                    else if(data.message){setMessage(data.message);}
                })
                .catch(err => console.log(err));
            }
        }
        else{
            const url = `${hostname}signin`;
            const username = event.target[0].value.trim();
            const password = event.target[1].value.trim();
            const data = {username:username, password:password};
            fetch(url, {
                method:"POST",
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify(data)
                })
            .then(res => res.json())
            .then(data => {
                if(data.token){dispatch(SIGIN(data));
                }else if(data.message){setMessage(data.message);}
            })
            .catch(err => console.log(err));
        }
    }
 
    return (<div className="authentication-page-container">
        <div className="form-container ">
            <div className="header">
                <div className={(active==='signin')?"active":""} onClick={()=> {setActive('signin');setMessage(null);}}><span>Sign in</span></div>
                <div className={(active==='signup')?"active":""} onClick={()=> {setActive('signup');setMessage(null);}}><span>Sign up</span></div>
            </div>
            <form onSubmit={(e)=> handleSubmit(e)}>
                <div className={(active==='signin')?"inputs-container r-b-r ":"inputs-container l-b-r"} id='inputs-container'>
                        <div className='messages-container'>
                            {(message)?message:""}
                        </div>
                        <div>
                            <label htmlFor='username'>Username <span className="red">*</span></label>
                            <input type='text' maxLength="50" required placeholder='Username' id='username' onInput={(e)=> {handleInputChanges(e); setMessage(null)}} />
                        </div>
                    {(active==='signup')?<>
                        <div>
                            <label htmlFor='firstname'>First name <span className="red">*</span></label>
                            <input type='text' maxLength="25" required placeholder='First name' id='firstname' onInput={(e)=> handleInputChanges(e)} />
                        </div>
                        <div>
                            <label htmlFor='lastname'>Last name <span className="red">*</span></label>
                            <input type='text' maxLength="25" required placeholder='Last name' id='lastname' onInput={(e)=> handleInputChanges(e)} />
                        </div>
                        <div>
                            <label htmlFor='email'>Email <span className="red">*</span></label>
                            <input type='email' maxLength="250" required placeholder='Email' id='email' onInput={(e)=> {handleInputChanges(e);setMessage(null)}} />
                        </div>
                    </>:''}
                        <div>
                            <label htmlFor='password'>Password <span className="red">*</span></label>
                            <input type='text' minLength="8" maxLength="30" required placeholder='Password' id='password' 
                            onInput={(e)=>{handleInputChanges(e); setMessage(null)}} />
                        </div>
                        {active==='signin'?
                        <div>
                            <p className="black">Don't have an account? <span onClick={()=> {setActive('signup');setMessage(null);}}>Sign Up</span></p>
                        </div>
                        : <div>
                            <p className="black">Already have an account? <span onClick={()=> {setActive('signin');setMessage(null);}}>Sign in</span></p>
                        </div>}
                </div>
                <div className="buttons-container">
                    <button type="submit">
                        {active==='signin'?"Sign in":"Sign up"}
                    </button>
                    <button type="button" onClick={()=> {clearInputs();setMessage(null);}}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>)
}