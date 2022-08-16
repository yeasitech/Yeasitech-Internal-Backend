import sgMail from "@sendgrid/mail";
import fs from "fs";
import path from "path";
//const fs = require(fs);
const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  "resetPassEmail.html"
);
export const sendEmail = ({ email, host, token, userName }) => {
  //console.log({ email, host, userName });
  let link = "http://" + host + "/contractor-new-password/" + token;
  sgMail.setApiKey(
    "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"
  );
  let html = fs.readFileSync(templatePath, "utf-8");
  html = html.replace("[name]", userName);
  html = html.replace("[link]", link);
  //console.log(html);
  //console.log(`${link}`);
  const msg = {
    to: email, // Change to your recipient
    from: "ramjan@yeasitech.com", // Change to your verified sender
    subject: "Password change request for your mail",
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
