import {combineReducers } from 'redux';
const tokenInLocalStorage = 'token';
 
const initialAuthenticationState = ()=> {
    if(localStorage.getItem(tokenInLocalStorage)){
        return  {
            token:localStorage.getItem(tokenInLocalStorage),
            state:true
        };
    } 
    return { 
        state:false,
        token:null
    };
}

const authenticationReducer = (state = initialAuthenticationState(), action)=> {
    switch(action.type){
        case 'signin':
            localStorage.setItem(tokenInLocalStorage, action.payload['token']);
            return {
                state:true,
                token:action.payload['token']
            };
        case "authentication/error":
            localStorage.removeItem(tokenInLocalStorage);
            return {
                state:false,
                token:null,
            };
        case "logout":
            localStorage.removeItem(tokenInLocalStorage);
            return {
                state:false,
                token:null,
            };
        default:
            return state;
    }
}
const initialState = {
    display:false,
    type:'login'
}
export const modalReducer = (state = initialState, action)=>{
    switch(action.type){
        case 'display/hide':
            return {
               ...state,
                display:false
            }
        case 'type/logout':
            return {
               ...state,
                type:'logout',
                display:true
            };
        case 'type/edit':
            return {
                ...state,
                display:true,
                type:'edit'
            };
        case 'type/delete':
            return {
                ...state,
                display:true,
                type:'delete'
            };
    
        case 'type/search':
            return {
                ...state,
                display:true,
                type:'search'
            };
        case 'type/add':
            return {
                ...state,
                display:true,
                type:'add'
            };
        case 'type/user-delete':
            return {
                ...state,
                display:true,
                type:'delete-user'
            };

        case 'type/user-update':
            return {
                ...state,
                display:true,
                type:'update-user'
            };
        default:
            return state;
    }
}
export const contactsReducer = (state = [], action)=> {
    switch(action.type){
        case 'contacts/update':
            return action.payload;
        default:
            return state;
    }
}
export const contactIdReducer = (state = 0, action)=> {
    switch(action.type){
        case 'contactId/update':
            return action.contactId;
        default:
            return state;
    }
}
export const sortReducer = (state = 'asc', action)=> {
    switch(action.type){
        case 'sort/update':
            return ((state==='asc')?'des':'asc');
        default:
            return state;
    }
}
export const CountReducer = (state = 0, action)=> {
    switch(action.type){
        case 'count/update':
            return action.count;
        default:
            return state;
    }
}
export const searchReducer = (state = "", action)=> {
    switch(action.type){
        case 'search/update-query':
            return {
                query:action.query
            };
        default:
            return state
    }
}

export const contactUpdatedReducer = (state = false, action)=> {
    switch(action.type){
        case 'contact-update/update':
            return !state;
        default:
            return state;
    }
}

export const setUserReducer = (state = {}, action)=> {
    switch(action.type){
        case 'set-user/update':
            return action.data;
        default:
            return state;
    }
}

const Reducers = combineReducers({
    authenticated:authenticationReducer,
    user:setUserReducer,
    modal:modalReducer,
    contactId:contactIdReducer,
    contacts:contactsReducer,
    count:CountReducer,
    sort:sortReducer,
    search:searchReducer,
    contactUpdated:contactUpdatedReducer
});
export default Reducers;