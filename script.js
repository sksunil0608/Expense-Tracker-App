//Navigation
expenseTrackerButton = document.querySelector("#expenseTrackerButton");
expenseTrackerButton.onclick =function(){
    window.scrollTo({
        top: document.getElementById('table').offsetTop,
    });
}
// Form DOM
form = document.getElementById('expenseForm');
//no_ofExpenses to count total number of Expensess
// let no_ofExpenses = 0;

//Fetch Data
var expenseAmt = document.querySelector('#expenseAmount');
var expenseDesc = document.querySelector('#expenseDesc');
var expenseCat = document.querySelector('#expenseCat');
// Flag Variable to check item edited or add
let is_item_edited = false;
//Refresh Page
function refreshPage(){
    refresh_link = document.createElement('a');
    refresh_link.href ="index.html";
    refresh_link.style.textDecoration="none";
    refresh_link.textContent="Refresh to Reload";

    return refresh_link;
}
//succcess Message
function successMessage(){
    let successMSG = document.createElement('div');
    successMSG.className = "alert alert-success";
    successMSG.role ="alert";
    return successMSG;
}

form.addEventListener("submit",onSubmitExpenseForm);
//Function to Edit
function editItem(expenseKey){
    // Set focus to the input box
    expenseDesc.focus();
    window.scrollTo({
        top: form,
        behavior: 'smooth' // Optional: Use smooth scrolling
    });
    expenseDeserialized = JSON.parse(localStorage.getItem(expenseKey));
    expenseDesc.value= expenseDeserialized.expenseDesc;
    expenseAmt.value = expenseDeserialized.expenseAmt;
    expenseCat.value = expenseDeserialized.expenseCat;
    is_item_edited = true;
}

//function to Delete
function deleteItem(expenseKey){
    localStorage.removeItem(expenseKey);
    let deleteMessage = document.createElement('div');
    deleteMessage.className ="alert alert-danger";
    deleteMessage.textContent =`Expense Deleted: `
    deleteMessage.innerHTML += `<strong>${expenseKey}&nbsp</strong>`
    refresh_link = refreshPage();
    deleteMessage.appendChild(refresh_link);
    form.appendChild(deleteMessage);
    window.scrollTo({
        top: form,
        behavior: 'smooth' // Optional: Use smooth scrolling
    });
}

//Function to Show Expenses
function showExpenses(){
    table = document.getElementById('table');
    noExpense = document.getElementById('noExpense');
    if(localStorage.length==0){
        table.style.display="none";
    }
    else{
        noExpense.style.display ="none";
        for(var i=0;i<localStorage.length;i++){
            expenseKey = localStorage.key(i);
            expenseDeserialized = JSON.parse(localStorage.getItem(expenseKey))

            // Creating Table Body
            table_body = document.getElementById('table-body');
            
            table_row = document.createElement('tr');

            table_exp_desc = document.createElement('td');
            table_exp_desc.textContent = expenseDeserialized.expenseDesc;

            table_exp_amt = document.createElement('td');
            table_exp_amt.textContent = expenseDeserialized.expenseAmt;

            table_exp_cat = document.createElement('td');
            table_exp_cat.textContent = expenseDeserialized.expenseCat;

            table_edit_button = document.createElement('td');
            edit_button = document.createElement('button');
            edit_button.textContent ="Edit";
            edit_button.value = expenseDeserialized.expenseDesc;
            edit_button.className = "btn btn-primary btn-sm"
            edit_button.onclick = function(){
                editItem(this.value);
            }
            table_edit_button.appendChild(edit_button);

            table_delete_button = document.createElement('td');
            delete_button = document.createElement('button');
            delete_button.textContent ="Delete";
            delete_button.value = expenseDeserialized.expenseDesc;
            delete_button.className = "btn btn-danger btn-sm";
            delete_button.onclick=function(){
                deleteItem(this.value);
            }
            table_delete_button.appendChild(delete_button)
            
            table_row.appendChild(table_exp_desc);
            table_row.appendChild(table_exp_amt);
            table_row.appendChild(table_exp_cat);
            table_row.appendChild(table_edit_button);
            table_row.appendChild(table_delete_button);

            table_body.appendChild(table_row);


        }
    }
}
showExpenses();

// Store Expense to Local Storage
function onSubmitExpenseForm(e){
    e.preventDefault();
    if(!expenseAmt.value || expenseDesc.value==''){
        console.log("Please Insert Values");
    }
    else{
        
        items = {
            "expenseAmt":expenseAmt.value,
            "expenseDesc":expenseDesc.value,
            "expenseCat":expenseCat.value
        };
        item_serialized = JSON.stringify(items);
        localStorage.setItem(expenseDesc.value,item_serialized);

        //Show Success Message
        successMSG = successMessage();
        successMSG.textContent = `Expense Added: `;
        if(is_item_edited){successMSG.textContent =`Expense Edited: `}
        successMSG.innerHTML += `<strong>${expenseDesc.value}&nbsp</strong>`
        refresh_link = refreshPage();
        successMSG.appendChild(refresh_link);
        form.appendChild(successMSG);

    }
}

