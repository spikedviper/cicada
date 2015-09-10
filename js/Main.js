var Ts;
(function (Ts) {
    var Main = (function () {
        function Main(menuDiv, mapDiv) {
            var _this = this;
            this._currentCoords = [];
            this._markers = [];
            this._circles = [];
            this._devices = [];
            this._leftMenu = menuDiv;
            this.DevicesGot = function (devices) {
                devices.forEach(function (_) {
                    if (_.last_position != null)
                        _.last_position.forEach(function (_) { _.lat = Number(_.lat); _.lon = Number(_.lon); _.rad = Number(_.rad); });
                });
                _this._devices = devices;
                _this._leftMenu.data.clearAll();
                devices.forEach(function (_) { _.id = _.imei; _this._leftMenu.data.add(_); });
            };
            this.CoordinatesGot = function (coordinates) {
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
        Main.prototype.SetCoordinates = function (coordinates, isDrawPolyline) {
            var _this = this;
            if (isDrawPolyline === void 0) { isDrawPolyline = true; }
            this._markers.forEach(function (_) { return _.setMap(null); });
            this._circles.forEach(function (_) { return _.setMap(null); });
            if (this._polyline != null)
                this._polyline.setMap(null);
            if (coordinates.length == 0)
                return;
            var bounds = new google.maps.LatLngBounds();
            var labelCaption = 0;
            var polyLinePoints = [];
            coordinates.forEach(function (_) {
                var pinColor = config.IconColorRad0;
                if (_.rad > 0)
                    pinColor = config.IconColorRadMoreThan0;
                var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + "" + "|" + pinColor);
                var position = new google.maps.LatLng(_.lat, _.lon);
                var marker = new MarkerWithLabel({
                    position: position,
                    draggable: false,
                    raiseOnDrag: false,
                    map: _this._map,
                    labelContent: _.packet_time.substr(11, 5),
                    labelAnchor: new google.maps.Point(22, 0),
                    labelClass: "labels",
                    labelStyle: { opacity: 0.75 },
                    icon: pinImage
                });
                var circle = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: _this._map,
                    center: position,
                    radius: _.rad
                });
                _this._circles.push(circle);
                polyLinePoints.push({ lat: _.lat, lng: _.lon });
                _this._markers.push(marker);
                bounds.extend(marker.getPosition());
                var contentString = '<div id="content">' + '';
                contentString += '<b>Время пакета</b>: ' + _.packet_time + ' </br>';
                contentString += '<b>Долгота</b>: ' + _.lon + ' </br>';
                contentString += '<b>Широта</b>: ' + _.lat + ' </br>';
                contentString += '<b>Скорость</b>: ' + _.speed + ' км/ч</br>';
                contentString += '<b>Азимут</b>: ' + _.direction + ' </br>';
                contentString += '</div>';
                var infoWindow = new google.maps.InfoWindow({
                    content: contentString
                });
                var m = _this._map;
                marker.addListener('click', function () {
                    infoWindow.open(m, marker);
                });
            });
            if (isDrawPolyline) {
                this._polyline = new google.maps.Polyline({
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    path: polyLinePoints
                });
                this._polyline.setMap(this._map);
            }
            this._map.setCenter(bounds.getCenter());
            if (this._markers.length > 1)
                this._map.fitBounds(bounds);
            else
                this._map.setZoom(12);
        };
        Main.prototype.OnDeviceSelected = function (id) {
            if (this._markers != null)
                this._markers.forEach(function (_) { return _.setMap(null); });
            if (this._polyline != null)
                this._polyline.setMap(null);
            this._markers = [];
            if (id == null || id.length == 0)
                return;
            var coords;
            debugger;
            if (id.length == 1) {
                coords = this._devices.First(function (_) { return id[0] == _.imei; }).last_position;
                this.SetCoordinates(coords);
            }
            else {
                coords = this._devices.Where(function (_) { return id.Contains(_.imei); }).Select(function (_) { return _.last_position; }).Where(function (_) { return _ != null; }).Select(function (_) { return _[0]; });
                this.SetCoordinates(coords, false);
            }
        };
        Main.prototype.OnDeviceDateChanged = function (date) {
            var d = date.getDate();
            var m = date.getMonth() + 1;
            var y = date.getFullYear();
            var dat = '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d); // Боже, какой пиздец Х2.
            //this.SetCoordinates(this._currentCoords.Where(function (_) { return _.packet_time.substring(0, 10) == dat; }));
        };
        return Main;
    })();
    Ts.Main = Main;
})(Ts || (Ts = {}));
