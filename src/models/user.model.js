import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = new Schema(
    {

        personal_info: {
            fullname: {
                type: String,
                lowercase: true,
                required: true,
                minlength: [3, 'fullname must be 3 letters long'],
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                unique: true
            },
            password: {
                type: String,
                required: [false, 'Password is required']
            },
            username: {
                type: String,
                minlength: [3, 'Username must be 3 letters long'],
                unique: true,
            },
            bio: {
                type: String,
                maxlength: [200, 'Bio should not be more than 200'],
                default: "",
            },
            profile_img: {
                type: String,
                default: () => {
                    return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`
                }
            },
            refreshToken: {
                type: String
            }
        },
        social_links: {
            youtube: {
                type: String,
                default: "",
            },
            instagram: {
                type: String,
                default: "",
            },
            facebook: {
                type: String,
                default: "",
            },
            twitter: {
                type: String,
                default: "",
            },
            github: {
                type: String,
                default: "",
            },
            website: {
                type: String,
                default: "",
            }
        },
        account_info: {
            total_posts: {
                type: Number,
                default: 0
            },
            total_reads: {
                type: Number,
                default: 0
            },
        },
        google_auth: {
            type: Boolean,
            default: false
        },
        blogs: {
            type: [Schema.Types.ObjectId],
            ref: 'blogs',
            default: [],
        }

    },
    {
        timestamps: {
            createdAt: 'joinedAt',
            updatedAt: 'modifiedAt'

        }

    }
)


userSchema.pre('save', async function (next) {
    if (!this.isModified("personal_info.password")) return next();
    this.personal_info.password = await bcrypt.hash(this.personal_info.password, 16);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.personal_info.password);
}


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



userSchema.plugin(mongooseAggregatePaginate)
export const User = mongoose.model("User", userSchema)