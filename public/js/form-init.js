(function() {
  var docElem = window.document.documentElement, didScroll, scrollPosition;

  // trick to prevent scrolling when opening/closing button
  function noScrollFn() {
    window.scrollTo( scrollPosition ? scrollPosition.x : 0, scrollPosition ? scrollPosition.y : 0 );
  }

  function noScroll() {
    window.removeEventListener( 'scroll', scrollHandler );
    window.addEventListener( 'scroll', noScrollFn );
  }

  function scrollFn() {
    window.addEventListener( 'scroll', scrollHandler );
  }

  function canScroll() {
    window.removeEventListener( 'scroll', noScrollFn );
    scrollFn();
  }

  function scrollHandler() {
    if( !didScroll ) {
      didScroll = true;
      setTimeout( function() { scrollPage(); }, 60 );
    }
  };

  function removeClass(ele,cls) {
     var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
     ele.className = ele.className.replace(reg,' ');
  }

  function scrollPage() {
    scrollPosition = { x : window.pageXOffset || docElem.scrollLeft, y : window.pageYOffset || docElem.scrollTop };
    didScroll = false;
  };

  scrollFn();

  [].slice.call( document.querySelectorAll( '.morph-button' ) ).forEach( function( bttn ) {
    new UIMorphingButton( bttn, {
      closeEl : '.icon-close',
      onBeforeOpen : function() {
        // don't allow to scroll
        trackballGlobal.enabled = false;
         $("#marshall-form").find('label').html("");
        document.body.className += " newsletter-modal-oepn";
        noScroll();
      },
      onAfterOpen : function() {
        $('#marshall-email').focus();
        canScroll();
      },
      onBeforeClose : function() {
        // don't allow to scroll
        noScroll();
      },
      onAfterClose : function() {
        // can scroll again
        trackballGlobal.enabled = true;
        canScroll();
        document.querySelector('body').classList.remove('newsletter-modal-oepn');
      }
    } );
  } );

})();