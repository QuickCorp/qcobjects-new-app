/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";

Package("org.quickcorp.custom.controllers", [
	Class("MainController", Controller, {
		dependencies: [],
		component: null,
		_new_(o) {
			this.__new__(o);
			//TODO: Implement
		},
		done: function () {
			if (!MainController.loaded) {
				var s = _DOMCreateElement("style");
				s.innerHTML = "body, html {margin:0;padding:0;width:100%;height:100%;top:0;bottom:0;left:0;right:0}";
				document.body.append(s);
				MainController.loaded = true;
			}

		}
	}),
	Class("PWAController", Object, {
		component: null,
		_new_(o) {
			logger.debug("PWAController Element Initialized");
			this.component = o.component;
		},
		done: function () {
			document.head.innerHTML += componentRoot.innerHTML;
			componentRoot.innerHTML = "";
		}
	}),
	Class("SideNavController", Object, {
		dependencies: [],
		component: null,
		visibility: false,
		effect: null,
		open() {
			var controller = this;
			var componentRoot = (controller.component.shadowed)?(controller.component.shadowRoot):(controller.component.body);
			if (this.effect != null) {
				this.effect.apply(componentRoot, 0, 1);
			}
			componentRoot.style.width = "100%";
			componentRoot.style.overflowX = "visible";
			componentRoot.parentElement.subelements(".navbtn")[0].style.display = "none";
			componentRoot.parentElement.subelements(".closebtn")[0].style.display = "block";
			this.visibility = true;
			return this.visibility;
		},
		close() {
			var controller = this;
			var componentRoot = (controller.component.shadowed)?(controller.component.shadowRoot):(controller.component.body);
			if (this.effect != null) {
				this.effect.apply(componentRoot, 1, 0);
			}
			componentRoot.style.width = "0px";
			componentRoot.style.overflowX = "hidden";
			componentRoot.parentElement.subelements(".navbtn")[0].style.display = "block";
			componentRoot.parentElement.subelements(".closebtn")[0].style.display = "none";
			this.visibility = false;
			return this.visibility;
		},
		toggle() {
			if (this.visibility) {
				this.close();
			} else {
				this.open();
			}
		},
		_new_(o) {
			this.__new__(o);
			global.sideNavController = this;
			var controller = this;
			global._sdk_.then(function () {
				controller.effect = New(Fade, {
					duration: 300
				});
				controller.close();
			});
			//TODO: Implement

		},
		done: function () {}
	}),
	Class("HeaderController", Controller, {
		dependencies: [],
		component: null,
		installer: null,
		loadInstallerButton() {
			var controller = this;
			var componentRoot = (controller.component.shadowed)?(controller.component.shadowRoot):(controller.component.body);
			componentRoot.subelements("#installerbutton").map(
				function (element) {
					controller.installer = New(Installer, {
						root: element
					});
				}
			);
		},
		_new_(o) {
			this.__new__(o);
			//TODO: Implement
		},
		done: function () {
			this.loadInstallerButton();
		}
	}),
	Class("Controller1", Controller, {
		dependencies: [],
		component: null,
		_new_(o) {
			this.__new__(o);
			var controller = this;
			//TODO: Implement
		}
	}),
	Class("Controller2", Controller, {
		dependencies: [],
		component: null,
		_new_(o) {
			this.__new__(o);
			var controller = this;
			//TODO: Implement
		}
	})
]);