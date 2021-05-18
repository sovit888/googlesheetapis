const express = require("express");
const { google } = require("googleapis");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const auth = new google.auth.GoogleAuth({
  keyFile: "", //put the credentails files here
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

app.get("/", (req, res) => {
  return res.render("index");
});

app.get("/data", async (req, res) => {
  try {
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "let from google sheet";
    // Get metadata about spreadsheet
    const metaData = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
    });
    return res.send(metaData);
  } catch (error) {
    console.log(error);
    return res.send("an error occured");
  }
});

app.post("/", async (req, res) => {
  const { name, age } = req.body;
  try {
    // Create client instance for auth
    const client = await auth.getClient();

    // Instance of Google Sheets API
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = "let from google sheet";
    //appedn data to the gogole sheet
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:B",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[name, age]],
      },
    });

    res.send("added new user to the google sheets");
  } catch (error) {
    console.log(error);
    return res.send("error");
  }
});

app.listen(2000);
