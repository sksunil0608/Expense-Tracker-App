const BACKEND_ADDRESS = ''
const BACKEND_API__URL = BACKEND_ADDRESS||'http://localhost:3000'; 

//Navigation
expenseTrackerButton = document.querySelector("#expenseTrackerButton");
expenseTrackerButton.onclick = function () {
    window.scrollTo({
        top: document.getElementById('table').offsetTop,
    });
}
// Form DOM
const form = document.getElementById('expenseForm');
form.addEventListener("submit", createExpense);

window.addEventListener('DOMContentLoaded', () => {
    const currentPage = sessionStorage.getItem('currentPage') || 1;
    const selectedItemsPerPage = sessionStorage.getItem('itemsPerPage') || 5;
    getExpenses(currentPage, selectedItemsPerPage);
})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


function clearInputBox() {
    document.querySelector('#expenseDesc').value = '';
    document.querySelector('#expenseAmount').value = '';
    document.querySelector("#expenseCat").value = "";
}
function premiumUserUI() {
    if (!document.getElementById('premium_user_msg')) {
        if (document.getElementById('normal-user-area')) {
            document.getElementById('normal-user-area').remove();
        }
        const premium_user_msg = document.createElement('div')
        premium_user_msg.id = 'premium_user_msg'
        premium_user_msg.innerHTML = `
    <strong><p class="text-success text-center">
    Hi ${'SUNIL'},
    Thanks For Using Our Expense Tracker App. 
    You are already a Premium User.    
    `
        document.getElementById('premium-user-area-button').innerHTML = `
        <button class="btn btn-success rounded w-100 mb-2 mb-md-0" onclick="showLeaderboard()">Leaderboard</button>
    </p></strong>
    `
        document.getElementById('premium-user-area').appendChild(premium_user_msg)
    }
}
//Function to Show Expenses
function showAllExpenses(response) {
    const data = response.data.allExpenses;

    const table = document.getElementById('table');
    noExpense = document.getElementById('noExpense');


    if (data.length == 0) {
        table.style.display = "none";
    }
    else {
        noExpense.style.display = "none";
        data.forEach((i) => {
            // Create a new row
            var tableBody = document.getElementById("table-body");
            var newRow = tableBody.insertRow();
            newRow.id = i.id;

            // Insert cells into the row
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            var cell4 = newRow.insertCell(3);
            var cell5 = newRow.insertCell(4);

            cell1.innerHTML = i.expenseName;
            cell2.innerHTML = i.price;
            cell3.innerHTML = i.category;
            cell4.innerHTML = ` <button class="btn btn-danger btn-sm input-group-text m-1" onclick="deleteExpense('${i.id}')">
                                Delete
                            </button>`;
            cell5.innerHTML = `<button class="btn btn-warning btn-sm input-group-text m-1" onclick="updateExpense('${i.id}')">
                                Edit
                            </button>`;
        })

    }

    document.getElementById('total-expense').textContent = `Total Expense:${response.data.totalExpense || 0}`
}

function showAddedExpense(response) {
    const data = response.data.allExpenses;
    // Create a new row
    var tableBody = document.getElementById("table-body");
    var newRow = tableBody.insertRow();
    newRow.id = data.id;

    // Insert cells into the row
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);

    cell1.innerHTML = data.expenseName;
    cell2.innerHTML = data.price;
    cell3.innerHTML = data.category;
    cell4.innerHTML = ` <button class="btn btn-danger btn-sm input-group-text m-1" onclick="deleteExpense('${data.id}')">
                                Delete
                            </button>`;
    cell5.innerHTML = `<button class="btn btn-warning btn-sm input-group-text m-1" onclick="updateExpense('${data.id}')">
                                Edit
                            </button>`;
}
//show edit expense
function showEditExpense(response) {
    document.getElementById(`${response.data.allExpenses.id}`).remove();
    showAddedExpense(response);
}
async function getExpenses(page, itemsPerPage) {
    const token = localStorage.getItem('token')
    try {
        const decodedToken = parseJwt(token)
        const isPremium = decodedToken.isPremiumUser
        if (isPremium) {
            premiumUserUI();
        }
        // Store the current page in local storage
        sessionStorage.setItem('currentPage', page);
        sessionStorage.setItem('itemsPerPage', itemsPerPage);

        const response = await axios.get(`${BACKEND_API__URL}/all-expenses?page=${page}&itemsPerPage=${itemsPerPage}`, { headers: { "Authorization": token } });
        updatePaginationControls(response)

    } catch (err) {
        console.log(err)
    }
}
// Store Expense to Local Storage
async function createExpense(event) {
    event.preventDefault();

    const expenseName = event.target.expenseDesc.value;
    const price = event.target.expenseAmount.value;
    const category = event.target.expenseCat.value;
    const token = localStorage.getItem('token')
    const header = { headers: { "Authorization": token } }
    const obj = {
        expenseName,
        price,
        category,
    }

    try {
        const response = await axios.post(`${BACKEND_API__URL}/add-expense`, obj, header);
        showAddedExpense(response);
        clearInputBox();
    }
    catch (err) {
        var myElement = document.getElementById('error-area');
        var errorAlert = document.createElement('div');
        errorAlert.innerHTML = `<div class="text-danger">
                    <strong><p class="m-2">${err}</p></strong>
             </div>`
        myElement.insertBefore(errorAlert, myElement.firstChild)
    }
}

function removeDeletedExpenseUI(id) {
    document.getElementById(id).remove();
}
//function to Delete
async function deleteExpense(expenseId) {
    try {
        const token = localStorage.getItem('token')
        const header = { headers: { "Authorization": token } }
        const response = await axios.delete(`${BACKEND_API__URL}/delete/${expenseId}`, header);
        removeDeletedExpenseUI(expenseId);
    } catch (err) {
        console.log(err)
    }
}

function showInputDataOnEditpage(response) {
    const data = response.data.allExpenses
    document.querySelector("#expenseDesc").value = data.expenseName
    document.querySelector("#expenseAmount").value = data.price
    document.querySelector("#expenseCat").value = data.category
}
//Function to Edit
async function updateExpense(expenseId) {
    const token = localStorage.getItem('token')
    const header = { headers: { "Authorization": token } }
    const response = await axios.get(`${BACKEND_API__URL}/expense/${expenseId}`, header);
    showInputDataOnEditpage(response);

    const update_btn = document.createElement("div");
    update_btn.style = "display:flex;justify-content:center;"
    update_btn.innerHTML = `<button class="btn btn-warning submit-button input-group-text m-1">
                                UPDATE
                           </button>`;
    document.getElementById("form-border").appendChild(update_btn);
    update_btn.addEventListener("click", postEditData);

    async function postEditData(event) {
        event.preventDefault();
        const expenseName = document.querySelector("#expenseDesc").value;
        const price = document.querySelector("#expenseAmount").value;
        const category = document.querySelector("#expenseCat").value;
        const obj = {
            expenseName,
            price,
            category,
        };

        try {
            const token = localStorage.getItem('token')
            const header = { headers: { "Authorization": token } }
            const response = await axios.put(
                `${BACKEND_API__URL}/edit/${expenseId},`,
                obj, header
            );
            showEditExpense(response);
            clearInputBox();
        } catch (err) {
            console.log(err);
        }
    }
}


const logout_button = document.getElementById('logout')
logout_button.onclick = async function logout(e) {
    try {
        e.preventDefault();
        const token = localStorage.getItem('token')
        await axios.get(`${BACKEND_API__URL}/logout`, { headers: { "Authorization": token } })
        localStorage.removeItem('token')
        window.location.href = "authentication/login.html"

    } catch (err) {
        console.log(err)
    }
}

function updatePaginationControls(response) {
    var tableBody = document.getElementById("table-body");
    tableBody.innerHTML = '';
    showAllExpenses(response)
    const totalPages = response.data.totalPages
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear existing buttons


    for (let i = 1; i <= totalPages; i++) {

        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'm-2')
        button.addEventListener('click', () => getExpenses(i, sessionStorage.getItem('itemsPerPage')));

        if (i === parseInt(sessionStorage.getItem('currentPage'))) {
            button.classList.add('active');
        }
        paginationContainer.appendChild(button);
    }

}

function itemsPerPageDropdown(selectedValue) {
    const selectedItemsPerPage = selectedValue;
    const currentPage = 1
    getExpenses(currentPage, selectedItemsPerPage);
}


