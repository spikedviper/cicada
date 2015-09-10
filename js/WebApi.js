//<reference path="./Scripts/typings/jquery/jquery.d.ts" />
var Ts;
(function (Ts) {
    var WebApi = (function () {
        function WebApi(WebAPIRootUrl) {
            this.WebAPIRootUrl = WebAPIRootUrl;
        }
        WebApi.prototype.GetDeviceList = function (callback) {
            var keys = 'devlist';
            this.Read(keys, callback);
        };
        WebApi.prototype.GetDeviceCoordinates = function (imea, callback) {
            var keys = 'devcoords/' + imea;
            this.Read(keys, callback);
        };
        WebApi.prototype.Read = function (keys, callback) {
            if (callback === void 0) { callback = null; }
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
        };
        return WebApi;
    })();
    Ts.WebApi = WebApi;
})(Ts || (Ts = {}));
