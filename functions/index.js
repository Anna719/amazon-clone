const functions = require("firebase-functions");
const express = require("express");
const cors= require("cors");
const stripe=require("stripe")
("sk_test_51ITWYjDwGDe3GjKzaaQ4Z6qyRSkctHe87ULpqKDTKtomtUbcyRV4Vj8IJnMq3bV0MCeX2BCABDDGXiys10eOwQ8D00R8Ieiqfb");

// api

// app config

const app=express();

//  MiddleWares

app.use(cors({origin: true}));
app.use(express.json());


// api routes
app.get("/", (request, response)=>response.status(200).send("hello world"));
app.post('/payments/create', async (request, response) => {
   const total=request.query.total;

   console.log("payment Request Received BOOOM! for this amount >>>", total)

    const paymentIntent=await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
    });
   //OK- Created
   response.status(201).send({
       clientSecret:paymentIntent.client_secret,
   })
});

// api command
exports.api = functions.https.onRequest(app);

// http://localhost:5001/challenge-5383a/us-central1/api
