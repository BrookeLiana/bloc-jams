
var animatePoints = function() {

  var revealPoint = function() {
          // #7
          $(this).css({
              opacity: 1,
              transform: 'scaleX(1) translateY(0)'
          });
          var revealPoint = function() {
        // #7
        $(this).css({
            opacity: 1,
            transform: 'scaleX(1) translateY(0)'
        });

    };

 var animatePoints = function(points) {
      forEach(points, revealPoint);
    };

    $(window).load(function() {
      // #1
           if ($(window).height() > 950) {
               animatePoints();
           }
           // #2
                var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

                // #3
     $(window).scroll(function(event) {
                  // #4
       if ($(window).scrollTop() >= scrollDistance) {
             animatePoints();
             });

         window.addEventListener("scroll", function(event) {
           if (pointsArray[0].getBoundingClientRect().top <= 500) {
             animatePoints(pointsArray);
           }
         });
 }
