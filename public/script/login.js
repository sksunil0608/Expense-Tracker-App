function clearInputBox() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}
async function login(event) {
    try {
        event.preventDefault();
        const email = event.target.email;
        const password = event.target.password;

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
        var myElement = document.getElementById('error-area');
        var erroAlert = document.createElement('div');
        erroAlert.innerHTML = `<div class="alert alert-danger" role="alert">
                    <h5>Some Error Occured</h5>
                    <p>${err}</p>
             </div>`
        myElement.insertBefore(erroAlert, myElement.firstChild);
    }

}