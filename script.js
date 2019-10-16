




var apiKey = "4068ce7013dbc9e2b3e2e764b179e755";
var date = moment().format('MM/D/YYYY');

	function getTemp (city) {
		$( "#currentCity" ).empty();
		var queryURL = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid="+apiKey;

		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {

			var cityName = $('<h4>').text(response.name + ' (' + date + ')');
			$('#currentCity').append(cityName);
			var selectedCity = $('<ul>');
			selectedCity.addClass('cityInfo');
			$('#currentCity').append(selectedCity);
			$('#currentCity').addClass('border');
			var temp = $('<li>').text("Temp " + response.main.temp + ' \xB0F');
			var humidity = $('<li>').text("Humidity: " + response.main.humidity + "%");
			var wind = $('<li>').text("Wind Speed: " + response.wind.speed);
			$('.cityInfo').append(temp);
			$('.cityInfo').append(humidity);
			$('.cityInfo').append(wind);
			var lat = response.coord.lat;
			var lon = response.coord.lon;
			var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

			$.ajax({
				url: uvURL,
				method: "GET"
			}).then(function (response) {
				console.log(response);
				var uvLabel = $('<li>').text("UV Index: ")
				var uv = $('<li>').text(response.value);
				uv.addClass('bg-color');
				$('.cityInfo').append(uvLabel, uv);
			});

		});
	}

	function getForecast(city) {
		$( "#fiveDayForecast" ).empty();
		var fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid="+apiKey;

		$.ajax({
			url: fiveDayURL,
			method: "GET"
		}).then(function(response) {
			console.log(response);

			// This is only writting out the last one e.g. the 5th day  Need to figure that out.
			for (var i = 1 ; i < 6; i++){
				let roll = i;
				var dailyInfoDiv =  $('<div>');
				dailyInfoDiv.addClass('dailyInfoDiv').addClass(roll).addClass('d-flex').addClass('flex-column').addClass('flex-fill').addClass('bg-primary').addClass('text-light').addClass('m-1');
				$('#fiveDayForecast').append(dailyInfoDiv);

				var dailyDate = $('.dailyInfoDiv').text(moment().add(1,'day').format('MM/D/YYYY'));
				var dailyDate = $('.dailyInfoDiv').text(moment().add(roll,'day').format('MM/D/YYYY'));
				$('.dailyinfoDiv').append(dailyDate);

				var dailyList = $('<ul>');
				dailyList.addClass('dailyList');
				$('.dailyInfoDiv').append(dailyList);

				var dayTemp = $('<li>').text("Temp: " + response.list[roll].main.temp + ' \xB0F');
				var dayHumidity = $('<li>').text("Humidity: " + response.list[roll].main.humidity + '%');
				$('.dailyList').append(dayTemp);
				$('.dailyList').append(dayHumidity);


				}
		});
}

function getCity() {

	$('.lookup').on('click', function () {
		console.log(this);
		console.log($(this).data());
		var input = $(this).data('input');
		var value = $(input).val();
		console.log(input);
		console.log(value);

		getForecast(value);
		getTemp(value);
	})

}

getCity();
