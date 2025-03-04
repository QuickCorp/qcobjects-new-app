/* eslint-disable prefer-rest-params */
"use strict";
import QCObjects from "qcobjects";
import type { ServiceResponse } from '../../types/shared.d.ts';

const { Package, Service } = QCObjects;

function hasAdmin(template: string | undefined): boolean {
  return template !== undefined && template.includes('admin');
}

class AdminCheckService extends Service {
  url = "/admin";

  async done(args?: ServiceResponse): Promise<unknown> {
    if (args) {
      args.serviceData = {
        hasAdmin: hasAdmin(args.template)
      };
    }
    return args;
  }

  async fail(args?: ServiceResponse): Promise<unknown> {
    if (args) {
      args.serviceData = {
        hasAdmin: false
      };
    }
    return args;
  }
}

Package("com.qcobjects.services.newapp", [
  AdminCheckService
]);
