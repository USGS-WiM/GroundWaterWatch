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
        public sce: any;
        public http: any;
        public pagecontent: any;
        public siteinfoURL: any;

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$http', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService'];
        constructor($scope: ISiteInfoModalControllerScope, $http: ng.IHttpService, $sce: any, modal: ng.ui.bootstrap.IModalServiceInstance, gwwservice: Services.IGroundWaterWatchService) {
            super($http, configuration.baseurls['GroundWaterWatch']);
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

        public Close(): void {
            this.modalInstance.dismiss('cancel')
        }

        public convertUnsafe(x: string) {
            console.log('converting...');
            return this.sce.trustAsHtml(x);
        }


        public getOldGWWpage() {


            //var url = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=" + this.gwwServices.SelectedGWSite['properties'].SITE_NO + "&ncd=awl"
            //var request: WiM.Services.Helpers.RequestInfo = new WiM.Services.Helpers.RequestInfo(url, true, WiM.Services.Helpers.methodType.GET, 'html');

            //this.Execute(request).then(
            //    (response: any) => {
            //        console.log('Successfully retrieved', response);

            //        //this.pagecontent = response.data.article.description;

            //    }, (error) => {
            //        //sm when error
            //    }).finally(() => {

            //    });

            
            var url = "http://groundwaterwatch.usgs.gov/AWLSites.asp?mt=g&S=304949083165301&ncd=awl"
            console.log('in here', url);
            this.http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fgroundwaterwatch.usgs.gov%2FAWLSites.asp%3Fmt%3Dg%26S%3D304949083165301%26ncd%3Dawl'&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
                .success((data: any) => {

                    if (data.indexOf('dws_maps') > 0) {

                        var replace = data.replace('iframe', 'div')
                        console.log(replace);
                        this.pagecontent = replace;

                    }
                    
                });

        }
        
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            //place anything that needs to be initialized here
            console.log('here', this.gwwServices.SelectedGWSite);
            this.getOldGWWpage();
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.SiteInfoModalController', SiteInfoModalController);
}//end module 