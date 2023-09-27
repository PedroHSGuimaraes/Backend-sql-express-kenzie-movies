CREATE TABLE IF NOT EXISTS movies (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(50) NOT NULL,
                    category VARCHAR(20) NOT NULL,
                    duration INTEGER NOT NULL,
                    price NUMERIC NOT NULL
                    
                    );   


