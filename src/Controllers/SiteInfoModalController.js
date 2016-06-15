//------------------------------------------------------------------------------
//----- SiteInfoModalController -------------------------------------------------
//------------------------------------------------------------------------------
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GroundWaterWatch;
(function (GroundWaterWatch) {
    //-------1---------2---------3---------4---------5---------6---------7---------8
    //       01234567890123456789012345678901234567890123456789012345678901234567890
    //-------+---------+---------+---------+---------+---------+---------+---------+
    // copyright:   2016 WiM - USGS
    //    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
    //
    //
    //   purpose:  Example of Modal Controller
    //
    //discussion:
    //Comments
    //05.11.2016 jkn - Created
    //Import
    (function (Controllers) {
        'use string';

        var SiteInfoModalController = (function (_super) {
            __extends(SiteInfoModalController, _super);
            function SiteInfoModalController($scope, $http, $sce, modal, gwwservice) {
                _super.call(this, $http, configuration.baseurls['GroundWaterWatch']);
                $scope.vm = this;
                this.sce = $sce;
                this.http = $http;
                this.modalInstance = modal;
                this.gwwServices = gwwservice;
                this.pagecontent = '';
                this.init();
            }
            //Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SiteInfoModalController.prototype.Close = function () {
                this.modalInstance.dismiss('cancel');
            };

            SiteInfoModalController.prototype.convertUnsafe = function (x) {
                console.log('converting...');
                return this.sce.trustAsHtml(x);
            };

            SiteInfoModalController.prototype.getOldGWWpage = function () {
                //var url = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=" + this.gwwServices.SelectedGWSite['properties'].SITE_NO + "&ncd=awl"
                //var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'html');
                var _this = this;
                //this.Execute(request).then(
                //    (response: any) => {
                //        console.log('Successfully retrieved', response);
                //        //this.pagecontent = response.data.article.description;
                //    }, (error) => {
                //        //sm when error
                //    }).finally(() => {
                //    });
                var url = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=304949083165301&ncd=awl";
                console.log('in here', url);
                this.http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fgroundwaterwatch.usgs.gov%2FAWLSites.asp%3Fmt%3Dg%26S%3D304949083165301%26ncd%3Dawl'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys").success(function (data) {
                    if (data.indexOf('dws_maps') > 0) {
                        var replace = data.replace('iframe', 'div');
                        console.log(replace);
                        _this.pagecontent = replace;
                    }
                });
            };

            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SiteInfoModalController.prototype.init = function () {
                //place anything that needs to be initialized here
                console.log('here', this.gwwServices.SelectedGWSite);
                this.getOldGWWpage();
            };
            SiteInfoModalController.$inject = ['$scope', '$http', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService'];
            return SiteInfoModalController;
        })(WiM.Services.HTTPServiceBase);

        angular.module('GroundWaterWatch.Controllers').controller('GroundWaterWatch.Controllers.SiteInfoModalController', SiteInfoModalController);
    })(GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
    var Controllers = GroundWaterWatch.Controllers; //end module
})(GroundWaterWatch || (GroundWaterWatch = {}));
//# sourceMappingURL=SiteInfoModalController.js.map
