$(document).ready(function() {
    var $algo = $('#algorithm_panel');

    $('.panel').draggable();

    $('.accordion').accordion({
        collapsible: false,
    });

    $('#hide_instructions').click(function() {
        $('#instructions_panel').slideUp();
    });

    $('#play_panel').css({
        top: $algo.offset().top + $algo.outerHeight() + 20
    });
});
