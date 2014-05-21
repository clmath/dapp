// jshint unused:false, undef:false, quotmark:false
define([
	"intern!object",
	"intern/chai!assert",
	"dapp/Application",
	"dojo/json",
	"dojo/on",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"delite/register",
	"dojo/Deferred",
	"requirejs-text/text!dapp/tests/unit/transitionVisibility/app.json",
	"deliteful/LinearLayout",
	"deliteful/ViewStack"
], function (registerSuite, assert, Application, json, on, domGeom, domClass, register, Deferred,
	transitionVisibilityconfig) {
	// -------------------------------------------------------------------------------------- //
	// for transitionVisibilitySuite
	var transitionVisibilityContainer3, transitionVisibilityNode3;
	var transitionVisibilityHtmlContent3 =
		"<d-view-stack id='transitionVisibilityAppdviewStack' " +
		"style='width: 100%; height: 100%; position: absolute !important'>" +
		"</d-view-stack>";

	var transitionVisibilitySuite = {
		name: "transitionVisibilitySuite dapp transitionVisibility: test app transitions",
		setup: function () {
			appName = "transitionVisibilityApp"; // this is from the config
			transitionVisibilityContainer3 = document.createElement("div");
			document.body.appendChild(transitionVisibilityContainer3);
			transitionVisibilityContainer3.innerHTML = transitionVisibilityHtmlContent3;
			register.parse(transitionVisibilityContainer3);
			transitionVisibilityNode3 = document.getElementById("transitionVisibilityAppdviewStack");
			testApp = null;

		},
		"transitionVisibilitySuite dapp transitionVisibility test initial layout": function () {
			var d = this.async(10000);

			var appStartedDef = Application(json.parse(stripComments(transitionVisibilityconfig)),
				transitionVisibilityContainer3);
			appStartedDef.then(function (app) {
				// we are ready to test
				testApp = app;

				var transitionVisibilityAppHome1 = document.getElementById("transitionVisibilityAppHome1");
				// check the DOM state to see if we are in the expected state
				assert.isNotNull(transitionVisibilityNode3, "root transitionVisibilityNode3 must be here");
				assert.isNotNull(transitionVisibilityAppHome1, "transitionVisibilityAppHome1 view must be here");

				checkNodeVisibility(transitionVisibilityNode3, transitionVisibilityAppHome1);

				// test is finished resolved the deferred
				d.resolve();
			});
			return d;
		},

		// NOTE: these tests will show transition the views, but call to before/afterDeactivate are not working here
		// because the next transition fires before the call to afterActivate.
		"Show (by widget.show with id) test on delite-after-show": function () {
			var d = this.async(10000);

			on.once(transitionVisibilityNode3, "delite-after-show", function (complete) {
				var transitionVisibilityAppHome3NoController =
					document.getElementById("transitionVisibilityAppHome3NoController");
				checkNodeVisibility(transitionVisibilityNode3, transitionVisibilityAppHome3NoController);
				d.resolve();
			});
			transitionVisibilityNode3.show("transitionVisibilityAppHome3NoController");
		},
		"Show (by widget.show with id) test with deferred": function () {
			var d = this.async(10000);

			var showDeferred = transitionVisibilityNode3.show("transitionVisibilityAppHome1");
			showDeferred.then(function () {
				var transitionVisibilityAppHome1 = document.getElementById("transitionVisibilityAppHome1");
				checkNodeVisibility(transitionVisibilityNode3, transitionVisibilityAppHome1);
				d.resolve();
			});
		},
		"Show (by widget.show with id) test with transitionVisibilityNode3.on(delite-after-show)": function () {
			var d = this.async(10000);

			var handle = transitionVisibilityNode3.on("delite-after-show", d.callback(function () {
				var transitionVisibilityAppHome3NoController =
					document.getElementById("transitionVisibilityAppHome3NoController");
				checkNodeVisibility(transitionVisibilityNode3, transitionVisibilityAppHome3NoController);
				handle.remove(); // avoid second calls from other tests
			}));

			var showDeferred = transitionVisibilityNode3.show("transitionVisibilityAppHome3NoController");
		},
		"Test displayView (by view name) ": function () {
			var d = this.async(10000);
			var displayDeferred = new Deferred();

			testApp.showOrHideViews('transitionVisibilityAppHome2', {
				displayDeferred: displayDeferred
			});
			displayDeferred.then(function () {
				var transitionVisibilityAppHome2 = document.getElementById("transitionVisibilityAppHome2");
				checkNodeVisibility(transitionVisibilityNode3, transitionVisibilityAppHome2);
				d.resolve();
			});
		},
		teardown: function () {
			// call unloadApp to cleanup and end the test
			transitionVisibilityContainer3.parentNode.removeChild(transitionVisibilityContainer3);
			testApp.unloadApp();
		}
	};

	registerSuite(transitionVisibilitySuite);

	function checkNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				((vs.children[i] === target && vs.children[i].style.display !== "none") ||
					(vs.children[i] !== target && vs.children[i].style.display === "none")),
				"checkNodeVisibility FAILED for target.id=" + (target ? target.id : "")
			);
		}
	}

	// strip out single line comments from the json config
	function stripComments(jsonData) {
		jsonData = jsonData.replace(/\/\*.*?\*\//g, "");
		jsonData = jsonData.replace(/\/\/.*/g, "");
		return jsonData;
	}

});