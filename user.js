document.addEventListener("DOMContentLoaded", getCurrent);
document.addEventListener("DOMContentLoaded", bindAddButtons);

// Get current contents of database
function getCurrent() {
	// Reset default values of weights, reps to 0
	document.getElementById("new_reps").value = "0";
	document.getElementById("new_weight").value = "0";

	var currreq = new XMLHttpRequest();
	currreq.open("GET", "/current", false);
	currreq.send(null);
	var current_values = JSON.parse(currreq.responseText);
	for (var i = 0; i < current_values.length; i++) {
		addRow(current_values[i]);
	}
}

function bindAddButtons() {
	document.getElementById("add").addEventListener("click", function (event) {
		if (document.getElementById("new_units").value == "kgs") {
			var new_units = false;
		} else if (document.getElementById("new_units").value == "lbs") {
			var new_units = true;
		}

		// Get values from add form
		var added_vals = {
			name: document.getElementById("new_name").value,
			reps: document.getElementById("new_reps").value,
			weight: document.getElementById("new_weight").value,
			date: new Date(document.getElementById("new_date").value),
			units: new_units,
		};

		var addreq = new XMLHttpRequest();
		addreq.open("POST", "/add", true);

		addreq.setRequestHeader("Content-Type", "application/json");
		addreq.onreadystatechange = function () {
			// Call a function when the state changes.
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				console.log("success");
				let parsedResult = JSON.parse(addreq.responseText);

				// Add row to html table if successful add to database
				addRow(parsedResult);

				// Reset values in add form
				document.getElementById("new_name").value = "";
				document.getElementById("new_reps").value = "0";
				document.getElementById("new_weight").value = "0";
				document.getElementById("new_date").value = "";
				document.getElementById("new_units").value = "lbs";
			}
		};
		addreq.send(JSON.stringify(added_vals));

		event.preventDefault();
	});
}

// Change date into useful format
function getFormattedDate(date) {
	var year = date.getFullYear();

	var month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : "0" + month;

	var day = date.getDate().toString();
	day = day.length > 1 ? day : "0" + day;

	return month + "/" + day + "/" + year;
}

// Add row to html table after successful add to database with new values
function addRow(added_vals) {
	console.log(added_vals.id);
	added_vals.lbs ? (added_vals.units = "lbs") : (added_vals.units = "kgs");

	// Format date
	added_vals.date = getFormattedDate(new Date(added_vals.date));

	// Get new values from html table
	var table = document.getElementById("workouts");
	var new_row = table.insertRow(table.rows.length);
	var new_row_id = table.rows.length;
	var new_id_entry = new_row.insertCell(0);
	new_id_entry.innerHTML = "<class='id', id='" + added_vals.id + "'>";
	new_id_entry.innerText = added_vals.id;
	var new_name_entry = new_row.insertCell(1);
	new_name_entry.innerHTML = "<class='name', id='" + added_vals.id + "'>";
	new_name_entry.innerText = added_vals.name;
	var new_reps_entry = new_row.insertCell(2);
	new_reps_entry.innerHTML = "<class='reps', id='" + added_vals.id + "'>";
	new_reps_entry.innerText = added_vals.reps;
	var new_weights_entry = new_row.insertCell(3);
	new_weights_entry.innerHTML = "<class='weights', id='" + added_vals.id + "'>";
	new_weights_entry.innerText = added_vals.weight;
	var new_date_entry = new_row.insertCell(4);
	new_date_entry.innerHTML = "<class='date', id='" + added_vals.id + "'>";
	new_date_entry.innerText = added_vals.date;
	var new_units_entry = new_row.insertCell(5);
	new_units_entry.innerHTML = "<class='lbs', id='" + added_vals.id + "'>";
	new_units_entry.innerText = added_vals.units;
	new_row.insertCell(6).innerHTML =
		"<button input type='button' class='edit' id='" +
		added_vals.id +
		"' value='Edit row'>" +
		"Edit row" +
		"</button>";

	// Add functionality to edit button
	new_row.lastChild.addEventListener("click", function (event) {
		window.location.href = "/edit?id=" + added_vals.id;
	});

	new_row.insertCell(7).innerHTML =
		"<button input type='button' class='delete' id='" +
		added_vals.id +
		"' value='Delete row'>" +
		"Delete row" +
		"</button>";

	// Add fuctionality to delete button
	new_row.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("workouts").deleteRow(new_row.rowIndex);
			}
		});

		req.open("GET", "/delete?id=" + added_vals.id, false);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});
}
