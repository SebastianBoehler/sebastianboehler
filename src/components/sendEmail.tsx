const sendEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
}

export default sendEmail;
