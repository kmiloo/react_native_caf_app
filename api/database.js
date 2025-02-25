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
  const [rows] = await pool.query("SELECT * FROM sesionlogin WHERE id = ?", [
    id,
  ]);
  //console.log(rows[0]);
  return rows[0];
}

//consulta para iniciar sesion
export async function getUserByEmail(correo) {
  const query = "SELECT * FROM sesionlogin WHERE correo = ?";
  const [rows] = await pool.query(query, [correo]);
  return rows[0]; // Devuelve el primer usuario encontrado (o null si no existe)
}

//ultimo inicio de sesion
export async function updateLastLogin(userId) {
  const query = "UPDATE sesionlogin SET ultimo_login = NOW() WHERE id = ?";
  await pool.query(query, [userId]);
}

//agregar token a usuario
export async function updateUserToken(userId, token) {
  const query = "UPDATE sesionlogin SET token_notification = ? WHERE id = ?";
  await pool.query(query, [token, userId]);
}

//registro de usuario
export async function registerUser(
  nombre,
  apellido,
  rut,
  correo,
  contrasena_hash,
) {
  const query = `
    INSERT INTO sesionlogin (nombre, apellido, rut, correo, contrasena_hash)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.query(query, [
    nombre,
    apellido,
    rut,
    correo,
    contrasena_hash,
  ]);
  return result;
}

//obtener notificacion de usuario
export async function getUserNotifications(userId) {
  const query = "SELECT * FROM notificacion WHERE usuario_id = ?";
  const [rows] = await pool.query(query, [userId]);
  return rows;
}

export async function updateNotificationState(notificationId, state) {
  console.log("Actualizando notificación en bbbbbbb:", notificationId, state);
  const query = "UPDATE notificacion SET estado = ? WHERE id = ?";
  const [result] = await pool.query(query, [state, notificationId]); // Extrae el primer elemento del array
  console.log("Actualizando notificación en aaaaaaaa:", result);
  return result;
}

export async function getProfileFitnessByUserId(userId) {
  const query =
    "SELECT * FROM perfilfitness WHERE usuario_id = ? Order by creado_en DESC LIMIT 1";
  const [rows] = await pool.query(query, [userId]);
  console.log("Perfil fitness:", rows[0]);
  return rows[0];
}

export async function getLastFitnessEvaluation(profileId) {
  const query =
    "SELECT * FROM evaluacion WHERE perfil_fitness_id = ? ORDER BY creado_en DESC LIMIT 1";
  const [rows] = await pool.query(query, [profileId]);
  console.log("Última evaluación:", rows[0]);
  return rows[0];
}

export async function getRoutinesByProfileId(profileId) {
  const query = "SELECT * FROM rutina WHERE perfil_fitness_id = ?";
  const [rows] = await pool.query(query, [profileId]);
  console.log("Rutinasaaaaaaaaaaaaaaaaaaa:", rows);
  return rows;
}

export async function getActividadBloque(rut) {
  const query =
    "SELECT * FROM horasactividad h JOIN bloqueshorario b ON h.id_bloque = b.id WHERE rut_persona = ?;";
  const [rows] = await pool.query(query, [rut]);
  console.log("Actividad bloque:", rows);
  return rows;
}

/*
export async function getActividad(rut) {
  const query = "SELECT * FROM HorasActividad WHERE RutPersona = ?";
  const [rows] = await pool.query(query, [rut]);
  console.log("Actividad:", rows);
  return rows;
}*/

//getActividadBloque("21008896-2");

//getUserById(1);
