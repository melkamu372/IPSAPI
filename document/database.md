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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank` varchar(50) NOT NULL,
  `account` varchar(50) NOT NULL,
  `amount` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `transaction_code` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `eth_ref` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=895772 DEFAULT CHARSET=latin1;


--
-- Table structure for table `transact_log`
--

DROP TABLE IF EXISTS `transact_log`;

CREATE TABLE `transact_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `amount` varchar(255) DEFAULT NULL,
  `bank` varchar(255) DEFAULT NULL,
  `ref` varchar(255) DEFAULT NULL,
  `eth_ref` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'SUCCESS',
  `modified` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_time` (`date`)
) ENGINE=MyISAM AUTO_INCREMENT=4620067 DEFAULT CHARSET=latin1;

