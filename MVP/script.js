var map = L.map('map').setView([54.3, 56.7], 7);
var geojsonLayer;
var currentYear = '1970'; // Начальный год по умолчанию

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 19,
    minZoom: 7,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'sk.eyJ1IjoiaW5leHlvbWciLCJhIjoiY2x2MHd6bnNxMDB0bzJrcDBtcnhleGRsdCJ9.ZKGe0122kTkPg2i4sIommw'
}).addTo(map);

function closeDistrictInfoPanel() {
    var panel = document.getElementById('districtInfoPanel');
    panel.style.bottom = '-400px';
}

// Функция для загрузки и отображения GeoJSON данных
function loadGeoJSON(year) {
    if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
    }
    fetch('gj/' + year + '.geojson') // Имя файла зависит от выбранного года
        .then(response => response.json())
        .then(data => {
            geojsonLayer = L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: '#eb9534',
                        weight: 2,
                        fillColor: '#eb9534',
                        fillOpacity: 0.3
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.on('click', function (e) {
                        showDistrictInfoPanel(e.target.feature.properties, year); // Передаем текущий год в функцию отображения информации о районе
                    });
                    layer.on('mouseover', function () {
                        this.setStyle({
                            fillColor: '#eb9534',
                            fillOpacity: 0.5
                        });
                    });
                    var popupContent = "<b>Район:</b> " + feature.properties.district + "<br>" +
                                       "<b>Общее население:</b> " + feature.properties[year + '_districts_population'] + "<br>" + // Используем текущий год для формирования ключей
                                       "<b>Башкиры:</b> " + feature.properties[year + '_districts_bashkirs'] + "<br>" +
                                       "<b>Русские:</b> " + feature.properties[year + '_districts_russians'] + "<br>" +
                                       "<b>Татары:</b> " + feature.properties[year + '_districts_tatars'] + "<br>" +
                                       "<b>Чуваши:</b> " + feature.properties[year + '_districts_chuvashs'] + "<br>" +
                                       "<b>Марийцы:</b> " + feature.properties[year + '_districts_mariis'] + "<br>" +
                                       "<b>Украинцы:</b> " + feature.properties[year + '_districts_ukrainians'] + "<br>" +
                                       "<b>Мордва:</b> " + feature.properties[year + '_districts_mordva'] + "<br>" +
                                       "<b>Удмурты:</b> " + feature.properties[year + '_districts_udmurts'] + "<br>" +
                                       "<b>Белоруссы:</b> " + feature.properties[year + '_districts_belarusians'] + "<br>" +
                                       "<b>Прочие:</b> " + feature.properties[year + '_districts_others'] + "<br>";
                    layer.bindPopup(popupContent);
                    layer.on('mouseout', function () {
                        this.setStyle({
                            fillColor: '#eb9534',
                            fillOpacity: 0.3
                        });
                    });
                }
            }).addTo(map);
        });
}

// Функция для отображения информации о районе
function showDistrictInfoPanel(properties, year) {
    var panel = document.getElementById('districtInfoPanel');
    panel.style.bottom = '0';
    var panelContent = "<b>Район:</b> " + properties.district + "<br>" +
                       "<b>Общее население:</b> " + properties[year + '_districts_population'] + "<br>" + // Используем текущий год для формирования ключей
                       "<b>Башкиры:</b> " + properties[year + '_districts_bashkirs'] + "<br>" +
                       "<b>Русские:</b> " + properties[year + '_districts_russians'] + "<br>" +
                       "<b>Татары:</b> " + properties[year + '_districts_tatars'] + "<br>" +
                       "<b>Чуваши:</b> " + properties[year + '_districts_chuvashs'] + "<br>" +
                       "<b>Марийцы:</b> " + properties[year + '_districts_mariis'] + "<br>" +
                       "<b>Украинцы:</b> " + properties[year + '_districts_ukrainians'] + "<br>" +
                       "<b>Мордва:</b> " + properties[year + '_districts_mordva'] + "<br>" +
                       "<b>Удмурты:</b> " + properties[year + '_districts_udmurts'] + "<br>" +
                       "<b>Белоруссы:</b> " + properties[year + '_districts_belarusians'] + "<br>" +
                       "<b>Прочие:</b> " + properties[year + '_districts_others'] + "<br>";
    document.getElementById('panelContent').innerHTML = panelContent;
}

// Функция для обработки нажатий клавиш
function handleKeyPress(event) {
    if (event.key === '1') {
        currentYear = '1970';
        loadGeoJSON(currentYear);
    } else if (event.key === '2') {
        currentYear = '1979';
        loadGeoJSON(currentYear);
        alert('Выбран год 1979');
    }
}

// Загрузка данных для начального года
loadGeoJSON(currentYear);

// Обработчик события нажатия клавиши
document.addEventListener('keypress', handleKeyPress);
