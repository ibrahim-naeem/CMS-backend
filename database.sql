CREATE DATABASE cms;


-->--  DOWNLOAD EXTENSION FOR UUID
-->--  https://www.postgresql.org/docs/current/uuid-ossp.html 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY not NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_role VARCHAR REFERENCES roles(role)
);

CREATE TABLE roles(
   role_id SERIAL ,
   role VARCHAR primary KEY
);

select * from roles;

Insert into roles (user_role) values ('Admin');
Insert into roles (user_role) values ('Manager');
Insert into roles (user_role) values ('Employee');



SELECT * FROM users;

INSERT INTO users (user_name, user_email, user_password) VALUES ('test', 'test@test.com','test');

--                user_id                | username |   useremail   | userpassword
-- --------------------------------------+----------+---------------+--------------
--  e207db1c-8ada-4f76-bde3-672970a59943 | test     | test@test.com | test

CREATE TABLE user_details(
    user_id uuid PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,

    user_status VARCHAR(255) NOT NULL, 
    date_of_birth DATE NOT NULL, 
    joining_data DATE NOT NULL, 
    confirmation_date DATE NOT NULL, 

    gender VARCHAR(255) NOT NULL, 
    martial VARCHAR(255) NOT NULL, 
    
    shift_type VARCHAR(255) NOT NULL, 
    education VARCHAR(255) NOT NULL, 
    family VARCHAR(255) NOT NULL, 
    emplymeents VARCHAR(255) NOT NULL, 
    awards VARCHAR(255) NOT NULL
);

INSERT INTO user_details (user_id, user_name, user_email, user_status, date_of_birth, joining_data, confirmation_date, gender,
 martial, shift_type, education, family, emplymeents, awards) 
 VALUES ( '8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', 'visionx', 'visionx@test.com', 'single', '2022-08-31', '2022-08-16', '2022-08-31', 'male', 'single', 'morning', 'bscs', 'family', 'employment', 'awards' );

-- Software development & Ambassador cars
-- user_id , 
-- user_status, 
-- date_of_birth, 
-- gender, martial, 
-- joining_data, 
-- confirmation_date, 
-- shift_type, 
-- education, 
-- family, 
-- emplymeents, 
-- awards


-- Manager
CREATE TABLE managers (
    manager_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    title      VARCHAR(255) NOT NULL,
    employees  VARCHAR(255)[] NOT NULL
);
INSERT INTO managers (first_name, last_name, title, employees) VALUES ('Ahsan', 'Akram', 'Manager', ARRAY['8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', '0c2c467b-2843-42b7-a176-2fb8fc8b8c57', '1a6cf235-5a5a-467d-95cb-e25cde9bb4b0']);

-- Director
CREATE TABLE director (
    director_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name  VARCHAR(255) NOT NULL,
    title      VARCHAR(255) NOT NULL,
    managers  VARCHAR(255)[] NOT NULL
);
INSERT INTO director (first_name, last_name, title, managers) VALUES ('Rafhay', 'Ali', 'Director', ARRAY['37603797-17c0-4f08-b10a-65295bd3dcde ','8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', '0c2c467b-2843-42b7-a176-2fb8fc8b8c57']);

-- Skills
CREATE TABLE skills (
    skill_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    skill_name VARCHAR(255) NOT NULL,
    employees  VARCHAR(255)[] NOT NULL
);
INSERT INTO skills (skill_name, employees) VALUES ('DevOps', ARRAY['8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', '0c2c467b-2843-42b7-a176-2fb8fc8b8c57', '1a6cf235-5a5a-467d-95cb-e25cde9bb4b0']);

-- Projects
CREATE TABLE projects (
    project_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    project_name VARCHAR(255) NOT NULL,
    director_id  VARCHAR(255) NOT NULL,
    manager_id   VARCHAR(255) NOT NULL,
    employees_id VARCHAR(255)[] NOT NULL
);
INSERT INTO projects (project_name, director_id, manager_id, employees_id) VALUES ('Test', 'f32cd8f8-ab4a-4837-9d02-d599da4a62c5 ', '79a29339-5045-4307-adf9-907eda547d2e ', ARRAY['8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', '0c2c467b-2843-42b7-a176-2fb8fc8b8c57']);

-- Leaves
CREATE TABLE leave(
    leave_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    date DATE NOT NULL,
    employees_id_status VARCHAR(255)[][] NOT NULL
);
INSERT INTO leave (date, employees_id_status) VALUES ('2022-09-01',  '{{"8ebdc51e-3ac8-494a-b5ea-49edc3c53a51", "present"},{"0c2c467b-2843-42b7-a176-2fb8fc8b8c57", "absent"}}');

-- Trainings
CREATE TABLE trainings (
    training_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    training_name VARCHAR(255) NOT NULL,
    employees  VARCHAR(255)[] NOT NULL
);
INSERT INTO trainings (training_name, employees) VALUES ('Quality Assurance', ARRAY['8ebdc51e-3ac8-494a-b5ea-49edc3c53a51', '0c2c467b-2843-42b7-a176-2fb8fc8b8c57', 'd894b06d-8e39-4bd2-a86f-bb5262770fd6']);

-- SELECT array_position(employees, '8ebdc51e-3ac8-494a-b5ea-49edc3c53a51') FROM trainings WHERE '8ebdc51e-3ac8-494a-b5ea-49edc3c53a51' = ANY (employees);

--  SELECT training_name  FROM trainings WHERE 'f059446b-b633-4cb7-8ccd-ffe2b2f540f8 ' = ANY (employees);
-- SELECT training_name  FROM trainings WHERE 'f059446b-b633-4cb7-8ccd-ffe2b2f540f8' = ANY (employees);

-- //Template for POSTMAN
-- // {
-- //     "id": "f1cc19f1-8196-472f-a6cc-1e6e46f05808",
-- //     "status": "intern7",
-- //     "date_of_birth": "1997-08-22",
-- //     "joining_data": "2022-08-16",
-- //     "confirmation_date": "2022-08-31",
-- //     "gender": "maleI7",
-- //     "martial": "singleI7",
-- //     "shift_type": "morningI7",
-- //     "education": "bscsI",
-- //     "family": "family",
-- //     "emplymeents": "employment",
-- //     "awards": "awards"
-- // }



CREATE TABLE images ( 
    image_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_id  VARCHAR(255) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    image_type VARCHAR(255) NOT NULL
);

CREATE TABLE files ( 
    file_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_id  VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(255) NOT NULL
);