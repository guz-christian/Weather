let weather = {
	apiKey: '67178ebe8a9cdfb17009241a9860e511',
	getLocation: function(city) {
		fetch('http://api.openweathermap.org/geo/1.0/direct?q='
			+ city
			+'&limit=1&appid='
			+ this.apiKey)

		.then((response) => response.json())
		.then((locationData) => this.getWeather(locationData));
	},
	getWeather: function(data) {
		const {lat, lon, name, state} = data[0];

		fetch('https://api.openweathermap.org/data/2.5/weather?units=imperial&lat='
			+ lat 
			+'&lon=' + lon 
			+ '&appid='
			+ this.apiKey)
		.then((response) => response.json())
		.then((weatherData) => this.displayWeather(weatherData,name,state));
	},
	displayWeather: function(weatherData,name,state) {
		const {temp} = weatherData.main;
		const {feels_like} = weatherData.main;
		const {humidity} = weatherData.main;
		const {description} = weatherData.weather[0]
		document.querySelector('.stats').style.display = 'inline-block';
		document.querySelector('.advice').style.display = 'inline-block';
		document.querySelector('h1').innerText = name +', ' + state;
		document.querySelector('.temp').innerText = temp;
		document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
		document.querySelector('.feels-like').innerText = 'Feels Like ' + feels_like;
		document.querySelector('.notes').innerText = description
		this.getImage(name);
	},
	search: function() {
		this.getLocation(document.querySelector('.search-bar').value);
	},

	getImage: function(city){
		const rootUrl = 'https://api.teleport.org/api/cities/?search=';
        const endUrl = '&embed=city:search-results/city:item&embed=city:search-results/city:item/city:urban_area&embed=city:search-results/city:item/city:urban_area/ua:images';

        fetch(
            rootUrl
            + city
            + endUrl
        )
		.then(response => response.json())
        .then(imageData => this.changeBackground(imageData))
	},

	changeBackground: function(imageData){
		const {web} = imageData["_embedded"]["city:search-results"][0]["_embedded"]["city:item"]["_embedded"]["city:urban_area"]["_embedded"]["ua:images"]["photos"][0]["image"];
		console.log(web)

        document.querySelector("body").style.backgroundImage = "url(" + web + ")";
	}
};

document.querySelector('.search-button').addEventListener('click', function() {
	weather.search();
})

document.querySelector('.search-bar').addEventListener('keypress', function(event) {
	if(event.key === "Enter"){
		weather.search();
	}
})

