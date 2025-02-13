import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description:{
        required: true,
        type: String
    },
    name:{
        type: String,
        required: true
    },
    productImage:{
        type: String,
        required: true
    },
    stock:{
        default: 0,
        type: Number
    },
    price:{
        default: 0,
        type: Number
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps: true})

export const Product = mongoose.model("Product", productSchema)