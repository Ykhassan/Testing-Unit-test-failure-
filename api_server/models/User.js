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
 *         last_login:
 *           type: string
 *           format: date-time
 *           description: The last login date and time of the user
 *         bio:
 *           type: string
 *           description: The biography of the user
 *         is_active:
 *           type: boolean
 *           description: Indicates whether the user is active
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
 *         last_login: "2023-10-01T12:34:56Z"
 *         bio: "Software developer with 10 years of experience."
 *         is_active: true
 */
const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    profile_img_url: {
        type: DataTypes.TEXT,
    },
    last_login: {
        type: DataTypes.DATE,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
    {
        tableName: 'Users',
        schema: 'public',
        timestamps: true,
        updatedAt: false,
        createdAt: "created_at",
    });

export default User;
