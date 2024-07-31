// List of sentences
var _CONTENT = [
	"Effective...",
	"Amazing...",
	"Optimized..."
];

// Current sentence being processed
var _PART = 0;

// Character number of the current sentence being processed
var _PART_INDEX = 0;

// Holds the handle returned from setInterval
var _INTERVAL_VAL;

// Element that holds the text
var _ELEMENT = document.querySelector("#text");

// Cursor element
var _CURSOR = document.querySelector("#cursor");

// Implements typing effect
function Type() {
	// Get substring with 1 characater added
	var text =  _CONTENT[_PART].substring(0, _PART_INDEX + 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX++;

	// If full sentence has been displayed then start to delete the sentence after some time
	if(text === _CONTENT[_PART]) {
		// Hide the cursor
		_CURSOR.style.display = 'none';

		clearInterval(_INTERVAL_VAL);
		setTimeout(function() {
			_INTERVAL_VAL = setInterval(Delete, 50);
		}, 1000);
	}
}

// Implements deleting effect
function Delete() {
	// Get substring with 1 characater deleted
	var text =  _CONTENT[_PART].substring(0, _PART_INDEX - 1);
	_ELEMENT.innerHTML = text;
	_PART_INDEX--;

	// If sentence has been deleted then start to display the next sentence
	if(text === '') {
		clearInterval(_INTERVAL_VAL);

		// If current sentence was last then display the first one, else move to the next
		if(_PART == (_CONTENT.length - 1))
			_PART = 0;
		else
			_PART++;

		_PART_INDEX = 0;

		// Start to display the next sentence after some time
		setTimeout(function() {
			_CURSOR.style.display = 'inline-block';
			_INTERVAL_VAL = setInterval(Type, 100);
		}, 200);
	}
}

// Start the typing effect on load
_INTERVAL_VAL = setInterval(Type, 100);

function showLoader() {
  var btn = document.querySelector("#form-submit");
	btn.classList.add("loader");
	btn.innerText = "";
}

function hideLoader() {
	var btn = document.querySelector("#form-submit");
	var form = document.getElementById('form');
	btn.classList.remove("loader");
	btn.classList.add("hidden");
	form.classList.add("hidden");
	var lastbuttons = document.getElementById("two-buttons");
	lastbuttons.classList.remove("hidden");
}

function hideLoaderInError() {
	var btn = document.querySelector("#form-submit");
	var form = document.getElementById('form');
	btn.classList.remove("loader");
	btn.innerText = "Submit";
	var errMsg = document.createElement("p");
	errMsg.classList.add("errData");
	errMsg.innerHTML = "<ul><li>Error fetching data</li><li>try using a different url or refreshing the site</li><li>if none of the above methods work it maybe a server error</li></ul>";
	form.appendChild(errMsg);
	setTimeout(location.refresh,5000);
}


var query;

document.addEventListener('DOMContentLoaded', (query) => {
		const form = document.getElementById('form');
		var input = document.getElementById('form-url');
		var container = document.getElementById('data');
		form.addEventListener('click', async (e) => {
				e.preventDefault();
				query = input.value.trim();
				if (query) {
						try {
								showLoader();
								const response = await fetch(`/api/?url=${encodeURIComponent(query)}`);
								const data = await response.json();
								const stringdata = JSON.stringify(data);
								const formatted = stringdata.replaceAll("\\n","<br>");
								const final = formatted.replaceAll(/\*(.*?)\*/g, '<b>$1</b>');
								container.innerHTML = `<b style="display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:50px;line-height:20px;">Study Notes</b><br> ${final}`;
								hideLoader();
						} catch (error) {
								console.error('Error fetching data:', error);
								hideLoaderInError();
						}
				}
		});
});

document.addEventListener('DOMContentLoaded', (query) => {
		const form = document.getElementById('form');
		var input = document.getElementById('form-url');
		var resubmit = document.getElementById('btn1');
		var container = document.getElementById('data');
		resubmit.addEventListener('click', async (e) => {
				e.preventDefault();
				query = input.value.trim();
				if (query) {
						try {
								showLoader();
								const response = await fetch(`/api/?url=${encodeURIComponent(query)}`);
								const data = await response.json();
								const stringdata = JSON.stringify(data);
								const formatted = stringdata.replaceAll("\\n","<br>");
								final = formatted.replaceAll(/\*(.*?)\*/g, '<b>$1</b>');
								// container.innerHTML = JSON.stringify(data);
								container.innerHTML = `<b style="display:flex;align-items:center;justify-content:center;font-size:40px;margin-bottom:50px;line-height:20px;">Study Notes</b><br> ${final}`;
								hideLoader();
						} catch (error) {
								console.error('Error fetching data:', error);
								hideLoaderInError();
						}
				}
		});
});
