//Navigation
expenseTrackerButton = document.querySelector("#expenseTrackerButton");
expenseTrackerButton.onclick =function(){
    window.scrollTo({
        top: document.getElementById('table').offsetTop,
    });
}
// Form DOM
form = document.getElementById('expenseForm');
form.addEventListener("submit",createExpense);

window.addEventListener('DOMContentLoaded', getExpenses)


function clearInputBox(){
    document.querySelector('#expenseDesc').value='';
    document.querySelector('#expenseAmount').value='';
    document.querySelector("#expenseCat").value = "";
}

//Function to Show Expenses
function showAllExpenses(response){
    const data = response.data.allExpenses;

    const table = document.getElementById('table');
    noExpense = document.getElementById('noExpense');
    if(data.length==0){
        table.style.display="none";
    }
    else{
        noExpense.style.display ="none";
        data.forEach((i)=>{
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
}

function showAddedExpense(response){
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
async function getExpenses(){
    const token = localStorage.getItem('token')
    try{
        const response = await axios.get("http://localhost:3000/all-expenses", { headers: { "Authorization": token } });
        showAllExpenses(response)
    }catch(err){
        console.log(err)
    }
}
// Store Expense to Local Storage
async function createExpense(event){
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
    
    try{
        const response = await axios.post("http://localhost:3000/add-expense",obj,header);
        showAddedExpense(response);
        clearInputBox();
    }
    catch(err){
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
async function deleteExpense(expenseId){
    try{
        const token = localStorage.getItem('token')
        const header = { headers: { "Authorization": token } }
        const response = await axios.delete(`http://localhost:3000/delete/${expenseId}`,header);
        removeDeletedExpenseUI(expenseId);
    }catch(err){
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
async function updateExpense(expenseId){
    const token = localStorage.getItem('token')
    const header = { headers: { "Authorization": token } }
    const response = await axios.get(`http://localhost:3000/expense/${expenseId}`,header);
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
        `http://localhost:3000/edit/${expenseId},`,
        obj,header
      );
      showEditExpense(response);
      clearInputBox();
    } catch (err) {
      console.log(err);
    }
  }
}


