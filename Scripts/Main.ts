﻿module Ts
{
	export class Main
	{
		private _webApi: Ts.WebApi;
		private _leftMenu: any;

		private DevicesGot: (symbol: DTO.Device[]) => void;
		private CoordinatesGot: (symbol: DTO.Coordinates[]) => void;

		private _currentCoords: DTO.Coordinates[] = [];
		private _markers: google.maps.Marker[] = [];
		private _map: google.maps.Map;
		private _polyline: google.maps.Polyline;

		constructor(menuDiv: any, mapDiv: string)
		{
			this._leftMenu = menuDiv;
			this.DevicesGot = (devices) =>
			{
				this._leftMenu.data.clearAll();
				devices.forEach(_=> { _.id = _.imei; this._leftMenu.data.add(_) });
			}

			this.CoordinatesGot = (coordinates) =>
			{
				this._currentCoords = coordinates.sort((n1, n2) =>
				{
					if (n1.packet_time > n2.packet_time) { return 1; }
					if (n1.packet_time < n2.packet_time) { return -1; }
					return 0;
				});
				this._currentCoords.forEach(_=> { _.lat = Number(_.lat); _.lon = Number(_.lon); _.rad = Number(_.rad); });
				var dat = this._currentCoords.Last(null).packet_time;
				this.SetCoordinates(this._currentCoords.Where(function (_) { return _.packet_time.indexOf(dat) == 0; }));
			}

			var mapOptions = {
				zoom: 16, // initialize zoom level - the max value is 21
				streetViewControl: false, // hide the yellow Street View pegman
				scaleControl: true, // allow users to zoom the Google Map
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: new google.maps.LatLng(50.501179, 30.778217), // Kiev or around Kiev
				disableDefaultUI: true
			};
			this._map = new google.maps.Map(document.getElementById(mapDiv), mapOptions);

			this._webApi = new Ts.WebApi(config.MainSiteURL);
			this._webApi.GetDeviceList(this.DevicesGot);
			//this._webApi.GetDeviceCoordinates('353173060493077', this.CoordinatesGot);

			//
		}

		private SetCoordinates(coordinates: DTO.Coordinates[])
		{
			this._markers.forEach(_=> _.setMap(null));
			if (this._polyline != null)
				this._polyline.setMap(null);

			if (coordinates.length == 0)
				return;
			var bounds = new google.maps.LatLngBounds();
			var labelCaption = 0;
			var polyLinePoints = [];
			coordinates.forEach(_=>
			{
				var pinColor = config.IconColorRad0;
				if (_.rad > 0)
					pinColor = config.IconColorRadMoreThan0;
				var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + "" + "|" + pinColor);

				var marker = new MarkerWithLabel({
					position: new google.maps.LatLng(_.lat, _.lon),
					draggable: false,
					raiseOnDrag: false,
					map: this._map,
					labelContent: _.packet_time.substr(11, 5),
					labelAnchor: new google.maps.Point(22, 0),
					labelClass: "labels",
					labelStyle: { opacity: 0.75 },
					icon: pinImage
				});


				//           var marker = new google.maps.Marker({
				//               title: '(click to open)',
				//               position: new google.maps.LatLng(_.lat, _.lon),
				//map: this._map,
				//draggable: false,
				//               animation: google.maps.Animation.DROP,
				//               icon: pinImage
				//           })
				polyLinePoints.push({ lat: _.lat, lng: _.lon });
				this._markers.push(marker);
				bounds.extend(marker.getPosition());

				var contentString = '<div id="content">' + '';
				//contentString += '<b>Время пакета</b>: ' + _.packet_time + ' </br>';
				contentString += '<b>Долгота</b>: ' + _.lon + ' </br>';
				contentString += '<b>Широта</b>: ' + _.lat + ' </br>';
				//contentString += '<b>Точность</b>: ' + _.rad + ' </br>';
				//contentString += '<b>Тип пакета</b>: ' + _.packet_type + ' </br>';
				if (_['speed'] < 2)
				{
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
				marker.addListener('click', function ()
				{
					infoWindow.open(m, marker);
				});

			});
			this._polyline = new google.maps.Polyline({
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2,
				path: polyLinePoints
			});

			this._polyline.setMap(this._map);
			this._map.setCenter(bounds.getCenter());
			if (this._markers.length > 1)
				this._map.fitBounds(bounds);
			else
				this._map.setZoom(16);
		}

		public OnDeviceSelected(id: string)
		{
			if (this._markers != null)
				this._markers.forEach(_=> _.setMap(null));
			if (this._polyline != null)
				this._polyline.setMap(null);
			this._markers = [];
			this._webApi.GetDeviceCoordinates(id, this.CoordinatesGot);
		}

		public OnDeviceDateChanged(date: Date)
		{
			var d = date.getDate();
			var m = date.getMonth() + 1;
			var y = date.getFullYear();
			var dat = '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d); // Боже, какой пиздец Х2.
			this.SetCoordinates(this._currentCoords.Where(_=> _.packet_time.substring(0, 10) == dat));
		}
	}
}