import User from './User.js';
import Project from './Project.js';
import Tag from './Tag.js';
import Connection from './Connection.js';

// Associations
User.hasMany(Connection);
Connection.belongsTo(User);

User.hasMany(Project, { foreignKey: 'user_id'});
Project.belongsTo(User, { foreignKey: 'user_id'});

Project.belongsToMany(Tag, {through: 'ProjectTags'})
Tag.belongsToMany(Project, {through: 'ProjectTags'})

export {
    User,
    Connection,
    Project,
    Tag
};