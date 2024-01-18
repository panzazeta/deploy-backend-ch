import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { userModel } from "./users.models.js";

const ticketSchema = new Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        ref: 'user'
    },
    message: {
        type: String
    }
});

ticketSchema.pre('save', async function(next) {
    this.code = uuidv4();
    try {
        const user = await userModel.findById(this.user_id);;
        if (user && user.email) {
            this.purchaser = user.email;
        }
    } catch (error) {
        return next(error);
    }
    next();
});

export const ticketModel = model('ticket', ticketSchema);