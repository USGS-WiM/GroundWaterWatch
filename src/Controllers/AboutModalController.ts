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


        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope','$modalInstance'];
        constructor($scope: IAboutModalControllerScope, modal:ng.ui.bootstrap.IModalServiceInstance) {
            $scope.vm = this;
            this.modalInstance = modal;
            this.init();  
        }  
        
        //Methods  
        //-+-+-+-+-+-+-+-+-+-+-+-

        public Close(): void {
            this.modalInstance.dismiss('cancel')
        }

        public Dismiss(): void {
            this.createCookie('GWWshowAbout', true, 30);
            this.modalInstance.dismiss('cancel')
        }
        
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            //place anything that needs to be initialized here
        }

        public createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toUTCString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.AboutModalController', AboutModalController);
}//end module 