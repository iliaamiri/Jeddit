$("#buttonPost").click(function() {
    event.preventDefault();

    const thisButton = $("#buttonPost");

    thisButton.prop('disabled', true);

    const inputLink = $("#inputLink").val();
    const inputTitle = $("#inputTitle").val();
    const inputSub = $("#inputSub").find(":selected").text();
    const inputNewSub = $("#inputNewSub").val();
    const textareaInputDescription = $("#textareaInputDescription").val();

    let finalInputSub = inputSub;
    if (inputNewSub.length > 0) {
        finalInputSub = inputNewSub;
    }

    $.post("/posts/create",
        {
            inputLink: inputLink,
            inputTitle: inputTitle,
            textareaInputDescription: textareaInputDescription,
            finalInputSub: finalInputSub,
        },
        function(data, httpStatus){
            const status = data.status;
            const msg = data.msg;
            const post = data.post;

            if (status !== undefined && status === 1) {
                if (post.id === undefined) {
                    window.location.href = "/error/500";
                } else {
                    window.location.href = "/posts/show/" + post.id;
                }
            } else {
                let errorMessage = $("#errorMessage");
                errorMessage.html(msg);
                errorMessage.show();

                thisButton.prop('disabled', false);
            }
        });
});