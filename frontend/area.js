document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const areaId = urlParams.get('id');

    if (!areaId) {
        document.getElementById('area-title').textContent = "No area specified.";
        return;
    }

    try {
        const response = await fetch(`/api/areas/${areaId}`);
        if (!response.ok) throw new Error('Area not found');
        
        const data = await response.json();

        //Core Text Injection
        document.title = `${data.name} - Recycle Smart`;
        document.getElementById('area-title').textContent = data.name;
        document.getElementById('bc-name').textContent = data.name;
        document.getElementById('area-address').textContent = data.address;
        document.getElementById('area-note').textContent = data.note;
        
        //Details
        document.getElementById('area-hours').textContent = data.working_hours || "Hours not specified by facility.";
        document.getElementById('area-contact').textContent = data.contact || "No contact number provided.";
        document.getElementById('area-desc').textContent = data.description || data.note;

        //Tips & Warnings
        if (data.tips) {
            document.getElementById('area-tips').textContent = data.tips;
        } else {
            document.getElementById('tips-container').style.display = 'none';
        }

        if (data.warning) {
            const warnBox = document.getElementById('area-warning');
            warnBox.textContent = data.warning;
            warnBox.style.display = 'block';
        }

        // Inject Type Pills
        const pillGroup = document.getElementById('area-pills');
        pillGroup.innerHTML = '';
        data.type.forEach(t => {
            const pill = document.createElement('span');
            pill.className = 'pill';
            pill.textContent = t.toUpperCase();
            pillGroup.appendChild(pill);
        });

        //  Inject Material Icons
        const itemsGrid = document.getElementById('area-items');
        itemsGrid.innerHTML = '';
        if (data.accepted_items && data.accepted_items.length > 0) {
            data.accepted_items.forEach(item => {
                itemsGrid.innerHTML += `
                    <div class="material-item">
                        <div class="material-img">${item.icon}</div>
                        <p>${item.name}</p>
                    </div>
                `;
            });
        } else {
            itemsGrid.innerHTML = '<p style="color: #666;">Call facility for specific item guidelines.</p>';
        }

        //  INITIALIZE MAP & NAVIGATION
        if (data.lat && data.lng) {
            // Setup Leaflet Map
            const detailMap = L.map('detail-map').setView([data.lat, data.lng], 15);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap'
            }).addTo(detailMap);

            // Create a custom marker 
            const customIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="width:24px;height:24px;border-radius:50%;background:#5bb46b;border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,0.3)"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, -10]
            });

            // Add marker to map
            L.marker([data.lat, data.lng], {icon: customIcon})
                .addTo(detailMap)
                .bindPopup(`<b>${data.name}</b><br>${data.address}`)
                .openPopup();

            // Setup Navigate Button
            const navBtn = document.getElementById('btn-navigate');
            if (navBtn) {
                navBtn.addEventListener('click', () => {
                    // Opens Google Maps Directions API in a new tab
                    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`;
                    window.open(googleMapsUrl, '_blank');
                });
            }
        } else {
            // Fallback if no coordinates exist
            document.getElementById('detail-map').innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#888;">Map data unavailable for this location.</div>';
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('area-title').textContent = "Sorry, we couldn't load this location.";
    }
});