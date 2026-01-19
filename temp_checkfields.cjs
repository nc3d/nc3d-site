require('dotenv').config();
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function checkFields() {
    try {
        const records = await base(process.env.AIRTABLE_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
        if (records.length === 0) {
            console.log("No records found. Please add one dummy row to your Airtable so I can read the fields.");
        } else {
            console.log("\n--- YOUR AIRTABLE FIELDS ---");
            const fields = records[0].fields;
            Object.keys(fields).forEach(key => {
                console.log(`Field Name: "${key}" \t| Example: ${fields[key]}`);
            });
            console.log("----------------------------\n");
        }
    } catch (err) {
        console.error("Error connecting:", err);
    }
}

checkFields();