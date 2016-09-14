﻿module GroundWaterWatch.Models {
    export interface IFilterSite {
        name?: string 
        code: string
    }
    export interface IState extends IFilterSite {
        Counties: Array<ICounty>
    }
    export interface ICounty extends IFilterSite {
        statecode:string
    }
    export interface IAquifer extends IFilterSite {
    }
    export interface INetwork extends IFilterSite {
    }
}