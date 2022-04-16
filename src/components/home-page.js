import { useEffect, useState, useRef } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/home-page.scss';
import SVG from './svg';
import { handleScrollAction, loaderHandle } from './common';
import {UPDATE_SORT, SHOW_EDIT_MODAL, SHOW_DELETE_MODAL, SHOW_ADD_MODAL, UPDATE_CONTACTS,
     UPDATE_CONTACT_ID, UPDATE_CONTACTS_COUNT, AUTHENTICATION_ERROR } from '../redux/actions';

export default function HomePage(props) {
    const hostname = props.endpoint;
    const contacts = useSelector(state => state.contacts);
    const sort = useSelector(state => state.sort);
    const [page, setPage] = useState(1);
    const limit = 10; //do not change this at all.
    const previousPage = useRef(document.location.pathname);
    const authenticated = useSelector(state => state.authenticated.state);
    const contactsCount = useSelector(state => state.count); 
    const dispatch = useDispatch();
    const query = useSelector(state=> state.search.query);
    const pathname = window.location.pathname;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization':`Token ${localStorage.getItem('token')}`
    };
    useEffect(()=> {
        if(previousPage.current !== document.location.pathname){
            setPage(1);
            previousPage.current = document.location.pathname;
        }
        document.onscroll = ()=> handleScrollAction(true);
        let url = null;
        if(pathname.includes('search')){
            url = `${hostname}contacts/?q=${query}&order=${sort}&page=${page}&limit=${limit}`;
        }else{
            url = `${hostname}contacts/?format=json&order=${sort}&page=${page}&limit=${limit}`;
        }
        if((query !== undefined && pathname.includes('search')) || (!pathname.includes('search') && authenticated)){
            loaderHandle();
        }
        if(authenticated){
            fetch(url, {
                method:"GET",
                headers:headers
            })
            .then(res => {
                if(res.status===200){
                    return res.json();
                }else if(res.status===401){
                    dispatch(AUTHENTICATION_ERROR());
                }else{
                }
            })
            .then(data => {
                loaderHandle('hide'); 
                if(data.results){
                    dispatch(UPDATE_CONTACTS(data.results));
                    dispatch(UPDATE_CONTACTS_COUNT(data.count));
                }
            }) 
            .catch(err => console.log(err));
        }
    }, [sort, page, contactsCount, pathname, limit, query, authenticated, hostname]);
    const editContact = (contactId=null)=> {
        dispatch(UPDATE_CONTACT_ID(contactId));
        dispatch(SHOW_EDIT_MODAL());
    }
    const deleteContact = (contactId)=> {
        dispatch(UPDATE_CONTACT_ID(contactId));
        dispatch(SHOW_DELETE_MODAL());
    }
    return (<div className='home-page-container'> 
            {(authenticated)?<>
                <div className='container'>                    
                    <div className='panel-container'>
                        <div>{(contactsCount <= limit)?`Contacts: ${contactsCount}`
                            :<span>{(page===1)?1:limit * (page - 1) + 1} - {(page===1)?contacts.length:(limit*(page - 1) + contacts.length ) } of {contactsCount}</span>}
                        </div>{(contacts.length>1)?
                        <div>
                            <span>Sort</span>{(sort==='asc')?
                            <><span title="Oldest" onClick={()=> dispatch(UPDATE_SORT())}> <SVG name='angle-up' color='black' /></span></>
                            :<><span title="Newest" onClick={()=> dispatch(UPDATE_SORT())}> <SVG name='angle-down' color='black' /></span>
                            </>}
                        </div>
                        :''}
                        <div><button type='button'  onClick={()=> dispatch(SHOW_ADD_MODAL())}><span>Add contact</span></button></div>
                    </div>
                    <div className='contacts-list-container'>
                        {(contacts.length > 0 ) && contacts.map((item, index) => {return (<div className='contact' id={item.id} key={index}>
                            <div className='first-group-container'>
                                <div className='name'>
                                    <SVG name='user' color='black' />
                                    <span>{item.name} </span>
                                </div>
                                <div className='dropdown-menu-container'>
                                    <div className='svg-container' >
                                        <SVG name='ellipsis' color='black' />
                                    </div>
                                    <div className='dropdown-options'>
                                        <ul className='options-list' id={`options-list-${index}`} >
                                            <li onClick={()=> editContact(item.id)}><SVG name='pen-to-square' color='black' /> <span>Edit</span></li>
                                            <li onClick={()=> deleteContact(item.id)}><SVG name='trash' color='black' /> <span>Delete</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>{item.email?
                            <div className='email'>
                                <SVG name='envolope' color='black' />
                                <span>{item.email}</span> 
                            </div>
                            :''}{item.phone_number?
                                <div className='phone'>
                                <SVG name='phone' />
                                <span>{item.phone_number}</span>
                            </div>
                            :''}
                            <div className='detail'><Link to={'/contact/'+item.id}>View details</Link> </div>
                        </div>)})}
                    </div>{(contactsCount > limit )?
                    <div className='paggination-container'> 
                        <div className={(page===1)?'disabled':'paggination-btn'} title="First page" onClick={()=>  setPage(1)}><SVG name='angles-left' color='black' /></div>
                        <div className={(page===1)?'disabled':'paggination-btn'} onClick={()=>  {(page <= 1)?setPage(1):setPage(page=>page -1)}}><SVG name='angle-left' color='black' /></div>
                        <div className={'paggination-current-page'}>{page} of {Math.ceil(contactsCount/limit)}</div>
                        <div className={(contacts.length < limit || (contactsCount/limit === page && contactsCount%limit ===0))?'disabled':'paggination-btn'} 
                        onClick={()=>  {(contacts.length < limit || (contactsCount/limit === page && contactsCount%limit ===0))?setPage(page):setPage(page=>page + 1)}}><SVG name='angle-right' color='black' /></div>
                        <div className={(page=== Math.ceil(contactsCount/limit) )?'disabled':'paggination-btn'} title="Last page" onClick={()=>  setPage(Math.ceil(contactsCount/limit))}><SVG name='angles-right' color='black' /></div>
                    </div>
                    :''}
                </div>
                <div className='scroller-container hidden' id="scroller-container" onClick={()=> handleScrollAction()} >
                    <SVG color="silver" name="angle-up" />
                </div>
            </>
            :<div className='warning-container'>
                <div className='required-login'>
                    Login to view contacts list.  
                </div>
                <div>
                    <Link to='/signin'>Log in</Link>
                </div>
            </div>}
    </div>)
}