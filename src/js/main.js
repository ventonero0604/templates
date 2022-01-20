$('a[href^="#"]').on('click', function () {
  let time = 500;
  let target = $(this.hash);
  // const naviHeight = $('.Navi').outerHeight();
  const naviHeight = '0';
  const distance = target.offset().top - naviHeight;
  $('html,body').animate({ scrollTop: distance }, time, 'swing');
  console.log('hoge');
  return false;
});

$('.js-navi').on('click', function (e) {
  e.preventDefault();
  $('.Tsp').toggleClass('is-show');
});

var slideUp = {
  distance: '5%',
  origin: 'bottom',
  delay: 100,
  opacity: 0,
};

ScrollReveal().reveal('.reveal', slideUp);
