DROP TABLE IF EXISTS Item       CASCADE;
DROP TABLE IF EXISTS Map        CASCADE;
DROP TABLE IF EXISTS Player     CASCADE;
DROP TABLE IF EXISTS PlayerLoot CASCADE;
DROP TABLE IF EXISTS Tile       CASCADE;
DROP TABLE IF EXISTS Shop       CASCADE;
DROP TABLE IF EXISTS ShopStock  CASCADE;

DROP TYPE  IF EXISTS ItemClass  CASCADE;

CREATE TYPE ItemClass AS ENUM ('Weapon');

CREATE TABLE Item (
  id serial         ,
  name  varchar(30) ,
  value integer     ,
  class ItemClass   ,
  stat  integer     ,
  PRIMARY KEY (id)
);

CREATE TABLE Map (
  id serial,
  width integer,
  height integer,
  name varchar(50),
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE Player (
  id serial,
  x integer DEFAULT 0,
  y integer DEFAULT 0,
  "mapId" integer REFERENCES Map(id),
  name varchar(20),
  "lastActive" timestamp,
  "sessionId" varchar(32),
  health integer  DEFAULT 10,
  wealth integer  DEFAULT 0,
  stealth integer DEFAULT 0, -- like threat?
  shelf integer   DEFAULT 1 REFERENCES Item(id),
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE PlayerLoot (
  id serial,
  "playerId" integer REFERENCES Player(id),
  "itemId"   integer REFERENCES Item(id),
  count integer DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE ("playerId", "itemId")
);

CREATE TABLE Tile (
  id serial,
  x integer,
  y integer,
  "mapId" integer REFERENCES Map(id),
  PRIMARY KEY (id),
  UNIQUE (x,y, "mapId")
);

CREATE TABLE Shop (
  name varchar(20),
  PRIMARY KEY (id),
  UNIQUE (x,y, "mapId") -- key contraint not inherited from tile
) INHERITS (Tile);

CREATE TABLE Portal (
  dest_map integer REFERENCES Map(id),
  dest_x integer,
  dest_y integer,
  PRIMARY KEY (id),
  UNIQUE (x,y, "mapId") -- key contraint not inherited from tile
) INHERITS (Tile);

CREATE TABLE ShopStock (
  id serial,
  "shopId" integer REFERENCES Shop(id),
  "itemId" integer REFERENCES Item(id),
  count integer DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE ("shopId", "itemId")
);

INSERT INTO Item (name, value, class, stat) VALUES('Spoon', 5, 'Weapon', 0);
INSERT INTO Item (name, value, class, stat) VALUES('Fork',  6, 'Weapon', 1);
INSERT INTO Item (name, value, class, stat) VALUES('Knife', 7, 'Weapon', 2);

INSERT INTO Map (width, height, name) VALUES(64, 64, 'New Swedenheim');
INSERT INTO Map (width, height, name) VALUES(16, 16, 'Lolville');


-- 3 players (alpha beta & gamma), different locations, same stats
INSERT INTO Player (x, y, "mapId", name, health, wealth, stealth, shelf)
             VALUES(5, 5, 1, 'Alpha', 10, 9000, 0, 1);
INSERT INTO Player (x, y, "mapId", name, health, wealth, stealth, shelf)
             VALUES(6, 6, 1, 'Beta', 10, 9000, 0, 2);
INSERT INTO Player (x, y, "mapId", name, health, wealth, stealth, shelf)
             VALUES(7, 7, 1, 'Gamma', 10, 9000, 0, 3);

-- Alpha has a spoon, beta a fork, gamma a knife. One each
INSERT INTO PlayerLoot ("playerId", "itemId", count) VALUES (1,1,1);
INSERT INTO PlayerLoot ("playerId", "itemId", count) VALUES (2,2,1);
INSERT INTO PlayerLoot ("playerId", "itemId", count) VALUES (3,3,1);


INSERT INTO Shop (x, y, "mapId", name) VALUES (4,   4, 1, 'Spoon Shop');
INSERT INTO Shop (x, y, "mapId", name) VALUES (5,  10, 1, 'Fork Shop');
INSERT INTO Shop (x, y, "mapId", name) VALUES (10, 10, 1, 'Knife Shop');

INSERT INTO Shop (x, y, "mapId", name) VALUES (1, 1, 2, 'Knife Shop');

INSERT INTO Portal (x,y, "mapId", dest_map, dest_x, dest_y) VALUES (12,1,1, 2,1,12);

-- X shops now sell X
INSERT INTO ShopStock ("shopId", "itemId", count) VALUES (1,1,5);
INSERT INTO ShopStock ("shopId", "itemId", count) VALUES (2,2,5);
INSERT INTO ShopStock ("shopId", "itemId", count) VALUES (3,3,5);
