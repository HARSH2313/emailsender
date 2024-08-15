const nodemailer = require("nodemailer");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
require("dotenv").config();

// // List of possible sender names
// const senderNames = [
//     'Mark',
//     'hfhfhfd',
//     'fefuhue',
//     'fjfjufd'
// ];
const subjectNames = [];
const senderNames = [];

fs.createReadStream("senders.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Assuming the column header in the CSV is 'sender_name'
    if (row.sender_name) {
      senderNames.push(row.sender_name);
    }
  })
  .on("end", () => {
    if (senderNames.length > 0) {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * senderNames.length);
      // Get a random sender name
      const randomSender = senderNames[randomIndex];
      //   console.log(`Random sender name: ${randomSender}`);
    } else {
      console.log("No sender names found.");
    }
  });

fs.createReadStream("subjects.csv")
  .pipe(csv())
  .on("data", (row) => {
    // Assuming the column header in the CSV is 'sender_name'
    if (row.subject_name) {
      subjectNames.push(row.subject_name);
    }
  })
  .on("end", () => {
    if (subjectNames.length > 0) {
      // Get a random index
      const randomIndex = Math.floor(Math.random() * subjectNames.length);
      // Get a random sender name
      const randomSubject = subjectNames[randomIndex];
      //   console.log(`Random sender name: ${randomSender}`);
    } else {
      console.log("No subject found.");
    }
  });
// // Function to get a random sender name
const getRandomSenderName = () => {
  const randomIndex = Math.floor(Math.random() * senderNames.length);
  return senderNames[randomIndex];
};
// Function to get a random sendersubject
const getRandomSenderSubject = () => {
  const randomIndex = Math.floor(Math.random() * subjectNames.length);
  return subjectNames[randomIndex];
};

// Function to read emails and names from a CSV file
function readEmailsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const recipients = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.receiveremail && row.receivername) {
          // Check if both email and name are present
          recipients.push({
            receiverEmail: row.receiveremail,
            receiverName: row.receiveremail,
          });
        }
      })
      .on("end", () => {
        resolve(recipients);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
// Function to generate a random 11-digit number as a string
function generateRandomFilename() {
  const min = 10000000000; // Minimum 11-digit number
  const max = 99999999999; // Maximum 11-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to get a random element from an array
function getRandomElements(array, count) {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Define a list of emojis
const emojis = [
  '😊', // Smiling Face with Smiling Eyes
  '😂', // Face with Tears of Joy
  '😍', // Heart Eyes
  '😎', // Smiling Face with Sunglasses
  '🤔', // Thinking Face
  '😢', // Crying Face
  '😠', // Angry Face
  '🥳', // Partying Face
  '🤩', // Star-Struck
  '😴', // Sleeping Face
  '🤗', // Hugging Face
  '🥺', // Pleading Face
  '😜', // Face with Stuck-Out Tongue and Winking Eye
  '🤫', // Shushing Face
  '🤯', // Exploding Head
  '😶‍🌫️', // Face in Clouds
  '🧐', // Face with Monocle
  '😈', // Smiling Face with Horns
  '👻', // Ghost
  '💩', // Pile of Poo
  '👑', // Crown
  '🌈', // Rainbow
  '🔥', // Fire
  '🎉', // Party Popper
  '💖', // Sparkling Heart
  '🌟', // Glowing Star
  '🍕', // Pizza
  '🎂', // Birthday Cake
  '🍹', // Tropical Drink
  '🕶️', // Sunglasses
  '🎁', // Gift
  '🚀'  // Rocket
];
// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like 'smtp', 'hotmail', etc.
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to send emails
async function sendBulkEmails(recipients) {
  for (const recipient of recipients) {
    const { receiverEmail, receiverName } = recipient;
     // Generate a unique 11-digit filename
  const randomFilename = `${generateRandomFilename()}.pdf`;
  
  // Path to the original PDF file
  const filePath = path.join(__dirname, 'pafgef.pdf');
// Get 3 random emojis
const randomEmojis = getRandomElements(emojis, 3).join(' ');

  const subject_name = getRandomSenderSubject();
    const sender_name = getRandomSenderName();
    const mailOptions = {
      from: `"${sender_name}" <your-email@gmail.com>`,
      to: receiverEmail,
      subject: `"Payment Confirmation ${randomFilename}"`,
      // text: `${subject_name},\n\nPlease get in touch if you need anything more at all. We are always there to assist you. Thank you for taking swift action on this. We appreciate your cooperation and hope to work with you in the future\n\nCheck your Bill BELOW\n\nBest regards,\n${sender_name}`,
      // html: `<p style="background-color:red;text-align:center">${subject_name}</p><p>Please get in touch if you need anything more at all. We are always there to assist you. Thank you for taking swift action on this. We appreciate your cooperation and hope to work with you in the future</p><p>Check your Bill Below</p><p>Best regards,</p><p>${sender_name}</p>`, // You can use HTML if you prefer
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 20px;
                }
                .container {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container" style = "background-color: rgb(255, 230, 230);padding:10px" >
                <h1 style = "background-color: #ff6666;color:white;padding:10px;border-radius:5px;text-align:center"><span style="font-size:15px">Payment Confirmation ${randomFilename}</span></h1>
                <p>Please get in touch if you need anything more at all. We are always there to assist you. Thank you for taking swift action on this. We appreciate your cooperation and hope to work with you in the future. ${randomEmojis}</p>
                <b>Check your Bill BELOW</b>
                <p>Best Regards,</p>
                <p>${sender_name}</p>
            </div>
        </body>
        </html>
`,attachments:[{path:filePath,filename:randomFilename,contentType:'contentType'
}]
        
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${receiverName} (${receiverEmail})`);
    } catch (error) {
      console.error(
        `Failed to send email to ${receiverName} (${receiverEmail}): ${error.message}`
      );
    }
  }
}

// Main function to read CSV and send emails
async function main() {
  try {
    const recipients = await readEmailsFromCSV("./emails.csv");
    await sendBulkEmails(recipients);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

main();
