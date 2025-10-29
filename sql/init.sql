CREATE TABLE Role (
	roleId INT PRIMARY KEY,
	roleName VARCHAR(30) NOT NULL 
);
CREATE TABLE Department (
	departmentId INT PRIMARY KEY,
	departmentName VARCHAR(100) NOT NULL 
);

CREATE TABLE Teams(
	teamId INT PRIMARY KEY,
	teamName VARCHAR(100) NOT NULL,
	departmentId INT,
	FOREIGN KEY (departmentId) REFERENCES Department(departmentId)
);

CREATE TABLE Users (
	usersId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	firstName VARCHAR(100) NOT NULL, 
	userLastName VARCHAR(100),
	passWord TEXT NOT NULL,
	usersEmail VARCHAR(100) NOT NULL UNIQUE,
	teamId INT NOT NULL,
	roleId INT NOT NULL,
	phoneNumber VARCHAR(10),
	ispasswordchange BOOLEAN DEFAULT FALSE,
	createAt TIMESTAMP,
	FOREIGN KEY (teamId) REFERENCES Teams(teamId),
	FOREIGN KEY (roleId) REFERENCES Role(roleId)
);

CREATE TABLE Status(
	statusId INT PRIMARY KEY,
	statusState VARCHAR(20) NOT NULL
);

CREATE TABLE Category(
	categoryId INT PRIMARY KEY,
	categoryName VARCHAR(50) NOT NULL
);

CREATE TABLE ServiceLevelAgreement (
	priorityId INT PRIMARY KEY,
	priorityLevel VARCHAR(30),
	responseTime INT,
	resolveTime INT, 
	description TEXT 
);

CREATE TABLE Problem (
	problemId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	createBy INT NOT NULL,
	title VARCHAR(255),
	description TEXT,
	categoryId INT NOT NULL,
	createAt TIMESTAMP,
	statusId INT NOT NULL,
	departmentId INT NOT NULL,
	priorityId INT NOT NULL,
	location VARCHAR(100) NOT NULL,
	comment TEXT
	FOREIGN KEY (createBy) REFERENCES Users(usersId),
	FOREIGN KEY (categoryId) REFERENCES Category(categoryId),
	FOREIGN KEY (statusId) REFERENCES Status(statusId),
	FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
	FOREIGN KEY (priorityId) REFERENCES ServiceLevelAgreement(priorityId)
);

CREATE TABLE Attachment ( 
	fileId INT PRIMARY KEY ,
	problemId INT NOT NULL,
	fileName VARCHAR(255) NOT NULL,
	filePath TEXT NOT NULL,
	uploadedBy INT NOT NULL,
	uploadedAt TIMESTAMP,
	FOREIGN KEY (problemId) REFERENCES Problem(problemId),
	FOREIGN KEY (uploadedBy) REFERENCES Users(usersId)
);

CREATE TABLE ProblemUpdate (
	updateId INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	problemId INT NOT NULL,
	oldStatus INT,
	newStatus INT, 
	priorityId INT NOT NULL,
	updatedBy INT NOT NULL,
	updateAt TIMESTAMP NOT NULL,
	comment TEXT,
	FOREIGN KEY (problemId) REFERENCES Problem(problemId),
	FOREIGN KEY (oldStatus) REFERENCES Status(statusId),
	FOREIGN KEY (newStatus) REFERENCES Status(statusId),
	FOREIGN KEY (priorityId) REFERENCES ServiceLevelAgreement(priorityId),
	FOREIGN KEY (updatedBy) REFERENCES Users(usersId)
);

CREATE TABLE WorkAssignment (
    problemId INT NOT NULL,
    usersId INT NOT NULL,
    assignAt TIMESTAMP NOT NULL,
    finishAt TIMESTAMP,
    PRIMARY KEY (problemId, usersId),  
    FOREIGN KEY (problemId) REFERENCES Problem(problemId),
    FOREIGN KEY (usersId) REFERENCES Users(usersId)
);


/*
INSERT INTO users (firstname, lastname, password, useremail, teamid, roleid, phonenumber, createat) VALUES
('ธีรภัทร', 'วงศ์สุวรรณ', crypt('12345', gen_salt('bf')), 'theeraphat1@example.com', 1, 3, '0891234567', NOW()),
('กัญญารัตน์', 'พูนทรัพย์', crypt('12345', gen_salt('bf')), 'kanyarut2@example.com', 5, 1, '0819876543', NOW()),
('ปิยะพงษ์', 'สังข์ทอง', crypt('12345', gen_salt('bf')), 'piyapong3@example.com', 8, 4, '0945671234', NOW()),
('ณัฐธิดา', 'อรุณรุ่ง', crypt('12345', gen_salt('bf')), 'natthida4@example.com', 11, 2, '0837896541', NOW()),
('พงษ์ศักดิ์', 'อินทรจักร', crypt('12345', gen_salt('bf')), 'phongsak5@example.com', 3, 3, '0912347895', NOW()),
('ศิริพร', 'แก้วบัวทอง', crypt('12345', gen_salt('bf')), 'siriporn6@example.com', 7, 1, '0869123478', NOW()),
('อนุชา', 'คงเดช', crypt('12345', gen_salt('bf')), 'anucha7@example.com', 10, 1, '0923567890', NOW()),
('สุพัตรา', 'ใจดี', crypt('12345', gen_salt('bf')), 'supattra8@example.com', 6, 2, '0856321479', NOW()),
('ชัยวัฒน์', 'บุญเลิศ', crypt('12345', gen_salt('bf')), 'chaiwat9@example.com', 9, 3, '0932147856', NOW()),
('พรทิพย์', 'แสงทอง', crypt('12345', gen_salt('bf')), 'pornthip10@example.com', 2, 1, '0823145976', NOW()),
('ณัฐพล', 'สมบัติวงศ์', crypt('12345', gen_salt('bf')), 'natthaphon11@example.com', 4, 3, '0953412768', NOW()),
('วราภรณ์', 'ดวงดี', crypt('12345', gen_salt('bf')), 'waraporn12@example.com', 1, 2, '0896324175', NOW()),
('ภัทรพล', 'คีรีกาญจน์', crypt('12345', gen_salt('bf')), 'phattharaphon13@example.com', 5, 1, '0812469537', NOW()),
('จิตติมา', 'บุญญา', crypt('12345', gen_salt('bf')), 'jittima14@example.com', 8, 4, '0839514268', NOW()),
('ศักดิ์ชัย', 'นวลทอง', crypt('12345', gen_salt('bf')), 'sakcchai15@example.com', 11, 3, '0971346825', NOW()),
('นิภาพร', 'สวัสดี', crypt('12345', gen_salt('bf')), 'niphaporn16@example.com', 6, 1, '0849123576', NOW()),
('ธีรเดช', 'วัฒนชัย', crypt('12345', gen_salt('bf')), 'theeradech17@example.com', 3, 2, '0998753214', NOW()),
('จิราพร', 'สุขสวัสดิ์', crypt('12345', gen_salt('bf')), 'jiraporn18@example.com', 10, 1, '0918753462', NOW()),
('อรรถพล', 'เรืองเดช', crypt('12345', gen_salt('bf')), 'atthaphon19@example.com', 2, 4, '0859784132', NOW()),
('สุวนันท์', 'แสงใส', crypt('12345', gen_salt('bf')), 'suwanan20@example.com', 9, 3, '0879563142', NOW()),
('ธนวัฒน์', 'รุ่งโรจน์', crypt('12345', gen_salt('bf')), 'thanawat21@example.com', 7, 1, '0821349756', NOW()),
('จุฑารัตน์', 'อินทร์ทอง', crypt('12345', gen_salt('bf')), 'jutharat22@example.com', 5, 4, '0865314297', NOW()),
('ณัฐกิตติ์', 'โสภณ', crypt('12345', gen_salt('bf')), 'natthakrit23@example.com', 4, 1, '0956321487', NOW()),
('อัญชัน', 'ทองดี', crypt('12345', gen_salt('bf')), 'anchan24@example.com', 6, 2, '0897453162', NOW()),
('ธิดารัตน์', 'ชื่นบุญ', crypt('12345', gen_salt('bf')), 'thidarat25@example.com', 1, 1, '0918345627', NOW()),
('กิตติชัย', 'มหาพงษ์', crypt('12345', gen_salt('bf')), 'kittichai26@example.com', 8, 3, '0823571496', NOW()),
('วาสนา', 'บัวงาม', crypt('12345', gen_salt('bf')), 'wasana27@example.com', 2, 2, '0874539126', NOW()),
('พงศกร', 'ใจบุญ', crypt('12345', gen_salt('bf')), 'phongsakon28@example.com', 3, 4, '0998734512', NOW()),
('กัลยารัตน์', 'คงทน', crypt('12345', gen_salt('bf')), 'kalyarat29@example.com', 9, 1, '0839756142', NOW()),
('สมศักดิ์', 'บุญธรรม', crypt('12345', gen_salt('bf')), 'somsak30@example.com', 10, 2, '0859641327', NOW()),
('วารุณี', 'ทองคำ', crypt('12345', gen_salt('bf')), 'warunee31@example.com', 11, 1, '0862354791', NOW()),
('ธีรศักดิ์', 'จันทร์เพ็ญ', crypt('12345', gen_salt('bf')), 'theerasak32@example.com', 4, 3, '0925784316', NOW()),
('สุภาวดี', 'สมสุข', crypt('12345', gen_salt('bf')), 'suphawadee33@example.com', 5, 4, '0849753164', NOW()),
('พิชิต', 'สกุลดี', crypt('12345', gen_salt('bf')), 'phichit34@example.com', 8, 1, '0914573826', NOW()),
('รัตนาวดี', 'บุญมาก', crypt('12345', gen_salt('bf')), 'rattanawadee35@example.com', 3, 2, '0819467532', NOW()),
('วิชัย', 'ศรีสุข', crypt('12345', gen_salt('bf')), 'wichai36@example.com', 1, 3, '0831264975', NOW()),
('อรอุมา', 'ทองแท้', crypt('12345', gen_salt('bf')), 'ornuma37@example.com', 7, 1, '0957418263', NOW()),
('สมชาย', 'พูนสุข', crypt('12345', gen_salt('bf')), 'somchai38@example.com', 2, 4, '0921845736', NOW()),
('ศุภกานต์', 'จิตดี', crypt('12345', gen_salt('bf')), 'suppakan39@example.com', 10, 2, '0897314562', NOW()),
('ณัฐรดา', 'วัฒนะ', crypt('12345', gen_salt('bf')), 'nattharada40@example.com', 11, 1, '0819642375', NOW()),
('นพดล', 'อ่อนดี', crypt('12345', gen_salt('bf')), 'nopadon41@example.com', 4, 3, '0889654317', NOW()),
('ศิริลักษณ์', 'ชาญเดช', crypt('12345', gen_salt('bf')), 'sirilak42@example.com', 6, 1, '0839175246', NOW()),
('พัชรี', 'ทวีสุข', crypt('12345', gen_salt('bf')), 'patcharee43@example.com', 8, 4, '0946132578', NOW()),
('ก้องภพ', 'บุญชู', crypt('12345', gen_salt('bf')), 'kongphop44@example.com', 5, 1, '0867912345', NOW()),
('วชิรวิทย์', 'บุญเหลือ', crypt('12345', gen_salt('bf')), 'watcharawit45@example.com', 7, 2, '0824613759', NOW()),
('อัจฉรา', 'เพ็งดี', crypt('12345', gen_salt('bf')), 'atchara46@example.com', 9, 1, '0917425368', NOW()),
('นฤมล', 'ใจเพชร', crypt('12345', gen_salt('bf')), 'narumon47@example.com', 10, 3, '0896135247', NOW()),
('ศุภชัย', 'สุขศรี', crypt('12345', gen_salt('bf')), 'supphachai48@example.com', 1, 4, '0958264137', NOW()),
('เกศรินทร์', 'สุขดี', crypt('12345', gen_salt('bf')), 'kesarin49@example.com', 3, 2, '0846512973', NOW()),
('ธีรพงษ์', 'มีทรัพย์', crypt('12345', gen_salt('bf')), 'theeraphong50@example.com', 2, 1, '0925478613', NOW());





INSERT INTO problem (createBy, title, description, categoryid, createat, statusid, departmentid, priorityid, location) VALUES
(12, 'โปรแกรมหยุดทำงานกะทันหัน', 'ซอฟต์แวร์หยุดตอบสนองขณะบันทึกข้อมูลลูกค้า', 1, NOW(), 1, 1, 3, 'ตึก A ชั้น 2'),
(45, 'เครื่องคอมพิวเตอร์ไม่เปิดติด', 'เครื่องไม่แสดงผลเมื่อกดปุ่มเปิด', 2, NOW(), 1, 1, 2, 'ตึก B ชั้น 1'),
(7, 'อินเทอร์เน็ตช้าผิดปกติ', 'ความเร็วเครือข่ายลดลงอย่างมากในช่วงเช้า', 3, NOW(), 1, 1, 4, 'ตึก A ชั้น 3'),
(28, 'ไฟในห้องประชุมไม่ติด', 'ไฟฟ้าดับเฉพาะห้องประชุมใหญ่', 4, NOW(), 1, 5, 3, 'ตึก D ชั้น 1'),
(39, 'น้ำรั่วบริเวณฝ้าเพดาน', 'เกิดคราบน้ำซึมในห้องฝ่ายการเงิน', 5, NOW(), 1, 3, 2, 'ตึก C ชั้น 1'),
(15, 'ประตูห้องเซิร์ฟเวอร์ล็อกไม่สนิท', 'ระบบล็อกประตูอัตโนมัติทำงานผิดพลาด', 6, NOW(), 1, 1, 3, 'ตึก A ชั้น 1'),
(23, 'เครื่องปรับอากาศไม่เย็น', 'อุณหภูมิไม่ลดลงหลังจากเปิดใช้งาน 30 นาที', 7, NOW(), 1, 4, 2, 'ตึก E ชั้น 1'),
(2, 'ระบบบัญชีไม่สามารถเข้าสู่ระบบได้', 'เกิดข้อผิดพลาด “Invalid token” ระหว่างเข้าสู่ระบบ', 1, NOW(), 1, 3, 4, 'ตึก B ชั้น 2'),
(48, 'เมาส์ไม่ทำงาน', 'เมาส์ USB ไม่ตอบสนองต่อการเคลื่อนไหว', 2, NOW(), 1, 1, 3, 'ตึก A ชั้น 1'),
(11, 'Wi-Fi หลุดบ่อย', 'อุปกรณ์บางเครื่องเชื่อมต่อไม่ต่อเนื่อง', 3, NOW(), 1, 5, 2, 'ตึก C ชั้น 2'),
(19, 'เบรกเกอร์ชั้น 2 ตัดเอง', 'เกิดการตัดไฟอัตโนมัติระหว่างทำงาน', 4, NOW(), 1, 5, 1, 'ตึก D ชั้น 2'),
(36, 'พื้นห้องแตก', 'พื้นปูนแตกเป็นรอยยาวในห้องเก็บของ', 5, NOW(), 1, 4, 3, 'ตึก B ชั้น 3'),
(22, 'กล้องวงจรปิดไม่บันทึก', 'ระบบ DVR ไม่สามารถบันทึกภาพได้', 6, NOW(), 1, 5, 2, 'ตึก A ชั้น 1'),
(3, 'โทรทัศน์ไม่แสดงภาพ', 'หน้าจอขึ้นข้อความ “No Signal”', 7, NOW(), 1, 2, 3, 'ตึก E ชั้น 1'),
(31, 'แอปภายในค้างระหว่างใช้งาน', 'ระบบจัดการเอกสารค้างเมื่อเปิดไฟล์ PDF', 1, NOW(), 1, 1, 2, 'ตึก A ชั้น 3'),
(46, 'คีย์บอร์ดพิมพ์ไม่ได้', 'บางปุ่มไม่ตอบสนอง', 2, NOW(), 1, 1, 4, 'ตึก B ชั้น 2'),
(10, 'สายแลนหลุดจากพอร์ต', 'ไม่มีสัญญาณอินเทอร์เน็ตที่โต๊ะทำงาน', 3, NOW(), 1, 5, 2, 'ตึก A ชั้น 2'),
(33, 'ไฟสำรองไม่ทำงาน', 'UPS ไม่จ่ายไฟเมื่อไฟดับ', 4, NOW(), 1, 1, 1, 'ตึก D ชั้น 1'),
(41, 'รอยรั่วบนหลังคา', 'น้ำหยดจากหลังคาเมื่อฝนตก', 5, NOW(), 1, 4, 3, 'ตึก C ชั้น 3'),
(8, 'การ์ดเข้าประตูใช้ไม่ได้', 'สแกนแล้วไม่ตอบสนอง', 6, NOW(), 1, 2, 2, 'ตึก A ชั้น 1'),
(5, 'พัดลมเสีย', 'หมุนช้าและมีเสียงดังผิดปกติ', 7, NOW(), 1, 4, 4, 'ตึก B ชั้น 1'),
(16, 'ระบบอีเมลไม่ส่งออก', 'อีเมลติดใน Outbox ของพนักงานหลายคน', 1, NOW(), 1, 2, 3, 'ตึก A ชั้น 1'),
(50, 'จอภาพไม่ติด', 'ไฟ power กระพริบตลอดเวลา', 2, NOW(), 1, 1, 2, 'ตึก C ชั้น 2'),
(26, 'VPN ต่อไม่ติด', 'ไม่สามารถเชื่อมต่อจากภายนอกสำนักงานได้', 3, NOW(), 1, 1, 3, 'ตึก D ชั้น 1'),
(18, 'ปลั๊กไฟหลวม', 'เสียบอุปกรณ์แล้วไม่แน่น', 4, NOW(), 1, 3, 2, 'ตึก A ชั้น 3'),
(29, 'ประตูห้องน้ำปิดไม่สนิท', 'กลอนประตูหลวม ต้องซ่อม', 5, NOW(), 1, 4, 5, 'ตึก B ชั้น 2'),
(9, 'ระบบเตือนภัยไม่ทำงาน', 'ไม่ได้ยินเสียงเตือนเมื่อกดทดสอบ', 6, NOW(), 1, 5, 1, 'ตึก C ชั้น 1'),
(13, 'เครื่องถ่ายเอกสารติดกระดาษ', 'กระดาษติดที่ถาดที่ 2 ทุกครั้งที่สั่งพิมพ์', 2, NOW(), 1, 2, 3, 'ตึก D ชั้น 2'),
(37, 'แอร์น้ำหยด', 'น้ำหยดจากตัวเครื่องลงพื้น', 7, NOW(), 1, 3, 3, 'ตึก A ชั้น 1'),
(24, 'ระบบจัดเก็บไฟล์ไม่ตอบสนอง', 'เข้าหน้าเว็บจัดเก็บไฟล์ไม่ได้', 1, NOW(), 1, 1, 4, 'ตึก A ชั้น 2'),
(44, 'เสียงพัดลม PSU ดัง', 'พัดลมเครื่อง Server ส่งเสียงดังผิดปกติ', 2, NOW(), 1, 1, 3, 'ตึก B ชั้น 3'),
(14, 'Ping ไม่ถึงเกตเวย์', 'ตรวจพบแพ็กเก็ตสูญหายเป็นช่วง ๆ', 3, NOW(), 1, 5, 4, 'ตึก D ชั้น 1'),
(6, 'ไฟฟ้าช็อตที่ปลั๊ก', 'เกิดประกายไฟเมื่อเสียบปลั๊ก', 4, NOW(), 1, 5, 1, 'ตึก E ชั้น 1'),
(30, 'กระเบื้องแตก', 'กระเบื้องพื้นหลุดบริเวณทางเดิน', 5, NOW(), 1, 4, 3, 'ตึก C ชั้น 2'),
(32, 'ระบบกล้องบันทึกภาพเบลอ', 'ภาพไม่ชัดแม้ตั้งค่าโฟกัสแล้ว', 6, NOW(), 1, 1, 3, 'ตึก D ชั้น 2'),
(17, 'เครื่องดูดฝุ่นไม่ดูด', 'ไม่มีแรงดูดแม้เปิดทำงาน', 7, NOW(), 1, 5, 4, 'ตึก A ชั้น 3'),
(1, 'ระบบเวิร์กโฟลว์ค้าง', 'โหลดหน้าข้อมูลนานผิดปกติ', 1, NOW(), 1, 1, 2, 'ตึก B ชั้น 2'),
(35, 'คอมพิวเตอร์ดับเอง', 'เครื่องดับโดยไม่มีสาเหตุ', 2, NOW(), 1, 1, 1, 'ตึก A ชั้น 1'),
(25, 'อินเทอร์เน็ตในห้องประชุมใช้ไม่ได้', 'Wi-Fi ไม่สามารถเชื่อมต่อได้', 3, NOW(), 1, 2, 3, 'ตึก B ชั้น 3'),
(20, 'หลอดไฟกระพริบ', 'แสงกระพริบตลอดเวลาในห้องทำงาน', 4, NOW(), 1, 4, 4, 'ตึก D ชั้น 1'),
(42, 'ท่อน้ำตัน', 'น้ำไม่ไหลลงในอ่างล้างมือ', 5, NOW(), 1, 3, 2, 'ตึก E ชั้น 1'),
(4, 'ระบบสแกนนิ้วมือไม่อ่าน', 'เครื่องสแกนไม่ตอบสนองต่อการแตะนิ้ว', 6, NOW(), 1, 2, 3, 'ตึก A ชั้น 2'),
(47, 'เครื่องทำกาแฟไม่ทำงาน', 'ไม่ร้อนและไม่จ่ายน้ำ', 7, NOW(), 1, 5, 3, 'ตึก C ชั้น 3'),
(21, 'โปรแกรมรายงานผลล้มเหลว', 'ไม่สามารถสร้างรายงานยอดขายได้', 1, NOW(), 1, 4, 3, 'ตึก A ชั้น 1'),
(43, 'ปริ้นเตอร์ขึ้น Error 0xE8', 'ไม่สามารถสั่งพิมพ์ได้เลย', 2, NOW(), 1, 3, 2, 'ตึก B ชั้น 1'),
(34, 'สายไฟไหม้', 'เกิดกลิ่นไหม้จากเบรกเกอร์ย่อย', 4, NOW(), 1, 1, 1, 'ตึก E ชั้น 1'),
(49, 'ประตูห้องเก็บของปิดไม่ลง', 'บานพับหลุด', 5, NOW(), 1, 4, 2, 'ตึก D ชั้น 1'),
(40, 'เครื่องสแกนบัตรเสีย', 'ไม่สามารถสแกนบัตรพนักงานได้', 6, NOW(), 1, 5, 4, 'ตึก B ชั้น 2'),
(27, 'เครื่องดูดอากาศไม่ทำงาน', 'ไม่มีเสียงและลมออก', 7, NOW(), 1, 3, 2, 'ตึก A ชั้น 3'),
(38, 'เว็บแอปไม่โหลดข้อมูล', 'หน้า Dashboard ขึ้น error 500', 1, NOW(), 1, 1, 3, 'ตึก C ชั้น 1'),
(9, 'คีย์บอร์ดเสียหายจากน้ำ', 'บางปุ่มไม่สามารถกดได้', 2, NOW(), 1, 2, 3, 'ตึก A ชั้น 1'),
(19, 'สายแลนขาด', 'ไม่พบสัญญาณ network', 3, NOW(), 1, 1, 2, 'ตึก D ชั้น 2'),
(5, 'ไฟฟ้าช็อตโต๊ะทำงาน', 'เกิดไฟช็อตเมื่อเสียบพัดลม', 4, NOW(), 1, 5, 1, 'ตึก A ชั้น 3'),
(12, 'น้ำซึมผนังห้อง', 'ผนังชั้นล่างมีคราบน้ำชื้น', 5, NOW(), 1, 4, 4, 'ตึก B ชั้น 1'),
(48, 'ระบบกันขโมยทำงานผิดเวลา', 'แจ้งเตือนตอนกลางวันโดยไม่มีเหตุผล', 6, NOW(), 1, 2, 3, 'ตึก C ชั้น 2'),
(16, 'ไมโครเวฟไม่ร้อน', 'เครื่องเปิดติดแต่ไม่อุ่นอาหาร', 7, NOW(), 1, 5, 2, 'ตึก E ชั้น 1'),
(24, 'แอปเวอร์ชันใหม่เข้าไม่ได้', 'หลังอัปเดตแล้วเกิด error “Cannot load data”', 1, NOW(), 1, 1, 3, 'ตึก A ชั้น 1'),
(3, 'ฮาร์ดดิสก์มีเสียงดัง', 'คาดว่าใกล้เสีย', 2, NOW(), 1, 1, 2, 'ตึก B ชั้น 2'),
(25, 'สัญญาณอินเทอร์เน็ตหลุดทุก 5 นาที', 'ต้องรีสตาร์ท router ทุกครั้ง', 3, NOW(), 1, 5, 3, 'ตึก C ชั้น 3'),
(30, 'เบรกเกอร์ห้องน้ำตัด', 'หลังเปิดเครื่องทำน้ำอุ่น', 4, NOW(), 1, 4, 2, 'ตึก D ชั้น 1'),
(41, 'พื้นลื่น', 'เกิดคราบน้ำในทางเดินหลัก', 5, NOW(), 1, 5, 4, 'ตึก A ชั้น 3'),
(23, 'กล้องวงจรปิดไม่เชื่อมต่อ', 'แสดง Offline บนจอหลัก', 6, NOW(), 1, 1, 3, 'ตึก B ชั้น 1'),
(14, 'ตู้เย็นไม่เย็น', 'ของในช่องแช่ไม่เย็นเลย', 7, NOW(), 1, 3, 2, 'ตึก E ชั้น 1'),
(33, 'ซอฟต์แวร์บัญชีค้าง', 'ไม่สามารถบันทึกใบแจ้งหนี้ได้', 1, NOW(), 1, 3, 4, 'ตึก C ชั้น 2'),
(27, 'เครื่องสแกนบาร์โค้ดไม่อ่าน', 'อ่านแล้วไม่ขึ้นข้อมูล', 2, NOW(), 1, 2, 3, 'ตึก D ชั้น 2'),
(8, 'อินเทอร์เน็ตไม่เข้าบางเว็บไซต์', 'เข้าเว็บภายนอกไม่ได้บางโดเมน', 3, NOW(), 1, 1, 4, 'ตึก B ชั้น 3'),
(44, 'ไฟไม่สว่างเท่ากัน', 'หลอดบางดวงหรี่กว่าปกติ', 4, NOW(), 1, 5, 3, 'ตึก A ชั้น 1'),
(20, 'กระจกแตก', 'กระจกบานประตูแตกเป็นรอย', 5, NOW(), 1, 4, 3, 'ตึก D ชั้น 2'),
(11, 'สัญญาณเตือนไฟไหม้ดังโดยไม่มีเหตุ', 'เกิดเสียงเตือนเอง', 6, NOW(), 1, 5, 2, 'ตึก A ชั้น 1'),
(47, 'เครื่องทำน้ำอุ่นไม่ทำงาน', 'ไม่มีความร้อนขณะเปิดใช้งาน', 7, NOW(), 1, 4, 3, 'ตึก B ชั้น 2'),
(10, 'ระบบ HRMS ล่ม', 'พนักงานไม่สามารถบันทึกเวลาได้', 1, NOW(), 1, 2, 5, 'ตึก A ชั้น 2');
*/