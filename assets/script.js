
$(document).ready(function () {

	// Global variables
	var apiKey = "4068ce7013dbc9e2b3e2e764b179e755";
	var date = moment().format('MM/D/YYYY');
	var defaultCity = "Denver";

	// This function will get the cities Temp, Humidity, Wind speed and UV Index
	// using 2 API's.  The current forecast API and UV API
	function getTemp(city) {

		//  You have to clear the current city so they don't stack on top of each other
		$("#currentCity").empty();
		var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

		// The ajax call to grab the current weather conditions
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {

			// Create a h4 tag and write the current date from our global variable above
			var cityName = $('<h4>').text(response.name + ' (' + date + ')');

			// Create a unordered List element and assign a class of cityInfo
			var selectedCity = $('<ul>');
			selectedCity.addClass('cityInfo');

			// Create list elements and write the temp, humidity and wind speed into memory
			var temp = $('<li>').text("Temp " + response.main.temp + ' \xB0F');
			var humidity = $('<li>').text("Humidity: " + response.main.humidity + "%");
			var wind = $('<li>').text("Wind Speed: " + response.wind.speed);


			// Write the city name to the currentCity DIV
			$('#currentCity').append(cityName);

			// Attach the selectedCity <ul> tag to the currentCity DIV and add a class of border
			$('#currentCity').append(selectedCity);
			$('#currentCity').addClass('border');

			// Append the temp, humidity and wind speed on to the page
			$('.cityInfo').append(temp);
			$('.cityInfo').append(humidity);
			$('.cityInfo').append(wind);

			// Grab the latitude and longitude to be used for the UV API
			var lat = response.coord.lat;
			var lon = response.coord.lon;

			// Set the UV API URL
			var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

			// Ajax call to grab UV data
			$.ajax({
				url: uvURL,
				method: "GET"
			}).then(function (response) {
				// console.log(response);

				// Create the list element tag and write the UV index label and data to memory
				// var uvLabel = $('<li>').text("UV Index: ");
				// var uvLabel = $('<li>').text("UV Index: ").wrapInner('<span></span>');
				// var uv = $('<li>').text(response.value);
				// var uvLabel = $('<li>').text("UV Index: " , uv);
				// Add some style color to the value
				var uv = $('<li>').text("UV Index: " + response.value);
				uv.addClass('bg-color');
				// $('.cityInfo').append("UV Index: ");
				$('.cityInfo').append(uv);
			});

		});
	}

	// use Const instead of var since this is a constant value
	// store "str => str.split(' ').shift();" into the getDate const Pass the string of the 3 hour times  and
	const getDate = str => str.split(' ').shift();
	// console.log("getDate is " + getDate);
	function cleanResponse(response) {
		const map = {};

		const cleanedResponses = response.filter(function (reading) {
			const date = getDate(reading.dt_txt);
			// console.log("date is " + date);
			if (!map[date]) {
				map[date] = true;
				return true;
			}
			return false;
		});

		return cleanedResponses;
	}

	// Get the 5 day forecast function
	function getForecast(city) {

		// clear out the forecast so it doesn't stack for each new city
		$("#fiveDayForecast").empty();

		// Set the 5 day forecast URL
		var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

		// Ajax call to grab the 5 day forecast
		$.ajax({
			url: fiveDayURL,
			method: "GET"
		}).then(function (response) {
			// console.log(response);

			// The API returns the 5 day forecast and 3 hour windows for each day.  We only want One and not every 3
			// hours.  We have to filter out and grab one response for each day. The cleanResponse function does that.
			const cleanedResponse = cleanResponse(response.list);

			// console.log('cleaned response', cleanedResponse);

			cleanedResponse.slice(0, 5).map(function (record, i) {
				var dailyInfoDiv = $('<div>');
				dailyInfoDiv
					.addClass('dailyInfoDiv')
					.addClass(i)
					.addClass('d-flex')
					.addClass('flex-column')
					.addClass('flex-fill')
					.addClass('bg-primary'
					).addClass('text-light')
					.addClass('m-1');

				var dailyDate = dailyInfoDiv
					.text(moment()
					.add(i, 'day')
					.format('MM/D/YYYY'));
				dailyInfoDiv.append(dailyDate);

				var dailyList = $('<ul>');
				dailyList.addClass('dailyList');
				dailyInfoDiv.append(dailyList);

				var dayTemp = $('<li>').text("Temp: " + record.main.temp + ' \xB0F');
				var dayHumidity = $('<li>').text("Humidity: " + record.main.humidity + '%');
				dailyList.append(dayTemp);
				dailyList.append(dayHumidity);
				$('#fiveDayForecast').append(dailyInfoDiv);

			})

		});
	}

	// Store the history of cities to local storage.
	function storeCity(city) {
		// Create list elements and write the city to memory
		var selectedCity = $('<li>').text(city);
		// add attributes to the <li> tag
		selectedCity.attr({type: 'button', class:'savedCity', name:city});
		// write the city name to the html page
		$('#cities').append(selectedCity);
		// store the city name in localstorage
		localStorage.setItem(city, city);
	}

	// The getCity function listens for the on click search button and passes the city name to the getForecast and
	// getTemp functions
	function getCity() {

		$('.lookup').on('click', function () {
			// console.log(this);
			// console.log($(this).data());
			// on click will assign "this" which is -> "<button data-input="#city" class="lookup"></button>" to the
			// variable input, input has the value "#city" that it gets from "data-input" #city is the ID of the
			// input field
			var input = $(this).data('input');

			// The city variable gets the value from the input field
			var city = $(input).val();
			// console.log("this is input " + input);
			// console.log("this is value " + value);

			// pass the city to both functions.
			getForecast(city);
			getTemp(city);
			storeCity(city);
		})

	}

	// Load saved city forecast and tempature
	$('#cities').on('click', 'li',  function (e) {
		e.preventDefault();
		// grab the innerHTML "city name" and assigin it to selected city
		var selectedCity = $(this)[0].innerHTML;
		// console.log(selectedCity);
		// Run the getTemp and get Forecast functions
		getTemp(selectedCity);
		getForecast(selectedCity);
	});

	// This loads your saved cities when you load the page
	function retrieveCities() {
		// grab the value attribute of your stored cities and assign it to keys
		keys = Object.values(localStorage);
		// console.log(keys);
		// If there are no cities stored then return
		for (var i = 0; i < keys.length; i++) {
			if (keys === null) {
				return;
			}
			else {
				// If there are cities get the number of cities and loop through each one and assign the name
				// attribute
				// retrieving the city names from local storage and creating a new <li> tag to append them to
				var selectedCity = $('<li>').text(keys[i]);
				selectedCity.attr({type: 'button', class:'savedCity', name:keys[i]});
				$('#cities').append(selectedCity);
			}
		}
	}

	// Loads Denver as the default city when the page loads.
	function init(denver) {

		getTemp(denver);
		getForecast(denver);

	}

	// Init will grab the default city, Denver and load the page
	init(defaultCity);
	retrieveCities();
	getCity();

});