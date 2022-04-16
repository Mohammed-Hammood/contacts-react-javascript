import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SHOW_EDIT_MODAL, SHOW_DELETE_MODAL, UPDATE_CONTACT_ID } from '../redux/actions';
import '../styles/contact-detail.scss';
import SVG from './svg';
import { handleScrollAction, loaderHandle, convertToLocalDate } from './common';

export default function ContactDetail(props) {
    const [contact, setContact] = useState({});
    const dispatch = useDispatch();
    const {contactId} = useParams();
    const navigate = useNavigate();
    const authenticated = useSelector(state => state.authenticated.state);
    const updated = useSelector(state => state.contactUpdated);
    const hostname = props.endpoint; 
    const headers = {
        'Content-Type': 'application/json',
        'Authorization':`Token ${localStorage.getItem('token')}`
    };
    useEffect(()=> {
        document.onscroll = ()=> handleScrollAction(true);
        if(!authenticated){return navigate('/signin');}
        let url  = `${hostname}contact/${contactId}`;
        loaderHandle();
        fetch(url, {
            method:"GET",
            headers: headers,
        })
        .then(res => {
            if(res.status===200){return res.json();}
            else if(res.status===404) {return navigate('not-found')}
         })
        .then(data => {
            loaderHandle('hide');
            if(data){ setContact(data);}})
        .catch(err => console.log(err));
    }, [contactId, updated, authenticated]);
    const editContact = (contactId=null)=> {
        dispatch(UPDATE_CONTACT_ID(contactId));
        dispatch(SHOW_EDIT_MODAL());
    }
    const deleteContact = (contactId)=> {
        dispatch(UPDATE_CONTACT_ID(contactId));
        dispatch(SHOW_DELETE_MODAL());
    }

    return (<div className='contact-detail-page-container'>           
                <div className='container'>                    
                    <div className='contact'  >
                        <div className='first-group-container'>
                            <div className='name'>
                                <SVG name='user' color='black' />
                                <span>{contact.name}</span>
                            </div>
                            <div className='dropdown-menu-container'>
                                <div className='svg-container' >
                                    <SVG name='ellipsis' color='black' />
                                </div>
                                <div className='dropdown-options'>
                                    <ul className='options-list' id={`options-list-${contactId}`} >
                                        <li onClick={()=> editContact(contact.id)}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                                        <li onClick={()=> deleteContact(contact.id)}><SVG name='trash' color='black' /> <span>Delete</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>{contact.email?
                        <div className='email'>
                            <SVG name='envolope' color='black' />
                            <span>{contact.email}</span> 
                        </div>
                        :''}{contact.phone_number?
                            <div className='phone'>
                            <SVG name='phone' />
                            <span>{contact.phone_number}</span>
                        </div>
                        :''}{contact.address?
                            <div className='address'><SVG name='location-dot' color='black' /><span>{contact.address}</span> </div>
                        :''}
                        <div className='time' title=''><SVG name='clock' color='black' /><span>Added at {convertToLocalDate(contact.created)}</span> </div>
                        {contact.note?
                        <div className='notes'>{contact.note} </div>
                        :''}
                    </div>
                </div>
                <div className='scroller-container hidden' id="scroller-container" onClick={()=> handleScrollAction()} >
                    <SVG color="silver" name="angle-up" />
                </div>
            </div>)
}