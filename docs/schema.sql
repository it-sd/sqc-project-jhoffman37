Drop table if exists shelters;
Drop table if exists pets;

CREATE TABLE shelters (
    shelter_id INT PRIMARY KEY,
    total_pets int DEFAULT NULL,
    pet_id int DEFAULT NULL,
    address VARCHAR(25) DEFAULT NULL,
    city VARCHAR(25) DEFAULT NULL,
    state VARCHAR(2) DEFAULT NULL,
    zip VARCHAR(5) DEFAULT NULL,
);


CREATE TABLE pets (
    petID PRIMARY KEY,
    name VARCHAR(25) DEFAULT NULL,
    gender varchar(6) DEFAULT NULL,
    age INT DEFAULT NULL,
    sizeLbs INT DEFAULT NULL,
    breed varchar(25) DEFAULT NULL,
    species varchar(25) DEFAULT NULL,
);

INSERT INTO shelters (address) VALUES
('1519 Something Ave');

-- Insert values into devices table for Device
INSERT INTO pets (name) VALUES
('Marlin'),
('Bebe');