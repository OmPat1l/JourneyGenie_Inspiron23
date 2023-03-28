const express = require("express");
const https = require("https");

const app = express();
const PORT = 3000;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const apiKey = "yourApiKey";
let dataArray = 0;
let city = 0;
let kind = 0;
let lat = 0;
let long = 0;

let checkKind = 0;
app.get("/places/time/:time", (req, res) => {
  let timeLimit = req.params.time;
  let timeArray = [];
  for (let i = 0; i < dataArray.length; i++) {
    if (dataArray[i].dur <= timeLimit) {
      timeArray.push(dataArray[i]);
    }
  }

  res.send(timeArray);
});
app.get("/places/:city", (req, res) => {
  checkKind = false;
  //accomodations, amusements, adult, interesting_places, sport, tourist_facilities

  const city = req.params.city;
  lat = "";
  long = "";
  const cityUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${apiKey}`;

  https.get(cityUrl, (cityResponse) => {
    let cityData = "";
    cityResponse.on("data", (chunk) => {
      cityData += chunk;
    });
    cityResponse.on("end", () => {
      const cityJson = JSON.parse(cityData);
      lat = cityJson.lat;
      long = cityJson.lon;
      const placesUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=50000&lon=${long}&lat=${lat}&rate=2&format=json&apikey=${apiKey}`;

      https.get(placesUrl, (placesResponse) => {
        let placesData = "";
        placesResponse.on("data", (chunk) => {
          placesData += chunk;
        });
        placesResponse.on("end", () => {
          const placesJson = JSON.parse(placesData);
          placesJson.forEach((obj) => {
            const dist1 = parseFloat(obj.dist);
            obj.dur = Math.round(dist1) / 500;
          });
          placesJson.sort((a, b) => b.rate - a.rate);

          dataArray = placesJson;
          res.send(placesJson);
        });
      });
    });
  });
});

app.get("/places/:city/:kind", (req, res) => {
  //accomodations, amusements, adult, interesting_places, sport, tourist_facilities
  checkKind = true;
  city = req.params.city;
  let kind = req.params.kind;
  kind = req.params.kind;
  lat = "";
  long = "";
  const cityUrl = `https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${apiKey}`;
  https.get(cityUrl, (cityResponse) => {
    let cityData = "";
    cityResponse.on("data", (chunk) => {
      cityData += chunk;
    });
    cityResponse.on("end", () => {
      const cityJson = JSON.parse(cityData);
      lat = cityJson.lat;
      long = cityJson.lon;
      const placesUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=50000&lon=${long}&lat=${lat}&kinds=${kind}&rate=2&format=json&apikey=${apiKey}`;
      https.get(placesUrl, (placesResponse) => {
        let placesData = "";
        placesResponse.on("data", (chunk) => {
          placesData += chunk;
        });
        placesResponse.on("end", () => {
          const placesJson = JSON.parse(placesData);
          placesJson.forEach((obj) => {
            const dist1 = parseFloat(obj.dist);
            obj.dur = Math.round(dist1) / 500;
          });
          placesJson.sort((a, b) => b.rate - a.rate);
          dataArray = placesJson;
          res.send(placesJson);
        });
      });
    });
  });
});

app.get("/data", (req, res) => {
  res.send(dataArray);
});
app.get("/schedule/:duration", (req, res) => {
  const dayDuration = 11; // in hours
  const duration = parseInt(req.params.duration);
  if (isNaN(duration)) {
    res.status(400).send("Duration must be a number");
    return;
  }

  const schedule = [];
  let dayCount = 1;
  let timeLeft = dayDuration;
  let activitiesIndex = 0;
  let explore = 4;
  if (checkKind) {
    switch (kind) {
      case "accomodations":
        res.send("cannot schedule accomodations :)");
        break;
      case "sport":
        explore = 8;
        break;
      case "amusements":
        explore = 10;
        break;
      case "adult":
        explore = 4;
        break;
      case "tourist_facilities":
        explore = 4;
        break;
      default:
        explore = 3;
    }
  }

  const getRestaurantData = (activity) => {
    return new Promise((resolve, reject) => {
      let hotellat = activity.point.lat;
      let hotelong = activity.point.lon;
      let urlhotel = `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${hotelong}&lat=${hotellat}&kinds=restaurants&limit=2&format=json&apikey=${apiKey}`;
      https.get(urlhotel, (response) => {
        let data1 = "";

        response.on("data", (chunk) => {
          data1 += chunk;
        });
        response.on("end", () => {
          const jsonData = JSON.parse(data1);
          resolve(jsonData);
        });
        response.on("error", (error) => {
          reject(error);
        });
      });
    });
  };

  const processActivity = async (activity) => {
    const activityDuration = Math.trunc(
      explore + 2 * (parseInt(activity.dur) / 60)
    );
    let transport = 0;
    if (activityDuration < 2) {
      transport = "Bike";
    } else if (activityDuration > 2 && activityDuration < 10) {
      transport = "Car";
    } else {
      transport = "Bus";
    }

    if (activityDuration > timeLeft) {
      dayCount++;
      timeLeft = dayDuration;
      return;
    }
    const restaurantData = await getRestaurantData(activity);
    schedule.push({
      day: dayCount,
      point: activity.point,
      name: activity.name,
      rate: activity.rate,
      duration: activityDuration,
      restaurant: restaurantData,
      transport: transport,
    });
    activitiesIndex++;
    timeLeft -= activityDuration;
  };

  const processActivities = async () => {
    while (dayCount <= duration && activitiesIndex < dataArray.length) {
      const activity = dataArray[activitiesIndex];
      await processActivity(activity);
    }
    res.send(schedule);
  };

  processActivities().catch((error) => {
    console.error(error);
    res.status(500).send("Internal Server Error");
  });
});

// app.get("/schedule/:duration", (req, res) => {
//   const dayDuration = 11; // in hours
//   const duration = parseInt(req.params.duration);
//   if (isNaN(duration)) {
//     res.status(400).send("Duration must be a number");
//     return;
//   }

//   const schedule = [];
//   let dayCount = 1;
//   let timeLeft = dayDuration;
//   let activitiesIndex = 0;
//   let explore = 4;
//   if (checkKind) {
//     switch (kind) {
//       case "accomodations":
//         res.send("cannot schedule accomodations :)");
//         break;
//       case "sport":
//         explore = 8;
//         break;
//       case "amusements":
//         explore = 10;
//         break;
//       case "adult":
//         explore = 4;
//         break;
//       case "tourist_facilities":
//         explore = 4;
//         break;
//       default:
//         explore = 3;
//     }
//   }

//   while (dayCount <= duration && activitiesIndex < dataArray.length) {
//     const activity = dataArray[activitiesIndex];

//     const activityDuration = Math.trunc(
//       explore + 2 * (parseInt(activity.dur) / 60)
//     );

//     if (activityDuration > timeLeft) {
//       dayCount++;
//       timeLeft = dayDuration;
//       continue;
//     }
//     let hotellat = activity.point.lat;
//     let hotelong = activity.point.lon;
//     let urlhotel = `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${hotelong}&lat=${hotellat}&kinds=restaurants&limit=2&format=json&apikey=${apiKey}`;
//     https.get(urlhotel, (response) => {
//       let data1 = "";

//       response.on("data1", (chunk) => {
//         data1 += chunk;
//       });
//       let jsonData = 0;
//       response.on("end", () => {
//         jsonData = JSON.parse(data1);
//       });

//       schedule.push({
//         point: activity.point,
//         activity: activity.name,
//         rate: activity.rate,
//         day: dayCount,
//         duration: activityDuration,
//         hotel: jsonData,
//       });

//       activitiesIndex++;
//       timeLeft -= activityDuration;
//     });

//     res.send(schedule);
//   }
// });
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// app.get("/weather", (req, res) => {
//   const weather = `http://api.weatherapi.com/v1/current.json?key=9f944bc0f1d947b3a2a132553232403&q=${city}&aqi=no`;
//   let buffWeather = weather.current;
//   let w = JSON.parse(buffWeather);
//   res.send(w);
