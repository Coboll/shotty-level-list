$(window).on('load', function () {
    $('body').css('overflow', 'auto')
    $('.load').fadeOut(300)
    $(window).on('resize', function () {
        windowcheck()
    }).trigger('resize')
    windowcheck()
    $('.overflowbuttons').hide()
    $('.overflow').on('click', function () {
        if ($('.overflowbuttons').css('display') == 'none') $('.overflowbuttons').slideDown()
        else $('.overflowbuttons').slideUp()
    })
    twemoji.parse($('body')[0])
})