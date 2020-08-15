"use strict";
Package("org.quickcorp.custom.views",[
  Class("CardView",View,{
    done (){
      let component = this.component;
      component.body.style.display="block";
      component.body.style.width="100px";
      component.body.style.height="100px";
    }
  }),
  Class("View2",View,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    }
  }),
]);
