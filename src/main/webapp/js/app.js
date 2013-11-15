define([ 'jquery', 'views/MainView'], function($, MainView) {
	var initialize = function() {
		MainView.init();
	};

	return {
		initialize : initialize
	};
});