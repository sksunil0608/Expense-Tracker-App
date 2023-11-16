const buy_premium = document.getElementById('rzp-buy-premium'); 

buy_premium.addEventListener('click', getBuyPremium);

window.addEventListener('DOMContentLoaded',checkPremiumUser);


function premiumUserUI() {
    document.getElementById('normal-user-area').remove();
    const premium_user_msg = document.createElement('div')
    premium_user_msg.innerHTML = `
    <strong><p class="text-success text-center">
    Hi ${'SUNIL'},
    Thanks For Using Our Expense Tracker App. 
    You are already a Premium User.
    <br>
    <button class="btn btn-success rounded m-3" id="show-leaderboard" onclick="showLeaderboard()">Leaderboard</button>
    </p></strong>
    `
    document.getElementById('premium-user-area').appendChild(premium_user_msg)
}

async function showLeaderboard(){
    const token =localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/premium/leaderboard',{headers:{"Authorization":token}});

    const leaderboard_area = document.createElement('div');
    document.getElementById('premium-user-area').appendChild(leaderboard_area);
    leaderboard_area.innerHTML = `
    <h3>LeaderBoard</h3>
    <div class="border border-2 rounded">
    <table class="table" id="leaderboard-table">
        <thead id="leaderboard-head">
            <tr>
                <th scope="col">Name</th>
                <th scope="col">Expense</th>
            </tr>
        </thead>
        <tbody id="leaderboard-body"></tbody>
    </table>
    </div>
`;
 
    response.data.userLeaderboard.forEach((user) => {
        const leaderboard_table = document.getElementById('leaderboard-table');
        const leaderboardBody = document.getElementById("leaderboard-body");

        // Create a new row at the end of the table
        const newRow = leaderboardBody.insertRow();

        // Insert cells into the row
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);

        cell1.innerHTML = user.name;
        cell2.innerHTML = user.total_expense;
    });


    
}

async function checkPremiumUser(event) {
    try {
        event.preventDefault();
        const token = localStorage.getItem('token')
        const premium_user = await axios.post('http://localhost:3000/check-premium-user', 
        { 'token': token }, { headers: { "Authorization": token } })
        if(premium_user){
            premiumUserUI();
            // showLeaderboard();
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
            "key": response.data.key_id, //Key Genereated By dashboard
            "order_id": response.data.order.id,
            "handler": async function (response) {
                    const transResponse = await axios.post('http://localhost:3000/transaction-status', {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id
                    }, { headers: { "Authorization": token } })
                    
                    if(transResponse.status ==202){
                        premiumUserUI();
                    }
                    localStorage.setItem('token',transResponse.data.token)
                
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        event.preventDefault();
        rzp1.on('payment failed', function (response) {
            console.log(response);
            document.getElementById('premium-user-area').innerHTML = `
                <strong><p class="text-danger text-center">
                Hi ${'user'},
                Your Transcation is failed, Please do Payment to become Premium User.
                </p></strong>
            `
        })
    }
    catch (err) {
        if (err.response.status==403){
            document.getElementById('premium-user-area').innerHTML = `
                <strong><p class="text-danger text-center">
                Hi ${'user'},
                Your are already a premium User.
                </p></strong>
            `
        }
        else{
            console.log(err)
        }
    }
}