// script.js

document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the "Add" button to show the modal
    document.querySelector('.btn-primary').addEventListener('click', function () {
        showAddModal();
    });

    // Add event listener for the "Delete" button
    document.getElementById('deleteBtn').addEventListener('click', function () {
        deleteSelectedErrors();
    });

    // Your other event listeners and functions go here
});
function fetchExistingData() {
    // Make an Axios request to get existing data from the server
    axios.get('/')
        .then(response => {
            // Update the table with the existing data
            updateTable(response.data.errors);
        })
        .catch(error => {
            console.error('Error fetching existing data:', error);
        });
}

function updateTable(errors) {
    // Clear the existing table rows
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    // Populate the table with the fetched data
    errors.forEach(error => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${error.code}</td>
            <td>${error.errtext}</td>
            <td>${error.recommendation}</td>
            <td>${error.obj}</td>
        `;
        tableBody.appendChild(newRow);
    });
}
function showAddModal() {
    // Code to show the add modal goes here
    console.log('Show Add Modal');
}

function deleteSelectedErrors() {
    // Code to delete selected errors goes here
    console.log('Delete Selected Errors');
    // Make an Axios request to the server to delete the selected errors
    const selectedIds = getSelectedIds();
    if (selectedIds.length > 0) {
        axios.post('/delete', { ids: selectedIds })
            .then(response => {
                console.log(response.data.message);
                // Refresh the page or update the UI as needed
            })
            .catch(error => {
                console.error('Error deleting errors:', error);
            });
    } else {
        alert('Please select errors to delete.');
    }
}

function getSelectedIds() {
    // Code to get the IDs of selected errors goes here
    const selectedIds = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        selectedIds.push(parseInt(checkbox.value));
    });
    return selectedIds;
    // Add this inside the script.js file
function showAddModal() {
    // Clear the form before showing the modal
    document.getElementById('errorForm').reset();

    // Set up the modal for adding a new error
    $('#addModal').modal('show');
}

function submitForm() {
    const formData = {
        code: document.getElementById('code').value,
        errtext: document.getElementById('errtext').value,
        recommendation: document.getElementById('recommendation').value,
        obj: document.getElementById('obj').value
    };

    // Determine whether to add or update an error
    const isUpdate = formData.hasOwnProperty('id') && formData.id !== '';

    // Make an Axios request to add or update the error
    const requestUrl = isUpdate ? '/update' : '/add';
    const httpMethod = isUpdate ? 'PUT' : 'POST';

    axios({
        method: httpMethod,
        url: requestUrl,
        data: formData
    })
    .then(response => {
        console.log(response.data.message);
        // Close the modal
        $('#addModal').modal('hide');
        // Fetch and display updated data from the server
        fetchExistingData();
    })
    .catch(error => {
        console.error('Error adding/updating error:', error);
    });
}

}
