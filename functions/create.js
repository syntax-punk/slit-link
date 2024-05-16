const { collection, addDoc, serverTimestamp } = require("firebase/firestore");
const { generateUrl } = require("./utils/randomize.js");
const { db } = require("./utils/firebase.js");
const validUrl = require('valid-url');

const DB_NAME = process.env.DB_NAME;

exports.handler = async function(event, ctx) {
  let body;  
  const reqBody = JSON.parse(event.body)
  const link = reqBody.link;
  const { hash, url } = generateUrl();
  
  try {
    if (!link) {
      return {
        statusCode: 302,
        headers: {
          'Location': 'https://urlzipr.com'
       }
      }
    } else {
      if (!validUrl.isUri(link)) {
        throw new Error("URL is not valid!!!");
      }
    }

    await addDoc(collection(db, DB_NAME), {
      link,
      hash,
      created: serverTimestamp()
    });

    const body = {
      response: 'Ok',
      link: url
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    body = 'Opps';

    return {
      statusCode: 501,
      body
    }
  }
};