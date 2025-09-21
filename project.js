// אנימציית זום לתמונה
window.onload = function () {
    const img = document.querySelector('.zoom-image');
    if (!img) return;

    setTimeout(() => { img.style.transform = 'translate(-50%, -50%) scale(2.5)'; }, 500);
    setTimeout(() => { img.style.transform = 'translate(-50%, -50%) scale(1)'; }, 5000);
};

// יצירת עננים מונפשים וכפתור לעצירת/הפעלת סיבוב
window.addEventListener('DOMContentLoaded', () => {
    const sky = document.getElementById('sky');
    const cloudCount = 15;
    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement('div');
        cloud.classList.add('cloud');
        const top = Math.random() * window.innerHeight;
        const left = Math.random() * window.innerWidth;
        const scale = 0.5 + Math.random();
        const duration = 40 + Math.random() * 60;
        const delay = Math.random() * 10;
        cloud.style.top = `${top}px`;
        cloud.style.left = `${left}px`;
        cloud.style.transform = `scale(${scale})`;
        cloud.style.animationDuration = `${duration}s`;
        cloud.style.animationDelay = `${delay}s`;
        sky.appendChild(cloud);
    }

    // כפתור לעצירת/הפעלת סיבוב התמונה
    const toggleSpinButton = document.getElementById('toggle-spin');
    const zoomImage = document.querySelector('.zoom-image');
    toggleSpinButton.addEventListener('click', () => {
        zoomImage.classList.toggle('rotate-counter');
        toggleSpinButton.textContent = zoomImage.classList.contains('rotate-counter')
            ? 'STOP PICTURE CYCLE'
            : 'START PICTURE CYCLE';
    });
});

// ולידציה של שדה קלט
const input = document.getElementById('username');
input.addEventListener('input', () => {
    const trimmed = input.value.trim();
    input.classList.toggle('is-valid', trimmed !== '');
    input.classList.toggle('is-invalid', trimmed === '');
});

// טיפול בטופס ותצוגת תמונת רחוב
$(document).ready(function() {
    $('#address-form').on('submit', function(e){
        e.preventDefault();
        const address = $('#username').val().trim();
        if (!address) {
            alert("אנא הכנס כתובת");
            return;
        }

        // הצגת מחוון טעינה
        $('#loading').show();
        $('#streetview-image').hide();

        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        console.log("Nominatim URL:", geoUrl);
        $.getJSON(geoUrl).done(function(data){
            if (!data || data.length === 0) {
                $('#loading').hide();
                alert("לא נמצא מיקום עבור הכתובת: " + address);
                console.error("Nominatim response:", JSON.stringify(data, null, 2));
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            console.log(`קואורדינטות עבור ${address}: lat=${lat}, lon=${lon}`);

            const accessToken = "MLY|31289690614011747|72af985bd8d72e426437f6ffc496f503"; // הטוקן שלך
            const radius = 100; // מטרים
            const delta_lat = radius / 111111; // המרה לדרגות (1 מעלה ≈ 111.111 מטר)
            const delta_lon = radius / (111111 * Math.cos(lat * Math.PI / 180)); // התאמה לקו הרוחב
            const min_lat = lat - delta_lat;
            const max_lat = lat + delta_lat;
            const min_lon = lon - delta_lon;
            const max_lon = lon + delta_lon;
            const bbox = `${min_lon},${min_lat},${max_lon},${max_lat}`;

            const mapillaryUrl = `https://graph.mapillary.com/images?fields=id,thumb_1024_url,thumb_2048_url,thumb_256_url&bbox=${bbox}&limit=10&access_token=${accessToken}`;
            console.log("Mapillary URL:", mapillaryUrl);

            $.getJSON(mapillaryUrl).done(function(mapData){
                $('#loading').hide();
                console.log("Mapillary response:", JSON.stringify(mapData, null, 2));
                const image = $('#streetview-image');

                // בדיקה של מבנה התגובה
                const responseData = mapData.data || mapData.results || mapData;
                if (responseData && Array.isArray(responseData) && responseData.length > 0) {
                    const imageUrl = responseData[0].thumb_1024_url || responseData[0].thumb_2048_url || responseData[0].thumb_256_url;
                    if (imageUrl) {
                        image.attr('src', imageUrl);
                        image.attr('alt', `תמונת רחוב של ${address}`);
                        image.show();
                    } else {
                        image.hide();
                        alert("לא נמצא URL תקף לתמונת רחוב עבור " + address + ". בדוק את הקונסולה.");
                        console.warn("No valid image URL found in Mapillary response.");
                    }
                } else {
                    image.hide();
                    alert("לא נמצאה תמונת רחוב עבור " + address + ". בדוק את הקונסולה לפרטים.");
                    console.warn("Mapillary response is empty or has unexpected structure:", JSON.stringify(mapData, null, 2));
                }
            }).fail(function(jqXHR, textStatus, errorThrown){
                $('#loading').hide();
                console.error("שגיאה בטעינת Mapillary:", textStatus, errorThrown, JSON.stringify(jqXHR.responseJSON, null, 2));
                alert("שגיאה בטעינת תמונת רחוב: " + textStatus + " - " + errorThrown + ". בדוק את הקונסולה.");
            });
        }).fail(function(jqXHR, textStatus, errorThrown){
            $('#loading').hide();
            console.error("שגיאה בבקשה ל-Nominatim:", textStatus, errorThrown, JSON.stringify(jqXHR.responseJSON, null, 2));
            alert("שגיאה בבקשה לשרת OpenStreetMap: " + textStatus + " - " + errorThrown);
        });
    });
});