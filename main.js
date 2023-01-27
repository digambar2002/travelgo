// API for fetching touristic areas: https://opentripmap.io/product.
const opentripmapApiKey = '5ae2e3f221c38a28845f05b64c78a88c33c73d32475f7e0c796455d5';

// Maximum number of results to display.
const maxResults = 50;

// Radius in meters for fetching touristic areas.
const radius = 100000;

$(() => {
    // Fetch touristic places around the coordinates.
    fetchTouristicPlaces = function (longitude, latitude) {
        $.ajax({
            url: 'https://api.opentripmap.com/0.1/en/places/radius',
            method: 'GET',
            dataType: 'json',
            cache: false,
            data: {
                apikey: opentripmapApiKey,
                radius: radius,
                limit: maxResults,
                offset: 0,
                lon: longitude,
                lat: latitude,
                rate: 2,
                format: 'json',
            },
            beforeSend: function () {
                $('#Loading').show();
            },
            complete: function () {
                $('#Loading').hide();
            },

        }).then(function (data) {
            // console.log(data)


            // Update the divs that contain the touristic places.
            var list = "";
            for (let i = 0; i < data.length; i++) {
                $(`#result${i}`).text(data[i].name)
                $(`#link${i}`).attr("href", `https://www.wikidata.org/wiki/${data[i].wikidata}`);
                console.log(data[i].wikidata);

                list += ` <a href="https://www.wikidata.org/wiki/${data[i].wikidata}" target="_blank">  <li class="tile"> <i class='bx bx-link-external redirect-icon'></i> ${data[i].name} </li> </a>`;

                $("#PlaceList").append(list);


            }

            for (let i = data.length; i < maxResults; i++) {
                $(`#result${i}`).text('')
            }
        }).catch(function (err) {

            // If any error or data not found
            var list = `<div class="center"><h3>No Places found</h3></div>`;
            $("#PlaceList").append(list);
            // console.log("Fetch Places Error :-S", err);
        });
    }

    // Find the coordinates associated with the city selected by the user.
    fetchLocationByName = function (locationName) {
        return $.ajax({
            url: 'https://api.opentripmap.com/0.1/en/places/geoname',
            method: 'GET',
            dataType: 'json',
            data: {
                apikey: opentripmapApiKey,
                name: locationName
            }
        });
    }


    // Onlick on search
    $("#SearchBtn").click(function () {

        // getting value of selector
        let place = $('#search').val();

        if (place != null) {

            $("#Card").attr("hidden", false);
            $("#Card").addClass("animate__fadeIn");

            // to reload the dive for refresh
            $("#PlaceList").load(location.href + " #PlaceList");


            fetchLocationByName(place).then(function (data) {
                console.log(data)
                // Once we receive the coordinates of the city,
                // then fetch the touristic areas around those 
                // coordinates.
                fetchTouristicPlaces(data.lon, data.lat);
            }).catch(function (err) {
                console.log("Fetch Location Error :-S", err);
            });
        }


    });

    // on enter press
    $("#search").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#SearchBtn").click();
        }
    });



})
