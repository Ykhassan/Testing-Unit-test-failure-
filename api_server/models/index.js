import User from './User.js';
import Project from './Project.js';
import Tag from './Tag.js';
import Connection from './Connection.js';
import Branch from './Branch.js';
import Commit from './Commit.js';
import Collaborator from './Collaborator.js';
import Comment from './Comment.js';
import Reply from './Reply.js';
import Issue from './Issue.js'
import IssueComments from './IssueComments.js';
import ProjectComments from './ProjectComments.js';
import Deployment from './Deployment.js';

// Associations
User.hasMany(Connection);
Connection.belongsTo(User);

User.hasMany(Project, { foreignKey: 'user_id' });
Project.belongsTo(User, { foreignKey: 'user_id' });

Project.belongsToMany(Tag, { through: 'ProjectTags' })
Tag.belongsToMany(Project, { through: 'ProjectTags' })

Project.hasMany(Branch, { foreignKey: 'project_id' })
Branch.belongsTo(Project, { foreignKey: 'project_id' })

User.hasMany(Commit, { foreignKey: 'user_id' })
Commit.belongsTo(User, { foreignKey: 'user_id' })

Branch.hasMany(Commit, { foreignKey: 'branch_id' })
Commit.belongsTo(Branch, { foreignKey: 'branch_id' })

User.hasMany(Collaborator, { foreignKey: 'user_id' })
Collaborator.belongsTo(User, { foreignKey: 'user_id' })

//specifying forign key in many to many might be needed in case of a confliction with sequlize base naming for keys
User.belongsToMany(Branch, { through: 'Collaborator' })
Branch.belongsToMany(User, { through: 'Collaborator' })


User.hasMany(Deployment, { foreignKey: 'user_id' })
Deployment.belongsTo(User, { foreignKey: 'user_id' })

Project.hasMany(Deployment, { foreignKey: 'project_id' })
Deployment.belongsTo(Project, { foreignKey: 'project_id' })

Connection.hasOne(Deployment, { foreignKey: 'connection_id' })

User.hasMany(Comment, { foreignKey: 'user_id' })
Comment.belongsTo(User, { foreignKey: 'user_id' })

User.hasMany(Issue, { foreignKey: 'user_id' })
Issue.belongsTo(User, { foreignKey: 'user_id' })

Project.hasMany(Issue, { foreignKey: 'project_id' })
Issue.belongsTo(Project, { foreignKey: 'project_id' })

// Replys remains
// asosiactions
// Comment id becomes unique
// 1 to many relation between comment_id and it self

Comment.hasOne(Reply, {foreignKey: 'comment_id'})
Reply.belongsTo(Comment, {foreignKey: 'comment_id'})
Comment.hasMany(Reply, {foreignKey: 'parent_comment_id'})
Reply.belongsTo(Comment, {foreignKey: 'parent_comment_id'})

Issue.belongsToMany(Comment, { through: IssueComments, foreignKey: 'issue_id' })
Comment.belongsToMany(Issue, { through: IssueComments, foreignKey: 'comment_id' })

Project.belongsToMany(Comment, { through: ProjectComments, foreignKey: 'project_id' })
Comment.belongsToMany(Project, { through: ProjectComments, foreignKey: 'comment_id' })


export {
    User,
    Connection,
    Project,
    Tag,
    Branch,
    Commit,
    Collaborator,
    Comment,
    Reply,
    ProjectComments,
    Issue,
    IssueComments,
    Deployment
};