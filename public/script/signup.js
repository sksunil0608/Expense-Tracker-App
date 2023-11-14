

function clearInputBox(){
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
async function signup(event) {
    try{
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const signUpDetails = {
        name, email, password
    }
    const response = await axios.post('http://localhost:3000/signup', signUpDetails);
    clearInputBox();
    if(response.status == 201){
        window.location.href = "../views/login.html"
    }
    
    else{
        throw new Error("Failed to Login")
    }
    }
    catch(err){
        if (err.response.status == 409) {
            var myElement = document.getElementById('error-area');
            var errorAlert = document.createElement('div');
            errorAlert.innerHTML = `<div class="alert alert-danger" role="alert">
                    <p>User Already Exist! Please Login.</p>
             </div>`
            myElement.insertBefore(errorAlert, myElement.firstChild);
        }
        else{
        var myElement = document.getElementById('error-area');
        var errorAlert = document.createElement('div');
        errorAlert.innerHTML =`<div class="alert alert-danger" role="alert">
                    <p>${err}</p>
             </div>`
        myElement.insertBefore(errorAlert, myElement.firstChild);
    }
    }

}