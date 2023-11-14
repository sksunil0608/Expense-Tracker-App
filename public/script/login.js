function clearInputBox() {
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
        const response = await axios.post('http://localhost:3000/login', loginDetails);
        clearInputBox();
        if (response.status = 201) {
            window.location.href = "../views/index.html"
        }
        else {
            throw new Error("Failed to Login")
        }
    }
    catch (err) {
        err = {response:{ status: 401 }}; 
        let error;
        if(err.response.status==204){
            error = "User Does Not Exist! Please SignUp"
        }
        else if(err.response.status==401){
            error= "Authentication Error! Password Does Not Match."
        }

        var myElement = document.getElementById('error-area');
        var erroAlert = document.createElement('div');
        erroAlert.innerHTML = `<div class="text-danger">
                    <strong><p class="m-2">${error}</p></strong>
             </div>`
        myElement.insertBefore(erroAlert, myElement.firstChild);
    }

}