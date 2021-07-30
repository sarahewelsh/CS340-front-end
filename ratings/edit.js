document.addEventListener("DOMContentLoaded", bindEditButtons);

// Get id parameter from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// Submit changes
function bindEditButtons() {
	document.getElementById("edit").addEventListener("click", function (event) {
		// Get new values from edit form
		var new_vals = {
			name: document.getElementById("new_item_name").value,
			rating: document.getElementById("new_item_rating").value,
			genre: document.getElementById("new_item_genre").value,
			type: document.getElementById("new_item_type").value,
			cost: document.getElementById("new_item_cost").value,
		};

		var editreq = new XMLHttpRequest();
		editreq.open(
			"POST",
			"http://flip1.engr.oregonstate.edu:8687/ratings",
			true
		);

		editreq.setRequestHeader("Content-Type", "application/json");
		editreq.onreadystatechange = function () {
			// Call a function when the state changes.
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				console.log("success");
				let parsedResult = JSON.parse(editreq.responseText);
				window.location.href =
					"http://web.engr.oregonstate.edu/~welshsa/public/ratings";
			}
		};
		editreq.send(JSON.stringify(new_vals));

		event.preventDefault();
	});
}

// Get information associated with a specific id in the database
document.addEventListener("DOMContentLoaded", getSpecificRating(id));
function getSpecificRating(id) {
	var req = new XMLHttpRequest();

	req.addEventListener("load", function () {
		if (req.status >= 200 && req.status < 400) {
			console.log("success");
			console.log(req.responseText);
		}

		let current_vals = JSON.parse(req.responseText);
		console.log(current_vals[0]);

		document.getElementById("edit_rating").value =
			current_vals[0]["rating_type"];
	});

	req.open("GET", "http://flip1.engr.oregonstate.edu:8687/ratings/" + id, true);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(null);
}
