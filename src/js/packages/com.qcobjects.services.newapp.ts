/* eslint-disable prefer-rest-params */
"use strict";
import { Package, Service, _DataStringify } from "qcobjects";

type StandardResponse = { 
  request: XMLHttpRequest;
  service: Service; 
};

Package("com.qcobjects.services.newapp", [
  class AdminCheckService extends Service {
    
    url = "/admin";

    done (standardResponse:StandardResponse){
      const hasAdmin = (template:string) => {
        return (/<base href="\/admin\/" target="_self">/).test(template);
      };
      standardResponse.service.template = _DataStringify({
        hasAdmin: hasAdmin(standardResponse.service.template)
      });
    }

    fail (standardResponse:StandardResponse){
      standardResponse.service.template = _DataStringify({
        hasAdmin: false
      });
    }

  }
]);
