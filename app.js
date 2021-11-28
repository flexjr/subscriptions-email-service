require("dotenv").config();
var Mailgen = require("mailgen");
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
var mailgun = require("mailgun-js")({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    // Appears in header & footer of e-mails
    name: "Flex Jr",
    link: "https://www.flexjr.one/",
    logo: "https://cdn.sanity.io/images/z14ymswx/production/81cb9a0c756bd38c942eec58a1b8276601c23d67-316x151.svg?h=120&auto=format&dpr=2",
  },
});

exports.subscription_status = (event, context) => {
  const requestBody = JSON.parse(event.body);
  const status = requestBody.status;

  if (status == "success") {
    const email = {
        body: {
          name: "JJ Goi",
          intro:
            "Thank you for upgrading!",
          action: {
            instructions:
              "To manage your company’s subscriptions, you can click on the button below.",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Manage Subscriptions",
              link: "https://app.flexjr.one/flex/organization/subscriptions/manage",
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we’re happy to answer your questions!",
        },
      };
    
      // Generate an HTML email with the provided contents
      var emailBody = mailGenerator.generate(email);
    
      // Generate the plaintext version of the e-mail (for clients that do not support HTML)
      var emailText = mailGenerator.generatePlaintext(email);
    
      // Send
      var mailOptions = {
        from: "Flex <hello@flexjr.one>",
        to: requestBody.email,
        subject: "Your Flex subscription has been upgraded!",
        text: emailText,
        html: emailBody,
      };

      mailgun.messages().send(mailOptions, function (error, body) {
        console.log(body);
      });
  } else if (status == "failed") {
    const email = {
        body: {
          name: "JJ Goi",
          intro:
            "Your payment for a Flex subscription plan has failed, so you’ve not been charged.",
          action: {
            instructions:
              "To manage your company’s subscriptions, you can click on the button below.",
            button: {
              color: "#22BC66", // Optional action button color
              text: "Manage Subscriptions",
              link: "https://app.flexjr.one/flex/organization/subscriptions/manage",
            },
          },
          outro:
            "Need help, or have questions? Just reply to this email, we’re happy to answer your questions!",
        },
      };
    
      // Generate an HTML email with the provided contents
      var emailBody = mailGenerator.generate(email);
    
      // Generate the plaintext version of the e-mail (for clients that do not support HTML)
      var emailText = mailGenerator.generatePlaintext(email);
    
      // Send
      var mailOptions = {
        from: "Flex <hello@flexjr.one>",
        to: requestBody.email,
        subject: "You’ve not been charged for your Flex subscription",
        text: emailText,
        html: emailBody,
      };

      mailgun.messages().send(mailOptions, function (error, body) {
        console.log(body);
      });
  }

  console.info(
    `${requestBody.email} sent email for task flexjr.subscription_status`
  );

  return {
    statusCode: 200,
    body: JSON.stringify(
      `{"status": 200, "message": "Email has been sent out for flexjr.subscription_status"}`
    ),
  };

  // Optionally, preview the generated HTML e-mail by writing it to a local file
  // require("fs").writeFileSync("preview.html", emailBody, "utf8");
};