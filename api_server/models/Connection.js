import { sequelize } from "../configs/postgresDB.js";
import { DataTypes } from "sequelize";

// CREATE TABLE "Connections" (
//     "connection_id" serial PRIMARY KEY,
//     "user_id" varchar(255),
//     "name" varchar NOT NULL,
//     "cloud_provider" varchar NOT NULL,
//     "status" varchar,
//     "details" JSONB,
//     "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id")
//   );
const Connection = sequelize.define('Connection', {
    connection_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cloud_provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    details: {
        type: DataTypes.JSONB
    }
}, {
    tableName: 'Connections',
    schema: 'public',
    timestamps: true
});

export default Connection;