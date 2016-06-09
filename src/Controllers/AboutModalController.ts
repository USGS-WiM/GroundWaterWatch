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
        
        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private init(): void {
            //place anything that needs to be initialized here
        }
      
    }//end  class

    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.AboutModalController', AboutModalController);
}//end module 