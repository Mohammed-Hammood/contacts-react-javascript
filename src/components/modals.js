import {useSelector} from 'react-redux';
import SVG from './svg';
import '../styles/modals.scss';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CONTACT_UPDATED, HIDE_MODAL, LOGOUT, AUTHENTICATION_ERROR, UPDATE_CONTACTS_COUNT, UPDATE_SEARCH, SET_USER } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import { loaderHandle, setInputsValues, modalToggle, handleInputChanges} from './common';


export default function Modal(props) {
    const displayState = useSelector(state => state.modal.display);
    const typeState = useSelector(state => state.modal.type);
    const contactsCount = useSelector(state => state.count);
    const contactId = useSelector(state => state.contactId);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hostname = props.endpoint;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization':`Token ${localStorage.getItem('token')}`
    };
    useEffect(()=> {
        if(displayState){
            modalToggle();
        }
        if(!displayState){
            modalToggle('hide');
        }
        if(typeState === 'edit'){
            const url = `${hostname}contact/${contactId}`;
            const fetchContact = async ()=> {
                const res = await fetch(url, {headers:headers});
                const data = await res.json();
                setInputsValues(data);
            }
            fetchContact();
        }else if(typeState==='update-user'){
            const fetchUser = async ()=> {
                const res = await fetch( `${hostname}user`, {headers:headers});
                const data = await res.json();
                setInputsValues(data, 'user');
            }
            fetchUser();
        }
    }, [displayState, contactId, typeState, hostname]);

    const handleForm = (e)=> {
        e.preventDefault();
        if(typeState==='search'){
            const input = document.getElementById('input-contact-name');
            dispatch(UPDATE_SEARCH(input.value));
            closeModal();
            return navigate('/search');
        }else if(typeState==='edit'){
            const url = `${hostname}contact/${contactId}`;
            const name = document.getElementById('input-contact-name').value.trim();
            const data = {
                name:name,
                email:document.getElementById('input-contact-email').value.trim() ,
                phone_number:parseInt(document.getElementById('input-contact-phone').value.trim()),
                note:document.getElementById('input-contact-note').value.trim(),
                address:document.getElementById('input-contact-address').value.trim(),
            };
            if(name.length > 0){
                fetch(url, {
                    method:'PUT',
                    headers:headers,
                    body:JSON.stringify(data)
                })
                .then(res=>{
                    if(res.status===200){
                        return res.json();
                    }else if(res.status===401){
                        dispatch(AUTHENTICATION_ERROR());
                    }})
                .then(data=> {
                    closeModal();
                    if(data){
                        dispatch(CONTACT_UPDATED());
                        return navigate('/contact/'+data.id);
                    }
                })
                .catch(err=> console.log(err));
            }
        }
    }
    const deleteContact = ()=> {
        const url = `${hostname}contact/${contactId}`;
        fetch(url, {
            method:'DELETE',
            headers:headers
        })
        .then( (res) => {
                if(res.status===204){
                    dispatch(UPDATE_CONTACTS_COUNT(contactsCount - 1));
                    closeModal();
                    return navigate('/');
                }else if(res.status===401){dispatch(AUTHENTICATION_ERROR());}
        })
        .catch(err => console.log(err));
    }

    const handleInputChange = (e)=> {
        const element = e.target;
        if(element.id==='input-contact-name' && element.value.length > 100){
            element.value = element.value.slice(0, 99);
        }
        else if(element.id==='input-contact-email' && element.value.length > 100){
            element.value = element.value.slice(0, 99);
        }
        else if(element.id==='input-contact-phone' && element.value.length > 20){
            element.value = element.value.slice(0, 19);
        }
        else if(element.id==='input-contact-address' && element.value.length > 200){
            element.value = element.value.slice(0, 199);
        }
        else if(element.id==='input-contact-note' && element.value.length > 500){
            element.value = element.value.slice(0, 499);
        }
        
    }
    const closeModal = ()=> {
        dispatch(HIDE_MODAL());
        if(typeState==='search'){
            document.getElementById('input-contact-name').value = '';
        }else if(typeState==='delete' || typeState ==='update-user'){}
        else {
            document.getElementById('input-contact-name').value = '';
            document.getElementById('input-contact-email').value  = '';
            document.getElementById('input-contact-phone').value = '';
            document.getElementById('input-contact-note').value = '';
            document.getElementById('input-contact-address').value = '';
        }
    }
    const deleteUser = ()=> {
        const url = `${hostname}user`;
        loaderHandle();
        fetch(url, {
            method:'DELETE',
            headers:headers
        })
        .then(res => res.json())
        .then((data) => {
            loaderHandle('hide');
            if(data.status===200){
                dispatch(LOGOUT());
            }else {
                dispatch(AUTHENTICATION_ERROR());
            }
            dispatch(HIDE_MODAL());
        })
        .catch(err => console.log(err));
    }
    const addNewContact = ()=> {
        const name = document.getElementById('input-contact-name');
        const email = document.getElementById('input-contact-email');
        const phone = document.getElementById('input-contact-phone');
        const note = document.getElementById('input-contact-note');
        const address = document.getElementById('input-contact-address');
        if(name.value.trim().length > 0){
            const url = `${hostname}contact-create`;
            const data = {
                name:name.value.trim(),
                email:email.value.trim(),
                phone_number:parseInt(phone.value.trim()),
                note:note.value.trim(),
                address:address.value.trim()
            };
             if(name.value.trim().length > 0){
                 loaderHandle();
                 fetch(url, {
                     method:"POST",
                     headers: headers,
                     body:JSON.stringify(data)
                    })
                    .then(res => {
                        loaderHandle('hide');
                        if(res.status===401){
                            dispatch(AUTHENTICATION_ERROR());
                        }else if(res.status===200){return res.json();}
                    })
                    .then(data => {
                        closeModal();
                        if(data.id){
                            return navigate('/contact/' + data.id);}   
                    })
                    .catch(err => console.log(err));
                }
        }
    }
    const handleSubmit = (e)=> {
        e.preventDefault();
        const url = `${hostname}user`;
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const email = document.getElementById('email').value.trim();
            if(firstname.length > 0 && firstname.length < 26 && lastname.length > 0 && lastname.length < 25 && email.length > 5 && email.length < 250){
                const data = { email:email, first_name:firstname, last_name:lastname,};
                fetch(url, {
                    method:'PUT',
                    headers:headers,
                    body:JSON.stringify(data)
                })
                .then(res=>{
                    if(res.status===200){
                        return res.json();
                    }else if(res.status===401){
                        dispatch(AUTHENTICATION_ERROR());
                    }
                })
                .then(data=> {
                    if(data['message']){
                        setMessage(data['message']);
                    }else if(data.id){
                        closeModal();
                        dispatch(SET_USER(data));
                    }
                })
                .catch(err=> console.log(err));
            }
    }
    const handleLogout = ()=> {
        dispatch(LOGOUT());
        dispatch(HIDE_MODAL());
        const url = `${hostname}logout`;
        fetch(url, {
            method:'POST',
            headers:headers,
        })
        .then(res=>res.json())
        .then(data=> {
            if(data['message']){setMessage(data['message']);}
        })
        .catch(err=> console.log(err));
    }
    return (<div className='modal-page-container'>
           <div className='modal-container hidden' id='modal-container'> 
                <div className='content-container'>
                    {(typeState === 'logout')?<>
                            <div className='modal-header-container'>
                                <div className='title'>Logout</div>
                                <div onClick={()=> closeModal() }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            <div className='body-container'>    
                                <div className='text-container'>
                                    <p>Do you want to log out?</p>
                                </div>
                                <div className='buttons-container'>
                                    <button type='button' onClick={()=>{handleLogout()}}><span>Logout</span></button>
                                    <button type='button' onClick={()=> {dispatch(HIDE_MODAL()) }}><span>Close</span></button>
                                </div>
                            </div>
                    </>:''}
                    {(typeState === 'edit')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='pen-to-square' color='black' /><span> Edit</span></div>
                                <div onClick={()=> closeModal() }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            
                            <div className='body-container'>    
                                   <form onSubmit={(e)=> handleForm(e)}>
                                       <div className='name'> 
                                            <label htmlFor='input-contact-name'>Contact name: <span className='red'>*</span> </label>
                                            <input type='text' maxLength='100' required id='input-contact-name' placeholder='Contact name...' onChange={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='email'>
                                            <label htmlFor='input-contact-email'>Email: </label>
                                            <input type='text' maxLength="100" id='input-contact-email' placeholder='Email...' onInput={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='phone'>
                                            <label htmlFor='input-contact-phone'>Phone: </label>
                                            <input type='number' maxLength="20" id='input-contact-phone' placeholder='Phone...' onInput={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='address'>
                                            <label htmlFor='input-contact-address'>Address: </label>
                                            <input type='text' maxLength="200" id='input-contact-address' placeholder='address...' onInput={(e)=> handleInputChange(e)} />
                                        </div>
                                       <div className='note'>
                                            <label htmlFor='input-contact-note'>Note: </label>
                                            <textarea type='text' maxLength="500" id='input-contact-note' placeholder='Note...' onInput={(e)=> handleInputChange(e)} />
                                        </div>
                                        <div className='buttons-container'>
                                            <button type='submit'><span>Save contact</span></button>
                                            <button type='button' onClick={()=> closeModal()}><span>Close</span></button>
                                        </div>
                                   </form>
                            </div>
                    </>:''}
                    {(typeState === 'search')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='search' color='black' /><span> Search</span></div>
                                <div onClick={()=> closeModal() }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            <div className='body-container'>    
                                   <form onSubmit={(e)=> handleForm(e)}>
                                       <div className='inputs-container ' id='name-container'> 
                                            <label htmlFor='input-contact-name'> </label>
                                            <input name='inputs-fields' required className='inputs' maxLength='200' type='text' id='input-contact-name' placeholder='Search...' onChange={(e)=> handleInputChange(e)}/>
                                        </div>
                                        <div className='buttons-container'>
                                            <button type='submit'><span>Search</span></button>
                                            <button type='button' onClick={()=> closeModal()}><span>Close</span></button>
                                        </div> 
                                   </form>
                            </div>
                    </>:''}
                    {(typeState === 'add')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='plus' color='green' /><span> Add new contact</span></div>
                                <div onClick={()=> closeModal() }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            <div className='body-container'>    
                               
                                   <form onSubmit={(e)=> handleForm(e)}>
                                       <div className='name'>
                                            <label htmlFor='input-contact-name'>Contact name: <span className='red'>*</span></label>
                                            <input type='text' required id='input-contact-name' placeholder='Contact name...' onChange={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='email'>
                                            <label htmlFor='input-contact-email'>Email: </label>
                                            <input type='text' id='input-contact-email' placeholder='Email...' onInput={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='phone'>
                                            <label htmlFor='input-contact-phone'>Phone: </label>
                                            <input type='number' id='input-contact-phone' placeholder='Phone...'   onInput={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='address'>
                                            <label htmlFor='input-contact-address'>Address: </label>
                                            <input type='text' id='input-contact-address' placeholder='address...'   onInput={(e)=> handleInputChange(e)}/>
                                        </div>
                                       <div className='note'>
                                            <label htmlFor='input-contact-note'>Note: </label>
                                            <textarea type='text' id='input-contact-note' placeholder='Note...' onInput={(e)=> handleInputChange(e)} />
                                        </div>
                                        <div className='buttons-container'>
                                            <button type='submit' onClick={()=> addNewContact()}><span>Save contact</span></button>
                                            <button type='button' onClick={()=> {closeModal()}}><span>Close</span></button>
                                        </div>
                                   </form>
                        
                            </div>
                    </>:''}
                    {(typeState === 'delete')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='trash' color='red' /> <span className='red'>Delete</span></div>
                                <div onClick={()=> dispatch(HIDE_MODAL()) }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            <div className='body-container'>    
                                <div className='text-container'>
                                    <p>Do you want to delete this contact?</p>
                                </div>
                                <div className='buttons-container'>
                                    <button type='button' className='delete-btn' onClick={()=>deleteContact()}><span>Confirm</span></button>
                                    <button type='button' onClick={()=> {dispatch(HIDE_MODAL()) }}><span>Close</span></button>
                                </div>
                            </div>
                    </>:''}
                    {(typeState === 'delete-user')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='trash' color='red' /> <span className='red'>Warning</span></div>
                                <div onClick={()=> dispatch(HIDE_MODAL()) }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>
                            <div className='body-container'>    
                                <div className='text-container'>
                                    <p>Do you want to delete your account?</p>
                                </div>
                                <div className='buttons-container'>
                                    <button type='button' className='delete-btn' onClick={()=>deleteUser()}><span>Confirm</span></button>
                                    <button type='button' onClick={()=> {dispatch(HIDE_MODAL()) }}><span>Close</span></button>
                                </div>
                            </div>
                    </>:''}
                    {(typeState === 'update-user')?<>
                            <div className='modal-header-container'>
                                <div className='title'><SVG name='pen-to-square' color='red' /> <span className='red'>Edit</span></div>
                                <div onClick={()=> dispatch(HIDE_MODAL()) }>
                                    <span className='close'  title='Закрыть окно'>&times;</span>
                                </div>
                            </div>{message?
                            <div className='messages-container'>
                                {message}
                            </div>
                            :""}
                            <div className='body-container'>    
                                <div className="form-container ">
                                    <form onSubmit={(e)=> handleSubmit(e)}>
                                                {/* <div className='user-inputs-container'>
                                                    <label htmlFor='username'>Username <span className="red">*</span></label>
                                                    <input type='text' maxLength="50" required placeholder='Username' id='username' onInput={(e)=> handleInputChanges(e)} />
                                                </div> */}
                                    
                                                <div className='user-inputs-container'>
                                                    <label htmlFor='firstname'>First name <span className="red">*</span></label>
                                                    <input type='text' maxLength="25" required placeholder='First name' id='firstname' onInput={(e)=> handleInputChanges(e)} />
                                                </div>
                                                <div className='user-inputs-container'>
                                                    <label htmlFor='lastname'>Last name <span className="red">*</span></label>
                                                    <input type='text' maxLength="25" required placeholder='Last name' id='lastname' onInput={(e)=> handleInputChanges(e)} />
                                                </div>
                                                <div className='user-inputs-container'>
                                                    <label htmlFor='email'>Email <span className="red">*</span></label>
                                                    <input type='email' maxLength="250" required placeholder='Email' id='email' onInput={(e)=> {handleInputChanges(e);setMessage(null)}} />
                                                </div>
                                                {/* <div className='user-inputs-container'>
                                                    <label htmlFor='password'>Password <span className="red">*</span></label>
                                                    <input type='text' minLength="8" maxLength="30" required placeholder='Password' id='password' onInput={(e)=> handleInputChanges(e)} />
                                                </div> */}
                                      
                                        <div className="buttons-container">
                                            <button type="submit">
                                               Save
                                            </button>
                                            <button type="button" onClick={()=> closeModal()}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                          
                            </div>
                    </>:''}
                </div>
        </div>
    </div>)
}