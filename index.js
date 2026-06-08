const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const productRoute = require("./routes/productRoute")
const Auth = require("./routes/Auth")
const mongoose = require('mongoose');
const ExcelJS = require('exceljs');
const Product = require('./models/Product')
const Action = require('./models/Action')
const Visitor = require('./models/Visitors')
const UserRoute = require('./routes/UserRoute')
const OrdersRoute = require('./routes/OrdersRoute')
const InvoiceRoute = require("./routes/InvoiceRoute")
const categoryRoute = require("./routes/categoryRoute")
const slugRoute = require("./routes/slugRoute")
const path = require('path');
const visitor = require("./routes/visitorAndActions")
const settingRoute = require("./routes/settingRoute")
const { ErrorHandler } = require("./routes/verifyToken");
const CollectionRoute = require("./routes/collection")
const messageRoute = require("./routes/messageRoute")
const postsAndComments = require("./routes/postsAndComments")

require('dotenv').config();
main().catch(err => console.log(err));

async function main() {
  try {
    // await mongoose.connect('mongodb://localhost:27017/mosasha');
    await mongoose.connect(process.env.DB);

    setInterval(async () => {
      const visitors = await Visitor.find({ isActive: true })
      const actions = await Action.find()
      let now = Date.now();
      visitors.forEach(async (visitor) => {

        if (actions.filter((a) => (a.visitor == visitor._id)).some((a) => (now - new Date(a.createdAt).getTime() > 60000))) { // If no heartbeat received for more than 10 seconds
          await visitors.findByIdAndUpdate(visitor._id, { online: false })
        }
      })
    }, 60000);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)

    })

  }
  catch (err) {
    console.log(err)
  }

}
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use(express.static(path.resolve('./images')));

app.use(cors({
  origin: '*', // مؤقتاً اكتب '*' عشان يسمح لأي فرونت إند يكلمه، ولما ترفع الفرونت إند حط الرابط بتاعه هنا
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


app.use(ErrorHandler);
app.use('/collection', CollectionRoute)
app.use("/products", productRoute)
app.use("/auth", Auth)
app.use("/user", UserRoute)
app.use("/order", OrdersRoute)
app.use("/invoice", InvoiceRoute)
app.use("/category", categoryRoute)
app.use("/slug", slugRoute)
app.use("/visitor", visitor)
app.use("/setting", settingRoute)
app.use("/message", messageRoute)
app.use("/social", postsAndComments)

module.exports = app;


