/**
 * The control panel.
 */
var Panel = {//只有两个功能，一个是初始化另一个是发现路径
    init: function() {

        $('#hide_instructions').click(function() {
            $('#instructions_panel').slideUp();
        });
        $('#button2').attr('disabled', 'disabled');
    },

};
