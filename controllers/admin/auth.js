const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "Mynameismohammedrizwan";
const signup = async (req, res, next) => {
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({
            message: "Please enter all details"
        })
    }

    let user = await User.findOne({ email })
    if (user) {
        res.status(400).json({
            message: "Admin has been already registered"
        })
    } else {
        hash_password = bcrypt.hashSync(password, 10);
        const _user = User({
            firstName, lastName, userName: Math.random().toString(), email, hash_password, role: 'admin'
        })

        const createdUser = await _user.save()
        console.log(createdUser);
        res.status(200).json({
            message: "Admin created successfully"
        })
    }
}

const signin = async (req, res, next) => {
    var { email, password } = req.body;
    console.log(req.body.email);
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400).json({
            message: "Admin is not found"
        })
    }
    console.log(user);

    const isCorrect = await bcrypt.compare(password, user.hash_password)
    if (!isCorrect) {
        res.status(400).json({
            message: "Credentials are wrong"
        })
    }

    const data = {
        id: user._id
    }

    var { _id, firstName, lastName, email, role, fullName } = user;

    const jwtToken = jwt.sign(data, SECRET_KEY, { expiresIn: '1h' })
    res.status(200).json({
        jwtToken,
        _id, firstName, lastName, email, role, fullName
    })

}

const requireSignin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user;
    next();
    //jwt.decode()
}

module.exports = { signin, signup, requireSignin }