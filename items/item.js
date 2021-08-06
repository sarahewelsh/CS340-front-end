document.addEventListener("DOMContentLoaded", bindAllButtons);
document.addEventListener("DOMContentLoaded", addRatingOptions);
document.addEventListener("DOMContentLoaded", addGenreOptions);

function bindAllButtons() {
	bindAddButtons();
	bindSearchButtons();
}

function getAllItems() {
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
		"http://flip1.engr.oregonstate.edu:8687/items/",
		true
	);
	httpRequest.send();
}

// Get current rating_types for drop down menu
function addRatingOptions() {
	addSelectOptions(
		"new_rating_type",
		"rating",
		"http://flip1.engr.oregonstate.edu:8687/ratings",
		{
			rating_id: null,
			rating_type: "(None)",
		}
	);
}

// Get current genre_types for dropdown menu
function addGenreOptions() {
	addSelectOptions(
		"new_genre_type",
		"genre",
		"http://flip1.engr.oregonstate.edu:8687/genres",
		{
			genre_id: null,
			genre_type: "(None)",
		}
	);
}

function addSelectOptions(id, type, url, nullObject) {
	var httpRequest = new XMLHttpRequest();

	// Do stuff with the response
	httpRequest.onreadystatechange = function () {
		console.log(type + " body");
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			const body = JSON.parse(httpRequest.response);
			body.reverse();
			body.unshift(nullObject);

			var select = document.getElementById(id);

			for (const row of body) {
				addSelectOption(select, row[type + "_type"]);
			}
		} else {
			console.log("no");
		}
	};
	httpRequest.open("GET", url, true);
	httpRequest.send();
}

function addSelectOption(node, optionName) {
	var option = document.createElement("option");
	option.text = option.value = optionName;
	node.add(option, 0);
}

// Add new row when item is added
function addRow(addedVals) {

	// Get new values from html table
	var table = document.getElementById("items");
	// Add a new row to the end of the table
	var newRow = table.insertRow(table.rows.length);

	var hackCounter = 0; 
	for (const [key, value] of Object.entries(addedVals)) {
		var newCell = newRow.insertCell(hackCounter);
		newCell.innerText = value;
		hackCounter++;
	}

	// Add edit button 
	newRow.insertCell().innerHTML =
		"<button input type='button' class='edit' id='" +
		addedVals.id +
		"' value='Edit row'>" +
		"Edit item" +
		"</button>";

	// Add functionality to edit button
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["item_id"];
	});

	// Add delete button
	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete item" +
		"</button>";
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("items").deleteRow(newRow.rowIndex);
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/items/" + addedVals["item_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		event.preventDefault();
	});
}

// Get id parameter from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// Submit changes
function bindAddButtons() {
	document
		.getElementById("item_add")
		.addEventListener("click", function (event) {
			console.log("here");
			// Get new values from form
			var ratingThing = document.getElementById("new_rating_type");
			var genreThing = document.getElementById("new_genre_type");

			var new_vals = {
				name: document.getElementById("new_item_name").value,
				rating: ratingThing.options[ratingThing.selectedIndex].text,
				genre: genreThing.options[genreThing.selectedIndex].text,
				type: document.getElementById("new_item_type").value,
				cost: document.getElementById("new_item_cost").value,
			};

			var addreq = new XMLHttpRequest();

			addreq.onreadystatechange = function () {
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					let parsedResult = JSON.parse(addreq.responseText);
					const newRowID = parsedResult.insertId;

					var checkreq = new XMLHttpRequest();
					checkreq.open(
						"GET",
						"http://flip1.engr.oregonstate.edu:8687/items/" + newRowID,
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
				"http://flip1.engr.oregonstate.edu:8687/items/new",
				true
			);

			addreq.setRequestHeader("Content-Type", "application/json");
			addreq.send(JSON.stringify(new_vals));

			event.preventDefault();
		});
}

function addSearchRow(addedVals) {

	// Get new values from html table
	var table = document.getElementById("searchRows");
	// Add a new row to the end of the table
	var newRow = table.insertRow(table.rows.length);

	var hackCounter = 0; // DO NOT DO THIS; THIS IS BAD AND I SHOULD FEEL BAD.
	for (const [key, value] of Object.entries(addedVals)) {
		var newCell = newRow.insertCell(hackCounter);
		newCell.innerText = value;
		hackCounter++;
	}

	newRow.insertCell().innerHTML =
		"<button input type='button' class='edit' id='" +
		addedVals.id +
		"' value='Edit row'>" +
		"Edit item" +
		"</button>";

	// Add functionality to edit button
	newRow.lastChild.addEventListener("click", function (event) {
		window.location.href = "edit.html?id=" + addedVals["item_id"];
	});

	newRow.insertCell().innerHTML =
		"<button input type='button' class='delete' id='" +
		addedVals.id +
		"' value='Delete row'>" +
		"Delete item" +
		"</button>";
	);

	// Add functionality to delete button
	newRow.lastChild.addEventListener("click", function (event) {
		var req = new XMLHttpRequest();

		// Send delete request to database
		req.addEventListener("load", function () {
			if (req.status >= 200 && req.status < 400) {
				console.log("success");

				// If deletion from database was successful, delete from html table
				document.getElementById("items").deleteRow(newRow.rowIndex);
				location.reload();
			}
		});

		req.open(
			"DELETE",
			"http://flip1.engr.oregonstate.edu:8687/items/" + addedVals["item_id"],
			true
		);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(null);
		event.preventDefault();
	});
}

// Submit search
function bindSearchButtons() {
	document
		.getElementById("item_search")
		.addEventListener("click", function (event) {
			// Get search values from form
			var ratingThing = document.getElementById("new_rating_type");
			var genreThing = document.getElementById("new_genre_type");

			var name = document.getElementById("new_item_name").value;
			var rating = ratingThing.options[ratingThing.selectedIndex].text;
			var genre = genreThing.options[genreThing.selectedIndex].text;
			var type = document.getElementById("new_item_type").value;
			var cost = document.getElementById("new_item_cost").value;

			var addreq = new XMLHttpRequest();

			if (name !== "") {
				addreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/name/" + name,
					true
				);
			} else if (rating !== "") {
				addreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/rating/" + rating,
					true
				);
			} else if (genre !== "") {
				addreq.open(
					"GET",
					"http://flip1.engr.oregonstate.edu:8687/items/genre/" + genre,
					true
				);
			} else {
				alert("Please enter valid search criteria.");
			}

			addreq.setRequestHeader("Content-Type", "application/json");
			addreq.onreadystatechange = function () {
				// Call a function when the state changes.
				if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
					const body = JSON.parse(addreq.response);
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
