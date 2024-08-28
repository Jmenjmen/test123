import mongoose from "mongoose";

const mongoUrl = 'mongodb+srv://artem:sosok@cluster0.b9n8g.mongodb.net/';

export function MongoDBConnect() {
    mongoose.connect(mongoUrl)
    .then(() => {
        console.log('MongoDB started')
    })
}