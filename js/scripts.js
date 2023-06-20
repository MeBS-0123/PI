/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    $(document).ready(function () {
        // Solucionar dropdowns en la navegación responsiva
        $('.navbar-nav .dropdown-toggle').on('click', function (e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                var dropdownMenu = $(this).next('.dropdown-menu');
                dropdownMenu.slideToggle();

                // Cerrar otros dropdowns abiertos
                var otherDropdownMenus = $('.navbar-nav .dropdown-menu').not(dropdownMenu);
                otherDropdownMenus.slideUp();
            }
        });
    });

});