import fs from "node:fs/promises";

import bodyParser from "body-parser";
import express from "express";
import nodemailer from 'nodemailer';
// import ('dotenv').config();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/meals", async (req, res) => {
  const meals = await fs.readFile("./data/available-meals.json", "utf8");
  res.json(JSON.parse(meals));
});






app.post("/orders", async (req, res) => {
  const orderData = req.body.order;
  console.log("getting orders")
  // Validate order data
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: "Missing data: No items in order." });
  }

  if (
    !orderData.customer ||
    !orderData.customer.email ||
    !orderData.customer.email.includes("@") ||
    !orderData.customer.name ||
    orderData.customer.name.trim() === "" ||
    !orderData.customer.street ||
    orderData.customer.street.trim() === "" ||
    !orderData.customer["postal-code"] ||
    orderData.customer["postal-code"].trim() === "" ||
    !orderData.customer.city ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code, or city is missing.",
    });
  }

  try {
    // Create new order
    const newOrder = {
      ...orderData,
      id: (Math.random() * 1000).toFixed(0),
    };
 console.log(newOrder)

    const transporter = nodemailer.createTransport({
      service:"gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "badaoluwatobi12@gmail.com",
        pass: "enter your pass code",
      },
    });

    await transporter.sendMail({
      from: `"Your Store" <${process.env.EMAIL_USER}>`, // Sender address
      to: "badaoluwatobi12@gmail.com", // Admin email address
      subject: "New Order Received",
      text: `A new order has been placed by ${orderData.customer.name}. Order details:\n\n${JSON.stringify(
        newOrder,
        null,
        2
      )}`,
      html: `
        <h3>New Order Received</h3>
        <p><strong>Customer Name:</strong> ${orderData.customer.name}</p>
        <p><strong>Email:</strong> ${orderData.customer.email}</p>
        <p><strong>Address:</strong> ${orderData.customer.street}, ${orderData.customer.city}, ${orderData.customer["postal-code"]}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${orderData.items
            .map(
              (item) =>
                `<li>
          <p><strong>Product Name:</strong> ${item.name}</p>
          <p><strong>Price:</strong> $${item.price}</p>
          <p><strong>Description:</strong> ${item.description}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
        </li>`
            )
            .join("")}
        </ul>
        <p><strong>Order ID:</strong> ${newOrder.id}</p>
      `,
    });

    res.status(201).json({ message: "Order created and email sent to admin!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);


