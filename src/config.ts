﻿//http://lgorithms.blogspot.com/2013/07/angularui-router-as-infrastructure-of.html
//http://www.funnyant.com/angularjs-ui-router/

declare var configuration: any;
module GroundWaterWatch {
    //'use strict';

    class config {
        static $inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$logProvider'];
        constructor(private $stateProvider: ng.ui.IStateProvider, private $urlRouterProvider: ng.ui.IUrlRouterProvider, private $locationProvider: ng.ILocationProvider, private $logProvider: ng.ILogProvider) {
            this.$stateProvider
                //NETWORK_CD         = ncd
                //STATE_CD           = sc
                //COUNTY_CD          = cc
                //SITE_NO            = S
                
                //LTN frequency      = a
                //LTN timeperiod     = d
                .state("main", {
                url: '/?ncd&sc&cc&S&a&d',
                template:'<ui-view/>',
                views: {
                    'map': {
                        templateUrl: "Views/mapview.html",
                        controller: "GroundWaterWatch.Controllers.MapController"
                    },
                    'sidebar': {
                        templateUrl: "Views/sidebarview.html",
                        controller: "GroundWaterWatch.Controllers.SidebarController"

                    },
                    'navbar': {
                        templateUrl: "Views/navigationview.html",
                        controller: "GroundWaterWatch.Controllers.NavbarController"
                    }
                }
            })//end main state 
          
            this.$urlRouterProvider.otherwise('/');     
            
            this.$locationProvider.html5Mode(true);   
            
            //turns of angular-leaflet console spam
            this.$logProvider.debugEnabled(false);    

                                
        }//end constructor
    }//end class

    angular.module('GroundWaterWatch',[
        'ui.router', 'ui.bootstrap','ui.checkbox',
        'mobile-angular-ui',
        'angulartics', 'angulartics.google.analytics',
        'toaster', 'ngFileUpload',
        'leaflet-directive',
        'GroundWaterWatch.Services',
        'GroundWaterWatch.Controllers',
        'WiM.Services', 'WiM.Event', 'wim_angular', 'angularResizable','angular-multi-select'
        ])
        .config(config);
}//end module 