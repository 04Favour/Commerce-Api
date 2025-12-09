/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({timestamps: true})
export class Cart {
    @Prop({type: Types.ObjectId, ref: 'User', unique: true})
    user: Types.ObjectId;

    // @Prop([{
    //     productId: {types: Types.ObjectId, ref:'Product'},
    //     quantity: {type: Number, default: 1, min: 1}
    // }])
    // items: {
    //     productId: Types.ObjectId,
    //     quantity: number
    // }[]
}
export type CartDocument = HydratedDocument<Cart>
export const CartSchema = SchemaFactory.createForClass(Cart)