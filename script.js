$(document).ready(function () {

    var theCity;
    var pastCities;
    
    //Inserts the correct dates into the variables
    var day1 = moment().add(1, "days").format("l");
    var day2 = moment().add(2, "days").format("l");
    var day3 = moment().add(3, "days").format("l");
    var day4 = moment().add(4, "days").format("l");
    var day5 = moment().add(5, "days").format("l");


    //Function puts recently searched cities into the list
    function listCities() {

        $("#pastSearched").text("");

        pastCities.forEach((theCity) => {

          $("#pastSearched").prepend("<tr><td>" + theCity + "</td></tr>");

        });
      }
    
    //This function takes the list of searches and saves it to local storage
    function saveToLocalStorage() {

        localStorage.setItem("mostRecent", theCity);

        pastCities.push(theCity);

        localStorage.setItem("cities", JSON.stringify(pastCities));

      }

    //Inserts cities from local storage
    function getCities() {
        var recentCities = JSON.parse(localStorage.getItem("cities"));
    
        if (recentCities) {

          pastCities = recentCities;

        } else {

          pastCities = [];

        }
      }
    
      getCities()
    

      //Takes the most recent city searched, to be used later to create main search results and 5 day forecast
    function getRecent() {

      var lastSearch = localStorage.getItem("mostRecent");

      if (lastSearch) {

        theCity = lastSearch;

        searchFun();

      } 

  
      
    }
  
        getRecent()
  
  
    //Takes user input and creates a variable for later use as well as saving the recent search to local storage
    function getCity() {

        theCity = $("#cityInput").val();

        if (theCity && pastCities.includes(theCity) === false) {

          saveToLocalStorage();

        }
      }
  
  
    //API function call
    //Used to find data on certain cities 
    //Then displays the data through HTML
    function searchFun() {

      var coordinates = [];
  
      $.ajax({

        url: "https://api.openweathermap.org/data/2.5/weather?q=" + theCity + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",

        method: "GET",

      }).then(function (response) {
        
        var cityName = response.name;
        var cityCond = response.weather[0].description;
        var cityTemp = response.main.temp;
        var cityHum = response.main.humidity;
        var cityWind = response.wind.speed;
        var pic = response.weather[0].icon;

        $("#date1").text(day1);
        $("#date2").text(day2);
        $("#date3").text(day3);
        $("#date4").text(day4);
        $("#date5").text(day5);

        $("#pic").html(`<img src="http://openweathermap.org/img/wn/${pic}@2x.png">`);

        $("#cityName").html(cityName);
        $("#conditions").text("Conditions: " + cityCond);
        $("#temperature").text("Temperature: " + cityTemp);
        $("#humidity").text("Humidity: " + cityHum);
        $("#windSpeed").text("Wind Speed: " + cityWind);


        coordinates.push(response.coord.lat);
        coordinates.push(response.coord.lon);
        fullData(response.coord.lat, response.coord.lon);
      })
    }

    //Function for retrieving the rest of the necessary data
    //That is then displayed on the page using string concatenation 
    //At the end, the UV index is shown and the color of the text is changed based upon the severity
    function fullData(lat, long) {
       
          
        $.ajax({

        url: "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly" + "&units=imperial&appid=42d98d76405f5b8038f2ad71187af430",

        method: "GET",

            }).then(function (response) {
            
                let day1temp = response.daily[1].temp.max;
                let day2temp = response.daily[2].temp.max;
                let day3temp = response.daily[3].temp.max;
                let day4temp = response.daily[4].temp.max;
                let day5temp = response.daily[5].temp.max;

                    
                $("#temperature1").text("Temp(F):" + " " + day1temp);
                $("#temperature2").text("Temp(F):" + " " + day2temp);
                $("#temperature3").text("Temp(F):" + " " + day3temp);
                $("#temperature4").text("Temp(F):" + " " + day4temp);
                $("#temperature5").text("Temp(F):" + " " + day5temp);
            

                let day1hum = response.daily[1].humidity;
                let day2hum = response.daily[2].humidity;
                let day3hum = response.daily[3].humidity;
                let day4hum = response.daily[4].humidity;
                let day5hum = response.daily[5].humidity;


                $("#hum1").text("Humidity:" + " " + day1hum + "%");
                $("#hum2").text("Humidity:" + " " + day2hum + "%");
                $("#hum3").text("Humidity:" + " " + day3hum + "%");
                $("#hum4").text("Humidity:" + " " + day4hum + "%");
                $("#hum5").text("Humidity:" + " " + day5hum + "%");
            
                let pic1 = response.daily[1].weather[0].icon;
                let pic2 = response.daily[2].weather[0].icon;
                let pic3 = response.daily[3].weather[0].icon;
                let pic4 = response.daily[4].weather[0].icon;
                let pic5 = response.daily[5].weather[0].icon;
                    
            
                $("#pic1").html(`<img src="http://openweathermap.org/img/wn/${pic1}@2x.png">`);
                $("#pic2").html(`<img src="http://openweathermap.org/img/wn/${pic2}@2x.png">`);
                $("#pic3").html(`<img src="http://openweathermap.org/img/wn/${pic3}@2x.png">`);
                $("#pic4").html(`<img src="http://openweathermap.org/img/wn/${pic4}@2x.png">`);
                $("#pic5").html(`<img src="http://openweathermap.org/img/wn/${pic5}@2x.png">`);
                        
                var uvIndex = response.current.uvi;
            
                if (uvIndex >= 8) {
                        
                            $("#uvIndex").css("color", "red");

                        } else if (uvIndex > 4 && uvIndex < 8) {

                            $("#uvIndex").css("color", "yellow");

                        } else {

                            $("#uvIndex").css("color", "green");

                        }

                        $("#uvIndex").text("UV Index:" + " " + uvIndex);

                });
        }

    
    //Search button
    $("#submit").on("click", (e) => {

        e.preventDefault();

        getCity();

        searchFun();

        $("#cityInput").val("");

        listCities();

      });
    

//Clear button
    $("#clr-btn").click(() => {

        localStorage.removeItem("cities");

        getCities();

        listCities();

      });
  

    listCities();

        
  });
  