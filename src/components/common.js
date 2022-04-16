export const updateMode = (action=null)=>{
    const container = document.querySelector(".darkMode-container");
    const button = container.querySelector("span");
    const body = document.querySelector("body");
    if(body.className === 'light'){           
      body.classList.add("dark");
      body.classList.remove("light");
      button.classList.remove("dark");
      button.classList.add("light");
      localStorage.setItem("darkMode", "dark");

  }else {
      body.classList.add("light");
      body.classList.remove("dark");
      button.classList.remove("light");
      button.classList.add("dark");
      localStorage.setItem("darkMode", "light");
  }
  if(action){
    body.classList.remove("light" && "dark");
    body.classList.add(action);
    button.classList.remove("light" && "dark");
    button.classList.add((action==='light')?"dark":"light");
    localStorage.setItem("darkMode", action);
  }
}
export const loaderHandle = (action=null)=> {
    const loader = document.getElementById('loader-container');
    if(loader.className.includes('hidden')){
        loader.classList.add('show-f');
        loader.classList.remove('hidden');
    }else{
        loader.classList.add('hidden');
        loader.classList.remove('show-f');
    }
    if(action === 'hide'){
        loader.classList.add('hidden');
        loader.classList.remove('show-f');
    }
}
export const handleScrollAction = (firstLoad=null)=> {
    if(firstLoad){
        const scroller = document.querySelector("#scroller-container");
        if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
            scroller.classList.add("show-f");
            scroller.classList.remove("hidden");
        }else{
            scroller.classList.add("hidden");
            scroller.classList.remove("show-f");
        }

    }else{
        if(document.body.scrollTop > 30 || document.documentElement.scrollTop > 30){
            document.body.scrollTop = 0; //for safari
            document.documentElement.scrollTop = 0; //for IE, Firefox, chrome, Opera, 
        }
    }
}
export const clearInputs = ()=> {
  const container = document.getElementById('inputs-container');
  const inputs = container.querySelectorAll('input');
  for(let i = 0; i < inputs.length; i++){
      inputs[i].value = '';
  }
}
export const handleInputChanges = (event, setMessage=null)=> {
  const input = event.target;
  if(input.id === 'username' && input.value.length > 50){
          input.value = input.value.slice(0, 49);
  }else if(input.id === 'password' && input.value.length > 0){
      input.type = 'password';
      if(input.value.length > 30){
          input.value = input.value.slice(0, 29);
      }
  }else if(input.id === 'firstname' && input.value.length > 25){
      input.value = input.value.slice(0, 24);
  }else if(input.id === 'lastname' && input.value.length > 25){
      input.value = input.value.slice(0, 24);
  }else if(input.id === 'email' && input.value.length > 80){
      input.value = input.value.slice(0, 79);
  }
 
}
export const setInputsValues = (data, type=null)=> {
    if(type==='user'){
        // document.getElementById('username').value = data.username;
        // document.getElementById('password').value  = data.password;
        document.getElementById('firstname').value = data.first_name;
        document.getElementById('lastname').value = data.last_name;
        document.getElementById('email').value = data.email;
    }else {
        document.getElementById('input-contact-name').value = data.name;
        document.getElementById('input-contact-email').value  = data.email;
        document.getElementById('input-contact-phone').value = data.phone_number;
        document.getElementById('input-contact-note').value = data.note;
        document.getElementById('input-contact-address').value = data.address;
    }
}
export const modalToggle = (action=null)=> {
    const modal = document.getElementById("modal-container");
    if(modal.className.includes('show-b')){
        modal.classList.remove('show-b');
        modal.classList.add('hidden');
    }else{modal.classList.add('show-b');
        modal.classList.remove('hidden');
    }
    if(action === 'hide'){
        modal.classList.remove('show-b');
        modal.classList.add('hidden');
    }
}
export const convertToLocalDate = (date_) => {
    if(date_===undefined || date_ === null)return "";
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(date_);
    const year=  date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const display = (number)=> {return ((number < 10)?'0'+number:number);}
    const fullDate = display(hours) + ':' + 
    display(minutes) + ", " + months[month] + " " + display(day) + ", " + year ;
    return fullDate; 
  }