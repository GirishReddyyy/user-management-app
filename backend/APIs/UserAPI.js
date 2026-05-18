//create min-exoress app
import exp from 'express';
import { UserModel } from '../models/UserModel.js'
export const UserApp = exp.Router();

//user api routers

//create user
UserApp.post('/users', async (req, res) => {
    //get new user
    const newUser = req.body
    //create user document
    const newUserDocument = new UserModel(newUser)
    //save new user
    let user = await newUserDocument.save()
    //send res
    res.status(201).json({ message: "User created", payload: user })
})
//read all users
UserApp.get('/users', async (req, res) => {
    //read all users
    let usersList = await UserModel.find({ status: true })
    //send res
    res.status(200).json({ message: "users", payload: usersList })
})
//read a user by id
UserApp.get('/users/:id', async (req, res) => {
    //get user id from url
    let uid = req.params.id
    //find users by id
    let user = await UserModel.findOne({ _id: uid, status: true })
    //check user
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    //send res
    res.status(200).json({ message: "user found", payload: user })
})
//delete a user by id
UserApp.delete('/users/:id', async (req, res) => {
    //get user id from url
    let uid = req.params.id
    //find user and chnage status to false
    let user = await UserModel.findByIdAndUpdate(uid, { $set: { status: false } })
    //check user
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    //send res
    res.status(200).json({ message: "User removed" })
})

//Activate user(change status to true)  PUT(complete change) & PATCH(Partial changes)
UserApp.patch('/users/:id', async (req, res) => {
    //get user id from url
    let uid = req.params.id
    //find user and chnage status to false
    let user = await UserModel.findByIdAndUpdate(uid, { $set: { status: true } },{new:true})
    //check user
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    //send res
    res.status(200).json({ message: "User Activate", payload: user })
})
