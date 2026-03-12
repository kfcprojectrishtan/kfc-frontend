// ═══════════════════════════════════════════════════════════════
// SHARED ADDRESS LOGIC (index.html & addresses.html)
// ═══════════════════════════════════════════════════════════════

function getLocs() {
    try { return JSON.parse(localStorage.getItem('kfc_locations') || '[]'); } catch { return []; }
}
function saveLocs(l) { localStorage.setItem('kfc_locations', JSON.stringify(l)); }
function getSelected() { return localStorage.getItem('kfc_selected_location'); }
function setSelected(id) { localStorage.setItem('kfc_selected_location', id); }

let leafletMap = null;
let currentCenterLat = 41.311081; // default to Tashkent
let currentCenterLng = 69.240562;
let mapAddressLabel = ""; // Stored reverse-geocoded label
let reverseGeocodingTimeout = null;
let isUsingGps = false;

function openMapModal() {
    // Hide native elements locally
    const locSheet = document.getElementById('locationSheet');
    if (locSheet) locSheet.classList.remove('active');

    document.getElementById('mapOverlay').classList.add('active');
    document.getElementById('mapSheet').classList.add('active');
    document.getElementById('mapForm').style.display = 'none'; // Hide the save form initially
    document.getElementById('mapConfirmBtn').innerText = currentLang === 'uz' ? "Tasdiqlash" : "Подтвердить";
    document.getElementById('mapConfirmBtn').onclick = lockMapSelection;
    document.getElementById('mapCoordsDisplay').textContent = "Manzilni tanlang...";
    document.getElementById('mapNoteInput').value = '';

    if (!leafletMap) {
        leafletMap = new google.maps.Map(document.getElementById('mapContainer'), {
            center: { lat: currentCenterLat, lng: currentCenterLng },
            zoom: 15,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        });

        leafletMap.addListener('dragend', function () {
            const center = leafletMap.getCenter();
            currentCenterLat = center.lat();
            currentCenterLng = center.lng();
            onMapMoveUpdateCenter();
        });
        leafletMap.addListener('zoom_changed', function () {
            const center = leafletMap.getCenter();
            currentCenterLat = center.lat();
            currentCenterLng = center.lng();
            onMapMoveUpdateCenter();
        });
    } else {
        leafletMap.setCenter({ lat: currentCenterLat, lng: currentCenterLng });
        leafletMap.setZoom(15);
    }

    setTimeout(() => {
        if (leafletMap) {
            google.maps.event.trigger(leafletMap, 'resize');
            const center = leafletMap.getCenter();
            currentCenterLat = center.lat();
            currentCenterLng = center.lng();
            onMapMoveUpdateCenter();
        }
    }, 300);
}

function closeMapModal() {
    document.getElementById('mapOverlay').classList.remove('active');
    document.getElementById('mapSheet').classList.remove('active');

    // If opened from location sheet
    const locOverlay = document.getElementById('locationOverlay');
    const locSheet = document.getElementById('locationSheet');
    if (locOverlay && locSheet) {
        locOverlay.classList.add('active');
        locSheet.classList.add('active');
    }
}

function useGPS() {
    if (!navigator.geolocation) {
        alert(currentLang === 'uz' ? "Qurilmangizda GPS yo'q" : "На вашем устройстве нет GPS");
        return;
    }
    document.getElementById('mapCoordsDisplay').textContent = currentLang === 'uz' ? "GPS qidirilmoqda..." : "Поиск GPS...";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            currentCenterLat = pos.coords.latitude;
            currentCenterLng = pos.coords.longitude;
            isUsingGps = true;
            if (leafletMap) {
                leafletMap.setCenter({ lat: currentCenterLat, lng: currentCenterLng });
                leafletMap.setZoom(18);
            }
        },
        (err) => {
            alert(currentLang === 'uz' ? "GPS ruxsati berilmadi yoki xato yuz berdi" : "Разрешение на GPS не предоставлено или произошла ошибка");
            onMapMoveUpdateCenter(); // revert display
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

function onMapMoveUpdateCenter() {
    isUsingGps = false;
    document.getElementById('mapCoordsDisplay').textContent = currentLang === 'uz' ? "Manzil aniqlanmoqda..." : "Определение адреса...";

    // Debounce reverse geocoding to not hit the API too rapidly
    if (reverseGeocodingTimeout) clearTimeout(reverseGeocodingTimeout);
    reverseGeocodingTimeout = setTimeout(() => {
        reverseGeocode(currentCenterLat, currentCenterLng);
    }, 600);
}

function reverseGeocode(lat, lng) {
    const coordsDisplay = document.getElementById('mapCoordsDisplay');

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=uz`)
        .then(res => res.json())
        .then(data => {
            if (data && data.address) {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || "";
                const road = addr.road || addr.pedestrian || addr.street || "";
                const house = addr.house_number || "";

                let labelParts = [];
                if (city) labelParts.push(city);
                if (road) labelParts.push(house ? `${road} ${house}` : road);

                if (labelParts.length > 0) {
                    mapAddressLabel = labelParts.join(', ');
                } else if (data.display_name) {
                    mapAddressLabel = data.display_name.split(',').slice(0, 2).join(', '); // fallback
                } else {
                    mapAddressLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                }

                if (coordsDisplay) coordsDisplay.textContent = mapAddressLabel;
            } else {
                mapAddressLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                if (coordsDisplay) coordsDisplay.textContent = typeof currentLang !== 'undefined' && currentLang === 'uz' ? "Manzil topilmadi, xarita orqali saqlanadi." : "Адрес не найден, сохраняется по карте.";
            }
        })
        .catch(err => {
            console.error("Geocoding err:", err);
            mapAddressLabel = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            if (coordsDisplay) coordsDisplay.textContent = typeof currentLang !== 'undefined' && currentLang === 'uz' ? "Manzil topilmadi, xarita orqali saqlanadi." : "Адрес ne topilmadi, xarita orqali saqlanadi.";
        });
}

function lockMapSelection() {
    // Hide map temporarily or shift focus to form
    document.getElementById('mapForm').style.display = 'block';
    document.getElementById('mapLabelText').value = mapAddressLabel;

    const confirmBtn = document.getElementById('mapConfirmBtn');
    confirmBtn.innerText = currentLang === 'uz' ? "Saqlash" : "Сохранить";
    confirmBtn.onclick = saveNewAddress;
}

function saveNewAddress() {
    const note = document.getElementById('mapNoteInput').value.trim();

    const newLoc = {
        id: 'loc_' + Date.now(),
        street: mapAddressLabel,
        note: note,
        lat: currentCenterLat,
        lng: currentCenterLng,
        isGps: isUsingGps,
        createdAt: Date.now()
    };

    let locs = getLocs();
    locs.push(newLoc);
    saveLocs(locs);

    // Set as main selected
    setSelected(newLoc.id);

    // Re-render based on which page we are on
    if (typeof renderAddresses === 'function') {
        renderAddresses();
    }
    if (typeof updateMainLocationDisplay === 'function') {
        updateMainLocationDisplay();
    }

    closeMapModal();
}
