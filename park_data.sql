DROP DATABASE IF EXISTS delos_DB;
CREATE DATABASE delos_DB;
USE delos_DB;

CREATE table narratives (
	id INT NOT NULL AUTO_INCREMENT,
	narrative_name VARCHAR(100),
	park_name VARCHAR(30),
	active_slots INT DEFAULT 0,
	price FLOAT(65,2),
	available_slots INT,
	PRIMARY KEY (id)
);

CREATE table destinations (
	park_id INT NOT NULL AUTO_INCREMENT,
	park_name VARCHAR(30) NOT NULL,
	overhead_costs DECIMAL(65,2) NOT NULL,
    PRIMARY KEY (park_id)
);

CREATE table hosts_data (
	host_id INT NOT NULL AUTO_INCREMENT,
	host_name VARCHAR(30),
	host_location VARCHAR(30),
	host_value DECIMAL(65,2),
	data_copies INT,
	PRIMARY KEY(host_id)
);

INSERT INTO narratives (narrative_name, park_name, price, available_slots)
VALUES
("Bounty Hunt", "WestWorld", 1300, 8),
("Treasure Hunt", "WestWorld", 850, 12),
("Akane No Mai", "ShogunWorld", 2500, 10),
("Sakura", "ShogunWorld", 3000, 5),
("Excavation", "The Raj", 2500, 6),
("Ivory Trade", "The Raj", 3000, 5),
("Song of Fire and Ice", "MedievalWorld", 6000, 3),
("The Odyssey", "RomanWorld", 1650, 10),
("BladeRunner", "FutureWorld", 5000, 3);

INSERT INTO narratives (narrative_name, park_name, active_slots, price, available_slots)
VALUES
("The Maze", "RESTRICTED", 1, 0, 0);

INSERT INTO destinations (park_name,overhead_costs)
VALUES
("WestWorld", 175240),
("ShogunWorld", 500000),
("The Raj", 150000),
("MedievalWorld", 400000),
("RomanWorld", 375000),
("FutureWorld", 672000),
("RESTRICTED", 999999);

SELECT destinations.park_id AS 'park_id', destinations.park_name AS 'park_name', destinations.overhead_costs AS 'park_costs', COALESCE(sum(narratives.active_slots), 0) AS "slot_sales", (COALESCE(sum(narratives.active_slots), 0) - destinations.overhead_costs) AS 'total_profits' FROM destinations LEFT JOIN narratives ON destinations.park_name = narratives.park_name GROUP BY destinations.park_id ORDER BY destinations.park_name;


