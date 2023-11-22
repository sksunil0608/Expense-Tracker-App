
const buy_premium = document.getElementById('rzp-buy-premium'); 

buy_premium.addEventListener('click', getBuyPremium);

async function showLeaderboard(){
    const token =localStorage.getItem('token')
    const response = await axios.get(`${BACKEND_API__URL}/premium/leaderboard`,{headers:{"Authorization":token}});

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
        cell2.innerHTML = user.totalExpenseAmount!=null?user.totalExpenseAmount:0;
    });


    
}

async function getBuyPremium(event) {
    try {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const response = await axios.get(`${BACKEND_API__URL}/buy-premium`, { headers: { "Authorization": token } })

        var options = {
            "key": response.data.key_id, //Key Genereated By dashboard
            "order_id": response.data.order.id,
            "handler": async function (response) {
                console.log("1")
                const transResponse = await axios.post(`${BACKEND_API__URL}/transaction-status`, {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { "Authorization": token } })
                console.log("3")
                if (transResponse.status == 202) {
                    premiumUserUI();
                }

                localStorage.setItem('token', transResponse.data.token)

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
        if (err.response.status == 403) {
            document.getElementById('premium-user-area').innerHTML = `
                <strong><p class="text-danger text-center">
                Hi ${'user'},
                Your are already a premium User.
                </p></strong>
            `
        }
        else {
            console.log(err)
        }
    }
}