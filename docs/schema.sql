Drop table if exists shelters;
Drop table if exists pets;

CREATE TABLE shelters (
    shelterID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    totalPets int DEFAULT NULL,
    petID int DEFAULT NULL,
    Address VARCHAR(25) DEFAULT NULL,
    City VARCHAR(25) DEFAULT NULL,
    State VARCHAR(2) DEFAULT NULL,
    Zip VARCHAR(5) DEFAULT NULL,
    PRIMARY KEY (shelterID)
)  AUTO_INCREMENT=1;


CREATE TABLE pets (
    petID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) DEFAULT NULL,
    gender varchar(6) DEFAULT NULL,
    age INT DEFAULT NULL,
    sizeLbs INT DEFAULT NULL,
    breed varchar(25) DEFAULT NULL,
    species varchar(25) DEFAULT NULL,
    PRIMARY KEY (DeviceID)
)  AUTO_INCREMENT=1;

INSERT INTO shelters (Address) VALUES
('1519 Something Ave');

-- Insert values into devices table for Device
INSERT INTO pets (name) VALUES
('Marlin'),
('Bebe');