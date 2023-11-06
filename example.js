let weather ={
    apiKey: '9e1ad5dc29ebaf5a534ead4c5305b5af',
    getLocation: function(city) {
        fetch('http://api.openweathermap.org/geo/1.0/direct?q='
            + city
            +'&limit=1&appid='
            + this.apiKey
        )
        .then(response => response.json())
        .then((locationData) => this.getWeather(locationData));
    },

    getWeather: function(data){
        const {lat,lon,name,state} = data[0];
        fetch(
            'https://api.openweathermap.org/data/2.5/weather?lat='
            + lat
            +'&lon='
            +lon
            +'&appid='
            + this.apiKey
        )
        .then(response => response.json())
        .then(weatherdata => this.displayWeather(weatherdata,name,state))
    },

    displayWeather: function(weatherdata,name,state){
        const {temp} = weatherdata.main;
        const {feels_like} = weatherdata.main;
        const {humidity} = weatherData.main;
		const {description} = weatherData.weather[0];

        document.querySelector('.location').innerText = name + ',' + state;
        document.querySelector('.temp').innerText = temp;
        document.querySelector('.humidity').innerText = 'Humidity: ' + humidity;
        document.querySelector('.feels-like').innerText = 'feels like: ' + feels_like;
        document.querySelector('.notes').innerText = description;

        // this.getImage(name)

    },

    search: function(){
        this.getLocation(document.querySelector('search-bar').value)
    },

    getImage: function(city){
        const rootUrl = 'https://api.teleport.org/api/cities/?search=';
        const endUrl = '&embed=city:search-results/city:item&embed=city:search-results/city:item/city:urban_area&embed=city:search-results/city:item/city:urban_area/ua:images';

        fetch(
            rootUrl
            + city
            + endUrl
        )
        .then(response => this.changeBackground(response))
    },

    changeBackground: function(response){
        const image = response.embedded["city:search-results"][0]["embedded"]["city:urban_area"]["embeded"]["ua:images"]["photos"][0]["image"]["web"];

        document.getElementById("body").style.backgroundImage = "url(" + "image" + ")"

    }


}

document.querySelector('.search-button').addEventListener('click',function(){
    weather.search()
})