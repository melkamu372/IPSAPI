```
CREATE DATABASE IPS;

```

```
CREATE USER 'abay'@'%' IDENTIFIED BY 'PassWord.1';
GRANT ALL PRIVILEGES ON IPS.* TO 'abay'@'%';
FLUSH PRIVILEGES;
```

--
-- Table structure for table `transfers`
--

DROP TABLE IF EXISTS `transfers`;
CREATE TABLE `transfers` (
  `id` UUID NOT NULL DEFAULT uuid_generate_v4(),
  `bank` varchar(50) NOT NULL,
  `account` varchar(50) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `transaction_code` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `eth_ref` varchar(50) DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) 


--
-- Table structure for table `transact_log`
--

DROP TABLE IF EXISTS `transact_log`;

CREATE TABLE `transact_log` (
  `id` UUID NOT NULL DEFAULT uuid_generate_v4(),
  `account` varchar(255) DEFAULT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `ref` varchar(255) DEFAULT NULL,
  `eth_ref` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'SUCCESS',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) 

///////////////////////////////
/// New Table structure sql ///
//////////////////////////////

```
CREATE TABLE `token_lists` (
    `id` UUID NOT NULL DEFAULT uuid_generate_v4(),
    `accessToken` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(255) NOT NULL,
    `expiresAt` TIMESTAMP NOT NULL,
    `refreshExpiresAt` TIMESTAMP NOT NULL,
    `created_at` DATETIME NOT NULL,  
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Last modification time
  PRIMARY KEY (`id`)
);

```

> Table structure for table `transfers`
```
CREATE TABLE `transfers` (
  `id` CHAR(36) NOT NULL,  -- UUID as a string
  `debitor_name` VARCHAR(255) DEFAULT NULL,  -- Name of the debitor
  `creditor_name` VARCHAR(255) DEFAULT NULL,  -- Name of the creditor
  `bank` VARCHAR(50) NOT NULL,  -- Bank name
  `account` VARCHAR(50) NOT NULL,  -- Account number
  `amount` DECIMAL(15, 2) DEFAULT NULL,  -- Transaction amount
  `transaction_code` VARCHAR(50) DEFAULT NULL,  -- Code for the transaction
  `status` VARCHAR(50) DEFAULT 'PENDING',  -- Status of the transaction
  `eth_ref` VARCHAR(50) DEFAULT NULL,  -- Ethereum reference
  `createdAt` DATETIME NOT NULL,  
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Last modification time
  PRIMARY KEY (`id`)
);

```
> Table Transfer

```
CREATE TABLE `transact_logs` (
  `id` CHAR(36) NOT NULL,  -- UUID as a string
  `debitor_name` VARCHAR(255) DEFAULT NULL,
  `creditor_name`  VARCHAR(255) DEFAULT NULL,
  `account` VARCHAR(255) DEFAULT NULL,
  `amount` DECIMAL(15, 2) DEFAULT NULL,
  `bank` VARCHAR(255) DEFAULT NULL,
  `ref` VARCHAR(255) DEFAULT NULL,
  `eth_ref` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'SUCCESS',
  `createdAt` DATETIME NOT NULL,  
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Last modification time
  PRIMARY KEY (`id`)
);

```
