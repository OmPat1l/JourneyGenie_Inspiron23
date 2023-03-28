# Best Web Dev Project in Inspiron'23 :- JourneyGenie
Inspiron is a national lvl hackathon with 1000+ participants and 200+ teams, organised by Computer Society of India, COEP Tech Student Chapter in <br> association with Devfolio, Polygon Labs, UPTIQ and StampMyVisa.<br>
Our problem statement was to create a travel itenary recommendation website, which recommends popular tourist destination, and also schedules trips. <br>
(Recommend Destination and create itenary) <br>
To solve this, We came up with JourneyGenie <br>
<br>
FOR VIDEO DEMO VISIT "https://www.linkedin.com/in/ompatil130503" <br>
<br>
#Api Info <br>
Tech stack used here is HTML, CSS, JS, Node and Express <br>
This folder contains 3 subfolders of which touristApi is not working and was a pitch idea <br>
to start working run app.js in node inside the subfolde searchApi <br>
There are total 5 endpoints and we use "opentripmap" to fetch data across world <br>
1) "/places/:city" this endpoint first gives us longitude and latitude of a city/place and then relays it to obtain all the tourist destinations near <br>
that coordinates with distance to travel, duration to reach, ratings, tags and much more (this list will be sorted according to ratings) <br>
<br>
2) "/places/:city/:kind" This endpoint retrieves a list of places within a 50km radius of the specified city that match the specified kind of place.<br> The available kinds of places are: accomodations, amusements, adult, interesting_places, sport, and tourist_facilities. <br>
This  endpoint  listens to GET requests to the URL path /places/:city/:kind and expects two parameters: city and kind.
<br>
The purpose of this endpoint is to retrieve information about places in a given city that match a specific kind. The possible values for kind are: accomodations, amusements, adult, interesting_places, sport, tourist_facilities.
<br>
The endpoint starts by setting a flag checkKind to true, which will be used later to determine whether to apply additional logic based on the kind parameter. It then retrieves the latitude and longitude of the city using the OpenTripMap API, and saves them in the lat and long variables.
<br>
It then constructs a URL to query the OpenTripMap API for places that match the kind parameter and are within a 50km radius of the city's coordinates. The query also filters places with a rating of less than or equal to 2.
<br>
Once the API call returns with the data, it calculates the travel duration to each place from the city using a distance-to-duration conversion formula, and sorts the resulting array of places by their rating in descending order.
<br>
The resulting array of places is then sent as the response to the client.<br>

To use this endpoint, make a GET request to the URL, replacing :city with the name of the city you want to search in and :kind with the kind of place you <br> want to search for <br>
for more info about the catalogue of categories visit "https://opentripmap.io/catalog" <br>
this would only return the types of destination that particular category has <br>
<br>
3) "places/time/:time" this endpoint allows users to enter time (in minutes in url which can be manupilated) and the api would only return those places which could be covered in this time. <br>
<br>
4) "/schedule/:duration" duration here is the number of days, and the api would return hourly schedule of each day with ratings of each place and<br> restaurants near it (i have limited it to top 2 restaurants acc to dist, but we can further customise it)
<br>
This is an endpoint for scheduling activities based on a duration input. The endpoint accepts a GET request with a duration parameter in days. The endpoint returns a JSON response with a schedule array of objects that contains information about the scheduled activities.
<br>
The endpoint first checks if the duration parameter is a number, and returns a 400 Bad Request response if it is not. The endpoint then initializes some variables for keeping track of the schedule, including the day count, time left in the day, and index of the current activity.
<br>
The endpoint also sets the explore variable, which determines the recommended duration for exploring each point of interest. The explore value is different depending on the kind of activity requested.
<br>
The endpoint then defines two helper functions. The first function, getRestaurantData, makes an HTTP GET request to the OpenTripMap API to retrieve data about nearby restaurants for a given activity. The second function, processActivity, processes a single activity and adds it to the schedule array.
<br>
The endpoint then defines a main function, processActivities, which loops through the activities and calls processActivity for each one. If the duration of the current activity exceeds the time left in the day, the endpoint increments the day count and resets the time left. Once the duration or number of days exceeds the duration parameter, the endpoint sends the schedule array in the response.
<br>
Overall, this endpoint provides a convenient way to schedule activities based on a desired duration, making use of the OpenTripMap API to retrieve nearby restaurant data for each activity.<br>
5)"/data" this endpoint is only for testing and debugging process (ofc you can use it acc to ur choice), it return all the info in my api<br>
<br>
PLEASE NOTE HERE, THERE ARE STILL A LOT OF CUSTOMISATIONS POSSIBLE AND THIS API IS BUILT COMPLETELY FROM SCRATCH SO IS CRUDE AS OF NOW, AND ONE CAN <br>
PLAY AROUND IN FRONTEND AS WELL TO ENHANCE USER EXPERIENCE
<br>

the JouneyGenie file here is for the frontend part, you can start the server and open the html file to directly see the result <br>
The images are stock images and are randomly alloted, this was done in order to make the api faster <br>
<br>
Thank you for taking the time to read this readme file. I hope this project can be useful to you and inspire you to create something great. If you have any questions, suggestions, or feedback, please don't hesitate to contact me. "https://www.linkedin.com/in/ompatil130503"
