/*
Navicat Premium Data Transfer

Source Server         : localhost_3306_1
Source Server Type    : MySQL
Source Server Version : 90700 (9.7.0)
Source Host           : localhost:3306
Source Schema         : rt

Target Server Type    : MySQL
Target Server Version : 90700 (9.7.0)
File Encoding         : 65001

Date: 11/06/2026 19:46:26
 */
SET
    NAMES utf8mb4;

SET
    FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;

CREATE TABLE
    `cache` (
        `key` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `value` mediumtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `expiration` bigint NOT NULL,
            PRIMARY KEY (`key`) USING BTREE,
            INDEX `cache_expiration_index` (`expiration` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;

CREATE TABLE
    `cache_locks` (
        `key` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `owner` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `expiration` bigint NOT NULL,
            PRIMARY KEY (`key`) USING BTREE,
            INDEX `cache_locks_expiration_index` (`expiration` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for data
-- ----------------------------
DROP TABLE IF EXISTS `data`;

CREATE TABLE
    `data` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `tipe` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `nama` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `nomor` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `alamat` text CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
            `status` varchar(50) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;

CREATE TABLE
    `failed_jobs` (
        `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        `uuid` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `connection` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `queue` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `payload` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `exception` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`) USING BTREE,
            UNIQUE INDEX `failed_jobs_uuid_unique` (`uuid` ASC) USING BTREE,
            INDEX `failed_jobs_connection_queue_failed_at_index` (`connection` ASC, `queue` ASC, `failed_at` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;

CREATE TABLE
    `file` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `parent_id` bigint NULL DEFAULT NULL,
        `parent_table` varchar(50) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `nama` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `path` varchar(500) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`) USING BTREE,
            INDEX `idx_file_parent` (`parent_id` ASC, `parent_table` ASC) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;

CREATE TABLE
    `job_batches` (
        `id` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `name` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `total_jobs` int NOT NULL,
            `pending_jobs` int NOT NULL,
            `failed_jobs` int NOT NULL,
            `failed_job_ids` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `options` mediumtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            `cancelled_at` int NULL DEFAULT NULL,
            `created_at` int NOT NULL,
            `finished_at` int NULL DEFAULT NULL,
            PRIMARY KEY (`id`) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;

CREATE TABLE
    `jobs` (
        `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        `queue` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `payload` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `attempts` smallint UNSIGNED NOT NULL,
            `reserved_at` int UNSIGNED NULL DEFAULT NULL,
            `available_at` int UNSIGNED NOT NULL,
            `created_at` int UNSIGNED NOT NULL,
            PRIMARY KEY (`id`) USING BTREE,
            INDEX `jobs_queue_index` (`queue` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;

CREATE TABLE
    `migrations` (
        `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
        `migration` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `batch` int NOT NULL,
            PRIMARY KEY (`id`) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;

CREATE TABLE
    `password_reset_tokens` (
        `email` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `token` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`email`) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for personal_access_tokens
-- ----------------------------
DROP TABLE IF EXISTS `personal_access_tokens`;

CREATE TABLE
    `personal_access_tokens` (
        `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        `tokenable_type` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `tokenable_id` bigint UNSIGNED NOT NULL,
            `name` text CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `token` varchar(64) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `abilities` text CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            `last_used_at` timestamp NULL DEFAULT NULL,
            `expires_at` timestamp NULL DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`) USING BTREE,
            UNIQUE INDEX `personal_access_tokens_token_unique` (`token` ASC) USING BTREE,
            INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type` ASC, `tokenable_id` ASC) USING BTREE,
            INDEX `personal_access_tokens_expires_at_index` (`expires_at` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;

CREATE TABLE
    `sessions` (
        `id` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `user_id` bigint UNSIGNED NULL DEFAULT NULL,
            `ip_address` varchar(45) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
            `user_agent` text CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
            `payload` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `last_activity` int NOT NULL,
            PRIMARY KEY (`id`) USING BTREE,
            INDEX `sessions_user_id_index` (`user_id` ASC) USING BTREE,
            INDEX `sessions_last_activity_index` (`last_activity` ASC) USING BTREE
    ) ENGINE = InnoDB CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tran
-- ----------------------------
DROP TABLE IF EXISTS `tran`;

CREATE TABLE
    `tran` (
        `id` bigint NOT NULL AUTO_INCREMENT,
        `id_data` bigint NULL DEFAULT NULL,
        `tipe` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `tipe2` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `tipe3` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `nama` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `nomor` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `tanggal` date NULL DEFAULT NULL,
            `bulan` smallint UNSIGNED NULL DEFAULT NULL,
            `tahun` smallint UNSIGNED NULL DEFAULT NULL,
            `tanggal_bayar` date NULL DEFAULT NULL,
            `status_penghuni` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `status_bayar` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `bayar` double NULL DEFAULT NULL,
            `status` varchar(50) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`) USING BTREE,
            INDEX `idx_tran_id_data` (`id_data` ASC) USING BTREE,
            CONSTRAINT `fk_tran_data` FOREIGN KEY (`id_data`) REFERENCES `data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;

CREATE TABLE
    `users` (
        `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        `name` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `email` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `email_verified_at` timestamp NULL DEFAULT NULL,
            `password` varchar(255) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            `remember_token` varchar(100) CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`) USING BTREE,
            UNIQUE INDEX `users_email_unique` (`email` ASC) USING BTREE
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER
SET
    = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET
    FOREIGN_KEY_CHECKS = 1;