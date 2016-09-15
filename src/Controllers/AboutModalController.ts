//------------------------------------------------------------------------------
//----- AboutModalController -------------------------------------------------
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
    interface IAboutModalControllerScope extends ng.IScope {
        vm: IAboutModalController;
    }
    interface IModal {
        Close():void
    }    
    interface IAboutModalController extends IModal {
    }
    class AboutModalController implements IAboutModalController {
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        private modalInstance: ng.ui.bootstrap.IModalServiceInstance;
        private modalService: Services.IModalService;
        private gwwService: Services.IGroundWaterWatchService;
        public selectedAboutTabName: string;
        public sce: any;
        public showModal: boolean;

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$sce', '$modalInstance', 'GroundWaterWatch.Services.GroundWaterWatchService', 'GroundWaterWatch.Services.ModalService'];
        constructor($scope: IAboutModalControllerScope, $sce: any, modal: ng.ui.bootstrap.IModalServiceInstance, gwwservice: Services.IGroundWaterWatchService, modalService: Services.IModalService) {
            $scope.vm = this;
            this.sce = $sce;
            this.modalInstance = modal;
            this.modalService = modalService;
            this.gwwService = gwwservice;
            this.selectedAboutTabName = modalService.modalOptions.tabName;
            this.showModal = true;
            this.init();  

            $scope.$watch(() => this.modalService.modalOptions.tabName, (newval, oldval) => this.selectAboutTab(newval));
        }  
        
        //Methods  
        //-+-+-+-+-+-+-+-+-+-+-+-

        public Close(): void {
            this.modalInstance.dismiss('cancel')
        }

        public Dismiss(): void {
            if (!this.showModal) {
                this.createCookie('GWWhideAbout', true, 30);
            }
            else this.eraseCookie('GWWhideAbout');
        }

        public selectAboutTab(tabname: string): void {
            if (this.selectedAboutTabName == tabname) return;
            this.selectedAboutTabName = tabname;
        }
        
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            //place anything that needs to be initialized here
            if (this.readCookie('GWWhideAbout') != null) this.showModal = !this.showModal;
        }

        public convertUnsafe(x: string) {
            return this.sce.trustAsHtml(x);
        };

        public createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toUTCString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        public readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        public eraseCookie(name) {
            this.createCookie(name, "", -1);
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.AboutModalController', AboutModalController);
}//end module 