<<<<<<< HEAD
const input = document.getElementById('username');

input.addEventListener('input', () => {
  if (input.value.trim() !== '') {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
  }
});
=======

$('#address-form').on('submit', function(e){
    e.preventDefault();
    const address = $('#address').val().trim();
    if(!address) return alert("אנא הכנס כתובת");

    // 1) Geocoding עם Nominatim (OpenStreetMap חינמי)
    const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    $.getJSON(geoUrl, function(data){
        if(!data || data.length === 0){
            alert("לא נמצא מיקום עבור הכתובת");
            return;
        }

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        console.log("קואורדינטות:", lat, lon);

        // 2) מפה עם Leaflet
        if(window.map) {
            window.map.remove();
        }
        window.map = L.map('map').setView([lat, lon], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(window.map);

        L.marker([lat, lon]).addTo(window.map)
          .bindPopup(`<b>${address}</b>`).openPopup();

        // 3) חיפוש תמונת רחוב מ-Mapillary (API חינמי, ללא הרשמה)
        const mapillaryUrl = `https://graph.mapillary.com/images?fields=id,thumb_1024_url&closeto=${lon},${lat}&limit=1`;

        $.getJSON(mapillaryUrl, function(mapData){
            if(mapData.data && mapData.data.length > 0){
                const imgUrl = mapData.data[0].thumb_1024_url;
                console.log("תמונת רחוב Mapillary:", imgUrl);

                // הצגת תמונה בדף
                $('#streetview-img').attr('src', imgUrl);
            } else {
                console.log("לא נמצאה תמונת רחוב עבור המיקום");
                $('#streetview-img').attr('src','');
            }
        }).fail(function(){
            console.log("שגיאה בבקשה ל-Mapillary");
        });

    }).fail(function(){
        alert("שגיאה בבקשה לשרת OpenStreetMap");
    });
});
>>>>>>> 385995c0ddf5f8509893edfe4383af474a9737c4
