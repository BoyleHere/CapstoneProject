-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: eventzen
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendees`
--

DROP TABLE IF EXISTS `attendees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendees` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `attendees_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendees`
--

LOCK TABLES `attendees` WRITE;
/*!40000 ALTER TABLE `attendees` DISABLE KEYS */;
INSERT INTO `attendees` VALUES (1,1,'Prashast','admin@eventzen.com','7894561232','2026-03-18 12:04:38','2026-03-18 12:04:38',1,1,1),(2,2,'Prashast','admin2@eventzen.com','7894561232','2026-03-18 12:22:03','2026-03-18 12:22:03',1,1,1),(3,3,'Yashu','yashu@gmail.com','7894561235','2026-03-19 14:40:36','2026-03-19 14:40:36',2,2,1),(4,4,'Yashu','yashu@gmail.com','7894561235','2026-03-19 14:40:56','2026-03-19 14:40:56',2,2,1),(5,5,'Yashu','yashu@gmail.com','7894561235','2026-03-19 14:46:07','2026-03-19 14:46:07',2,2,1),(7,7,'Yashu','yashu@gmail.com','7894561233','2026-03-19 15:12:59','2026-03-19 15:12:59',2,2,1),(8,7,'Prash','prashu@gmail.com','7894561233','2026-03-19 15:12:59','2026-03-19 15:12:59',2,2,1),(9,6,'string','user@example.com','string','2026-03-19 15:13:59','2026-03-19 15:13:59',2,2,1),(13,8,'Arnav','arnav11@gmail.com','7894561235','2026-03-19 19:16:52','2026-03-19 19:16:52',3,3,1),(14,8,'Prashast','prashast1509@gmail.com','9658585862','2026-03-19 19:16:52','2026-03-19 19:16:52',3,3,1),(16,10,'arnav','arnav@gg.io','7894561235','2026-03-19 19:24:02','2026-03-19 19:24:02',3,3,1),(17,9,'Arnav Aradhya','arnav@gmail.com','7894561235','2026-03-19 19:24:37','2026-03-19 19:24:37',3,3,1),(18,9,'Prashast','prashast@gmail.com','9876543215','2026-03-19 19:24:37','2026-03-19 19:24:37',3,3,1),(19,11,'Arnav','arnav@gmail.com','789456123','2026-03-19 20:49:50','2026-03-19 20:49:50',3,3,1),(20,12,'Arnav','arnavnew@gmail.com','7485961415','2026-03-19 20:50:33','2026-03-19 20:50:33',3,3,1),(33,13,'Daksh Shukla','daksh@deloitte.com','7894561235','2026-03-19 22:05:39','2026-03-19 22:05:39',4,4,1),(34,13,'Prashast Saxena','pboy@gmail.com','897561235','2026-03-19 22:05:39','2026-03-19 22:05:39',4,4,1),(35,13,'Arnav Aradhya','aaboy@gmail.com','876511246','2026-03-19 22:05:39','2026-03-19 22:05:39',4,4,1),(36,14,'daksh','dboy@gg.io','7894561235','2026-03-19 22:15:52','2026-03-19 22:15:52',4,4,1),(37,15,'Rahul','rahul@deloitte.com','7894561235','2026-03-20 09:08:17','2026-03-20 09:08:17',5,5,1),(38,15,'Hasib','hasib@cloudthat.com','7894561235','2026-03-20 09:08:17','2026-03-20 09:08:17',5,5,1),(39,16,'rahul','rahul@deloitte.com','789456258','2026-03-20 09:09:19','2026-03-20 09:09:19',5,5,1),(40,17,'rahul','rahul@gg.io','788941561','2026-03-20 09:09:56','2026-03-20 09:09:56',5,5,1),(41,18,'Prashast','saxena@gmail.com','789456258','2026-03-20 09:10:18','2026-03-20 09:10:18',5,5,1);
/*!40000 ALTER TABLE `attendees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) DEFAULT NULL,
  `record_id` bigint(20) DEFAULT NULL,
  `operation_type` varchar(10) DEFAULT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_data`)),
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_data`)),
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `changed_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'users',1,'INSERT',NULL,'{\"id\": 1, \"name\": \"Prashast\", \"email\": \"admin@eventzen.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-17 16:21:42',NULL),(2,'users',1,'UPDATE','{\"id\": 1, \"name\": \"Prashast\", \"email\": \"admin@eventzen.com\", \"role\": \"CUSTOMER\", \"status\": 1}','{\"id\": 1, \"name\": \"Prashast\", \"email\": \"admin@eventzen.com\", \"role\": \"ADMIN\", \"status\": 1}','2026-03-17 16:23:09',NULL),(3,'venues',1,'INSERT',NULL,'{\"id\": 1, \"name\": \"Good Place\", \"location\": \"Delhi\", \"capacity\": 1, \"price\": 250.00, \"status\": 1}','2026-03-17 20:06:28',1),(4,'events',2,'INSERT',NULL,'{\"id\": 2, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-23 18:30:00\", \"status\": 1}','2026-03-18 06:47:55',1),(5,'events',3,'INSERT',NULL,'{\"id\": 3, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-24 18:30:00\", \"status\": 1}','2026-03-18 06:50:36',1),(6,'vendors',1,'INSERT',NULL,'{\"id\": 1, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"Foodie@food.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-18 06:52:18',1),(7,'vendors',1,'UPDATE','{\"id\": 1, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"Foodie@food.com\", \"phone\": \"7894561235\", \"status\": 1}','{\"id\": 1, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"foodie123@food.com\", \"phone\": \"7894561232\", \"status\": 1}','2026-03-18 06:53:20',1),(8,'vendors',1,'UPDATE','{\"id\": 1, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"foodie123@food.com\", \"phone\": \"7894561232\", \"status\": 1}','{\"id\": 1, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"foodie123@food.com\", \"phone\": \"7894561232\", \"status\": 0}','2026-03-18 06:54:55',1),(9,'vendors',2,'INSERT',NULL,'{\"id\": 2, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"Foodie@food.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-18 06:55:10',1),(10,'events',4,'INSERT',NULL,'{\"id\": 4, \"name\": \"Ugadi\", \"venue_id\": 1, \"event_date\": \"2026-03-11 18:30:00\", \"status\": 1}','2026-03-18 07:32:34',1),(11,'venues',1,'UPDATE','{\"id\": 1, \"name\": \"Good Place\", \"location\": \"Delhi\", \"capacity\": 1, \"price\": 250.00, \"status\": 1}','{\"id\": 1, \"name\": \"Good Place\", \"location\": \"Delhi\", \"capacity\": 50, \"price\": 250.00, \"status\": 1}','2026-03-18 11:19:45',1),(12,'bookings',1,'INSERT',NULL,'{\"id\": 1, \"user_id\": 1, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-18 12:04:38',1),(13,'attendees',1,'INSERT',NULL,'{\"id\": 1, \"booking_id\": 1, \"name\": \"Prashast\", \"email\": \"admin@eventzen.com\", \"phone\": \"7894561232\", \"status\": 1}','2026-03-18 12:04:38',1),(14,'bookings',2,'INSERT',NULL,'{\"id\": 2, \"user_id\": 1, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-18 12:22:03',1),(15,'attendees',2,'INSERT',NULL,'{\"id\": 2, \"booking_id\": 2, \"name\": \"Prashast\", \"email\": \"admin2@eventzen.com\", \"phone\": \"7894561232\", \"status\": 1}','2026-03-18 12:22:03',1),(16,'users',2,'INSERT',NULL,'{\"id\": 2, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-19 14:18:43',NULL),(17,'bookings',3,'INSERT',NULL,'{\"id\": 3, \"user_id\": 2, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-19 14:40:36',2),(18,'attendees',3,'INSERT',NULL,'{\"id\": 3, \"booking_id\": 3, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 14:40:37',2),(19,'payments',1,'INSERT',NULL,'{\"id\": 1, \"booking_id\": 3, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-3\", \"status\": 1}','2026-03-19 14:40:37',2),(20,'bookings',4,'INSERT',NULL,'{\"id\": 4, \"user_id\": 2, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-19 14:40:56',2),(21,'attendees',4,'INSERT',NULL,'{\"id\": 4, \"booking_id\": 4, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 14:40:56',2),(22,'payments',2,'INSERT',NULL,'{\"id\": 2, \"booking_id\": 4, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-4\", \"status\": 1}','2026-03-19 14:40:56',2),(23,'bookings',5,'INSERT',NULL,'{\"id\": 5, \"user_id\": 2, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 14:46:07',2),(24,'attendees',5,'INSERT',NULL,'{\"id\": 5, \"booking_id\": 5, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 14:46:07',2),(25,'payments',3,'INSERT',NULL,'{\"id\": 3, \"booking_id\": 5, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-5\", \"status\": 1}','2026-03-19 14:46:07',2),(26,'events',4,'UPDATE','{\"id\": 4, \"name\": \"Ugadi\", \"venue_id\": 1, \"event_date\": \"2026-03-11 18:30:00\", \"status\": 1}','{\"id\": 4, \"name\": \"Ugadi\", \"venue_id\": 1, \"event_date\": \"2026-03-25 18:30:00\", \"status\": 1}','2026-03-19 14:52:24',1),(27,'bookings',6,'INSERT',NULL,'{\"id\": 6, \"user_id\": 2, \"event_id\": 4, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 14:52:47',2),(28,'attendees',6,'INSERT',NULL,'{\"id\": 6, \"booking_id\": 6, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"phone\": \"7894561233\", \"status\": 1}','2026-03-19 14:52:47',2),(29,'payments',4,'INSERT',NULL,'{\"id\": 4, \"booking_id\": 6, \"amount\": 50.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-6\", \"status\": 1}','2026-03-19 14:52:47',2),(30,'bookings',7,'INSERT',NULL,'{\"id\": 7, \"user_id\": 2, \"event_id\": 3, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','2026-03-19 15:12:59',2),(31,'attendees',7,'INSERT',NULL,'{\"id\": 7, \"booking_id\": 7, \"name\": \"Yashu\", \"email\": \"yashu@gmail.com\", \"phone\": \"7894561233\", \"status\": 1}','2026-03-19 15:12:59',2),(32,'attendees',8,'INSERT',NULL,'{\"id\": 8, \"booking_id\": 7, \"name\": \"Prash\", \"email\": \"prashu@gmail.com\", \"phone\": \"7894561233\", \"status\": 1}','2026-03-19 15:12:59',2),(33,'payments',5,'INSERT',NULL,'{\"id\": 5, \"booking_id\": 7, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-7\", \"status\": 1}','2026-03-19 15:12:59',2),(34,'attendees',9,'INSERT',NULL,'{\"id\": 9, \"booking_id\": 6, \"name\": \"string\", \"email\": \"user@example.com\", \"phone\": \"string\", \"status\": 1}','2026-03-19 15:13:59',2),(35,'users',3,'INSERT',NULL,'{\"id\": 3, \"name\": \"Arnav\", \"email\": \"arnav11@gmail.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-19 19:07:38',NULL),(36,'bookings',8,'INSERT',NULL,'{\"id\": 8, \"user_id\": 3, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 19:13:19',3),(37,'attendees',10,'INSERT',NULL,'{\"id\": 10, \"booking_id\": 8, \"name\": \"Arnav\", \"email\": \"arnav11@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:13:19',3),(38,'payments',6,'INSERT',NULL,'{\"id\": 6, \"booking_id\": 8, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-8\", \"status\": 1}','2026-03-19 19:13:19',3),(39,'attendees',11,'INSERT',NULL,'{\"id\": 11, \"booking_id\": 8, \"name\": \"Arnav\", \"email\": \"arnav11@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:16:11',3),(40,'attendees',12,'INSERT',NULL,'{\"id\": 12, \"booking_id\": 8, \"name\": \"Prashast\", \"email\": \"prashast1509@gmail.com\", \"phone\": \"9658585862\", \"status\": 1}','2026-03-19 19:16:11',3),(41,'bookings',8,'UPDATE','{\"id\": 8, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 8, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','2026-03-19 19:16:11',3),(42,'attendees',13,'INSERT',NULL,'{\"id\": 13, \"booking_id\": 8, \"name\": \"Arnav\", \"email\": \"arnav11@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:16:52',3),(43,'attendees',14,'INSERT',NULL,'{\"id\": 14, \"booking_id\": 8, \"name\": \"Prashast\", \"email\": \"prashast1509@gmail.com\", \"phone\": \"9658585862\", \"status\": 1}','2026-03-19 19:16:52',3),(44,'bookings',8,'UPDATE','{\"id\": 8, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','{\"id\": 8, \"attendee_count\": 2, \"booking_status\": \"CANCELLED\"}','2026-03-19 19:16:52',3),(45,'events',5,'INSERT',NULL,'{\"id\": 5, \"name\": \"Arnav Wedding\", \"venue_id\": 1, \"event_date\": \"2026-03-30 18:30:00\", \"status\": 1}','2026-03-19 19:22:07',1),(46,'bookings',9,'INSERT',NULL,'{\"id\": 9, \"user_id\": 3, \"event_id\": 5, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 19:23:42',3),(47,'attendees',15,'INSERT',NULL,'{\"id\": 15, \"booking_id\": 9, \"name\": \"Arnav Aradhya\", \"email\": \"arnav@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:23:42',3),(48,'payments',7,'INSERT',NULL,'{\"id\": 7, \"booking_id\": 9, \"amount\": 1000.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-9\", \"status\": 1}','2026-03-19 19:23:42',3),(49,'bookings',10,'INSERT',NULL,'{\"id\": 10, \"user_id\": 3, \"event_id\": 5, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 19:24:02',3),(50,'attendees',16,'INSERT',NULL,'{\"id\": 16, \"booking_id\": 10, \"name\": \"arnav\", \"email\": \"arnav@gg.io\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:24:02',3),(51,'payments',8,'INSERT',NULL,'{\"id\": 8, \"booking_id\": 10, \"amount\": 1000.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-10\", \"status\": 1}','2026-03-19 19:24:02',3),(52,'attendees',17,'INSERT',NULL,'{\"id\": 17, \"booking_id\": 9, \"name\": \"Arnav Aradhya\", \"email\": \"arnav@gmail.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 19:24:37',3),(53,'attendees',18,'INSERT',NULL,'{\"id\": 18, \"booking_id\": 9, \"name\": \"Prashast\", \"email\": \"prashast@gmail.com\", \"phone\": \"9876543215\", \"status\": 1}','2026-03-19 19:24:37',3),(54,'bookings',9,'UPDATE','{\"id\": 9, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 9, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','2026-03-19 19:24:37',3),(55,'bookings',10,'UPDATE','{\"id\": 10, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 10, \"attendee_count\": 1, \"booking_status\": \"CANCELLED\"}','2026-03-19 19:25:04',3),(56,'bookings',5,'UPDATE','{\"id\": 5, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 5, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-19 19:25:51',1),(57,'bookings',9,'UPDATE','{\"id\": 9, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','{\"id\": 9, \"attendee_count\": 2, \"booking_status\": \"APPROVED\"}','2026-03-19 19:26:55',1),(58,'bookings',7,'UPDATE','{\"id\": 7, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','{\"id\": 7, \"attendee_count\": 2, \"booking_status\": \"REJECTED\"}','2026-03-19 19:27:02',1),(59,'events',2,'UPDATE','{\"id\": 2, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-23 18:30:00\", \"status\": 1}','{\"id\": 2, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-23 18:30:00\", \"status\": 1}','2026-03-19 20:18:16',1),(60,'users',3,'UPDATE','{\"id\": 3, \"name\": \"Arnav\", \"email\": \"arnav11@gmail.com\", \"role\": \"CUSTOMER\", \"status\": 1}','{\"id\": 3, \"name\": \"Arnav Aradhya\", \"email\": \"arnav11@gmail.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-19 20:43:11',NULL),(61,'bookings',11,'INSERT',NULL,'{\"id\": 11, \"user_id\": 3, \"event_id\": 4, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 20:49:50',3),(62,'attendees',19,'INSERT',NULL,'{\"id\": 19, \"booking_id\": 11, \"name\": \"Arnav\", \"email\": \"arnav@gmail.com\", \"phone\": \"789456123\", \"status\": 1}','2026-03-19 20:49:50',3),(63,'payments',9,'INSERT',NULL,'{\"id\": 9, \"booking_id\": 11, \"amount\": 50.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-11\", \"status\": 1}','2026-03-19 20:49:50',3),(64,'bookings',12,'INSERT',NULL,'{\"id\": 12, \"user_id\": 3, \"event_id\": 3, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 20:50:33',3),(65,'attendees',20,'INSERT',NULL,'{\"id\": 20, \"booking_id\": 12, \"name\": \"Arnav\", \"email\": \"arnavnew@gmail.com\", \"phone\": \"7485961415\", \"status\": 1}','2026-03-19 20:50:33',3),(66,'payments',10,'INSERT',NULL,'{\"id\": 10, \"booking_id\": 12, \"amount\": 0.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-12\", \"status\": 1}','2026-03-19 20:50:33',3),(67,'events',2,'UPDATE','{\"id\": 2, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-23 18:30:00\", \"status\": 1}','{\"id\": 2, \"name\": \"Holi\", \"venue_id\": 1, \"event_date\": \"2026-03-23 13:00:00\", \"status\": 1}','2026-03-19 20:57:31',1),(68,'events',5,'UPDATE','{\"id\": 5, \"name\": \"Arnav Wedding\", \"venue_id\": 1, \"event_date\": \"2026-03-30 18:30:00\", \"status\": 1}','{\"id\": 5, \"name\": \"Arnav Wedding\", \"venue_id\": 1, \"event_date\": \"2026-03-30 16:00:00\", \"status\": 1}','2026-03-19 20:57:56',1),(69,'vendors',2,'UPDATE','{\"id\": 2, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": \"Foodie@food.com\", \"phone\": \"7894561235\", \"status\": 1}','{\"id\": 2, \"name\": \"Food Nation\", \"service_type\": \"Food\", \"contact_email\": null, \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 21:23:23',1),(70,'bookings',6,'UPDATE','{\"id\": 6, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 6, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-19 21:27:03',1),(71,'venues',2,'INSERT',NULL,'{\"id\": 2, \"name\": \"Wedding Banquet Hall\", \"location\": \"India\", \"capacity\": 100, \"price\": 500000.00, \"status\": 1}','2026-03-19 21:28:36',1),(72,'vendors',3,'INSERT',NULL,'{\"id\": 3, \"name\": \"Best Mandi in Town\", \"service_type\": \"Mandi Provider\", \"contact_email\": null, \"phone\": \"7894561595\", \"status\": 1}','2026-03-19 21:39:33',1),(73,'events',6,'INSERT',NULL,'{\"id\": 6, \"name\": \"Best Wedding\", \"venue_id\": 2, \"event_date\": \"2026-03-31 07:46:00\", \"status\": 1}','2026-03-19 21:48:31',1),(74,'event_vendors',6,'INSERT',NULL,'{\"event_id\": 6, \"vendor_id\": 3, \"status\": 1}','2026-03-19 21:48:31',1),(75,'event_vendors',6,'INSERT',NULL,'{\"event_id\": 6, \"vendor_id\": 2, \"status\": 1}','2026-03-19 21:48:32',1),(76,'users',4,'INSERT',NULL,'{\"id\": 4, \"name\": \"Daksh\", \"email\": \"daksh@deloitte.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-19 22:01:12',NULL),(77,'bookings',13,'INSERT',NULL,'{\"id\": 13, \"user_id\": 4, \"event_id\": 6, \"attendee_count\": 3, \"booking_status\": \"PENDING\"}','2026-03-19 22:03:12',4),(78,'attendees',21,'INSERT',NULL,'{\"id\": 21, \"booking_id\": 13, \"name\": \"Daksh Shukla\", \"email\": \"daksh@deloitte.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 22:03:12',4),(79,'attendees',22,'INSERT',NULL,'{\"id\": 22, \"booking_id\": 13, \"name\": \"Prashast Saxena\", \"email\": \"pboy@gmail.com\", \"phone\": \"897561235\", \"status\": 1}','2026-03-19 22:03:12',4),(80,'attendees',23,'INSERT',NULL,'{\"id\": 23, \"booking_id\": 13, \"name\": \"Arnav Aradhya\", \"email\": \"aaboy@gmail.com\", \"phone\": \"876511245\", \"status\": 1}','2026-03-19 22:03:12',4),(81,'payments',11,'INSERT',NULL,'{\"id\": 11, \"booking_id\": 13, \"amount\": 750.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-13\", \"status\": 1}','2026-03-19 22:03:13',4),(82,'attendees',24,'INSERT',NULL,'{\"id\": 24, \"booking_id\": 13, \"name\": \"Daksh Shukla\", \"email\": \"daksh@deloitte.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 22:03:48',4),(83,'attendees',25,'INSERT',NULL,'{\"id\": 25, \"booking_id\": 13, \"name\": \"Prashast Saxena\", \"email\": \"pboy@gmail.com\", \"phone\": \"897561235\", \"status\": 1}','2026-03-19 22:03:48',4),(84,'attendees',26,'INSERT',NULL,'{\"id\": 26, \"booking_id\": 13, \"name\": \"Arnav Aradhya\", \"email\": \"aaboy@gmail.com\", \"phone\": \"876511246\", \"status\": 1}','2026-03-19 22:03:48',4),(85,'attendees',27,'INSERT',NULL,'{\"id\": 27, \"booking_id\": 13, \"name\": \"Daksh Shukla\", \"email\": \"daksh@deloitte.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 22:04:57',4),(86,'attendees',28,'INSERT',NULL,'{\"id\": 28, \"booking_id\": 13, \"name\": \"Prashast Saxena\", \"email\": \"pboy@gmail.com\", \"phone\": \"897561235\", \"status\": 1}','2026-03-19 22:04:57',4),(87,'attendees',29,'INSERT',NULL,'{\"id\": 29, \"booking_id\": 13, \"name\": \"Arnav Aradhya\", \"email\": \"aaboy@gmail.com\", \"phone\": \"876511246\", \"status\": 1}','2026-03-19 22:04:57',4),(88,'attendees',30,'INSERT',NULL,'{\"id\": 30, \"booking_id\": 13, \"name\": \"aa\", \"email\": \"aa@gmail.com\", \"phone\": \"785423568\", \"status\": 1}','2026-03-19 22:04:57',4),(89,'attendees',31,'INSERT',NULL,'{\"id\": 31, \"booking_id\": 13, \"name\": \"fesfes\", \"email\": \"fesf@gmail.com\", \"phone\": \"786465123\", \"status\": 1}','2026-03-19 22:04:57',4),(90,'attendees',32,'INSERT',NULL,'{\"id\": 32, \"booking_id\": 13, \"name\": \"fesesfes\", \"email\": \"fesfesf@gmail.com\", \"phone\": \"555812357\", \"status\": 1}','2026-03-19 22:04:57',4),(91,'bookings',13,'UPDATE','{\"id\": 13, \"attendee_count\": 3, \"booking_status\": \"PENDING\"}','{\"id\": 13, \"attendee_count\": 6, \"booking_status\": \"PENDING\"}','2026-03-19 22:04:57',4),(92,'attendees',33,'INSERT',NULL,'{\"id\": 33, \"booking_id\": 13, \"name\": \"Daksh Shukla\", \"email\": \"daksh@deloitte.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 22:05:39',4),(93,'attendees',34,'INSERT',NULL,'{\"id\": 34, \"booking_id\": 13, \"name\": \"Prashast Saxena\", \"email\": \"pboy@gmail.com\", \"phone\": \"897561235\", \"status\": 1}','2026-03-19 22:05:39',4),(94,'attendees',35,'INSERT',NULL,'{\"id\": 35, \"booking_id\": 13, \"name\": \"Arnav Aradhya\", \"email\": \"aaboy@gmail.com\", \"phone\": \"876511246\", \"status\": 1}','2026-03-19 22:05:39',4),(95,'bookings',13,'UPDATE','{\"id\": 13, \"attendee_count\": 6, \"booking_status\": \"PENDING\"}','{\"id\": 13, \"attendee_count\": 3, \"booking_status\": \"PENDING\"}','2026-03-19 22:05:39',4),(96,'bookings',13,'UPDATE','{\"id\": 13, \"attendee_count\": 3, \"booking_status\": \"PENDING\"}','{\"id\": 13, \"attendee_count\": 3, \"booking_status\": \"APPROVED\"}','2026-03-19 22:06:33',1),(97,'events',7,'INSERT',NULL,'{\"id\": 7, \"name\": \"new event\", \"venue_id\": 2, \"event_date\": \"2026-03-28 01:07:00\", \"status\": 1}','2026-03-19 22:07:45',1),(98,'event_vendors',7,'INSERT',NULL,'{\"event_id\": 7, \"vendor_id\": 3, \"status\": 1}','2026-03-19 22:07:45',1),(99,'event_vendors',7,'INSERT',NULL,'{\"event_id\": 7, \"vendor_id\": 2, \"status\": 1}','2026-03-19 22:07:45',1),(100,'bookings',11,'UPDATE','{\"id\": 11, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 11, \"attendee_count\": 1, \"booking_status\": \"APPROVED\"}','2026-03-19 22:08:41',1),(101,'bookings',12,'UPDATE','{\"id\": 12, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 12, \"attendee_count\": 1, \"booking_status\": \"REJECTED\"}','2026-03-19 22:13:40',1),(102,'bookings',14,'INSERT',NULL,'{\"id\": 14, \"user_id\": 4, \"event_id\": 2, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-19 22:15:52',4),(103,'attendees',36,'INSERT',NULL,'{\"id\": 36, \"booking_id\": 14, \"name\": \"daksh\", \"email\": \"dboy@gg.io\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-19 22:15:52',4),(104,'payments',12,'INSERT',NULL,'{\"id\": 12, \"booking_id\": 14, \"amount\": 25.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-14\", \"status\": 1}','2026-03-19 22:15:52',4),(105,'users',5,'INSERT',NULL,'{\"id\": 5, \"name\": \"Rahul\", \"email\": \"rahul@deloitte.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-20 09:06:35',NULL),(106,'bookings',15,'INSERT',NULL,'{\"id\": 15, \"user_id\": 5, \"event_id\": 2, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','2026-03-20 09:08:17',5),(107,'attendees',37,'INSERT',NULL,'{\"id\": 37, \"booking_id\": 15, \"name\": \"Rahul\", \"email\": \"rahul@deloitte.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-20 09:08:17',5),(108,'attendees',38,'INSERT',NULL,'{\"id\": 38, \"booking_id\": 15, \"name\": \"Hasib\", \"email\": \"hasib@cloudthat.com\", \"phone\": \"7894561235\", \"status\": 1}','2026-03-20 09:08:17',5),(109,'payments',13,'INSERT',NULL,'{\"id\": 13, \"booking_id\": 15, \"amount\": 50.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-15\", \"status\": 1}','2026-03-20 09:08:17',5),(110,'bookings',16,'INSERT',NULL,'{\"id\": 16, \"user_id\": 5, \"event_id\": 7, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-20 09:09:19',5),(111,'attendees',39,'INSERT',NULL,'{\"id\": 39, \"booking_id\": 16, \"name\": \"rahul\", \"email\": \"rahul@deloitte.com\", \"phone\": \"789456258\", \"status\": 1}','2026-03-20 09:09:19',5),(112,'payments',14,'INSERT',NULL,'{\"id\": 14, \"booking_id\": 16, \"amount\": 3000.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-16\", \"status\": 1}','2026-03-20 09:09:19',5),(113,'bookings',17,'INSERT',NULL,'{\"id\": 17, \"user_id\": 5, \"event_id\": 6, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-20 09:09:56',5),(114,'attendees',40,'INSERT',NULL,'{\"id\": 40, \"booking_id\": 17, \"name\": \"rahul\", \"email\": \"rahul@gg.io\", \"phone\": \"788941561\", \"status\": 1}','2026-03-20 09:09:56',5),(115,'payments',15,'INSERT',NULL,'{\"id\": 15, \"booking_id\": 17, \"amount\": 250.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-17\", \"status\": 1}','2026-03-20 09:09:56',5),(116,'bookings',18,'INSERT',NULL,'{\"id\": 18, \"user_id\": 5, \"event_id\": 5, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','2026-03-20 09:10:18',5),(117,'attendees',41,'INSERT',NULL,'{\"id\": 41, \"booking_id\": 18, \"name\": \"Prashast\", \"email\": \"saxena@gmail.com\", \"phone\": \"789456258\", \"status\": 1}','2026-03-20 09:10:18',5),(118,'payments',16,'INSERT',NULL,'{\"id\": 16, \"booking_id\": 18, \"amount\": 1000.00, \"payment_method\": \"CASH\", \"payment_status\": \"SUCCESS\", \"transaction_reference\": \"MOCK-18\", \"status\": 1}','2026-03-20 09:10:18',5),(119,'bookings',18,'UPDATE','{\"id\": 18, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 18, \"attendee_count\": 1, \"booking_status\": \"CANCELLED\"}','2026-03-20 09:10:43',5),(120,'bookings',15,'UPDATE','{\"id\": 15, \"attendee_count\": 2, \"booking_status\": \"PENDING\"}','{\"id\": 15, \"attendee_count\": 2, \"booking_status\": \"APPROVED\"}','2026-03-20 09:11:13',1),(121,'bookings',14,'UPDATE','{\"id\": 14, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 14, \"attendee_count\": 1, \"booking_status\": \"REJECTED\"}','2026-03-20 09:11:21',1),(122,'events',8,'INSERT',NULL,'{\"id\": 8, \"name\": \"Birthday Party\", \"venue_id\": 2, \"event_date\": \"2026-03-27 09:30:00\", \"status\": 1}','2026-03-20 09:14:44',1),(123,'event_vendors',8,'INSERT',NULL,'{\"event_id\": 8, \"vendor_id\": 3, \"status\": 1}','2026-03-20 09:14:45',1),(124,'event_vendors',8,'INSERT',NULL,'{\"event_id\": 8, \"vendor_id\": 2, \"status\": 1}','2026-03-20 09:14:45',1),(125,'venues',3,'INSERT',NULL,'{\"id\": 3, \"name\": \"Birthday Hall\", \"location\": \"Clubhouse\", \"capacity\": 50, \"price\": 15000.00, \"status\": 1}','2026-03-20 09:15:39',1),(126,'vendors',4,'INSERT',NULL,'{\"id\": 4, \"name\": \"Raju Electrical and Balloons\", \"service_type\": \"Decorations\", \"contact_email\": null, \"phone\": \"7894561231595\", \"status\": 1}','2026-03-20 09:16:24',1),(127,'bookings',17,'UPDATE','{\"id\": 17, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 17, \"attendee_count\": 1, \"booking_status\": \"REJECTED\"}','2026-03-20 09:17:19',1),(128,'bookings',16,'UPDATE','{\"id\": 16, \"attendee_count\": 1, \"booking_status\": \"PENDING\"}','{\"id\": 16, \"attendee_count\": 1, \"booking_status\": \"REJECTED\"}','2026-03-20 09:17:23',1),(129,'users',6,'INSERT',NULL,'{\"id\": 6, \"name\": \"Amrita\", \"email\": \"amrita@gmail.com\", \"role\": \"CUSTOMER\", \"status\": 1}','2026-03-20 09:57:01',NULL);
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `event_id` bigint(20) NOT NULL,
  `attendee_count` int(11) DEFAULT 1,
  `booking_status` enum('PENDING','APPROVED','REJECTED','CANCELLED') DEFAULT 'PENDING',
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,2,1,'APPROVED','2026-03-18 12:04:38','2026-03-18 12:04:38','2026-03-18 12:04:38',1,1,1),(2,1,2,1,'APPROVED','2026-03-18 12:22:03','2026-03-18 12:22:03','2026-03-18 12:22:03',1,1,1),(3,2,2,1,'APPROVED','2026-03-19 14:40:36','2026-03-19 14:40:36','2026-03-19 14:40:36',2,2,1),(4,2,2,1,'APPROVED','2026-03-19 14:40:56','2026-03-19 14:40:56','2026-03-19 14:40:56',2,2,1),(5,2,2,1,'APPROVED','2026-03-19 14:46:07','2026-03-19 14:46:07','2026-03-19 19:25:51',2,1,1),(6,2,4,1,'APPROVED','2026-03-19 14:52:47','2026-03-19 14:52:47','2026-03-19 21:27:03',2,1,1),(7,2,3,2,'REJECTED','2026-03-19 15:12:59','2026-03-19 15:12:59','2026-03-19 19:27:02',2,1,1),(8,3,2,2,'CANCELLED','2026-03-19 19:13:18','2026-03-19 19:13:18','2026-03-19 19:16:52',3,3,1),(9,3,5,2,'APPROVED','2026-03-19 19:23:42','2026-03-19 19:23:42','2026-03-19 19:26:55',3,1,1),(10,3,5,1,'CANCELLED','2026-03-19 19:24:02','2026-03-19 19:24:02','2026-03-19 19:25:04',3,3,1),(11,3,4,1,'APPROVED','2026-03-19 20:49:49','2026-03-19 20:49:49','2026-03-19 22:08:41',3,1,1),(12,3,3,1,'REJECTED','2026-03-19 20:50:33','2026-03-19 20:50:33','2026-03-19 22:13:40',3,1,1),(13,4,6,3,'APPROVED','2026-03-19 22:03:12','2026-03-19 22:03:12','2026-03-19 22:06:33',4,1,1),(14,4,2,1,'REJECTED','2026-03-19 22:15:52','2026-03-19 22:15:52','2026-03-20 09:11:21',4,1,1),(15,5,2,2,'APPROVED','2026-03-20 09:08:17','2026-03-20 09:08:17','2026-03-20 09:11:13',5,1,1),(16,5,7,1,'REJECTED','2026-03-20 09:09:19','2026-03-20 09:09:19','2026-03-20 09:17:23',5,1,1),(17,5,6,1,'REJECTED','2026-03-20 09:09:56','2026-03-20 09:09:56','2026-03-20 09:17:19',5,1,1),(18,5,5,1,'CANCELLED','2026-03-20 09:10:18','2026-03-20 09:10:18','2026-03-20 09:10:43',5,5,1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_vendors`
--

DROP TABLE IF EXISTS `event_vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_vendors` (
  `event_id` bigint(20) NOT NULL,
  `vendor_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`event_id`,`vendor_id`),
  KEY `vendor_id` (`vendor_id`),
  CONSTRAINT `event_vendors_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`),
  CONSTRAINT `event_vendors_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendors` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_vendors`
--

LOCK TABLES `event_vendors` WRITE;
/*!40000 ALTER TABLE `event_vendors` DISABLE KEYS */;
INSERT INTO `event_vendors` VALUES (6,2,'2026-03-19 16:18:31','2026-03-19 16:18:31',1,1,1),(6,3,'2026-03-19 16:18:31','2026-03-19 16:18:31',1,1,1),(7,2,'2026-03-19 16:37:45','2026-03-19 16:37:45',1,1,1),(7,3,'2026-03-19 16:37:45','2026-03-19 16:37:45',1,1,1),(8,2,'2026-03-20 03:44:45','2026-03-20 03:44:45',1,1,1),(8,3,'2026-03-20 03:44:45','2026-03-20 03:44:45',1,1,1);
/*!40000 ALTER TABLE `event_vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `venue_id` bigint(20) NOT NULL,
  `event_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `max_attendees_per_user` int(11) DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT NULL,
  `cost_per_ticket` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (2,'Holi',1,'2026-03-23 13:00:00','Holi Event','2026-03-18 06:47:55','2026-03-19 20:57:31',1,1,1,2,2500.00,25.00),(3,'Holi',1,'2026-03-24 18:30:00','Holi Event','2026-03-18 01:20:36','2026-03-18 01:20:36',1,1,1,NULL,NULL,NULL),(4,'Ugadi',1,'2026-03-25 18:30:00','Ugadi Celebration','2026-03-18 02:02:34','2026-03-19 14:52:24',1,1,1,50,25000.00,50.00),(5,'Arnav Wedding',1,'2026-03-30 16:00:00','Arnav\'s Wedding Celebration with cocktails','2026-03-19 13:52:06','2026-03-19 20:57:56',1,1,1,NULL,500000.00,1000.00),(6,'Best Wedding',2,'2026-03-31 07:46:00','Best Wedding in town. Must attend!!','2026-03-19 16:18:31','2026-03-19 16:18:31',1,1,1,5,2500000.00,250.00),(7,'new event',2,'2026-03-28 01:07:00','demo event','2026-03-19 16:37:45','2026-03-19 16:37:45',1,1,1,1,600000.00,3000.00),(8,'Birthday Party',2,'2026-03-27 09:30:00','Best birthday party','2026-03-20 03:44:44','2026-03-20 03:44:44',1,1,1,NULL,550000.00,0.00);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booking_id` bigint(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('CARD','UPI','NETBANKING','CASH') DEFAULT NULL,
  `payment_status` enum('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
  `transaction_reference` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,3,0.00,'CASH','SUCCESS','MOCK-3','2026-03-19 14:40:37','2026-03-19 14:40:37',2,2,1),(2,4,0.00,'CASH','SUCCESS','MOCK-4','2026-03-19 14:40:56','2026-03-19 14:40:56',2,2,1),(3,5,0.00,'CASH','SUCCESS','MOCK-5','2026-03-19 14:46:07','2026-03-19 14:46:07',2,2,1),(4,6,50.00,'CASH','SUCCESS','MOCK-6','2026-03-19 14:52:47','2026-03-19 14:52:47',2,2,1),(5,7,0.00,'CASH','SUCCESS','MOCK-7','2026-03-19 15:12:59','2026-03-19 15:12:59',2,2,1),(6,8,0.00,'CASH','SUCCESS','MOCK-8','2026-03-19 19:13:19','2026-03-19 19:13:19',3,3,1),(7,9,1000.00,'CASH','SUCCESS','MOCK-9','2026-03-19 19:23:42','2026-03-19 19:23:42',3,3,1),(8,10,1000.00,'CASH','SUCCESS','MOCK-10','2026-03-19 19:24:02','2026-03-19 19:24:02',3,3,1),(9,11,50.00,'CASH','SUCCESS','MOCK-11','2026-03-19 20:49:50','2026-03-19 20:49:50',3,3,1),(10,12,0.00,'CASH','SUCCESS','MOCK-12','2026-03-19 20:50:33','2026-03-19 20:50:33',3,3,1),(11,13,750.00,'CASH','SUCCESS','MOCK-13','2026-03-19 22:03:12','2026-03-19 22:03:12',4,4,1),(12,14,25.00,'CASH','SUCCESS','MOCK-14','2026-03-19 22:15:52','2026-03-19 22:15:52',4,4,1),(13,15,50.00,'CASH','SUCCESS','MOCK-15','2026-03-20 09:08:17','2026-03-20 09:08:17',5,5,1),(14,16,3000.00,'CASH','SUCCESS','MOCK-16','2026-03-20 09:09:19','2026-03-20 09:09:19',5,5,1),(15,17,250.00,'CASH','SUCCESS','MOCK-17','2026-03-20 09:09:56','2026-03-20 09:09:56',5,5,1),(16,18,1000.00,'CASH','SUCCESS','MOCK-18','2026-03-20 09:10:18','2026-03-20 09:10:18',5,5,1);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Prashast','admin@eventzen.com','$2a$11$kLZr9xnmSYYrNirgpPFTX.2IJPZZ4GA2lwaKjQT5/Nbtsf5Onkwra','ADMIN','2026-03-17 16:21:41','2026-03-17 16:23:09',NULL,NULL,1),(2,'Yashu','yashu@gmail.com','$2a$11$W00jVwo0EuVJ7VT.zCD8Kek1P3cpZPzUQJ/5xeAKOHnLiiOF6Grk6','CUSTOMER','2026-03-19 14:18:43','2026-03-19 14:18:43',NULL,NULL,1),(3,'Arnav Aradhya','arnav11@gmail.com','$2a$11$TAVhW6XhBuyeR2ckS1.02OJ3Gp3IcCmDiyF4AprIOQ5jMRru9laZ.','CUSTOMER','2026-03-19 19:07:36','2026-03-19 20:43:11',NULL,NULL,1),(4,'Daksh','daksh@deloitte.com','$2a$11$brS.nFF7gkh4KVeijicKKuJ3owb/8kuwUZqILHoFIBcjc7FlSlybq','CUSTOMER','2026-03-19 22:01:12','2026-03-19 22:01:12',NULL,NULL,1),(5,'Rahul','rahul@deloitte.com','$2a$11$tK3qup5dTqz485BaZZNkZO3hXIbZB.Y5ZnxxcMsSUByOtRxLnIm.W','CUSTOMER','2026-03-20 09:06:34','2026-03-20 09:06:34',NULL,NULL,1),(6,'Amrita','amrita@gmail.com','$2a$11$fFJIaBfKgbk2/cDlYupMyemziH/7rO5fLJSiMItQhgyaGNbiYF4bC','CUSTOMER','2026-03-20 09:57:01','2026-03-20 09:57:01',NULL,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendors` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `contact_email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,'Food Nation','Food','foodie123@food.com','7894561232','2026-03-18 01:22:18','2026-03-18 06:54:55',1,1,0,NULL),(2,'Food Nation','Food',NULL,'7894561235','2026-03-18 01:25:10','2026-03-19 21:23:23',1,1,1,25.00),(3,'Best Mandi in Town','Mandi Provider',NULL,'7894561595','2026-03-19 16:09:33','2026-03-19 16:09:33',1,1,1,5500.00),(4,'Raju Electrical and Balloons','Decorations',NULL,'7894561231595','2026-03-20 03:46:24','2026-03-20 03:46:24',1,1,1,500.00);
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `location` varchar(200) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Good Place','Delhi',50,250.00,'Holi Party','2026-03-17 14:36:28','2026-03-18 11:19:45',1,1,1),(2,'Wedding Banquet Hall','India',100,500000.00,'A royal wedding place for royal people!','2026-03-19 15:58:36','2026-03-19 15:58:36',1,1,1),(3,'Birthday Hall','Clubhouse',50,15000.00,'Birthday Hall','2026-03-20 03:45:39','2026-03-20 03:45:39',1,1,1);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-25 12:06:34
