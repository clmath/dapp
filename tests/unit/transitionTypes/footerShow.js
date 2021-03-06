// jshint unused:false, undef:false, quotmark:false
define(["dojo/dom", "dojo/on", "delite/register"], function (dom, on, register) {
	return {
		aaasel: false,
		bbbsel: false,
		cccsel: false,
		dddsel: false,

		setSelection: function (sel) {
			this.aaasel = false;
			this.bbbsel = false;
			this.cccsel = false;
			this.dddsel = false;
			if (sel === "aaa") {
				this.aaasel = true;
			} else if (sel === "bbb") {
				this.bbbsel = true;
			} else if (sel === "ccc") {
				this.cccsel = true;
			} else if (sel === "ddd") {
				this.dddsel = true;
			}
		},

		init: function () {
			console.log("in footerShow.js init called");
			this.app.on("vs-selection-changed", function (selection) {
				//console.log(" in vs-selection-changed selection="+selection);
				this.setSelection(selection);
			}.bind(this));
		},
		beforeActivate: function (previousView, viewData) {
			//console.log("in footerShow.js beforeActivate called");
		},
		beforeDeactivate: function (previousView, viewData) {
			//console.log("in footerShow.js beforeDeactivate called previousView=", previousView);
		},
		afterActivate: function (previousView) {
			if (this.ownerDocument.getElementById("vs")) {
				var vsNode = this.ownerDocument.getElementById("vs");
				var sel = vsNode.selectedChildId;
				this.setSelection(sel);
			}
		},
		afterDeactivate: function (previousView) {
			//console.log("in footerShow.js afterDeactivate called previousView=", previousView);
		}
	};
});
