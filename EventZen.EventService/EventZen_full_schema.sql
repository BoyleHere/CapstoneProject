
DROP DATABASE IF EXISTS EventZen;
CREATE DATABASE EventZen;
USE EventZen;

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','CUSTOMER') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1
);

-- =====================
-- VENUES
-- =====================
CREATE TABLE venues (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(200) NOT NULL,
    capacity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description VARCHAR(2000),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status INT DEFAULT 1
);

-- =====================
-- EVENTS
-- =====================
CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    venue_id BIGINT NOT NULL,
    event_date DATETIME,
    max_attendees_per_user INT,
    budget DECIMAL(12,2),
    cost_per_ticket DECIMAL(10,2),
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1,

    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- =====================
-- BOOKINGS
-- =====================
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    attendee_count INT DEFAULT 1,

    booking_status ENUM(
        'PENDING',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

-- =====================
-- ATTENDEES
-- =====================
CREATE TABLE attendees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1,

    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- =====================
-- VENDORS
-- =====================
CREATE TABLE vendors (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    service_type VARCHAR(100),
    contact_email VARCHAR(150),
    phone VARCHAR(20),
    price DECIMAL(10,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1
);

-- =====================
-- EVENT VENDORS
-- =====================
CREATE TABLE event_vendors (
    event_id BIGINT,
    vendor_id BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1,

    PRIMARY KEY (event_id, vendor_id),

    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- =====================
-- PAYMENTS
-- =====================
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CARD','UPI','NETBANKING','CASH'),
    payment_status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    transaction_reference VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    status TINYINT DEFAULT 1,

    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- =====================
-- AUDIT TABLE
-- =====================
CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100),
    record_id BIGINT,
    operation_type VARCHAR(10),
    old_data JSON,
    new_data JSON,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by BIGINT
);

DELIMITER $$

-- =====================
-- AUTO UPDATED_AT TRIGGERS
-- =====================

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER venues_set_updated_at BEFORE UPDATE ON venues
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER events_set_updated_at BEFORE UPDATE ON events
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER bookings_set_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER attendees_set_updated_at BEFORE UPDATE ON attendees
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER vendors_set_updated_at BEFORE UPDATE ON vendors
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER event_vendors_set_updated_at BEFORE UPDATE ON event_vendors
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

CREATE TRIGGER payments_set_updated_at BEFORE UPDATE ON payments
FOR EACH ROW BEGIN
SET NEW.updated_at = CURRENT_TIMESTAMP;
END$$

-- =====================
-- AUDIT TRIGGERS
-- =====================

CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'users',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'email',NEW.email,
'role',NEW.role,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'users',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'name',OLD.name,
'email',OLD.email,
'role',OLD.role,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'email',NEW.email,
'role',NEW.role,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER venues_audit_insert
AFTER INSERT ON venues
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'venues',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'location',NEW.location,
'capacity',NEW.capacity,
'price',NEW.price,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER venues_audit_update
AFTER UPDATE ON venues
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'venues',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'name',OLD.name,
'location',OLD.location,
'capacity',OLD.capacity,
'price',OLD.price,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'location',NEW.location,
'capacity',NEW.capacity,
'price',NEW.price,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER events_audit_insert
AFTER INSERT ON events
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'events',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'venue_id',NEW.venue_id,
'event_date',NEW.event_date,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER events_audit_update
AFTER UPDATE ON events
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'events',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'name',OLD.name,
'venue_id',OLD.venue_id,
'event_date',OLD.event_date,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'venue_id',NEW.venue_id,
'event_date',NEW.event_date,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER bookings_audit_insert
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'bookings',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'user_id',NEW.user_id,
'event_id',NEW.event_id,
'attendee_count',NEW.attendee_count,
'booking_status',NEW.booking_status
),
NEW.created_by
);
END$$

CREATE TRIGGER bookings_audit_update
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'bookings',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'attendee_count',OLD.attendee_count,
'booking_status',OLD.booking_status
),
JSON_OBJECT(
'id',NEW.id,
'attendee_count',NEW.attendee_count,
'booking_status',NEW.booking_status
),
NEW.updated_by
);
END$$

CREATE TRIGGER attendees_audit_insert
AFTER INSERT ON attendees
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'attendees',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'booking_id',NEW.booking_id,
'name',NEW.name,
'email',NEW.email,
'phone',NEW.phone,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER attendees_audit_update
AFTER UPDATE ON attendees
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'attendees',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'booking_id',OLD.booking_id,
'name',OLD.name,
'email',OLD.email,
'phone',OLD.phone,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'booking_id',NEW.booking_id,
'name',NEW.name,
'email',NEW.email,
'phone',NEW.phone,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER vendors_audit_insert
AFTER INSERT ON vendors
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'vendors',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'service_type',NEW.service_type,
'contact_email',NEW.contact_email,
'phone',NEW.phone,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER vendors_audit_update
AFTER UPDATE ON vendors
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'vendors',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'name',OLD.name,
'service_type',OLD.service_type,
'contact_email',OLD.contact_email,
'phone',OLD.phone,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'name',NEW.name,
'service_type',NEW.service_type,
'contact_email',NEW.contact_email,
'phone',NEW.phone,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER event_vendors_audit_insert
AFTER INSERT ON event_vendors
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'event_vendors',
NEW.event_id,
'INSERT',
NULL,
JSON_OBJECT(
'event_id',NEW.event_id,
'vendor_id',NEW.vendor_id,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER event_vendors_audit_update
AFTER UPDATE ON event_vendors
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'event_vendors',
NEW.event_id,
'UPDATE',
JSON_OBJECT(
'event_id',OLD.event_id,
'vendor_id',OLD.vendor_id,
'status',OLD.status
),
JSON_OBJECT(
'event_id',NEW.event_id,
'vendor_id',NEW.vendor_id,
'status',NEW.status
),
NEW.updated_by
);
END$$

CREATE TRIGGER payments_audit_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'payments',
NEW.id,
'INSERT',
NULL,
JSON_OBJECT(
'id',NEW.id,
'booking_id',NEW.booking_id,
'amount',NEW.amount,
'payment_method',NEW.payment_method,
'payment_status',NEW.payment_status,
'transaction_reference',NEW.transaction_reference,
'status',NEW.status
),
NEW.created_by
);
END$$

CREATE TRIGGER payments_audit_update
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
INSERT INTO audit_logs(table_name,record_id,operation_type,old_data,new_data,changed_by)
VALUES(
'payments',
NEW.id,
'UPDATE',
JSON_OBJECT(
'id',OLD.id,
'booking_id',OLD.booking_id,
'amount',OLD.amount,
'payment_method',OLD.payment_method,
'payment_status',OLD.payment_status,
'transaction_reference',OLD.transaction_reference,
'status',OLD.status
),
JSON_OBJECT(
'id',NEW.id,
'booking_id',NEW.booking_id,
'amount',NEW.amount,
'payment_method',NEW.payment_method,
'payment_status',NEW.payment_status,
'transaction_reference',NEW.transaction_reference,
'status',NEW.status
),
NEW.updated_by
);
END$$

-- =====================
-- VENUE CONFLICT CHECK
-- =====================

CREATE TRIGGER prevent_venue_conflict
BEFORE INSERT ON events
FOR EACH ROW
BEGIN
IF EXISTS (
SELECT 1 FROM events
WHERE venue_id = NEW.venue_id
AND event_date = NEW.event_date
AND status = 1
) THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Venue already booked for this time';
END IF;
END$$

-- =====================
-- VENUE CAPACITY LOGIC
-- =====================

CREATE TRIGGER enforce_capacity
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN

DECLARE total_attendees INT;
DECLARE venue_capacity INT;

SELECT IFNULL(SUM(attendee_count),0)
INTO total_attendees
FROM bookings
WHERE event_id = NEW.event_id
AND booking_status = 'APPROVED';

SELECT v.capacity
INTO venue_capacity
FROM venues v
JOIN events e ON e.venue_id = v.id
WHERE e.id = NEW.event_id;

IF total_attendees + NEW.attendee_count > venue_capacity THEN
SET NEW.booking_status = 'PENDING';
END IF;

END$$

DELIMITER ;
