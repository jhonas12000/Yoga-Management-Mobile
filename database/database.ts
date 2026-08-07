import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("yoga.db");

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  preferredContact: string | null;
};

export async function initializeDatabase() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS instructors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      preferredContact TEXT
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      preferredContact TEXT
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classId TEXT NOT NULL,
      title TEXT NOT NULL,
      instructorId INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER NOT NULL,
      capacity INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      classId INTEGER NOT NULL,
      customerId INTEGER NOT NULL,
      attendanceDate TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT
    );
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER NOT NULL,
      saleDate TEXT NOT NULL,
      amount REAL NOT NULL,
      paymentMethod TEXT NOT NULL,
      notes TEXT
    );
  `);
}

export async function insertInstructor(
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string
) {
  return await db.runAsync(
    `INSERT INTO instructors
      (firstName, lastName, address, phone, email, preferredContact)
     VALUES (?, ?, ?, ?, ?, ?)`,
    firstName,
    lastName,
    address,
    phone,
    email,
    preferredContact
  );
}

export async function getInstructors(): Promise<Instructor[]> {
  return await db.getAllAsync(
    "SELECT * FROM instructors ORDER BY id DESC"
  );
}

export async function getInstructorNames() {
  return await db.getAllAsync(
    `SELECT
       id,
       firstName,
       lastName
     FROM instructors
     ORDER BY firstName`
  );
}

export async function getInstructorById(
  id: number
): Promise<Instructor | null> {
  return await db.getFirstAsync(
    "SELECT * FROM instructors WHERE id = ?",
    id
  );
}

export async function updateInstructor(
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string
) {
  return await db.runAsync(
    `UPDATE instructors
     SET firstName = ?,
         lastName = ?,
         address = ?,
         phone = ?,
         email = ?,
         preferredContact = ?
     WHERE id = ?`,
    firstName,
    lastName,
    address,
    phone,
    email,
    preferredContact,
    id
  );
}

export async function deleteInstructor(id: number) {
  return await db.runAsync(
    "DELETE FROM instructors WHERE id = ?",
    id
  );
}

// Insert Customer
export async function insertCustomer(
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string
) {
  return await db.runAsync(
    `INSERT INTO customers
      (firstName, lastName, address, phone, email, preferredContact)
     VALUES (?, ?, ?, ?, ?, ?)`,
    firstName,
    lastName,
    address,
    phone,
    email,
    preferredContact
  );
}

// Get Customers
export async function getCustomers() {
  return await db.getAllAsync(
    "SELECT * FROM customers ORDER BY id DESC"
  );
}

// Get Customer by ID
export async function getCustomerById(id: number) {
  return await db.getFirstAsync(
    "SELECT * FROM customers WHERE id = ?",
    id
  );
}

// Update Customer
export async function updateCustomer(
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string
) {
  return await db.runAsync(
    `UPDATE customers
     SET firstName = ?,
         lastName = ?,
         address = ?,
         phone = ?,
         email = ?,
         preferredContact = ?
     WHERE id = ?`,
    firstName,
    lastName,
    address,
    phone,
    email,
    preferredContact,
    id
  );
}

// Delete Customer
export async function deleteCustomer(id: number) {
  return await db.runAsync(
    "DELETE FROM customers WHERE id = ?",
    id
  );
}

export async function insertClass(
  classId: string,
  title: string,
  instructorId: number,
  date: string,
  time: string,
  duration: number,
  capacity: number
) {
  return await db.runAsync(
    `INSERT INTO classes
      (classId, title, instructorId, date, time, duration, capacity)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    classId,
    title,
    instructorId,
    date,
    time,
    duration,
    capacity
  );
}

export async function getClasses() {
  return await db.getAllAsync(
    "SELECT * FROM classes ORDER BY id DESC"
  );
}

export async function getClassById(id: number) {
  return await db.getFirstAsync(
    "SELECT * FROM classes WHERE id = ?",
    id
  );
}

export async function updateClass(
  id: number,
  classId: string,
  title: string,
  instructorId: number,
  date: string,
  time: string,
  duration: number,
  capacity: number
) {
  return await db.runAsync(
    `UPDATE classes
     SET classId = ?,
         title = ?,
         instructorId = ?,
         date = ?,
         time = ?,
         duration = ?,
         capacity = ?
     WHERE id = ?`,
    classId,
    title,
    instructorId,
    date,
    time,
    duration,
    capacity,
    id
  );
}

export async function deleteClass(id: number) {
  return await db.runAsync(
    "DELETE FROM classes WHERE id = ?",
    id
  );
}
export async function getCustomerNames() {
  return await db.getAllAsync(
    `SELECT
        id,
        firstName,
        lastName
     FROM customers
     ORDER BY firstName`
  );
}

export async function getClassNames() {
  return await db.getAllAsync(
    `SELECT
        id,
        title
     FROM classes
     ORDER BY title`
  );
}
export async function insertAttendance(
  classId: number,
  customerId: number,
  attendanceDate: string,
  status: string,
  notes: string
) {
  return await db.runAsync(
    `INSERT INTO attendance
      (classId, customerId, attendanceDate, status, notes)
     VALUES (?, ?, ?, ?, ?)`,
    classId,
    customerId,
    attendanceDate,
    status,
    notes
  );
}
export async function getAttendance() {
  return await db.getAllAsync(`
    SELECT
      attendance.id,
      attendance.classId,
      attendance.customerId,
      attendance.attendanceDate,
      attendance.status,
      attendance.notes,
      classes.title AS classTitle,
      customers.firstName AS customerFirstName,
      customers.lastName AS customerLastName
    FROM attendance
    LEFT JOIN classes
      ON attendance.classId = classes.id
    LEFT JOIN customers
      ON attendance.customerId = customers.id
    ORDER BY attendance.id DESC
  `);
}
export async function getAttendanceById(id: number) {
  return await db.getFirstAsync(
    "SELECT * FROM attendance WHERE id = ?",
    id
  );
}

export async function updateAttendance(
  id: number,
  classId: number,
  customerId: number,
  attendanceDate: string,
  status: string,
  notes: string
) {
  return await db.runAsync(
    `UPDATE attendance
     SET classId = ?,
         customerId = ?,
         attendanceDate = ?,
         status = ?,
         notes = ?
     WHERE id = ?`,
    classId,
    customerId,
    attendanceDate,
    status,
    notes,
    id
  );
}

export async function deleteAttendance(id: number) {
  return await db.runAsync(
    "DELETE FROM attendance WHERE id = ?",
    id
  );
}
export async function insertSale(
  customerId: number,
  saleDate: string,
  amount: number,
  paymentMethod: string,
  notes: string
) {
  return await db.runAsync(
    `INSERT INTO sales
      (customerId, saleDate, amount, paymentMethod, notes)
     VALUES (?, ?, ?, ?, ?)`,
    customerId,
    saleDate,
    amount,
    paymentMethod,
    notes
  );
}

export async function getSales() {
  return await db.getAllAsync(`
    SELECT
      sales.id,
      sales.customerId,
      sales.saleDate,
      sales.amount,
      sales.paymentMethod,
      sales.notes,
      customers.firstName AS customerFirstName,
      customers.lastName AS customerLastName
    FROM sales
    LEFT JOIN customers
      ON sales.customerId = customers.id
    ORDER BY sales.id DESC
  `);
}

export async function getSaleById(id: number) {
  return await db.getFirstAsync(
    "SELECT * FROM sales WHERE id = ?",
    id
  );
}

export async function updateSale(
  id: number,
  customerId: number,
  saleDate: string,
  amount: number,
  paymentMethod: string,
  notes: string
) {
  return await db.runAsync(
    `UPDATE sales
     SET customerId = ?,
         saleDate = ?,
         amount = ?,
         paymentMethod = ?,
         notes = ?
     WHERE id = ?`,
    customerId,
    saleDate,
    amount,
    paymentMethod,
    notes,
    id
  );
}

export async function deleteSale(id: number) {
  return await db.runAsync(
    "DELETE FROM sales WHERE id = ?",
    id
  );
}
export async function getCustomerCount() {
  const result: any = await db.getFirstAsync(
    "SELECT COUNT(*) AS total FROM customers"
  );

  return result?.total ?? 0;
}

export async function getClassCount() {
  const result: any = await db.getFirstAsync(
    "SELECT COUNT(*) AS total FROM classes"
  );

  return result?.total ?? 0;
}

export async function getAttendanceCount() {
  const result: any = await db.getFirstAsync(
    "SELECT COUNT(*) AS total FROM attendance"
  );

  return result?.total ?? 0;
}

export async function getSalesCount() {
  const result: any = await db.getFirstAsync(
    "SELECT COUNT(*) AS total FROM sales"
  );

  return result?.total ?? 0;
}

export async function getTotalSalesRevenue() {
  const result: any = await db.getFirstAsync(
    "SELECT SUM(amount) AS total FROM sales"
  );

  return result?.total ?? 0;
}
export default db;