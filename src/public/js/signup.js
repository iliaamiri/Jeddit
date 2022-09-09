$("#submitButton").click(function() {
    event.preventDefault();

    const thisButton = $("#submitButton");

    thisButton.prop('disabled', true);

    const inputUsername = $("#inputUsername").val();
    const inputPassword = $("#inputPassword").val();

    $.post("/user/signup",
        {
            username: inputUsername,
            password: inputPassword
        },
        function(data, httpStatus){
            const status = data.status;
            const msg = data.msg;

            if (status === 1) {
                swal(`Welcome, ${inputUsername}!`, {
                    title: `Hi ${inputUsername} 😊`,
                    text: "Welcome to Jeddit! 🎉",
                    icon: "success",
                })
                    .then(() => {
                        window.location.href = "/user/login";
                    })
            } else {
                $("#errorMessage").show();

                thisButton.prop('disabled', false);
            }
        });
});