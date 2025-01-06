-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2025 at 10:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sales_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) GENERATED ALWAYS AS (`quantity` * `price`) STORED,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `product_id`, `product_name`, `quantity`, `price`, `created_at`) VALUES
(15, 2, 'French Baguette', 1, 3.99, '2024-12-29 02:29:16'),
(17, 3, 'Whole Grain Bread', 1, 5.99, '2024-12-29 05:10:28'),
(18, 2, 'French Baguette', 1, 3.99, '2025-01-01 03:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  `postcode` varchar(10) NOT NULL,
  `country` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `username`, `email`, `name`, `contact`, `address`, `postcode`, `country`, `city`, `created_at`, `updated_at`) VALUES
(22, 'siti456', 'siti456@example.com1', 'Siti Nurhaliza', '+60129876543', '45, Jalan Tun Razak, Kuala Lumpur', '50400', 'Malaysia', 'Kuala Lumpur', '2024-12-31 03:59:08', '2024-12-31 04:32:07'),
(23, 'ali789', 'ali789@example.com', 'Ali Hassan', '+60111222333', '78, Jalan Bukit Bintang, Kuala Lumpur', '55100', 'Malaysia', 'Kuala Lumpur', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(24, 'farah321', 'farah321@example.com', 'Farah Binti Ahmad', '+60155556677', '50, Jalan Klang Lama, Petaling Jaya', '46000', 'Malaysia', 'Petaling Jaya', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(25, 'muhammad555', 'muhammad555@example.com', 'Muhammad Noor', '+60199887766', '12, Jalan Taman Desa, Shah Alam', '40100', 'Malaysia', 'Shah Alam', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(26, 'azhar777', 'azhar777@example.com', 'Azhar Ibrahim', '+60122334455', '34, Jalan USJ 10, Subang Jaya', '47620', 'Malaysia', 'Subang Jaya', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(27, 'nurul999', 'nurul999@example.com', 'Nurul Ain', '+60123456790', '89, Jalan Gasing, Petaling Jaya', '46050', 'Malaysia', 'Petaling Jaya', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(28, 'hani123', 'hani123@example.com', 'Hani Binti Ismail', '+60135557788', '55, Jalan Sri Hartamas, Kuala Lumpur', '50480', 'Malaysia', 'Kuala Lumpur', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(29, 'zain432', 'zain432@example.com', 'Zain Ahmad', '+60187776655', '76, Jalan Bangsar, Kuala Lumpur', '59100', 'Malaysia', 'Kuala Lumpur', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(30, 'nadia654', 'nadia654@example.com', 'Nadia Aziz', '+60112233445', '29, Jalan Damansara, Kuala Lumpur', '60000', 'Malaysia', 'Kuala Lumpur', '2024-12-31 03:59:08', '2024-12-31 03:59:08'),
(31, 'siti456s2', 'Hafeez@gmail.com', 'Hafeez', '01010012313', 'Lot 883477', '123445', 'Malaysia', 'Kuala Lumpur', '2024-12-31 04:37:58', '2024-12-31 04:37:58');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `feedback_text` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` varchar(100) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`id`, `name`, `quantity`, `unit`, `supplier`) VALUES
(1, 'Flour', '100', 'kg', 'ABC Supplies'),
(2, 'Sugar', '50', 'kg', 'SweetCo'),
(3, 'Eggs', '200', 'dozen', 'FarmFresh'),
(4, 'Butter', '30', 'kg', 'DairyLand'),
(5, 'Yeast', '10', 'kg', 'Bakers Best'),
(6, 'Salt', '20', 'kg', 'SaltWorks'),
(7, 'Milk', '100', 'liters', 'DairyCo'),
(8, 'Chocolate Chips', '25', 'kg', 'ChocoLux'),
(9, 'Vanilla Extract', '5', 'liters', 'FlavorKing'),
(10, 'Baking Powder', '15', 'kg', 'ChemBake');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `stock` int(11) NOT NULL,
  `reorder_point` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `item_name`, `stock`, `reorder_point`) VALUES
(1, 'Sourdough Bread', 100, 30),
(2, 'French Baguette', 150, 50),
(3, 'Sourdough', 6, 15),
(5, 'Baguette', 15, 20),
(6, 'Croissant', 0, 10),
(7, 'Whole Wheat Bread', 25, 15),
(8, 'Rye Bread', 5, 10),
(9, 'Brioche', 12, 5),
(16, 'Garlic Bread', 45, 20),
(17, 'Whole Grain Bread', 30, 25);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `status` enum('pending','fulfilled','cancelled') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `order_date`, `status`, `total_amount`) VALUES
(2, NULL, '2025-01-06 13:38:59', 'pending', 5.99),
(3, NULL, '2025-01-06 13:39:06', 'pending', 9.98);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `item_name`, `quantity`, `price`) VALUES
(4, 2, 3, '', 1, 5.99),
(5, 3, 2, '', 1, 3.99),
(6, 3, 3, '', 1, 5.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `payment_method` enum('cash','card','online') NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `transaction_id`, `payment_method`, `status`) VALUES
(21, 2, NULL, 'cash', 'pending'),
(22, 3, NULL, 'cash', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `image_path`) VALUES
(1, 'Sourdough Bread', 'Classic sourdough with a crispy crust.', 4.99, '/assets/product/sourdough.jpg'),
(2, 'French Baguette', 'Traditional French-style baguette.', 3.99, '/assets/product/baguette.png'),
(3, 'Whole Grain Bread', 'Rich in fiber and nutrients.', 5.99, '/assets/product/wholegrain.jpg'),
(4, 'Garlic Bread', 'Perfectly toasted bread with garlic butter.', 3.80, '/assets/product/garlicbread.jpg'),
(5, 'Focaccia', 'Soft Italian bread topped with olive oil and herbs.', 4.75, '/assets/product/focaccia.jpg'),
(6, 'Croissant', 'Flaky and buttery croissant, perfect for breakfast.', 2.99, '/assets/product/croissant.jpg'),
(7, 'Rye Bread', 'Made with a mixture of bread and rye flours, this simple no-knead rye bread is pleasantly tangy and sour', 1.99, '/assets/product/rye bread.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` int(11) NOT NULL,
  `promo_name` varchar(100) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_transactions`
--

CREATE TABLE `sales_transactions` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `payment_id` int(11) NOT NULL,
  `orders_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_transactions`
--

INSERT INTO `sales_transactions` (`id`, `customer_id`, `product_id`, `payment_id`, `orders_id`, `amount`, `date`) VALUES
(2, NULL, 3, 21, 2, 5.00, '2025-01-06'),
(3, NULL, 2, 22, 3, 3.00, '2025-01-06'),
(4, NULL, 3, 22, 3, 5.00, '2025-01-06');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('clerk','supervisor','admin') NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `role`, `email`, `password_hash`) VALUES
(1, 'Hafeez Clerk', 'clerk', 'hafeez.clerk@example.com', 'f005d7083cef0cf921ec77254b197293da516661'),
(2, 'Hafeez Supervisor', 'supervisor', 'hafeez.supervisor@example.com', 'd8ae3b5fb8cd65fcfae06dda2439bc823f2e6888'),
(3, 'Hafeez Admin', 'admin', 'hafeez.admin@example.com', 'f865b53623b121fd34ee5426c792e5c33af8c227');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaction_id` (`transaction_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales_transactions`
--
ALTER TABLE `sales_transactions`
  ADD CONSTRAINT `sales_transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
