document.getElementById('upload').addEventListener('change', () => {
    let fr = new FileReader();
    fr.readAsText(document.getElementById('upload').files[0]);
    fr.onload = function () {
        let Arr = fr.result.split(/\r?\n|\n/).map(e => e.split(','));
        let valNo = 0;
        let invalNo = 0;
        let valMail = [];

        Arr.forEach(e => {
            let em = String(e).trim();
            if (em) {
                let creEle = document.createElement("tr");
                creEle.innerHTML = e.map(e => `<td>${e}</td>`).join('');

                if (validateEmail(em)) {
                    document.querySelector("table#val").appendChild(creEle);
                    valMail.push(em);
                    valNo++;
                } else {
                    document.querySelector("table#inval").appendChild(creEle);
                    invalNo++;
                }
            }
        });

        document.querySelector('#valCount').innerHTML = valNo;
        document.querySelector('#invalCount').innerHTML = invalNo;
    };
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function sendEmail() {
    let valMail = Array.from(document.querySelectorAll("#val tr td:first-child")).map(td => td.textContent);
    let fromEmail = document.getElementById('from').value;
    let subject = document.getElementById('subject').value;
    let body = document.getElementById('msg').value;

    let batch = 100; // Number of emails to send per batch
    let delay = 10000; // 10 seconds delay between batches

    for (let i = 0; i < valMail.length; i += batch) {
        setTimeout(() => {
            let emails = valMail.slice(i, i + batch);
            emails.forEach(email => {
                Email.send({
                    Host: "smtp.elasticemail.com",
                    Username: "nandapriyanka121@gmail.com",
                    Password: "Priyanka@16",
                    To: email,
                    From: fromEmail,
                    Subject: subject,
                    Body: body
                }).then(
                    message => {
                        if (message !== 'OK') {
                            console.error(`Failed to send email to ${email}: ${message}`);
                        }
                    }).catch(error => {
                        console.error(`Error sending email to ${email}: ${error}`);
                    });
            });
        }, i / batch * delay);
    }

    alert(`${valMail.length} mails are being sent. Check the console for any errors.`);
}
