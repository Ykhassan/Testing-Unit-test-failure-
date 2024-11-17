import User from './User.js';
import Project from './Project.js';

// Associations
Project.belongsTo(User, { foreignKey: 'owner_id', targetKey: 'user_id' });
User.hasMany(Project, { foreignKey: 'owner_id', sourceKey: 'user_id' });

export {
    User,
    Project
};