//------------------------------------------------------------------------------
//----- NavbarController ------------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2014 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping


//   purpose:  

//discussion:   Controllers are typically built to reflect a View. 
//              and should only contailn business logic needed for a single view. For example, if a View 
//              contains a ListBox of objects, a Selected object, and a Save button, the Controller 
//              will have an ObservableCollection ObectList, 
//              Model SelectedObject, and SaveCommand.

//Comments
//04.14.2015 jkn - Created

//Imports"
module GroundWaterWatch.Controllers {
    'use strict';
    interface INavbarControllerScope extends ng.IScope {
        vm: NavbarController;
    }
    interface INavbarController {
        ProjectName: string; 
    }

    class NavbarController implements INavbarController {
        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        private modalService: Services.IModalService;
        private gwwService: Services.IGroundWaterWatchService;
        private cookies: any;
        private newArticleCount: number;
        public get ProjectName(): string {
            if (this.gwwService.SelectedPrimaryNetwork)
                return configuration.projectName + " - " + this.gwwService.SelectedPrimaryNetwork.name;
            else return configuration.projectName
        }

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        static $inject = ['$scope', '$stateParams', 'GroundWaterWatch.Services.ModalService', 'GroundWaterWatch.Services.GroundWaterWatchService'];
        constructor($scope: INavbarControllerScope, $stateParams, modal: Services.IModalService, gww: Services.IGroundWaterWatchService) {            
            $scope.vm = this;
            this.modalService = modal;
            this.gwwService = gww;
            this.checkAboutModal();

        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        public checkAboutModal() {
            if (this.readCookie('GWWshowAbout') == null) {
                this.modalService.openModal(Services.ModalType.e_about);
            }
        }

        public openAboutModal(): void {
            this.modalService.openModal(Services.ModalType.e_about);
        }

        //Helper Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
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

    }//end class
    angular.module('GroundWaterWatch.Controllers')
        .controller('GroundWaterWatch.Controllers.NavbarController', NavbarController)

}//end module
  