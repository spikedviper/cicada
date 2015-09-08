var Ts;
(function (Ts) {
    var Main = (function () {
        function Main(menuDiv, mapDiv) {
            var _this = this;
            this._currentCoords = [];
            this._markers = [];
            this._leftMenu = menuDiv;
            var MarkerWithLabel;
            this._mapWithLabel = MarkerWithLabel;
            this.DevicesGot = function (devices) {
                var menu = document.getElementById(_this._leftMenu);
                devices.forEach(function (_) { return menu.innerHTML += ('<br>    <input type="checkbox"  onclick="foo(' + _.imei + ');"  id="' + _.imei + '">' + _.name); }); // боже, какой пиздец!
            };
            this.CoordinatesGot = function (coordinates) {
                if (coordinates.length == 0)
                    return;
                _this._currentCoords = coordinates.sort(function (n1, n2) {
                    if (n1.packet_time > n2.packet_time) {
                        return 1;
                    }
                    if (n1.packet_time < n2.packet_time) {
                        return -1;
                    }
                    return 0;
                });
                _this._currentCoords.forEach(function (_) { _.lat = Number(_.lat); _.lon = Number(_.lon); _.rad = Number(_.rad); });
                var dat = _this._currentCoords.Last(null).packet_time;
                _this.SetCoordinates(_this._currentCoords.Where(function (_) { return _.packet_time.indexOf(dat) == 0; }));
            };
            var mapOptions = {
                zoom: 16,
                streetViewControl: false,
                scaleControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: new google.maps.LatLng(50.501179, 30.778217),
                disableDefaultUI: true
            };
            this._map = new google.maps.Map(document.getElementById(mapDiv), mapOptions);
            this._webApi = new Ts.WebApi(config.MainSiteURL);
            this._webApi.GetDeviceList(this.DevicesGot);
            //this._webApi.GetDeviceCoordinates('353173060493077', this.CoordinatesGot);
        }
        Main.prototype.SetCoordinates = function (coordinates) {
            if (this._markers != null)
                this._markers.forEach(function (_) { return _.setMap(null); });
            if (this._polyline != null)
                this._polyline.setMap(null);
            if (coordinates.length == 0)
                return;
            var bounds = new google.maps.LatLngBounds();
            var labelCaption = 0;
            var polyLinePoints = [];
            for (var i = 0; i < coordinates.length; i++) {
                var _ = coordinates[i];
                var pinColor = config.IconColorRad0;
                if (_.rad > 0)
                    pinColor = config.IconColorRadMoreThan0;
                var marker = new MarkerWithLabel({
                    position: new google.maps.LatLng(_.lat, _.lon),
                    draggable: false,
                    raiseOnDrag: false,
                    map: this._map,
                    labelContent: _.packet_time.substr(10, 5),
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels",
                    labelStyle: { opacity: 0.75 }
                });
                polyLinePoints.push({ lat: _.lat, lng: _.lon });
                this._markers.push(marker);
                bounds.extend(marker.getPosition());
                labelCaption++;
                var contentString = '<div id="content">' + '';
                //contentString += '<b>Время пакета</b>: ' + _.packet_time + ' </br>';
                contentString += '<b>Долгота</b>: ' + _.lon + ' </br>';
                contentString += '<b>Широта</b>: ' + _.lat + ' </br>';
                //contentString += '<b>Точность</b>: ' + _.rad + ' </br>';
                //contentString += '<b>Тип пакета</b>: ' + _.packet_type + ' </br>';
                if (_['speed'] < 2) {
                    _['speed'] = 0;
                }
                contentString += '<b>Скорость</b>: ' + _.speed + ' км/ч</br>';
                contentString += '<b>Азимут</b>: ' + _.direction + ' </br>';
                //contentString += '<b>"Черный ящик"</b>: ' + _.blackbox + ' </br>';
                contentString += '</div>';
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                infoWindow.open(this._map, marker);
                var m = this._map;
                marker.addListener('click', function () {
                    infoWindow.open(m, marker);
                });
            } //);
            this._polyline = new google.maps.Polyline({
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                path: polyLinePoints
            });
            this._polyline.setMap(this._map);
            this._map.setCenter(bounds.getCenter());
            this._map.fitBounds(bounds);
        };
        Main.prototype.OnDeviceSelected = function (id) {
            var checkbox;
            checkbox = $('#' + id)[0];
            if (checkbox.checked) {
                this._webApi.GetDeviceCoordinates(id, this.CoordinatesGot);
            }
            else {
                if (this._markers != null)
                    this._markers.forEach(function (_) { return _.setMap(null); });
                if (this._polyline != null)
                    this._polyline.setMap(null);
                this._markers = [];
            }
        };
        Main.prototype.OnDeviceDateChanged = function (date) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            var dat = '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d); // Боже, какой пиздец Х2.
            this.SetCoordinates(this._currentCoords.Where(function (_) { return _.packet_time.substring(0, 10) == dat; }));
        };
        return Main;
    })();
    Ts.Main = Main;
})(Ts || (Ts = {}));
