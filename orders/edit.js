document.addEventListener("DOMContentLoaded", bindEditButtons);

// Get id parameter from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// Submit changes
function bindEditButtons() {
	document.getElementById("edit").addEventListener("click", function (event) {
		// Get new values from edit form
		var new_vals = {
			firstName: document.getElementById("edit_first_name").value,
			lastName: document.getElementById("edit_last_name").value,
			email: document.getElementById("edit_email").value,
			zip: document.getElementById("edit_zip").value,
			id: id,
		};

		var editreq = new XMLHttpRequest();
		editreq.open(
			"POST",
			"http://flip1.engr.oregonstate.edu:8687/customers",
			true
		);

		editreq.setRequestHeader("Content-Type", "application/json");
		editreq.onreadystatechange = function () {
			// Call a function when the state changes.
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				console.log("success");
				let parsedResult = JSON.parse(editreq.responseText);
				window.location.href =
					"http://web.engr.oregonstate.edu/~welshsa/public/orders";
			}
		};
		editreq.send(JSON.stringify(new_vals));

		event.preventDefault();
	});
}

// Get information associated with a specific id in the database
document.addEventListener("DOMContentLoaded", getSpecificOrder(id));
function getSpecificOrder(id) {
	var req = new XMLHttpRequest();

	req.addEventListener("load", function () {
		if (req.status >= 200 && req.status < 400) {
			console.log("success");
			console.log(req.responseText);
		}
		let current_vals = JSON.parse(req.responseText);
		console.log(current_vals[0]);
		var orderID = current_vals.order_id;

		// document.getElementById("edit_first_name").value =
		// 	current_vals[0]["first_name"];
		// document.getElementById("edit_last_name").value =
		// 	current_vals[0]["last_name"];
		// document.getElementById("edit_email").value = current_vals[0]["email"];
		// document.getElementById("edit_zip").value = current_vals[0]["zip"];
	});

	req.open(
		"GET",
		"http://flip1.engr.oregonstate.edu:8687/orders_items/" + orderId,
		true
	);
	req.setRequestHeader("Content-Type", "application/json");
	req.send(null);
}
