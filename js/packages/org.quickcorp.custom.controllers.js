'use strict';
Package('org.quickcorp.custom.controllers',[
  Class('SideNavController',Object,{
  dependencies:[],
  component:null,
  visibility:false,
  open:function (){
    this.component.body.style.width="30%";
    this.component.body.style.overflowX="visible";
    this.component.body.parentElement.subelements('.navbtn')[0].style.display='none';
    this.visibility = true;
    return this.visibility;
  },
  close:function (){
    this.component.body.style.width="0px";
    this.component.body.style.overflowX="hidden";
    this.component.body.parentElement.subelements('.navbtn')[0].style.display='block';
    this.visibility = false;
    return this.visibility;
  },
  toggle:function (){
    if (this.visibility){
      this.close();
    } else {
      this.open();
    }
  },
  _new_:function (o){
      this.__new__(o);
      GLOBAL.sideNavController = this;
      //TODO: Implement

    },
    done: function (){
    }
  }),
  Class('Controller1',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    }
  }),
  Class('Controller2',Controller,{
    dependencies:[],
    component:null,
    _new_:function (o){
      this.__new__(o);
      var controller=this;
      //TODO: Implement
    }
  }),
]);
