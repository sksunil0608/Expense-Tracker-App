const buy_premium = document.getElementById('rzp-buy-premium'); 4
buy_premium.addEventListener('click', getBuyPremium);


window.addEventListener('DOMContentLoaded',checkPremiumUser);
function premiumUserUI() {
    document.getElementById('normal-user-area').remove();
    document.getElementById('premium-user-area').innerHTML = `
    <strong><p class="text-success text-center">
    Hi ${'SUNIL'},
    Thanks For Using Our Expense Tracker App. 
    You are already a Premium User.
    </p></strong>
    `
}

async function checkPremiumUser(event) {
    try {
        event.preventDefault();
        const token = localStorage.getItem('token')
        const premium_user = await axios.post('http://localhost:3000/check-premium-user', 
        { 'token': token }, { headers: { "Authorization": token } })
        if(premium_user){
            premiumUserUI();
        }
    } catch (err) {
        console.log(err)
    }
}

async function getBuyPremium(event) {
    try {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:3000/buy-premium', { headers: { "Authorization": token } })

        var options = {
            "key": response.data.key_id, //Key Genereated By dash
            "order_id": response.data.order.id,
            "handler": async function (response) {
                    const transResponse = await axios.post('http://localhost:3000/transaction-status', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "Authorization": token } })
                    
                    if(transResponse.status ==202){
                        premiumUserUI();
                    }
                
                
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();
        rzp1.on('payment failed', function (response) {
            console.log(response);
            document.getElementById('premium-user-area').innerHTML = `
                <strong><p class="text-danger text-center">
                Hi ${'SUNIL'},
                Your Transcation is failed, Please do Payment to become Premium User.
                </p></strong>
            `
        })
    }
    catch (err) {
        console.log(err)
    }
}