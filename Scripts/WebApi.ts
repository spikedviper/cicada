//<reference path="./Scripts/typings/jquery/jquery.d.ts" />

module Ts {
	export class WebApi {
		constructor(public WebAPIRootUrl: string) { }

		public GetDeviceList(callback: { (msg): void })
		{
			var keys: string = 'devlist';
			this.Read(keys, callback);
		}

		public GetDeviceCoordinates(imea: string, callback: { (msg): void }) {
			var keys: string = 'devcoords/' + imea;
			this.Read(keys, callback);
		}

		private Read(keys: string, callback: { (msg: any): void; } = null): void {
			$.support.cors = true;
			jQuery.support.cors = true;
			try {
				var url = this.WebAPIRootUrl + keys;
				$.ajax({
					url: url,
					crossDomain: true,
					type: 'GET',
					dataType: 'json',
					success: function (data) {
						if (callback != null)
							callback(data);
					},
					error: function (xhr, error) {
						console.log('webapi.read failed:' + error);
					}
				});
			}
			catch (error) {
				debugger;
			}
		}
    }
}