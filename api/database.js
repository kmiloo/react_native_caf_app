import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
});

export async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM sesiones_login WHERE id = ?", [
    id,
  ]);
  //console.log(rows[0]);
  return rows[0];
}

//consulta para iniciar sesion
export async function getUserByEmail(correo) {
  const query = "SELECT * FROM sesiones_login WHERE correo = ?";
  const [rows] = await pool.query(query, [correo]);
  return rows[0]; // Devuelve el primer usuario encontrado (o null si no existe)
}

//ultimo inicio de sesion
export async function updateLastLogin(userId) {
  const query = "UPDATE sesiones_login SET ultimo_login = NOW() WHERE id = ?";
  await pool.query(query, [userId]);
}

//registro de usuario
export async function registerUser(nombre, apellido, correo, contrasena_hash) {
  const query = `
    INSERT INTO sesiones_login (nombre, apellido, correo, contrasena_hash)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    nombre,
    apellido,
    correo,
    contrasena_hash,
  ]);
  return result;
}

//obtener notificaciones de usuario
export async function getUserNotifications(userId) {
  const query = "SELECT * FROM notificaciones WHERE usuario_id = ?";
  const [rows] = await pool.query(query, [userId]);
  return rows;
}

export async function updateNotificationState(notificationId, state) {
  console.log("Actualizando notificación en bbbbbbb:", notificationId, state);
  const query = "UPDATE notificaciones SET estado = ? WHERE id = ?";
  const [result] = await pool.query(query, [state, notificationId]); // Extrae el primer elemento del array
  console.log("Actualizando notificación en aaaaaaaa:", result);
  return result;
}

export async function getProfileFitnessByUserId(userId) {
  const query =
    "SELECT * FROM perfiles_fitness WHERE usuario_id = ? Order by creado_en DESC LIMIT 1";
  const [rows] = await pool.query(query, [userId]);
  console.log("Perfil fitness:", rows[0]);
  return rows[0];
}

export async function getLastFitnessEvaluation(profileId) {
  const query =
    "SELECT * FROM evaluaciones WHERE perfil_fitness_id = ? ORDER BY creado_en DESC LIMIT 1";
  const [rows] = await pool.query(query, [profileId]);
  console.log("Última evaluación:", rows[0]);
  return rows[0];
}

export async function getRoutinesByProfileId(profileId) {
  const query = "SELECT * FROM rutinas WHERE perfil_fitness_id = ?";
  const [rows] = await pool.query(query, [profileId]);
  console.log("Rutinasaaaaaaaaaaaaaaaaaaa:", rows);
  return rows;
}

//getUserById(1);
