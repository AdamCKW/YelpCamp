/* A self-invoking function that is used to prevent the form from submitting if there are invalid
fields. */
(function () {
    'use strict';

    /* Selecting all the forms with the class `validated-form` and storing them in a variable called
    `forms`. */
    const forms = document.querySelectorAll('.validated-form');

    /* A function that is called when the form is submitted. It checks if the form is valid and if it
    is not, it prevents the form from submitting. */
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            'submit',
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add('was-validated');
            },
            false
        );
    });
})();
