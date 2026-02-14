/* VERSION DÉPRÉCIÉE */

// let countriesData = [];
// let regions = ["europe", "oceania", "asia", "africa", "americas", "antarctic"];

// let request = regions.map((region) => {
//   return fetch(`https://restcountries.com/v3.1/region/${region}`);
// });

// Promise.all(request)
//   .then((responses) => {
//     return Promise.all(
//       responses.map((response) => {
//         if (!response.ok) {
//           throw new Error(
//             "Il y a un problème avec une des régions du monde réessaie"
//           );
//         }
//         return response.json();
//       })
//     );
//   })
//   .then((dataArray) => {
//     let allCountries = dataArray.flat();

//     console.log(`Succès ! ${allCountries.length} pays récupérés.`);

//     countriesData = allCountries;

//     console.log(countriesData);
//     return countriesData;
//   })
//   .catch((error) => {
//     console.log("Erreur lors de la récupération des données : ", error);
//   });

/* NOUVELLE VERSION, PLUS MODERNE */
const countriesContainer = document.querySelector(".countries-container");
const btnSort = document.querySelectorAll(".btnSort");
const API_ENDPOINT = "https://restcountries.com/v3.1/region/";
let countriesData = [];
let sortMethod = "MaxToMin";

async function fetchCountries() {
  const regions = [
    "europe",
    "oceania",
    "asia",
    "africa",
    "americas",
    "antarctic",
  ];

  try {
    const requests = regions.map((region) => fetch(`${API_ENDPOINT}${region}`));
    const responses = await Promise.all(requests);

    const jsonPromises = responses.map((response) => {
      if (!response.ok) throw new Error("Erreur sur une région");
      return response.json();
    });

    const dataArrays = await Promise.all(jsonPromises);
    return dataArrays.flat();
  } catch (error) {
    console.log("Erreur API :", error);
    return [];
  }
}

async function initialisation() {
  console.log("Récupération des données...");
  countriesData = await fetchCountries();
  console.log(`Terminé ! ${countriesData.length} pays récupérés.`);

  countriesDisplay();
}

function countriesDisplay() {
  countriesContainer.innerHTML = countriesData
    .filter((country) =>
      country.translations.fra.common
        .toLowerCase()
        .includes(inputSearch.value.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortMethod === "maxToMin") {
        return b.population - a.population;
      } else if (sortMethod === "minToMax") {
        return a.population - b.population;
      } else if (sortMethod === "alpha") {
        return a.translations.fra.common.localeCompare(
          b.translations.fra.common,
        );
      }
    })
    .slice(0, inputRange.value)
    .map(
      (country) =>
        ` <div class="card">
    <img src=${country.flags.svg} alt="drapeau ${
      country.translations.fra.common
    }"> 
    <h2>${country.translations.fra.common}</h2>
    <h4>${country.capital}</h4>
    <p>Population : ${country.population.toLocaleString()}</p>
    </div>
    `,
    )
    .join("");
}

window.addEventListener("load", initialisation);
inputSearch.addEventListener("input", countriesDisplay);
inputRange.addEventListener("input", () => {
  countriesDisplay();
  rangeValue.textContent = inputRange.value;
});

btnSort.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    sortMethod = e.target.id;
    countriesDisplay();
  });
});
