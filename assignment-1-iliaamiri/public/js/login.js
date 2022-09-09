$("#submitButton").click(function() {
    event.preventDefault();

    const thisButton = $("#submitButton");

    thisButton.prop('disabled', true);

    const inputUsername = $("#inputUsername").val();
    const inputPassword = $("#inputPassword").val();

    $.post("/user/login",
        {
            username: inputUsername,
            password: inputPassword
        },
        function(data, httpStatus){
            const status = data.status;
            const msg = data.msg;

            if (status === 1) {
                window.location.href = "/";
            } else {
                $("#errorMessage").show();

                thisButton.prop('disabled', false);
            }
        });
});