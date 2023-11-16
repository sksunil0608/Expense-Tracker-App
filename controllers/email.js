require('dotenv').config();
const Sib = require('sib-api-v3-sdk')
const client = Sib.ApiClient.instance
const apikey = client.authentications['api-key']
apikey.apikey = process.env.SENDIBLUE_API_KEY;
const transEmailApi = new Sib.TransactionalEmailsApi();

const sendEmail = async () => {
    try {
        const client = Sib.ApiClient.instance;
        const apikey = client.authentications['api-key'];
        apikey.apikey = process.env.SENDINBLUE_API_KEY;

        const sender = {
            email: 'sksun@gmail.com' // Corrected email address
        };

        const receivers = [{ email: 'sksun@gmail.com' }];

        const response = await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password reset Link",
            textContent: 'Here is your link'
        });

        console.log(response);
    } catch (error) {
        // console.error('Error:', error.message);
        console.log(error)
    }
};

// Call the async function
sendEmail();
