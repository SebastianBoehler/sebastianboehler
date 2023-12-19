const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //freeze form while sending
    const form = event.target as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    submitButton.disabled = true;
    submitButton.classList.add('cursor-not-allowed');

    //get form data desctructed from the event
    const target = event.target as typeof event.target & {
        name: { value: string };
        email: { value: string };
        message: { value: string };
    };
    const name = target.name.value; // get name
    const email = target.email.value; // get email
    const message = target.message.value; // get message

    const body = {
        name,
        email,
        message,
    }


    const res = await fetch('/api/contact', {
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    });

    const result = await res.json();
    console.log(result);

    if (result.message === 'Message sent') {
        alert('Message sent');
        //clear form again
        target.name.value = '';
        target.email.value = '';
        target.message.value = '';
    } else {
        alert('Message failed to send');
    }

    //unfreeze form
    submitButton.disabled = false;
}

export default sendEmail;
