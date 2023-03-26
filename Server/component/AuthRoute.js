import { Router } from 'express';
import User from './User.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const router = Router();

router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(406).json({ message: 'User already exists' })
        return
    }
    //hasing
    const saltRounds = 10;
    const key = await bcrypt.genSaltSync(saltRounds)
    const hashedPassword = await bcrypt.hashSync(password, key)
    console.log(hashedPassword);


    const user = await User({ email, password: hashedPassword, firstName, lastName });
    await user.save();
    res.status(201).json({ "message": 'user is created' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const userExists = await User.findOne({ email })
    if (!userExists) {
        res.status(406).json({ message: 'User not exists' })
        return;
    }

    const matched = await bcrypt.compare(password, userExists.password);
    if (!matched) {
        res.status(406).json({ message: 'User not found' });
        return;
    }

    // tommorow jwt connection
    const payload = {
        username: email,
        _id: userExists._id,
    }
    const token = jwt.sign({ payload }, 'some secret');
    res.json({ message: 'sucessfully logged in.', token })
});
export default router;