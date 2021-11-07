function pageTransition() {
    var tl = gsap.timeline();
  
    tl.to('ul.transition li', {duration: 1, scaleY: 1, transformOrigin: "bottom left", stagger: .2})
    tl.to('ul.transition li', {duration: 1, scaleY: 0, transformOrigin: "bottom left", stagger: .1, delay: .1})
  }

  function delay(n) {
    n = n || 2000;
    return new Promise(done => {
      setTimeout(() => {
        done();
      }, n);
    });
  }
  
  function contentAnimation() {
    var tl = gsap.timeline();
    tl.from('main', {duration: 1, opacity: 0})
  }

  function reloadPage() {
    setTimeout(function() {
      window.location.reload(true);
    }, 3090);
  }

$(function() {
  barba.init({
    sync: true,
    preventRunning: true,
  
    transitions: [{
  
      async leave(data) {
        const done = this.async();
        pageTransition();
        await delay(1500);
        done();
      },
  
      async enter(data) {
        contentAnimation();
        reloadPage();
        
        
      },
  
      async once(data) {
        contentAnimation();
      },
    }]
  })
})