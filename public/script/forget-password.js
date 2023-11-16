async function forget_password(event){
    try{
        event.preventDefault();
        const email = event.target.email.value
        const response = await axios.post('http://localhost:3000/password/forgotpassword',{email})
        document.getElementById('email-messagse-area').innerHTML =`
        <p class="text-danger">Password Reset Link Sent Successfully</p>
        `
        event.target.email.value=''
    }catch(err){
        console.log(err)
    }
}