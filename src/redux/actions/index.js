export const SIGIN = (data=null)=> {
    return {
        type:'signin',
        payload:data,
    };
}
export const LOGOUT =()=> {
    return {
        type:'logout'
    };
}
export const AUTHENTICATION_ERROR =()=> {
    return {
        type:'authentication/error'
    };
}
export const HIDE_MODAL = ()=> {
    return {
        type:'display/hide'
    };
}
export const SHOW_LOGOUT_MODAL = ()=> {
    return {
        type:'type/logout'
    };
}
export const SHOW_EDIT_MODAL = ()=> {
    return {
        type:'type/edit'
    };
}
export const SHOW_DELETE_MODAL = ()=> {
    return {
        type:'type/delete'
    };
}
export const SHOW_SEARCH_MODAL = ()=> {
    return {
        type:'type/search'
    };
}
export const SHOW_ADD_MODAL = ()=> {
    return {
        type:'type/add'
    };
}
export const UPDATE_CONTACTS = (contacts)=> {
    return {
        type:'contacts/update',
        payload:contacts
    }
}
export const UPDATE_CONTACT_ID = (contactId)=> {
    return {
        type:'contactId/update',
        contactId:contactId,
    }
}
export const UPDATE_CONTACTS_COUNT = (count=null)=>{
    return {
        type:'count/update',
        count:count
    }
}

export const UPDATE_SORT = ()=>{
    return {
        type:'sort/update',
    }
}
export const UPDATE_SEARCH = (query)=> {
    return {
        type:'search/update-query',
        query:query
    }
}
export const CONTACT_UPDATED = ()=> {
    return {
        type:'contact-update/update',
    }
}
export const SET_USER = (user_data)=> {
    return {
        type:'set-user/update',
        data:user_data
    }
}
export const DELETE_USER = ()=> {
    return {
        type:'type/user-delete',
    }
}

export const UPDATE_USER = ()=> {
    return {
        type:'type/user-update',
    }
}