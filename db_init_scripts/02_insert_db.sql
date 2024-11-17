-- Insert statements for "Users" table
INSERT INTO "Users" ("user_id", "username", "fullname", "email", "profile_img_url", "bio") VALUES
('user_1', 'john_doe', 'John Doe', 'john.doe@example.com', 'https://azureblobstorage.com/john_doe.jpg', 'Software Developer at XYZ Corp.'),
('user_2', 'alice_smith', 'Alice Smith', 'alice.smith@example.com', 'https://azureblobstorage.com/alice_smith.jpg', 'Cloud Architect at ABC Inc.'),
('user_3', 'bob_jones', 'Bob Jones', 'bob.jones@example.com', 'https://azureblobstorage.com/bob_jones.jpg', 'DevOps Engineer at DEF Ltd.'),
('user_4', 'carol_white', 'Carol White', 'carol.white@example.com', 'https://azureblobstorage.com/carol_white.jpg', 'Data Scientist at GHI Co.'),
('user_5', 'david_lee', 'David Lee', 'david.lee@example.com', 'https://azureblobstorage.com/david_lee.jpg', 'Full Stack Developer at JKL LLC.');

-- Insert statements for "Connections" table
INSERT INTO "Connections" ("user_id", "name", "cloud_provider", "status", "details") VALUES
('user_1', 'AWS Connection', 'AWS', 'active', '{"region": "us-west-1"}'),
('user_2', 'Azure Connection', 'Azure', 'active', '{"region": "east-us"}'),
('user_3', 'GCP Connection', 'GCP', 'inactive', '{"region": "europe-west1"}'),
('user_4', 'AWS Connection', 'AWS', 'active', '{"region": "us-east-1"}'),
('user_5', 'Azure Connection', 'Azure', 'inactive', '{"region": "west-europe"}');

-- Insert statements for "Projects" table
INSERT INTO "Projects" ("user_id", "name", "description", "visibility", "estimated_cost", "availability", "durability", "cloud_provider", "like_count", "blob_url") VALUES
('user_1', 'Microservices Architecture', 'A project to implement a microservices architecture.', 'public', 5000.00, 99.99, 95.00, 'AWS', 100, 'https://azureblobstorage.com/microservices.jpg'),
('user_2', 'Serverless Architecture', 'A project to implement a serverless architecture.', 'private', 3000.00, 99.95, 90.00, 'Azure', 80, 'https://azureblobstorage.com/serverless.jpg'),
('user_3', '3-Tier Architecture', 'A project to implement a 3-tier architecture.', 'public', 7000.00, 99.90, 85.00, 'GCP', 120, 'https://azureblobstorage.com/3tier.jpg'),
('user_4', 'Dockerized Application', 'A project to containerize an application using Docker.', 'private', 4000.00, 99.85, 80.00, 'AWS', 90, 'https://azureblobstorage.com/docker.jpg'),
('user_5', 'Kubernetes Deployment', 'A project to deploy an application on Kubernetes.', 'public', 6000.00, 99.80, 75.00, 'Azure', 110, 'https://azureblobstorage.com/kubernetes.jpg');

-- Insert statements for "Tags" table
INSERT INTO "Tags" ("name") VALUES
('Microservices'),
('Serverless'),
('3-Tier'),
('Docker'),
('Kubernetes');

-- Insert statements for "Projects_tags" table
INSERT INTO "Projects_tags" ("project_id", "tag_id") VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);