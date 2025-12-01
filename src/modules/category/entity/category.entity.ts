/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>

@Schema({timestamps: true})
export class Category {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({required: false})
    description?: string;

    @Prop({unique: true})
    slug: string;
}
export const categorySchema = SchemaFactory.createForClass(Category);