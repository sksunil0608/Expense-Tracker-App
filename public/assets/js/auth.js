
const BACKEND_ADDRESS = 'http://34.231.139.245'
const BACKEND_API__URL = BACKEND_ADDRESS ? BACKEND_ADDRESS : 'http://localhost:3000'; 
//-------------------------Login--------------------------
function clearLoginInputBox() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
async function login(event) {
    try {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        
        const loginDetails = {
        email, password
        }
        const response = await axios.post(`${BACKEND_API__URL}/login`, loginDetails);
        clearLoginInputBox();
        if (response.status === 201) {
            localStorage.setItem('token',response.data.token)
            window.location.href ='/admin/dashboard'
        }
        else{
            let message;
            if (response.status === 204) {
                message = "User Does Not Exist! Please Create a Account."
            }
            else {
                throw new Error("Failed to Login")
            }

            var myElement = document.getElementById('error-area');
            var errorAlert = document.createElement('div');
            errorAlert.innerHTML = `<div class="text-danger">
                    <strong><p class="m-2">${message}</p></strong>
             </div>`
            myElement.insertBefore(errorAlert, myElement.firstChild);
        }
        
        
        
    }
    catch (err) {
        let message;
        if(err.response.status===401){
            message= "Authentication Error! Password Does Not Match."
        }
        else if (err.response.status ===400) {
            message = "You have not filled all the details correctly."
        }
        else {
            message = "Bad Parameters, Something Went Wrong."
        }
        
        var myElement = document.getElementById('error-area');
        var errorAlert = document.createElement('div');
        errorAlert.innerHTML = `<div class="text-danger">
                    <strong><p class="m-2">${message}</p></strong>
             </div>`
        myElement.insertBefore(errorAlert, myElement.firstChild);
    }

}



//------------------------SignUp---------------------------------
function clearSignUpInputBox() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
async function signup(event) {
    try {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        const signUpDetails = {
            name, email, password
        }
        const response = await axios.post(`${BACKEND_API__URL}/signup`, signUpDetails);
        clearSignUpInputBox();
        if (response.status == 201) {
            window.location.href = "/login"
        }
        else {
            throw new Error("Failed to Login")
        }
    }
    catch (err) {
        let message;
        if (err.response.status == 409) {
            message = "User Already Exist! Please Login.";
        }
        else {
            message = err;
        }
        var myElement = document.getElementById('error-area');
        var errorAlert = document.createElement('div');
        errorAlert.innerHTML = `<div class="border border-danger rounded bg-danger text-white">
                    <p class="m-2">${message}</p>
             </div>`
        myElement.insertBefore(errorAlert, myElement.firstChild);
    }

}

//-------------------Forget Password---------------------------------
async function forget_password(event) {
    try {
        event.preventDefault();
        const email = event.target.email.value
        const response = await axios.post(`${BACKEND_API__URL}/forgot-password`, { email })
        document.getElementById('email-messagse-area').innerHTML = `
        <p class="text-danger">Password Reset Link Sent Successfully. Check Your Email Please.</p>
        `
        event.target.email.value = ''
    } catch (err) {
        console.log(err)
    }
}



