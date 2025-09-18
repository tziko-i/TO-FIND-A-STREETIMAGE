window.onload = function () {
  const img = document.querySelector('.zoom-image');

  if (!img) {
    console.log("תמונה לא נמצאה");
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

// שליחת טופס כתובת
$('#address-form').on('submit', function (e) {
  e.preventDefault();

  const address = $('#username').val().trim();
  if (!address) {
    alert("אנא הכנס כתובת");
    return;
  }

  const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  $.getJSON(geoUrl)
    .done(function (data) {
      if (!data || data.length === 0) {
        alert("לא נמצא מיקום עבור הכתובת");
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      // מפת OSM
      if (window.map) window.map.remove();
      window.map = L.map('map').setView([lat, lon], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(window.map);

      L.marker([lat, lon]).addTo(window.map)
        .bindPopup(`<b>${address}</b>`).openPopup();

      // Mapillary
      const mapillaryUrl = `https://graph.mapillary.com/images?fields=id,thumb_1024_url&closeto=${lon},${lat}&limit=1`;

      $.getJSON(mapillaryUrl)
        .done(function (mapData) {
          if (mapData.data && mapData.data.length > 0) {
            const imgUrl = mapData.data[0].thumb_1024_url;
            $('#streetview-img').attr('src', imgUrl);
          } else {
            $('#streetview-img').attr('src', '');
            alert("לא נמצאה תמונת רחוב במיקום זה.");
          }
        })
        .fail(function () {
          console.error("שגיאה בטעינת Mapillary");
        });

    })
    .fail(function () {
      alert("שגיאה בבקשה לשרת OpenStreetMap");
    });
});
$('#message').fadeIn(1000).delay(2000).fadeOut(1000);

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
