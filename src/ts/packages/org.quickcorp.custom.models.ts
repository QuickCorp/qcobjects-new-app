"use strict";

import { Package, VO } from "qcobjects";

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
