//------------------------------------------------------------------------------
//----- SiteInfoModalController -------------------------------------------------
//------------------------------------------------------------------------------
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var GroundWaterWatch;
(function (GroundWaterWatch) {
    var Controllers;
    (function (Controllers) {
        'use string';
        var SiteInfoModalController = (function (_super) {
            __extends(SiteInfoModalController, _super);
            function SiteInfoModalController($scope, $http, $sce, modal, gwwservice, eventManager) {
                var _this = _super.call(this, $http, configuration.baseurls['GroundWaterWatch']) || this;
                $scope.vm = _this;
                _this.sce = $sce;
                _this.modalInstance = modal;
                _this.gwwServices = gwwservice;
                _this.eventManager = eventManager;
                _this.siteLoaded = false;
                _this.init();
                //subscribe to events
                _this.eventManager.SubscribeToEvent(GroundWaterWatch.Services.onSelectedGWSiteChanged, new WiM.Event.EventHandler(function () {
                    console.log('detected a mouse click/gww site query', _this.gwwServices.SelectedGWSite);
                    if (_this.gwwServices.SelectedGWSite)
                        _this.getOldGWWpage();
                }));
                return _this;
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
            SiteInfoModalController.prototype.replaceAll = function (str, find, replace) {
                return str.replace(new RegExp(find, 'g'), replace);
            };
            SiteInfoModalController.prototype.getOldGWWpage = function () {
                var _this = this;
                this.pagecontent = '';
                var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'{0}/AWLSites.asp%3Fmt%3Dg%26S%3D" + this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + "%26ncd%3Dawl'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
                url = url.format(configuration.baseurls["gwwURL"]);
                var request = new WiM.Services.Helpers.RequestInfo(url, true);
                this.Execute(request).then(function (response) {
                    _this.siteLoaded = true;
                    if (response.data.indexOf('dws_maps') > 0) {
                        //hide header
                        var replaced = response.data.replace('<table border="0" cellpadding="3" cellspacing="0" width="950px">', '<table border="0" cellpadding="3" cellspacing="0" width="950px" style="display:none;">');
                        //hide footer
                        replaced = replaced.replace('<div id="usgsfooter">', '<div id="usgsfooter" style="display:none;">');
                        //change relative URLs
                        replaced = _this.replaceAll(replaced, 'iframe', 'div');
                        replaced = _this.replaceAll(replaced, '<td valign="top" width="550">', '<td valign="top" width="550" style="display:none;">');
                        replaced = _this.replaceAll(replaced, 'src="../', 'src="' + configuration.baseurls["gwwURL"]);
                        replaced = _this.replaceAll(replaced, 'src="images/', 'src="{0}/images/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'src="../images/', 'src="{}0/images/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'src="BandPlots-small/', 'src="{0}/BandPlots-small/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'src="DVPlotsSmall/', 'src="{0}/DVPlotsSmall/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'src="wlplotssmall/', 'src="{0}/wlplotssmall/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'src="plots-prsmall/', 'src="{0}/plots-prsmall/'.format(configuration.baseurls["gwwURL"]));
                        replaced = _this.replaceAll(replaced, 'color="red"', 'color="black"');
                        _this.pagecontent = replaced;
                    }
                    else {
                        console.log('No page found for this site');
                        _this.pagecontent = '<div class="alert alert-warning" role="alert">No page found for this site: ' + _this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + '<a href = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=' + _this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + '&ncd=awl" target="_blank"> GWW Page link </a></div>';
                    }
                }, function (error) {
                    console.log('No gww sites found');
                }).finally(function () {
                });
            };
            //Helper Methods
            //-+-+-+-+-+-+-+-+-+-+-+-
            SiteInfoModalController.prototype.init = function () {
                //place anything that needs to be initialized here
                this.pagecontent = '';
            };
            return SiteInfoModalController;
        }(WiM.Services.HTTPServiceBase)); //end  class
        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        SiteInfoModalController.$inject = ['$scope', '$http', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService', 'WiM.Event.EventManager'];
        angular.module('GroundWaterWatch.Controllers')
            .controller('GroundWaterWatch.Controllers.SiteInfoModalController', SiteInfoModalController);
    })(Controllers = GroundWaterWatch.Controllers || (GroundWaterWatch.Controllers = {}));
})(GroundWaterWatch || (GroundWaterWatch = {})); //end module 
//# sourceMappingURL=SiteInfoModalController.js.map