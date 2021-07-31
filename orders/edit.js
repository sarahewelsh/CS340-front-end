document.addEventListener("DOMContentLoaded", bindItemSearchButtons);

// Get id parameter from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

function addSearchRow(addedVals) {
	console.log(addedVals);

	// Get new values from html table
	var table = document.getElementById("item_results");
	// Add a new row to the end of the table
	var newRow = table.insertRow(table.rows.length);

	var hackCounter = 0; // DO NOT DO THIS; THIS IS BAD AND I SHOULD FEEL BAD.
	for (const [key, value] of Object.entries(addedVals)) {
		console.log(`${key}: ${value}`);
		var newCell = newRow.insertCell(hackCounter);
		newCell.innerText = value;
		hackCounter++;
	}

	newRow.insertCell().innerHTML =
		"<button input type='button' class='add' id='" +
		addedVals.id +
		"' value='Add row'>" +
		"Add item to order" +
		"</button>";

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/items/" + addedVals["item_id"]
	);

	// Add functionality to add button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		var new_vals = {
			orderID: parseInt(id),
			itemID: addedVals["item_id"],
		};

		// Send insert request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("add success");
				// If addition to database was successful, update html table
				getSpecificOrderItems(new_vals.orderID);
			}
		});
		console.log(new_vals);

		req.open(
			"POST",
			"http://flip1.engr.oregonstate.edu:8687/orders/items/",
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(JSON.stringify(new_vals));
		console.log(req.responseText);

		event.preventDefault();
	});
}

// Submit changes
function bindItemSearchButtons() {
	document
		.getElementById("item_search")
		.addEventListener("click", function (event) {
			// Get new values from edit form
			var new_vals = {
				itemName: document.getElementById("add_item_name").value,
				rating: document.getElementById("add_rating").value,
				genre: document.getElementById("add_genre").value,
				id: id,
			};
			console.log(new_vals.itemName);
			console.log(new_vals.rating);
			console.log(new_vals.genre);

			var editreq = new XMLHttpRequest();
			if (new_vals.itemName !== "") {
				console.log("name");
				editreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/name/" +
						new_vals.itemName,
					true
				);
			} else if (new_vals.rating !== "") {
				editreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/rating/" +
						new_vals.rating,
					true
				);
			} else {
				editreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/genre/" +
						new_vals.genre,
					true
				);
			}

			editreq.setRequestHeader("Content-Type", "application/json");
			editreq.onreadystatechange = function () {
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					console.log("yes");
					console.log(editreq.response);
					const body = JSON.parse(editreq.response);
					console.log(body);
					// Delete stuff
					var tableHeaderRowCount = 1;
					var table = document.getElementById("item_results");
					var rowCount = table.rows.length;
					for (var i = tableHeaderRowCount; i < rowCount; i++) {
						table.deleteRow(tableHeaderRowCount);
					}

					for (const row of body) {
						addSearchRow(row);
					}
				}
			};
			editreq.send(null);
			event.preventDefault();
		});
}

// Populate current order items
function addContentsRow(addedVals) {
	console.log(addedVals);

	// Get new values from html table
	var table = document.getElementById("order_contents");
	// Add a new row to the end of the table
	var newRow = table.insertRow(table.rows.length);

	var hackCounter = 0; // DO NOT DO THIS; THIS IS BAD AND I SHOULD FEEL BAD.
	for (const [key, value] of Object.entries(addedVals)) {
		console.log(`${key}: ${value}`);
		var newCell = newRow.insertCell(hackCounter);
		newCell.innerText = value;
		hackCounter++;
	}

	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete item" +
		"</button>";

	console.log(addedVals);

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/items/" + addedVals["item_id"]
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("order_contents").deleteRow(newRow.rowIndex);
				location.reload();
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/orders/items/" +
				id +
				"/" +
				addedVals["item_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});
}

// Get information associated with a specific id in the database
document.addEventListener("DOMContentLoaded", getSpecificOrderItems(id));
function getSpecificOrderItems(id) {
	var req = new XMLHttpRequest();

	req.addEventListener("load", function () {
		if (req.status >= 200 && req.status < 400) {
			console.log("success");
			console.log(req.responseText);
		}
		const body = JSON.parse(req.response);
		console.log(body);
		// Delete stuff
		var tableHeaderRowCount = 1;
		var table = document.getElementById("order_contents");
		var rowCount = table.rows.length;
		for (var i = tableHeaderRowCount; i < rowCount; i++) {
			table.deleteRow(tableHeaderRowCount);
		}

		for (const row of body) {
			addContentsRow(row);
		}
	});

	const urlParams = new URLSearchParams(window.location.search);
	const orderID = urlParams.get("id");

	req.open(
		"GET",
		"http://flip1.engr.oregonstate.edu:8687/orders/items/" + orderID,
		true
	);
	req.setRequestHeader("Content-Type", "application/json");

	req.send(null);
}
