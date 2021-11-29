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
    logo: "https://flexjr-assets.s3.ap-southeast-1.amazonaws.com/flex-logo-dark.png",
  },
});

exports.subscription_status = (event, context) => {
  const requestBody = JSON.parse(event.body);
  const status = requestBody.status;

  if (status == "success") {
    const email = {
      body: {
        name: requestBody.name,
        intro: "Thank you for upgrading!",
        action: {
          instructions: "To manage your company’s subscriptions and invoices, you can click on the button below.",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Manage Subscriptions",
            link: "https://app.flexjr.one/flex/organization/subscriptions/manage",
          },
        },
        outro: "Need help, or have questions? Just reply to this email, we’re happy to answer your questions!",
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

    mailgun.messages().send(mailOptions, function(error, body) {
      console.log(body);
    });
  } else if (status == "failed") {
    const email = {
      body: {
        name: requestBody.name,
        intro: "We were not able to charge your Flex Visa card for the subscription, so you’ve not been charged. You can try again later, and if the issue still persists, you can contact us.",
        action: {
          instructions: "To manage your company’s subscriptions, you can click on the button below.",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Manage Subscriptions",
            link: "https://app.flexjr.one/flex/organization/subscriptions/manage",
          },
        },
        outro: "Need help, or have questions? Just reply to this email, we’re happy to answer your questions!",
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

    mailgun.messages().send(mailOptions, function(error, body) {
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


// exports.subscription_request = (event, context) => {
//   const requestBody = JSON.parse(event.body);
//   const status = requestBody.status;

//   const email = {
//     body: {
//       name: requestBody.name,
//       intro: "Your employee has requested for an upgrade!",
//       action: {
//         instructions: "To manage your company’s subscriptions and invoices, you can click on the button below.",
//         button: {
//           color: "#22BC66", // Optional action button color
//           text: "Manage Subscriptions",
//           link: "https://app.flexjr.one/flex/organization/subscriptions/manage",
//         },
//       },
//       outro: "Need help, or have questions? Just reply to this email, we’re happy to answer your questions!",
//     },
//   };

//   // Generate an HTML email with the provided contents
//   var emailBody = mailGenerator.generate(email);

//   // Generate the plaintext version of the e-mail (for clients that do not support HTML)
//   var emailText = mailGenerator.generatePlaintext(email);

//   // Send
//   var mailOptions = {
//     from: "Flex <hello@flexjr.one>",
//     to: requestBody.email,
//     subject: "Your Flex subscription has been upgraded!",
//     text: emailText,
//     html: emailBody,
//   };

//   mailgun.messages().send(mailOptions, function(error, body) {
//     console.log(body);
//   });

//   console.info(
//     `${requestBody.email} sent email for task flexjr.subscription_status`
//   );

//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       `{"status": 200, "message": "Email has been sent out for flexjr.subscription_status"}`
//     ),
//   };

//   // Optionally, preview the generated HTML e-mail by writing it to a local file
//   // require("fs").writeFileSync("preview.html", emailBody, "utf8");
// };