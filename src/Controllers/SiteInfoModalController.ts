//------------------------------------------------------------------------------
//----- SiteInfoModalController -------------------------------------------------
//------------------------------------------------------------------------------

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

module GroundWaterWatch.Controllers {
    'use string';
    interface ISiteInfoModalControllerScope extends ng.IScope {
        vm: ISiteInfoModalController;
    }
    interface IModal {
        Close():void
    }    
    interface ISiteInfoModalController extends IModal {
    }
    class SiteInfoModalController extends WiM.Services.HTTPServiceBase implements ISiteInfoModalController {
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
        private gwwServices: Services.IGroundWaterWatchService;
        private eventManager: WiM.Event.IEventManager;
        public sce: any;
        public http: any;
        public pagecontent: any;

        public siteLoaded: boolean;

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$http', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService', 'WiM.Event.EventManager'];
        constructor($scope: ISiteInfoModalControllerScope, $http: ng.IHttpService, $sce: any, modal: ng.ui.bootstrap.IModalServiceInstance, gwwservice: Services.IGroundWaterWatchService, eventManager: WiM.Event.IEventManager) {
            super($http, configuration.baseurls['GroundWaterWatch']);
            $scope.vm = this;
            this.sce = $sce;
            this.modalInstance = modal;
            this.gwwServices = gwwservice;
            this.eventManager = eventManager;
            this.siteLoaded = false;
            
            this.init();  

            //subscribe to events
            this.eventManager.SubscribeToEvent(Services.onSelectedGWSiteChanged, new WiM.Event.EventHandler<WiM.Event.EventArgs>(() => {
                console.log('detected a mouse click/gww site query', this.gwwServices.SelectedGWSite);
                if (this.gwwServices.SelectedGWSite) this.getOldGWWpage();
            })); 
            
        }  
        
        //Methods  
        //-+-+-+-+-+-+-+-+-+-+-+-

        public Close(): void {
            this.modalInstance.dismiss('cancel')
        }

        public convertUnsafe(x: string) {
            console.log('converting...');
            return this.sce.trustAsHtml(x);
        }

        public replaceAll(str, find, replace) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        public getOldGWWpage() {

            this.pagecontent = '';

            var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fgroundwaterwatch.usgs.gov%2FAWLSites.asp%3Fmt%3Dg%26S%3D" + this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + "%26ncd%3Dawl'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"

            var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true);

            this.Execute(request).then(
                (response: any) => {
                    this.siteLoaded = true;

                    if (response.data.indexOf('dws_maps') > 0) {
                        //hide header
                        var replaced = response.data.replace('<table border="0" cellpadding="3" cellspacing="0" width="950px">', '<table border="0" cellpadding="3" cellspacing="0" width="950px" style="display:none;">')

                        //hide footer
                        replaced = replaced.replace('<div id="usgsfooter">', '<div id="usgsfooter" style="display:none;">');

                        //change relative URLs
                        replaced = this.replaceAll(replaced, 'iframe', 'div')
                        replaced = this.replaceAll(replaced, '<td valign="top" width="550">', '<td valign="top" width="550" style="display:none;">')
                        replaced = this.replaceAll(replaced, 'src="../', 'src="http://groundwaterwatch.usgs.gov/')
                        replaced = this.replaceAll(replaced, 'src="images/', 'src="http://groundwaterwatch.usgs.gov/images/')
                        replaced = this.replaceAll(replaced, 'src="../images/', 'src="http://groundwaterwatch.usgs.gov/images/')
                        replaced = this.replaceAll(replaced, 'src="BandPlots-small/', 'src="http://groundwaterwatch.usgs.gov/BandPlots-small/')
                        replaced = this.replaceAll(replaced, 'src="DVPlotsSmall/', 'src="http://groundwaterwatch.usgs.gov/DVPlotsSmall/')
                        replaced = this.replaceAll(replaced, 'src="wlplotssmall/', 'src="http://groundwaterwatch.usgs.gov/wlplotssmall/')
                        replaced = this.replaceAll(replaced, 'src="plots-prsmall/', 'src="http://groundwaterwatch.usgs.gov/plots-prsmall/')

                        replaced = this.replaceAll(replaced, 'color="red"', 'color="black"')
                        this.pagecontent = replaced;
                    }
                    else {
                        console.log('No page found for this site')
                        this.pagecontent = '<div class="alert alert-warning" role="alert">No page found for this site: ' + this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + '<a href = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=' + this.gwwServices.SelectedGWSite['properties']['SITE_NO'] + '&ncd=awl" target="_blank"> GWW Page link </a></div>';
                    }
                }, (error) => {
                    console.log('No gww sites found');
                }).finally(() => {
                });

        }
        
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            //place anything that needs to be initialized here
            this.pagecontent = '';
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.SiteInfoModalController', SiteInfoModalController);
}//end module 