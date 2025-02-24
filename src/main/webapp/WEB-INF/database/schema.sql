CREATE TABLE users (
                       username VARCHAR(20) PRIMARY KEY,
                       password VARCHAR(255) NOT NULL,
                       is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                       reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       mod_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_info (
                           username VARCHAR(20) PRIMARY KEY,
                           name VARCHAR(20) NOT NULL,
                           phone VARCHAR(20) NOT NULL UNIQUE,
                           email VARCHAR(255) NOT NULL UNIQUE,
                           delete_time TIMESTAMP,
                           address VARCHAR(255) NOT NULL,
                           address_detail VARCHAR(255),
                           department VARCHAR(50),
                           institution_name VARCHAR(50),
                           mod_date TIMESTAMP NOT NULL DEFAULT  CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE role (
                      code TINYINT PRIMARY KEY,
                      role_name VARCHAR(50) NOT NULL
);

CREATE TABLE user_role (
                           username VARCHAR(20) PRIMARY KEY,
                           role_code TINYINT,
                           FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
                           FOREIGN KEY (role_code) REFERENCES role(code) ON DELETE SET NULL
);

CREATE TABLE consultation (
                              code INT PRIMARY KEY AUTO_INCREMENT,
                              username VARCHAR(20),
                              pid VARCHAR(64) NOT NULL,
                              consultation_note VARCHAR(4000) NOT NULL,
                              reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              mod_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              FOREIGN KEY (username) REFERENCES users(username) ON DELETE SET NULL
);

CREATE TABLE medical_records (
                                 code INT PRIMARY KEY AUTO_INCREMENT,
                                 username VARCHAR(20),
                                 pid VARCHAR(64) NOT NULL,
                                 patient_symptoms VARCHAR(255),
                                 order_desc VARCHAR(255),
                                 medical_date TIMESTAMP NOT NULL,
                                 reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 mod_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 FOREIGN KEY (username) REFERENCES users(username) ON DELETE SET NULL
);

CREATE TABLE view (
                      code INT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(20),
                      studykey INT NOT NULL,
                      reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (username) REFERENCES users(username) ON DELETE SET NULL
);

-- 소견/판독 결과
CREATE TABLE finding (
                         code INT PRIMARY KEY AUTO_INCREMENT,
                         is_normal BOOLEAN  NOT NULL DEFAULT TRUE,
                         lesion_location VARCHAR(255),
                         lesion_size VARCHAR(255),
                         lesion_count INT NOT NULL DEFAULT 0,
                         morphology VARCHAR(255),
                         additional_findings VARCHAR(4000),
                         possible_diagnosis VARCHAR(255),
                         clinical_significance VARCHAR(255),
                         recommended_studies BOOLEAN NOT NULL DEFAULT FALSE,
                         comparison_studies VARCHAR(255),
                         additional_comment VARCHAR(4000),
                         additional_notes VARCHAR(4000),
                         radiologist_name VARCHAR(50) NOT NULL,
                         institution_name VARCHAR(50) NOT NULL,
                         urgency_level TINYINT NOT NULL DEFAULT 1,
                         report_status TINYINT NOT NULL DEFAULT 1,
                         reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         mod_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE interpretation (
                                code INT PRIMARY KEY AUTO_INCREMENT,
                                username VARCHAR(20),
                                studykey INT NOT NULL,
                                finding_code INT,
                                reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                mod_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                FOREIGN KEY (username) REFERENCES users(username) ON DELETE SET NULL,
                                FOREIGN KEY (finding_code) REFERENCES finding(code) ON DELETE SET NULL
);

CREATE TABLE logs (
                      code INT PRIMARY KEY AUTO_INCREMENT,
                      username VARCHAR(20),
                      studykey INT DEFAULT NULL,
                      activity_type ENUM('LOGIN', 'LOGOUT', 'VIEW_VIDEO', 'VIEW_RECORD') NOT NULL,
                      reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (username) REFERENCES users (username) ON DELETE SET NULL
);