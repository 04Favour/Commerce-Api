/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { Role } from "../enum/role.enum";
import { Logger } from "@nestjs/common";
import mongoose from "mongoose";

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

@Schema({timestamps:true})
export class User {
    @Prop({required: true})
    fullName: string;

    @Prop({required: true, unique: true})
    email: string

    @Prop({required: true})
    password: string

    @Prop({enum: Role, default: Role.USER})
    role: Role

    @Prop({required:false})
    address?: string

    @Prop({required: false})
    phone?: string
}

export type UserDocument = mongoose.HydratedDocument<User, UserMethods>

export const UserSchema = SchemaFactory.createForClass(User)

// This hashes the password before saving to the database
UserSchema.pre('save', async function (next) {
  // 'this' refers to the document being saved (the User instance)

  // 1. Only hash if the password field has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // 2. Generate a salt and hash the password
    const saltRounds = 10; // The cost factor
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);

    // 3. Overwrite the plaintext password with the hash
    this.password = hashedPassword;
    next();
  } catch (error) {
    // 4. Pass any errors to the Mongoose error handler
    next(error);
    Logger.log(error)
  }
});

// This compares the enteredPassword with the password in the database
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};
