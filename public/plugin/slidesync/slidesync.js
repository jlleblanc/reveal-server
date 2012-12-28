(function  () {
	var socket = io.connect(window.location.origin);

	var presenter = function  () {
		console.log('presenter');
		Reveal.addEventListener( 'fragmentshown', function(event) {
			socket.emit('fragmentchanged', {fragment : 'next'});
		});

		Reveal.addEventListener( 'fragmenthidden', function(event) {
			socket.emit('fragmentchanged', {fragment : 'previous'});
		});

		Reveal.addEventListener( 'slidechanged', function(event) {
			var nextindexh;
			var nextindexv;
			var slideElement = event.currentSlide;

			if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
				nextindexh = event.indexh;
				nextindexv = event.indexv + 1;
			} else {
				nextindexh = event.indexh + 1;
				nextindexv = 0;
			}

			var slideData = {
				indexh : event.indexh,
				indexv : event.indexv,
				nextindexh : nextindexh,
				nextindexv : nextindexv,
			};

			socket.emit('slidechanged', slideData);
		});

	};

	var viewer = function  () {
		console.log('viewer');

		socket.on('slidechanged', function (data) {
			Reveal.slide(data.indexh, data.indexv);
		});

		socket.on('fragmentdata', function (data) {
			console.log(data);
			if (data.fragment === 'next') {
				Reveal.nextFragment();
			}
			else if (data.fragment === 'previous') {
				Reveal.prevFragment();
			}
		});
	};

	// if presenter...
	socket.on("presenter", function  (data) {
		if (data === true) {
			presenter();
		} else {
			viewer();
		}
	});

})();