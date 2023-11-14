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
        console.log(response.status)
        if (response.status === 201) {
            window.location.href = "../views/index.html"
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