document.addEventListener("DOMContentLoaded", bindAllButtons);

function bindAllButtons() {
	bindAddButtons();
	bindSearchButtons();
}

function getAllCustomers() {
	httpRequest = new XMLHttpRequest();

	// Do stuff with the response
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			console.log("yes");
			console.log(httpRequest.response);
			const body = JSON.parse(httpRequest.response);
			console.log(body);
			for (const row of body) {
				addRow(row);
			}
		} else {
			console.log("no");
		}
	};
	httpRequest.open(
		"GET",
		"http://flip1.engr.oregonstate.edu:8687/customers",
		true
	);
	httpRequest.send();
}

function addRow(addedVals) {
	console.log(addedVals);

	// Get new values from html table
	var table = document.getElementById("customers");
	// Add a new row to the end of the table
	var newRow = table.insertRow(table.rows.length);

	var hackCounter = 0; // DO NOT DO THIS; THIS IS BAD AND I SHOULD FEEL BAD.
	for (const [key, value] of Object.entries(addedVals)) {
		console.log(`${key}: ${value}`);
		var newCell = newRow.insertCell(hackCounter);
		newCell.innerText = value;
		hackCounter++;
	}

	// Add edit customer button -------
	newRow.insertCell().innerHTML =
		"<button input type='button' class='edit' id='" +
		addedVals.id +
		"' value='Edit row'>" +
		"Edit customer" +
		"</button>";

	// Add functionality to edit button -------
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["customer_id"];
	});

	// Add delete customer button
	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete customer" +
		"</button>";

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/customers/" +
			addedVals["customer_id"]
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("customers").deleteRow(newRow.rowIndex);
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/customers/" +
				addedVals["customer_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});

	// Add new order button ------
	newRow.insertCell().innerHTML =
		"<button input type='button' class='add' id='" +
		addedVals.id +
		"' value='Add row'>" +
		"Start new order" +
		"</button>";

	// Add functionality to add button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send create order request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If new order creation was successful, redirect to edit order page
				window.location.href =
					"http://web.engr.oregonstate.edu/~welshsa/public/orders/index.html?id=" +
					addedVals["order_id"];
			}
		});

		req.open(
			"GET",
			"http://flip1.engr.oregonstate.edu:8687/orders/new/" +
				addedVals["customer_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});
}

// Get id parameter from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// Submit changes
function bindAddButtons() {
	document
		.getElementById("cust_add")
		.addEventListener("click", function (event) {
			// Get new values from form
			var new_vals = {
				firstName: document.getElementById("new_first_name").value,
				lastName: document.getElementById("new_last_name").value,
				email: document.getElementById("new_email").value,
				zip: document.getElementById("new_zip").value,
			};

			var addreq = new XMLHttpRequest();
			addreq.open(
				"POST",
				"http://flip1.engr.oregonstate.edu:8687/customers/new",
				true
			);

			addreq.setRequestHeader("Content-Type", "application/json");
			addreq.onreadystatechange = function () {
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					console.log("success");
					let parsedResult = JSON.parse(addreq.responseText);

					const newRowID = parsedResult.insertId;

					var checkreq = new XMLHttpRequest();
					checkreq.open(
						"GET",
						"http://flip1.engr.oregonstate.edu:8687/customers/" + newRowID,
						true
					);

					checkreq.setRequestHeader("Content-Type", "application/json");
					checkreq.onreadystatechange = function () {
						// Call a function when the state changes.
						if (
							this.readyState === XMLHttpRequest.DONE &&
							this.status === 200
						) {
							console.log("success");
							let newRow = JSON.parse(checkreq.responseText)[0];

							addRow(newRow);
						}
					};

					checkreq.send(JSON.stringify(new_vals));
				}
			};
			addreq.send(JSON.stringify(new_vals));

			event.preventDefault();
		});
}

function getAllCustomersEmail() {
	httpRequest = new XMLHttpRequest();

	// Do stuff with the response
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			console.log("yes");
			console.log(httpRequest.response);
			const body = JSON.parse(httpRequest.response);
			console.log(body);
			for (const row of body) {
				addRow(row);
			}
		} else {
			console.log("no");
		}
	};
	httpRequest.open(
		"GET",
		"http://flip1.engr.oregonstate.edu:8687/customers/email/" +
			document.getElementById("add_email").value,
		true
	);
	httpRequest.send();
}

function getAllCustomersName() {
	httpRequest = new XMLHttpRequest();

	// Do stuff with the response
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			console.log("yes");
			console.log(httpRequest.response);
			const body = JSON.parse(httpRequest.response);
			console.log(body);
			for (const row of body) {
				addRow(row);
			}
		} else {
			console.log("no");
		}
	};
	httpRequest.open(
		"GET",
		"http://flip1.engr.oregonstate.edu:8687/customers/name/" +
			document.getElementById("add_first_name").value +
			"/" +
			document.getElementById("add_last_name").value,
		true
	);
	httpRequest.send();
}

function addSearchRow(addedVals) {
	console.log(addedVals);

	// Get new values from html table
	var table = document.getElementById("searchRows");
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
		"<button input type='button' class='edit' id='" +
		addedVals.id +
		"' value='Edit row'>" +
		"Edit customer" +
		"</button>";

	// Add functionality to edit button
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["customer_id"];
	});

	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete customer" +
		"</button>";

	console.log(addedVals.customer_id);

	console.log(addedVals["customer_id"]);

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/customers/" +
			addedVals["customer_id"]
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("customers").deleteRow(newRow.rowIndex);
				location.reload();
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/customers/" +
				addedVals["customer_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});

	// Add new order button ------
	newRow.insertCell().innerHTML =
		"<button input type='button' class='add' id='" +
		addedVals.id +
		"' value='Add row'>" +
		"Start new order" +
		"</button>";

	// Add functionality to add button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send create order request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If new order creation was successful, redirect to edit order page
				window.location.href =
					"http://web.engr.oregonstate.edu/~welshsa/public/orders/index.html?id=" +
					addedVals["order_id"];
			}
		});

		req.open(
			"GET",
			"http://flip1.engr.oregonstate.edu:8687/orders/new/" +
				addedVals["customer_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		console.log(req.responseText);

		event.preventDefault();
	});
}

// Submit search
function bindSearchButtons() {
	document
		.getElementById("cust_search")
		.addEventListener("click", function (event) {
			console.log("work damn you");
			// Get search values from form
			var firstName = document.getElementById("new_first_name").value;
			var lastName = document.getElementById("new_last_name").value;
			var email = document.getElementById("new_email").value;
			var zip = document.getElementById("new_zip").value;

			var addreq = new XMLHttpRequest();

			if (firstName !== "" && lastName !== "") {
				addreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/customers/name/" +
						firstName +
						"/" +
						lastName,
					true
				);
			} else if (email !== "") {
				addreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/customers/email/" + email,
					true
				);
			} else {
				alert("No customer found");
			}

			addreq.setRequestHeader("Content-Type", "application/json");
			addreq.onreadystatechange = function () {
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					console.log("yes");
					console.log(addreq.response);
					const body = JSON.parse(addreq.response);
					console.log(body);
					// Delete stuff
					var tableHeaderRowCount = 1;
					var table = document.getElementById("searchRows");
					var rowCount = table.rows.length;
					for (var i = tableHeaderRowCount; i < rowCount; i++) {
						table.deleteRow(tableHeaderRowCount);
					}

					for (const row of body) {
						addSearchRow(row);
					}
				}
			};
			addreq.send(null);

			event.preventDefault();
		});
}
