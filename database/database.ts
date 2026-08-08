import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("yoga.db");

/*
=========================================================
DATABASE QUEUE

Prevents multiple SQLite operations from preparing
statements at exactly the same time.
=========================================================
*/

let databaseQueue: Promise<void> = Promise.resolve();

function runDatabaseTask<T>(task: () => Promise<T>): Promise<T> {
  const result = databaseQueue.then(task, task);

  databaseQueue = result.then(
    () => undefined,
    () => undefined,
  );

  return result;
}

function validateId(id: number, name: string) {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error(`Invalid ${name} id`);
  }
}

/*
=========================================================
TYPES
=========================================================
*/

export type Instructor = {
  id: number;
  firstName: string;
  lastName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  preferredContact: string | null;
};

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  preferredContact: string | null;
};

/*
=========================================================
DATABASE INITIALIZATION
=========================================================
*/

export async function initializeDatabase() {
  return runDatabaseTask(async () => {
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
  });
}

/*
=========================================================
INSTRUCTORS
=========================================================
*/

export async function insertInstructor(
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string,
) {
  return runDatabaseTask(() =>
    db.runAsync(
      `INSERT INTO instructors
        (firstName, lastName, address, phone, email, preferredContact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      firstName ?? "",
      lastName ?? "",
      address ?? "",
      phone ?? "",
      email ?? "",
      preferredContact ?? "",
    ),
  );
}

export async function getInstructors(): Promise<Instructor[]> {
  return runDatabaseTask(() =>
    db.getAllAsync<Instructor>("SELECT * FROM instructors ORDER BY id DESC"),
  );
}

export async function getInstructorNames() {
  return runDatabaseTask(() =>
    db.getAllAsync(
      `SELECT
         id,
         firstName,
         lastName
       FROM instructors
       ORDER BY firstName`,
    ),
  );
}

export async function getInstructorById(
  id: number,
): Promise<Instructor | null> {
  validateId(id, "instructor");

  return runDatabaseTask(() =>
    db.getFirstAsync<Instructor>("SELECT * FROM instructors WHERE id = ?", id),
  );
}

export async function findDuplicateInstructorContact(
  phone: string,
  email: string,
  excludeId?: number,
): Promise<"phone" | "email" | null> {
  return runDatabaseTask(async () => {
    const duplicate = await db.getFirstAsync<{
      phone: string | null;
      email: string | null;
    }>(
      `SELECT phone, email
       FROM instructors
       WHERE (phone = ? OR lower(email) = lower(?))
         AND (? IS NULL OR id != ?)
       LIMIT 1`,
      phone,
      email,
      excludeId ?? null,
      excludeId ?? null,
    );

    if (!duplicate) {
      return null;
    }

    if (duplicate.phone === phone) {
      return "phone";
    }

    return "email";
  });
}

export async function updateInstructor(
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string,
) {
  validateId(id, "instructor");

  return runDatabaseTask(() =>
    db.runAsync(
      `UPDATE instructors
       SET firstName = ?,
           lastName = ?,
           address = ?,
           phone = ?,
           email = ?,
           preferredContact = ?
       WHERE id = ?`,
      firstName ?? "",
      lastName ?? "",
      address ?? "",
      phone ?? "",
      email ?? "",
      preferredContact ?? "",
      id,
    ),
  );
}

export async function deleteInstructor(id: number) {
  validateId(id, "instructor");

  return runDatabaseTask(() =>
    db.runAsync("DELETE FROM instructors WHERE id = ?", id),
  );
}

/*
=========================================================
CUSTOMERS
=========================================================
*/

export async function insertCustomer(
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string,
) {
  return runDatabaseTask(() =>
    db.runAsync(
      `INSERT INTO customers
        (firstName, lastName, address, phone, email, preferredContact)
       VALUES (?, ?, ?, ?, ?, ?)`,
      firstName ?? "",
      lastName ?? "",
      address ?? "",
      phone ?? "",
      email ?? "",
      preferredContact ?? "",
    ),
  );
}

export async function getCustomers(): Promise<Customer[]> {
  return runDatabaseTask(() =>
    db.getAllAsync<Customer>("SELECT * FROM customers ORDER BY id DESC"),
  );
}

export async function getCustomerNames() {
  return runDatabaseTask(() =>
    db.getAllAsync(
      `SELECT
         id,
         firstName,
         lastName
       FROM customers
       ORDER BY firstName`,
    ),
  );
}

export async function getCustomerById(id: number): Promise<Customer | null> {
  validateId(id, "customer");

  return runDatabaseTask(() =>
    db.getFirstAsync<Customer>("SELECT * FROM customers WHERE id = ?", id),
  );
}

export async function findDuplicateCustomerContact(
  phone: string,
  email: string,
  excludeId?: number,
): Promise<"phone" | "email" | null> {
  return runDatabaseTask(async () => {
    const duplicate = await db.getFirstAsync<{
      phone: string | null;
      email: string | null;
    }>(
      `SELECT phone, email
       FROM customers
       WHERE (phone = ? OR lower(email) = lower(?))
         AND (? IS NULL OR id != ?)
       LIMIT 1`,
      phone,
      email,
      excludeId ?? null,
      excludeId ?? null,
    );

    if (!duplicate) {
      return null;
    }

    if (duplicate.phone === phone) {
      return "phone";
    }

    return "email";
  });
}

export async function updateCustomer(
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  email: string,
  preferredContact: string,
) {
  validateId(id, "customer");

  return runDatabaseTask(() =>
    db.runAsync(
      `UPDATE customers
       SET firstName = ?,
           lastName = ?,
           address = ?,
           phone = ?,
           email = ?,
           preferredContact = ?
       WHERE id = ?`,
      firstName ?? "",
      lastName ?? "",
      address ?? "",
      phone ?? "",
      email ?? "",
      preferredContact ?? "",
      id,
    ),
  );
}

export async function deleteCustomer(id: number) {
  validateId(id, "customer");

  return runDatabaseTask(() =>
    db.runAsync("DELETE FROM customers WHERE id = ?", id),
  );
}

/*
=========================================================
CLASSES
=========================================================
*/

export async function insertClass(
  classId: string,
  title: string,
  instructorId: number,
  date: string,
  time: string,
  duration: number,
  capacity: number,
) {
  validateId(instructorId, "instructor");

  return runDatabaseTask(() =>
    db.runAsync(
      `INSERT INTO classes
        (classId, title, instructorId, date, time, duration, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      classId ?? "",
      title ?? "",
      instructorId,
      date ?? "",
      time ?? "",
      Number(duration) || 0,
      Number(capacity) || 0,
    ),
  );
}

export async function getClasses() {
  return runDatabaseTask(() =>
    db.getAllAsync("SELECT * FROM classes ORDER BY id DESC"),
  );
}

export async function getClassNames() {
  return runDatabaseTask(() =>
    db.getAllAsync(
      `SELECT
         id,
         title
       FROM classes
       ORDER BY title`,
    ),
  );
}

export async function getClassById(id: number) {
  validateId(id, "class");

  return runDatabaseTask(() =>
    db.getFirstAsync("SELECT * FROM classes WHERE id = ?", id),
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
  capacity: number,
) {
  validateId(id, "class");
  validateId(instructorId, "instructor");

  return runDatabaseTask(() =>
    db.runAsync(
      `UPDATE classes
       SET classId = ?,
           title = ?,
           instructorId = ?,
           date = ?,
           time = ?,
           duration = ?,
           capacity = ?
       WHERE id = ?`,
      classId ?? "",
      title ?? "",
      instructorId,
      date ?? "",
      time ?? "",
      Number(duration) || 0,
      Number(capacity) || 0,
      id,
    ),
  );
}

export async function deleteClass(id: number) {
  validateId(id, "class");

  return runDatabaseTask(() =>
    db.runAsync("DELETE FROM classes WHERE id = ?", id),
  );
}

/*
=========================================================
ATTENDANCE
=========================================================
*/

export async function insertAttendance(
  classId: number,
  customerId: number,
  attendanceDate: string,
  status: string,
  notes: string,
) {
  validateId(classId, "class");
  validateId(customerId, "customer");

  return runDatabaseTask(() =>
    db.runAsync(
      `INSERT INTO attendance
        (classId, customerId, attendanceDate, status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      classId,
      customerId,
      attendanceDate ?? "",
      status ?? "Present",
      notes ?? "",
    ),
  );
}

export async function getAttendance() {
  return runDatabaseTask(() =>
    db.getAllAsync(`
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
    `),
  );
}

export async function getAttendanceById(id: number) {
  validateId(id, "attendance");

  return runDatabaseTask(() =>
    db.getFirstAsync("SELECT * FROM attendance WHERE id = ?", id),
  );
}

export async function updateAttendance(
  id: number,
  classId: number,
  customerId: number,
  attendanceDate: string,
  status: string,
  notes: string,
) {
  validateId(id, "attendance");
  validateId(classId, "class");
  validateId(customerId, "customer");

  return runDatabaseTask(() =>
    db.runAsync(
      `UPDATE attendance
       SET classId = ?,
           customerId = ?,
           attendanceDate = ?,
           status = ?,
           notes = ?
       WHERE id = ?`,
      classId,
      customerId,
      attendanceDate ?? "",
      status ?? "Present",
      notes ?? "",
      id,
    ),
  );
}

export async function deleteAttendance(id: number) {
  validateId(id, "attendance");

  return runDatabaseTask(() =>
    db.runAsync("DELETE FROM attendance WHERE id = ?", id),
  );
}

/*
=========================================================
SALES
=========================================================
*/

export async function insertSale(
  customerId: number,
  saleDate: string,
  amount: number,
  paymentMethod: string,
  notes: string,
) {
  validateId(customerId, "customer");

  return runDatabaseTask(() =>
    db.runAsync(
      `INSERT INTO sales
        (customerId, saleDate, amount, paymentMethod, notes)
       VALUES (?, ?, ?, ?, ?)`,
      customerId,
      saleDate ?? "",
      Number(amount) || 0,
      paymentMethod ?? "",
      notes ?? "",
    ),
  );
}

export async function getSales() {
  return runDatabaseTask(() =>
    db.getAllAsync(`
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
    `),
  );
}

export async function getSaleById(id: number) {
  validateId(id, "sale");

  return runDatabaseTask(() =>
    db.getFirstAsync("SELECT * FROM sales WHERE id = ?", id),
  );
}

export async function updateSale(
  id: number,
  customerId: number,
  saleDate: string,
  amount: number,
  paymentMethod: string,
  notes: string,
) {
  validateId(id, "sale");
  validateId(customerId, "customer");

  return runDatabaseTask(() =>
    db.runAsync(
      `UPDATE sales
       SET customerId = ?,
           saleDate = ?,
           amount = ?,
           paymentMethod = ?,
           notes = ?
       WHERE id = ?`,
      customerId,
      saleDate ?? "",
      Number(amount) || 0,
      paymentMethod ?? "",
      notes ?? "",
      id,
    ),
  );
}

export async function deleteSale(id: number) {
  validateId(id, "sale");

  return runDatabaseTask(() =>
    db.runAsync("DELETE FROM sales WHERE id = ?", id),
  );
}

/*
=========================================================
REPORTS
=========================================================
*/

export async function getCustomerCount() {
  return runDatabaseTask(async () => {
    const result: any = await db.getFirstAsync(
      "SELECT COUNT(*) AS total FROM customers",
    );

    return Number(result?.total ?? 0);
  });
}

export async function getClassCount() {
  return runDatabaseTask(async () => {
    const result: any = await db.getFirstAsync(
      "SELECT COUNT(*) AS total FROM classes",
    );

    return Number(result?.total ?? 0);
  });
}

export async function getAttendanceCount() {
  return runDatabaseTask(async () => {
    const result: any = await db.getFirstAsync(
      "SELECT COUNT(*) AS total FROM attendance",
    );

    return Number(result?.total ?? 0);
  });
}

export async function getSalesCount() {
  return runDatabaseTask(async () => {
    const result: any = await db.getFirstAsync(
      "SELECT COUNT(*) AS total FROM sales",
    );

    return Number(result?.total ?? 0);
  });
}

export async function getTotalSalesRevenue() {
  return runDatabaseTask(async () => {
    const result: any = await db.getFirstAsync(
      "SELECT SUM(amount) AS total FROM sales",
    );

    return Number(result?.total ?? 0);
  });
}

export default db;
