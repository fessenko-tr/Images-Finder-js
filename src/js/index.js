import '../scss/main.scss'


function transparentNavOnScroll(target, initialColor, transparentColor) {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        target.style.backgroundColor = transparentColor;
    } else {
        target.style.backgroundColor = initialColor;
    }
  }


  function smoothScroll( scrollDistance) {
    window.scrollBy({
      top: scrollDistance,
      behavior: 'smooth',
    });
  }


  export {transparentNavOnScroll, smoothScroll};

  
