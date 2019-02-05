$(document).ready(function(){
    $('#user-register-button').click(function () {
        $('#user-login').modal('hide');
        $('#user-register').modal('show');
    });

    $('#user-login-button').click(function () {
        $('#user-register').modal('hide');
        $('#user-login').modal('show');
    });
});