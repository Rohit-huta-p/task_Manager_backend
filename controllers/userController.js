// import Models 
const userModel = require('../models/userModel')

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // if any field empty
  if (!name && !email && !password) {
    return res.status(400).json({ message: "Email or password is missing!" });
  }

  try {
    const user = await userModel.findOne({ email });

    //if user exsits
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    // else create new user
    else {
      // hash password
      const hashedPassword = await userModel.encyptPassword(password);
      // save the user
      const newUser = await new userModel({
        name,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      // response
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Registration error ${error}` });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  
  // find user
  const user = await userModel.findOne({ email });

  try {
    if (user) {
        // check password
        const isPassChecked = await userModel.comparePass(password, user.password);
    
        if (isPassChecked) {
          // set Token
          const token = userModel.generateToken(user);
          // SUCCESS - user logged in
          return res.status(200).json({ token, message: "You are logged In" });

        }
        // password not match
         else {
          return res.status(401).json({ error: "Password does not match" });
        }
      } 
      // user not found
      else {
        // user not found
        return res.status(404).json({ error: "Email Not Found!" });
      }
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({error: `Internal server error ${error}`})
  }
};

const fetch_user_details = async (req, res) => {
    try {
        // userID
        const {userId} = req.user;
        // find user
        const user = await userModel.findById(userId);

        if(user){
            return res.status(200).json({user})
        }else{
            return res.status(404).json({error: "User not found"})
        }
    } catch (error) {
        return res.status(500).json({error: `Internal server error ${error}`})
    }
}





module.exports = {signup, login, fetch_user_details};