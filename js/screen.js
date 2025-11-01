function windowcheck() {
    if ($(window).width() < 650) {
        $('.levels h1').hide()
        $('.roulette h1').hide()
        $('.level .info h4').css('font-size', '80%')
        $('.level .info p').css('font-size', '80%')
        $('.recordmodal .info h4').css('font-size', '80%')
        $('.recordmodal .info p').css('font-size', '80%')
        $('.changelog p').css('font-size', '80%')
        $('ol').css('font-size', '80%')
        $('ul').css('font-size', '90%')
        $('ol').css('padding', '0 5px')
        $('.level h1').css('font-size', '150%')
        $('.records h1').css('font-size', '150%')
        $('.guidelines h1').css('font-size', '150%')
        $('.changelog h1').css('font-size', '150%')
        $('.guidelines .desc').css('font-size', '90%')
        $('.level h2').css('font-size', '100%')
        $('.recordmodal h2').css('font-size', '120%')
        $('.level h3').css('font-size', '90%')
        $('.records h5').css('font-size', '70%')
        $('.video').css('height', '200px')

        $('table').css('font-size', '80%')
        $('.recordmodal table').css('font-size', '70%')
        $('.hz').hide()
        $('.rank').hide()
        $('.recordmodal .points').hide()
        $('.level .country').hide()
    } else {
        $('.levels h1').show()
        $('.roulette h1').show()
        $('.level .info h4').css('font-size', '100%')
        $('.level .info p').css('font-size', '100%')
        $('.recordmodal .info h4').css('font-size', '100%')
        $('.recordmodal .info p').css('font-size', '100%')
        $('.changelog p').css('font-size', '100%')
        $('ol').css('font-size', '100%')
        $('ul').css('font-size', '100%')
        $('ol').css('padding', '0 20px')
        $('.level h1').css('font-size', '200%')
        $('.records h1').css('font-size', '200%')
        $('.guidelines h1').css('font-size', '200%')
        $('.changelog h1').css('font-size', '200%')
        $('.guidelines .desc').css('font-size', '100%')
        $('.level h2').css('font-size', '150%')
        $('.recordmodal h2').css('font-size', '150%')
        $('.level h3').css('font-size', '120%')
        $('.records h5').css('font-size', '80%')
        $('.video').css('height', '350px')

        $('table').css('font-size', '100%')
        $('.recordmodal table').css('font-size', '100%')
        $('.hz').show()
        $('.rank').show()
        $('.recordmodal .points').show()
        $('.level .country').show()
    }

    if ($(window).width() < 700) {
        $('.buttons').hide()
        $('.overflow').show()
    } else {
        $('.buttons').show()
        $('.overflow').hide()
        $('.overflowbuttons').hide()
    }

    if ($(window).width() < 800) {
        $('.levels h2').css('font-size', '90%')
        $('.levels h3').css('font-size', '80%')
        $('.roulette h2').css('font-size', '90%')
        $('.roulette h3').css('font-size', '80%')
    } else {
        $('.levels h2').css('font-size', '130%')
        $('.levels h3').css('font-size', '100%')
        $('.roulette h2').css('font-size', '130%')
        $('.roulette h3').css('font-size', '100%')
    }

    $('.vidratio').css('height', $('.vidratio').width() * (9 / 16) + 'px')

    twemoji.parse($('body')[0])
}