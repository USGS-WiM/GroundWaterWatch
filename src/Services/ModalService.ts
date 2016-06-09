//------------------------------------------------------------------------------
//----- modalService -----------------------------------------------------
//------------------------------------------------------------------------------

//-------1---------2---------3---------4---------5---------6---------7---------8
//       01234567890123456789012345678901234567890123456789012345678901234567890
//-------+---------+---------+---------+---------+---------+---------+---------+

// copyright:   2015 WiM - USGS

//    authors:  Jeremy K. Newson USGS Wisconsin Internet Mapping
//             
// 
//   purpose:  The service agent is responsible for initiating service calls, 
//             capturing the data that's returned and forwarding the data back to 
//             the Controller.
//          
//discussion:
//
//https://docs.angularjs.org/api/ng/service/$http

//Comments
//06.16.2015 mjs - Created

//Import
module GroundWaterWatch.Services {
    'use strict'
    export interface IModalService {
        openModal(mType: ModalType, options?: IModalOptions);
        modalOptions: IModalOptions;
    }

    export interface IModalOptions {
        tabName: string;
        regionID: string;
    }

    class ModalService implements IModalService{       
        //Events
        //-+-+-+-+-+-+-+-+-+-+-+-


        //Properties
        //-+-+-+-+-+-+-+-+-+-+-+-
        public modal: ng.ui.bootstrap.IModalService;
        public modalOptions: IModalOptions;

        //Constructor
        //-+-+-+-+-+-+-+-+-+-+-+-
        constructor($modal: ng.ui.bootstrap.IModalService) {
            this.modal = $modal;
        }

        //Methods
        //-+-+-+-+-+-+-+-+-+-+-+-
        public openModal(mType: ModalType, options: IModalOptions = null) {
            
            if (options) {
                this.modalOptions = options
            }
            this.modal.open(this.getModalSettings(mType));
        }  


        //HelperMethods
        //-+-+-+-+-+-+-+-+-+-+-+-
        private getModalSettings(mType: ModalType): ng.ui.bootstrap.IModalSettings {
            //console.log('in canUpdateProcedure');
            //Project flow:
            var msg: string;
            try {
                switch (mType) {
                    case ModalType.e_filter:
                    return {
                        templateUrl: 'Views/filtermodal.html',
                        controller: 'GroundWaterWatch.Controllers.FilterModalController',
                        size: 'lg',
                        backdropClass: 'backdropZ',
                        backdrop: 'static',
                        windowClass: 'windowZ'
                        };
                    case ModalType.e_about:
                        return {
                            templateUrl: 'Views/aboutmodal.html',
                            controller: 'GroundWaterWatch.Controllers.AboutModalController',
                            size: 'lg',
                            backdropClass: 'backdropZ',
                            backdrop: 'static',
                            windowClass: 'windowZ'
                        };
                    default:
                        return {
                            templateUrl: 'Views/aboutmodal.html',
                            controller: 'GroundWaterWatch.Controllers.AboutModalController',
                            size: 'lg',
                            backdropClass: 'backdropZ',
                            backdrop: 'static',
                            windowClass: 'windowZ'
                        };
                }//end switch          
            }
            catch (e) {
                return false;
            }
        }

    }//end class
    export enum ModalType {
        e_filter = 1,
        e_about =2        
    }

    factory.$inject = ['$modal'];
    function factory($modal: ng.ui.bootstrap.IModalService) {
        return new ModalService($modal)
    }
    angular.module('GroundWaterWatch.Services')
        .factory('GroundWaterWatch.Services.ModalService', factory)
}//end module  