import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const URL = 'mongodb+srv://abhishek:Ramaswamy1@cluster0.6kv3z.mongodb.net/Cluster0?retryWrites=true&w=majority';
const PORT = 3000;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
  app.listen(PORT, () => { console.log(`Server is running on PORT: ${PORT}`); });
}).catch((error) => {
  console.log('Error:', error.message)
})

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res) => {
  const { email, password } = req.body
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successfull", user: user })
      } else {
        res.send({ message: "Password didn't match" })
      }
    } else {
      res.send({ message: "User not registered" })
    }
  })
})

app.post("/register", (req, res) => {
  const { name, email, password } = req.body
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" })
    } else {
      const user = new User({
        name,
        email,
        password
      })
      user.save(err => {
        if (err) {
          res.send(err)
        } else {
          res.send({ message: "Successfully Registered, Please login now." })
        }
      })
    }
  })

})

app.listen(9002, () => {
  console.log("BE started at port 9002")
})
