import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: The unique identifier for the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         fullname:
 *           type: string
 *           description: The full name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         profile_img_url:
 *           type: string
 *           description: The URL of the user's profile image
 *         bio:
 *           type: string
 *           description: The biography of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *       required:
 *         - user_id
 *         - username
 *         - fullname
 *         - email
 *       example:
 *         user_id: "12345"
 *         username: "johndoe"
 *         fullname: "John Doe"
 *         email: "johndoe@example.com"
 *         profile_img_url: "http://example.com/profile.jpg"
 *         bio: "Software developer with 10 years of experience."
 *         createdAt: "2023-10-01T12:34:56Z"
 *         updatedAt: "2023-10-01T12:34:56Z"
 */
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.STRING(255),
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_img_url: {
        type: DataTypes.TEXT
    },
    bio: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Users',
    schema: 'public',
    timestamps: true
});

export default User;