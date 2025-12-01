/* eslint-disable prettier/prettier */
import { Schema } from "@nestjs/mongoose"
import { Prop, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true, index: true})
    name: string

    @Prop({ trim: true, default: "" })
    description?: string

    @Prop({ required: true, type: Number, min: 0 })
    price: number

    @Prop({ unique: true, index: true, sparse: true, trim: true })
    sku?: string

    @Prop({ type: [Types.ObjectId], ref: "Category", default: [], index: true, required: true })
    categories: Types.ObjectId[]

    @Prop({ default: true })
    isActive: boolean

    @Prop({ default: true })
    inStock: boolean

    @Prop({ type: Number, default: 0, min: 0 })
    quantity: number

    @Prop({ type: [String], default: [] })
    images: string[]

    @Prop({ type: Map, of: String, default: {}, index: true})
    attributes: Record<string, string>

    @Prop({ type: Object, default: {} })
    metadata?: Record<string, any>

    @Prop({unique: true, index: true})
    uniqueKey: string

    @Prop({type: Types.ObjectId, ref: 'User', required: true})
    createdBy: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: 'User', required: false})
    updatedBy?: Types.ObjectId
}

export type ProductDocument = Product & Document
export const ProductSchema = SchemaFactory.createForClass(Product)

