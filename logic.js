

let weather = {
	weatherKey: "9e1ad5dc29ebaf5a534ead4c5305b5af",
	unit: {word:"imperial", symbol: "\u00B0 F"},

	getLocation: function(city) {
		fetch('http://api.openweathermap.org/geo/1.0/direct?q='
			+ city
			+'&limit=1&appid='
			+ this.weatherKey)

		.then((response) => response.json())
		.then((locationData) => this.getWeather(locationData));
	},
	
	getWeather: function(data) {
		const {lat, lon, name, state} = data[0];
		
		fetch('https://api.openweathermap.org/data/2.5/weather?units='
		+ this.unit.word
		+'&lat='
		+ lat 
		+'&lon=' + lon 
		+ '&appid='
		+ this.weatherKey)
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
		document.querySelector('.temp').innerText = temp + this.unit.symbol;
		document.querySelector('.humidity').innerText = 'Humidity: ' + humidity + '%';
		document.querySelector('.feels-like').innerText = 'Feels Like ' + feels_like + this.unit.symbol;
		document.querySelector('.notes').innerText = description
		this.getImage(name);
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
			.then(imageData => this.addImage(imageData))
	},
		
	addImage: function(imageData){	
		try {
			const {web} = imageData["_embedded"]["city:search-results"][0]["_embedded"]["city:item"]["_embedded"]["city:urban_area"]["_embedded"]["ua:images"]["photos"][0]["image"];
			document.getElementById("imgId").src = web;
			document.getElementById("imgId").style.display = "inline-block";
		} catch (error) {
			document.getElementById("imgId").src = "";
			document.getElementById("imgId").style.display = "none"
		}		
	},

	search: function() {
		this.getLocation(document.querySelector('.search-bar').value);
	},
	
	changeUnit: function(){
		if(this.unit.word === "imperial"){
			this.unit.word = "metric";
			this.unit.symbol = "\u00B0 C";
			document.querySelector('.change-unit').value = "Change to Imperial";
		}
		else{
			this.unit.word = "imperial";
			this.unit.symbol = "\u00B0 F";
			document.querySelector('.change-unit').value = "Change to Celcius";
		}
		this.search()

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

document.querySelector('.change-unit').addEventListener('click', function(event){
	weather.changeUnit();
})

