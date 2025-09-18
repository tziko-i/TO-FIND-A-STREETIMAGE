window.onload = function () {
  const img = document.querySelector('.zoom-image');

  if (!img) {
    
    return;
  }

  // זום אין
  setTimeout(() => {
    img.style.transform = 'translate(-50%, -50%) scale(2.5)';
  }, 500);

  // זום אאוט
  setTimeout(() => {
    img.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 5000);
};
const image = document.querySelector('.zoom-image');
const btn = document.getElementById('toggle-spin');




window.addEventListener('DOMContentLoaded', () => {
  const sky = document.getElementById('sky');
  const cloudCount = 15;

  for (let i = 0; i < cloudCount; i++) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');

    // מיקום אקראי
    const top = Math.random() * window.innerHeight;
    const left = Math.random() * window.innerWidth;

    // גודל, מהירות, דיליי
    const scale = 0.5 + Math.random(); // 0.5 עד 1.5
    const duration = 40 + Math.random() * 60; // 40 עד 100 שניות
    const delay = Math.random() * 10; // דיליי אקראי

    cloud.style.top = `${top}px`;
    cloud.style.left = `${left}px`; // מיקום התחלה רנדומלי
    cloud.style.transform = `scale(${scale})`;
    cloud.style.animationDuration = `${duration}s`;
    cloud.style.animationDelay = `${delay}s`;

    sky.appendChild(cloud);
  }
});

// בדיקת שם משתמש בשדה קלט
const input = document.getElementById('username');
input.addEventListener('input', () => {
  const trimmed = input.value.trim();
  input.classList.toggle('is-valid', trimmed !== '');
  input.classList.toggle('is-invalid', trimmed === '');
});
// משתנה גלובלי למפה
let map = null;
let marker = null;

// פונקציה ליצירת המפה בפעם הראשונה
function initializeMap(lat, lon, address) {
    map = L.map('map').setView([lat, lon], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${address}</b>`).openPopup();
}

// פונקציה לעדכון מיקום המפה והמרקר בחיפושים הבאים
function updateMap(lat, lon, address) {
    map.setView([lat, lon], 16);
    if (marker) {
        marker.setLatLng([lat, lon]).bindPopup(`<b>${address}</b>`).openPopup();
    }
}

$(document).ready(function() {
    $('#address-form').on('submit', function(e){
        e.preventDefault();
        const address = $('#username').val().trim();
        if (!address) {
            alert("אנא הכנס כתובת");
            return;
        }

        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        $.getJSON(geoUrl).done(function(data){
            if (!data || data.length === 0) {
                alert("לא נמצא מיקום עבור הכתובת");
                return;
            }

            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);

            // בודק אם המפה כבר קיימת
            if (!map) {
                initializeMap(lat, lon, address);
            } else {
                updateMap(lat, lon, address);
            }

            const accessToken = "MLY|xxxxxxxxxxxxxxxxxxxxxxxxxxxx";
            const mapillaryUrl = `https://graph.mapillary.com/images?fields=id&closeto=${lon},${lat}&limit=1&access_token=${accessToken}`;

            $.getJSON(mapillaryUrl).done(function(mapData){
                const iframe = $('#streetview-iframe');
                if (mapData.data && mapData.data.length > 0) {
                    const imageKey = mapData.data[0].id;
                    const iframeSrc = `https://www.mapillary.com/embed?image_key=${imageKey}`;
                    iframe.attr('src', iframeSrc);
                    iframe.show();
                } else {
                    iframe.hide();
                    alert("לא נמצאה תמונת רחוב במיקום זה.");
                }
            }).fail(function(){
                console.error("שגיאה בטעינת Mapillary");
                $('#streetview-iframe').hide();
            });
        }).fail(function(){
            alert("שגיאה בבקשה לשרת OpenStreetMap");
        });
    });
});

// דוגמת גלילה חלקה
$('a[href^="#"]').on('click', function(event) {
  event.preventDefault();
  var target = this.hash;
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 600);
});

// דוגמת FadeIn ו-FadeOut
$('#message').fadeIn(1000).delay(2000).fadeOut(1000);

// דוגמת גלילה חלקה
$('a[href^="#"]').on('click', function(event) {
  event.preventDefault();
  var target = this.hash;
  $('html, body').animate({
    scrollTop: $(target).offset().top
  }, 600);
});
