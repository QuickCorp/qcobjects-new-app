"use strict";

import QCObjects from "qcobjects";
const { Package, VO } = QCObjects;

Package("org.quickcorp.custom.models", [

  class ContactVO extends VO {
    first_name = "";
    last_name = "";
    address = "";
    postalCode = "";
    city = "";
    country = "";
    email = "";
    phone = "";
  }
]);
