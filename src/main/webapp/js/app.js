define([ 'jquery', 'views/MainView'], function($, MainView) {
	var initialize = function() {
		MainView.load();
	};

	return {
		initialize : initialize
	};
});