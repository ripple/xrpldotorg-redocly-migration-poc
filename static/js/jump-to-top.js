$(document).ready(function() {
  console.log("Document ready is real")

  var TO_TOP_MIN = 50;
  var TO_TOP_SPEED = 500;
  var TO_TOP_POS = 0;
  $(window).scroll(function () {
    if ($(this).scrollTop() > TO_TOP_MIN) {
       $('.jump-to-top').fadeIn();
    } else {
       $('.jump-to-top').fadeOut();
    }
  });
  $(".jump-to-top").click(function() {
    $("html").animate({scrollTop: TO_TOP_POS}, TO_TOP_SPEED)
  });
});
