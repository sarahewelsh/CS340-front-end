document.addEventListener("DOMContentLoaded", bindAllButtons);

function bindAllButtons() {
	bindAddButtons();
	bindSearchButtons();
}

function getAllGenres() {
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
		"http://flip1.engr.oregonstate.edu:8687/genres",
		true
	);
	httpRequest.send();
}

function addRow(addedVals) {
	console.log(addedVals);

	// Get new values from html table
	var table = document.getElementById("genres");
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
		"Edit genre" +
		"</button>";

	// Add functionality to edit button
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["genre_id"];
	});

	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete genre" +
		"</button>";

	console.log(addedVals.genre_id);

	console.log(addedVals["genre_id"]);

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/genres/" + addedVals["genre_id"]
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("genres").deleteRow(newRow.rowIndex);
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/genres/" + addedVals["genre_id"],
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
		.getElementById("genre_add")
		.addEventListener("click", function (event) {
			console.log("here");
			// Get new values from form
			var new_vals = {
				genreType: document.getElementById("new_genre").value,
			};

			console.log(new_vals);
			var addreq = new XMLHttpRequest();

			addreq.onreadystatechange = function () {
				console.log(addreq.response);
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					console.log("success");
					let parsedResult = JSON.parse(addreq.responseText);

					const newRowID = parsedResult.insertId;

					var checkreq = new XMLHttpRequest();
					checkreq.open(
						"GET",
						"http://flip1.engr.oregonstate.edu:8687/genres/" + newRowID,
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

			addreq.open(
				"POST",
				"http://flip1.engr.oregonstate.edu:8687/genres/new",
				true
			);
			addreq.setRequestHeader("Content-Type", "application/json");

			addreq.send(JSON.stringify(new_vals));

			console.log("it should have sent");

			event.preventDefault();
		});
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
		"Edit genre" +
		"</button>";

	// Add functionality to edit button
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["genre_id"];
	});

	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete genre" +
		"</button>";

	console.log(addedVals.genre_id);

	console.log(addedVals["genre_id"]);

	console.log(
		"http://flip1.engr.oregonstate.edu:8687/genres/" + addedVals["genre_id"]
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("genres").deleteRow(newRow.rowIndex);
				location.reload();
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/genres/" + addedVals["genre_id"],
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
		.getElementById("genre_search")
		.addEventListener("click", function (event) {
			console.log("work damn you");
			// Get search values from form
			var newGenre = document.getElementById("new_genre").value;

			var addreq = new XMLHttpRequest();

			addreq.open(
				"GET",
				"http://flip1.engr.oregonstate.edu:8687/genres/type/" + newGenre,
				true
			);

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
