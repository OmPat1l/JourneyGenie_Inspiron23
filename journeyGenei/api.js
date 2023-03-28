let images = [
  "./img/about-1.jpg",
  "./img/back1.jpg",
  "./img/back2.jpg",
  "./img/blog-1.jpg",
  "./img/blog-2.jpg",
  "./img/blog-3.jpg",
  "./img/goa.jpg",
];
let duration = 0;
//letsGo
const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", handleSubmit);
function handleSubmit() {
  const place = document.getElementById("place").value;
  const category = document.getElementById("category").value;
  let cardsContainer = document.getElementById("apirow");
  let dataArray = 0;

  const departDate = new Date(document.getElementById("departDate").value);
  const returnDate = new Date(document.getElementById("returnDate").value);
  duration = Math.ceil((returnDate - departDate) / (1000 * 60 * 60 * 24));
  console.log(place, duration, category);
  fetch(`http://localhost:3000/places/${place}/${category}`)
    .then((response) => response.json())
    .then((data) => {
      // loop through the response data and generate cards
      data.forEach((place) => {
        // create the card element
        const randomImagePath =
          images[Math.floor(Math.random() * images.length)];
        const card = document.createElement("div");
        card.className = "col-lg-4 col-md-6 mb-4";
        card.innerHTML = `
        <div class="package-item bg-white mb-2">
          <img class="img-fluid" src=${randomImagePath} alt="" />
          <div class="p-4">
            <div class="d-flex justify-content-between mb-3">
              <small class="m-0"><i class="fa-sharp fa-solid fa-road"></i>${Math.trunc(
                place.dist / 1000
              )}km</small>
              <small class="m-0"><i class="fa-solid fa-clock"></i>${
                place.dur
              }Min</small>
              
            </div>
            <a class="h5 text-decoration-none" href="">${place.name}</a>
            <div class="border-top mt-4 pt-4">
              <div class="d-flex justify-content-between">
                <h6 class="m-0"><i class="fa fa-star text-primary mr-2"></i>${
                  place.rate
                }</h6>
                <p class="m-0">${place.kinds.substring(0, 12)}</p>
              </div>
            </div>
          </div>
        </div>
      `;
        // add the card to the container
        cardsContainer.appendChild(card);
      });
    })
    .catch((error) => console.error(error));
}

//schedule
document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("timeline");
  const submitBtn1 = document.getElementById("premium-button");

  submitBtn1.addEventListener("click", async () => {
    try {
      // make API call and get response
      const response = await fetch(
        `http://localhost:3000/schedule/${duration}`
      );
      const data = await response.json();

      // create a variable to store the HTML string
      let html = "";

      // loop through data and create timeline events dynamically
      data.forEach((place) => {
        html += `
          <li class="timeline-event">
            <label class="timeline-event-icon"></label>
            <div class="timeline-event-copy">
              <p class="timeline-event-thumbnail">Day - ${place.day}</p>
              <h3>${place.name}</h3>
              <h2>Duration: ${place.duration} hrs</h2>

              <h4>Ratings: ${place.rate}</h4>
              <p>
                <strong>Restaurant: ${place.restaurant[0].name}</strong><br>
                Rating: ${place.restaurant[0].rate}<br>
                Distance:  ${Math.trunc(place.restaurant[0].dist / 1000)}Km
              </p>
              <p>
                <strong>Restaurant: ${place.restaurant[1].name}</strong><br>
                Rating: ${place.restaurant[1].rate}<br>
                Distance: ${Math.trunc(place.restaurant[1].dist / 1000)}Km
              </p>
            </div>
          </li>
        `;
      });

      // set the inner HTML of the timeline element to the generated HTML string
      timeline.innerHTML = html;
    } catch (error) {
      console.log(error);
    }
  });
});
