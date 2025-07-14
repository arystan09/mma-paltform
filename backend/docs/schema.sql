-- 1. Весовые категории
CREATE TABLE weight_classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  min_weight FLOAT NOT NULL,
  max_weight FLOAT NOT NULL
);

-- 2. Бойцы
CREATE TABLE fighters (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  nickname VARCHAR(100),
  birth_date DATE,
  height FLOAT,
  weight FLOAT,
  team VARCHAR(100),
  country VARCHAR(100),
  reach_cm FLOAT,
  stance VARCHAR(50),
  weight_class_id INT REFERENCES weight_classes(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 3. События
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 4. Enum для метода боя
CREATE TYPE fight_method AS ENUM ('KO', 'SUBMISSION', 'DECISION', 'DRAW');

-- 5. Бои
CREATE TABLE fights (
  id SERIAL PRIMARY KEY,
  event_id INT REFERENCES events(id),
  red_corner_id INT REFERENCES fighters(id),
  blue_corner_id INT REFERENCES fighters(id),
  winner_id INT REFERENCES fighters(id),
  weight_class_id INT REFERENCES weight_classes(id),
  method fight_method,
  round INT,
  duration VARCHAR(10),
  is_finished BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. Рейтинги
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  fighter_id INT REFERENCES fighters(id),
  weight_class_id INT REFERENCES weight_classes(id),
  points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  rank_position INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
