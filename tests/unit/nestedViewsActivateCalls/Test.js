// jshint quotmark:false
define([
	"intern!object",
	"intern/chai!assert",
	"decor/sniff",
	"dapp/Application",
	"dapp/utils/view",
	"dojo/Deferred",
	"requirejs-text/text!dapp/tests/unit/nestedViewsActivateCalls/app1.json",
	"deliteful/LinearLayout",
	"deliteful/ViewStack"
], function (registerSuite, assert, has, Application, viewUtils, Deferred,
	nestedViewsActivateCallsconfig1) {
	// nestedViewsActivateCallsSuite1 is having problems on IE10, IE11 and FF
	if (has("ie") || has("ff")) {
		console.log("Skipping nestedViewsActivateCallsSuite1 tests on IE and FF");
		return;
	}
	// -------------------------------------------------------------------------------------- //
	// for nestedViewsActivateCallsSuite1 transition test
	var nestedViewsActivateCallsContainer1,
		nestedViewsActivateCallsApp1V2View,
		testApp,
		nestedViewsActivateCallsApp1P1View,
		nestedViewsActivateCallsApp1S1View,
		nestedViewsActivateCallsApp1V1View,
		nestedViewsActivateCallsApp1V7View,
		nestedViewsActivateCallsNode1;

	var nestedViewsActivateCallsHtmlContent1 =
		"<d-view-stack id='nestedViewsActivateCallsApp1dviewStack' " +
		"style='width: 100%; height: 100%; position: absolute !important'>" +
		"</d-view-stack>";

	var nestedViewsActivateCallsSuite1 = {
		name: "nestedViewsActivateCallsSuite1: test app transitions",
		setup: function () {
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				console.log("Skipping nestedViewsActivateCallsSuite1 tests on FireFox");
				return;
			}
			nestedViewsActivateCallsContainer1 = document.createElement("div");
			document.body.appendChild(nestedViewsActivateCallsContainer1);
			nestedViewsActivateCallsContainer1.innerHTML = nestedViewsActivateCallsHtmlContent1;
			//	register.parse(nestedViewsActivateCallsContainer1); // no need to call parse here since
			// 															config has "parseOnLoad": true
			nestedViewsActivateCallsNode1 = document.getElementById("nestedViewsActivateCallsApp1dviewStack");
			console.log("end setup step 2");

		},
		"test initial view": function () {
			this.timeout = 20000;
			console.log("in test initial view step 3");
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}

			var appStartedDef1 = new Application(JSON.parse(stripComments(nestedViewsActivateCallsconfig1)),
				nestedViewsActivateCallsContainer1);
			console.log("in test initial view step 4");
			return appStartedDef1.then(function (app) {
				console.log("in appStartedDef1.then step 5");
				// we are ready to test
				testApp = app;

				var nestedViewsActivateCallsApp1P1 = document.getElementById("P1");

				// Here nestedViewsActivateCallsApp1Home1View should be displayed

				nestedViewsActivateCallsApp1P1View = viewUtils.getViewFromViewId(testApp, "P1");
				nestedViewsActivateCallsApp1S1View = viewUtils.getViewFromViewId(testApp, "P1_S1");
				nestedViewsActivateCallsApp1V1View = viewUtils.getViewFromViewId(testApp, "P1_S1_V1");

				// check that init has been called on these views
				assert.isTrue(nestedViewsActivateCallsApp1P1View.initialized,
					"nestedViewsActivateCallsApp1P1View.initialized should be true");
				assert.isTrue(nestedViewsActivateCallsApp1S1View.initialized,
					"nestedViewsActivateCallsApp1S1View.initialized should be true");
				assert.isTrue(nestedViewsActivateCallsApp1V1View.initialized,
					"nestedViewsActivateCallsApp1V1View.initialized should be true");

				// check the DOM state to see if we are in the expected state
				assert.isNotNull(nestedViewsActivateCallsNode1, "root nestedViewsActivateCallsNode1 must be here");
				assert.isNotNull(nestedViewsActivateCallsApp1P1, "nestedViewsActivateCallsApp1Home1 view must exist");
				assert.strictEqual(nestedViewsActivateCallsApp1P1View.beforeActivateCallCount, 1,
					"nestedViewsActivateCallsApp1P1View.beforeActivateCallCount should be 1");

				checkNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1P1);
			});
		},

		// Currently showing P1_S1_V1 test transition to V7
		"nestedViewsActivateCallsNode1.show(V7)": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			return nestedViewsActivateCallsNode1.show("V7").then(function () {
				var nestedViewsActivateCallsApp1V7 = document.getElementById("V7");
				checkNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V7);

				nestedViewsActivateCallsApp1V7View = viewUtils.getViewFromViewId(testApp, "V7");
				nestedViewsActivateCallsApp1S1View = viewUtils.getViewFromViewId(testApp, "P1_S1");
				nestedViewsActivateCallsApp1V1View = viewUtils.getViewFromViewId(testApp, "P1_S1_V1");

				// Now nestedViewsActivateCallsApp1V2View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V7View, 1);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V1View, 1);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1S1View, 1);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1P1View, 1);
			});
		},

		// Currently showing V7 test transition to P1_S1_V1
		"nestedViewsActivateCallsNode1.show(P1) will show P1,S1,V1": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			return nestedViewsActivateCallsNode1.show("P1").then(function () {
				var nestedViewsActivateCallsApp1V1 = document.getElementById("P1_S1_V1");
				checkNestedNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V1);

				// Now nestedViewsActivateCallsApp1V1View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1S1View, 2);
				checkActivateCallCount(nestedViewsActivateCallsApp1V1View, 2);
				checkActivateCallCount(nestedViewsActivateCallsApp1P1View, 2);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V7View, 1);
			});
		},

		// Currently showing P1,S1,V1 test transition to P1_S1_V2
		"nestedViewsActivateCallsApp1S1View.containerNode.show('V2') will show P1,S1,V2": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			return nestedViewsActivateCallsApp1S1View.containerNode.show('V2').then(function () {
				var nestedViewsActivateCallsApp1V2 = document.getElementById("P1_S1_V2");
				checkNestedNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V2);

				nestedViewsActivateCallsApp1V2View = viewUtils.getViewFromViewId(testApp, "P1_S1_V2");

				// Now nestedViewsActivateCallsApp1V1View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V2View, 1);
				checkActivateCallCount(nestedViewsActivateCallsApp1V1View, 2, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1S1View, 3);
				checkActivateCallCount(nestedViewsActivateCallsApp1P1View, 3);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V7View, 1);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V1View, 2);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1S1View, 2, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1P1View, 2, true);
			});
		},

		// Currently showing P1_S1_V2 test transition to V7
		"testApp.showOrHideViews('V7')": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			var displayDeferred = new Deferred();
			testApp.showOrHideViews('V7', {
				displayDeferred: displayDeferred
			});
			return displayDeferred.then(function () {
				var nestedViewsActivateCallsApp1V7 = document.getElementById("V7");
				checkNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V7);

				// Now nestedViewsActivateCallsApp1V2View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V7View, 2);

				// Now nestedViewsActivateCallsApp1V1View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V2View, 1, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1V1View, 2, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1S1View, 3, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1P1View, 3, true);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V7View, 1, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V1View, 2);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V2View, 1);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1S1View, 3);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1P1View, 3);
			});
		},

		// Currently showing V7 test transition to P1_S1_V1
		"testApp.showOrHideViews('P1') will show P1,S1,V1": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			var displayDeferred = new Deferred();
			testApp.showOrHideViews('P1', {
				displayDeferred: displayDeferred
			});
			return displayDeferred.then(function () {
				var nestedViewsActivateCallsApp1V1 = document.getElementById("P1_S1_V1");
				checkNestedNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V1);

				// Now nestedViewsActivateCallsApp1V2View ActivateCallCounts as follows
				checkActivateCallCount(nestedViewsActivateCallsApp1V7View, 2, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1V2View, 1, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1V1View, 3);
				checkActivateCallCount(nestedViewsActivateCallsApp1S1View, 4);
				checkActivateCallCount(nestedViewsActivateCallsApp1P1View, 4);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V7View, 2);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V1View, 2, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V2View, 1, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1S1View, 3, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1P1View, 3, true);
			});
		},
		// Currently showing P1_S1_V1 use history.back() to get back to V7
		"test history.back() to get back to V7)": function () {
			this.timeout = 20000;
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				return;
			}
			var displayDeferred = new Deferred();
			setupOnOnce(testApp, displayDeferred);
			history.back();
			return displayDeferred.then(function () {
				var nestedViewsActivateCallsApp1V7 = document.getElementById("V7");
				checkNodeVisibility(nestedViewsActivateCallsNode1, nestedViewsActivateCallsApp1V7);

				// Now nestedViewsActivateCallsApp1V2View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V7View, 2, true);

				// Now nestedViewsActivateCallsApp1V1View ActivateCallCounts should be 1
				checkActivateCallCount(nestedViewsActivateCallsApp1V2View, 1, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1V1View, 3, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1S1View, 4, true);
				checkActivateCallCount(nestedViewsActivateCallsApp1P1View, 4, true);

				// Now nestedViewsActivateCallsApp1V1View DeactivateCallCounts should be 1
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V7View, 2, true);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V1View, 3);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1V2View, 1);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1S1View, 4);
				checkDeactivateCallCount(nestedViewsActivateCallsApp1P1View, 4);
			});
		},

		teardown: function () {
			// call unloadApp to cleanup and end the test
			if (navigator.userAgent.indexOf("Firefox") >= 0) {
				// This test is not reliable on Firefox
				console.log("Skipped nestedViewsActivateCallsSuite1 tests on FireFox");
				return;
			}
			nestedViewsActivateCallsContainer1.parentNode.removeChild(nestedViewsActivateCallsContainer1);
			testApp.unloadApp();
		}
	};

	registerSuite(nestedViewsActivateCallsSuite1);

	function setupOnOnce(testApp, displayDeferred) {
		var signal = testApp.on("dapp-finished-transition", function () {
			displayDeferred.resolve();
			signal.unadvise();
		});
	}

	function checkNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			if (vs.children[i] === target) {
				assert.strictEqual(vs.children[i].style.display, "",
					"checkNodeVisibility FAILED for target.id=" + target.id + " display should equal blank");
			} else {
				assert.strictEqual(vs.children[i].style.display, "none",
					"checkNodeVisibility FAILED other children style.display should equal none");
			}
		}
	}

	function checkNestedNodeVisibility(vs, target) {
		for (var i = 0; i < vs.children.length; i++) {
			assert.isTrue(
				(target.style.display !== "none"),
				"checkNestedNodeVisibility FAILED for target.id=" + (target ? target.id : "")
			);
		}
	}

	function checkActivateCallCount(view, count, skipActiveCheck) {
		if (view) {
			assert.strictEqual(view.beforeActivateCallCount, count,
				view.id + " beforeActivateCallCount should be " + count);
			assert.strictEqual(view.afterActivateCallCount, count,
				view.id + " afterActivateCallCount should be " + count);

			//also test for view._active being set correctly to true
			if (!skipActiveCheck) {
				assert.isTrue(view._active, "view_active should be true for " + view.id);
			}
		}
	}

	function checkDeactivateCallCount(view, count, skipActiveCheck) {
		if (view) {
			assert.strictEqual(view.beforeDeactivateCallCount, count,
				view.id + " beforeDeactivateCallCount should be " + count);
			assert.strictEqual(view.afterDeactivateCallCount, count,
				view.id + " afterDeactivateCallCount should be " + count);

			//also test for view._active being set correctly to false
			if (!skipActiveCheck) {
				assert.isFalse(view._active, "view_active should be false for " + view.id);
			}
		}
	}

	// strip out single line comments from the json config
	function stripComments(jsonData) {
		jsonData = jsonData.replace(/\/\*.*?\*\//g, "");
		jsonData = jsonData.replace(/\/\/.*/g, "");
		return jsonData;
	}

});
