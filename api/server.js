import {
  getUserById,
  getUserByEmail,
  updateLastLogin,
  registerUser,
  getUserNotifications,
  updateNotificationState,
  getProfileFitnessByUserId,
  getLastFitnessEvaluation,
  getRoutinesByProfileId,
  updateUserToken,
  getActividadBloque,
} from "./database.js";
import { generateToken, verifyToken } from "./auth.js";
import express from "express";
import { Expo } from "expo-server-sdk";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const expo = new Expo();

const corsOptions = {
  origin: "http://192.168.1.14:8081",
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

// Middleware para autenticar el token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
}

// Ruta para enviar notificaciones
app.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: "Token no válido" });
  }

  const message = {
    to: token,
    sound: "default",
    title: title || "Título predeterminado",
    body: body || "Cuerpo predeterminado",
  };

  try {
    const chunks = expo.chunkPushNotifications([message]);
    const tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error enviando notificación:", error);
    res.status(500).json({ error: "Error al enviar la notificación" });
  }
});

//obtener usuario por id
app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  res.status(user ? 200 : 404).json(user || { error: "Usuario no encontrado" });
});
/*ruta protegida
app.get('/user/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  res.status(user ? 200 : 404).json(user || { error: 'Usuario no encontrado' });
});*/

// Ruta para iniciar sesión
app.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;
  console.log("elLLLLLLLLLLLLLLLLLLLL: ", req.body);

  try {
    // Obtén el usuario por su correo
    const user = await getUserByEmail(correo);
    console.log("elLLLLLLLLLLLLLLLLLLLL: ", user);

    if (user) {
      // Compara la contraseña proporcionada con el hash almacenado
      console.log("etest: ", user.contrasena_hash, contrasena);
      const isPasswordValid = await bcrypt.compare(
        contrasena,
        user.contrasena_hash,
      );
      console.log("el  : ", isPasswordValid);

      if (isPasswordValid) {
        // Actualiza la fecha y hora del último inicio de sesión
        console.log("elLLLLLLLLLLLLLLLLLLLL: ", user.id);
        await updateLastLogin(user.id);
        console.log("elLl usuario: ", user);

        // Genera un token JWT
        const token = jwt.sign(
          {
            id: user.id,
            correo: user.correo,
            rut: user.rut,
            nombre: user.nombre,
            apellido: user.apellido,
            creado_en: user.creado_en,
          },
          SECRET_KEY,
          { expiresIn: "1h" },
        );
        res.json({ success: true, token });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
});

// Ruta para registrar un usuario
app.post("/register", async (req, res) => {
  console.log("elLLLLLLLLLLLLLLLLLLLL: ", req.body);
  const { nombre, apellido, rut, correo, contrasena_hash } = req.body;

  try {
    // Hashea la contraseña antes de almacenarla
    const contrasena = await bcrypt.hash(contrasena_hash, 10); // 10 es el costo del hashing

    // Registra al usuario en la base de datos
    await registerUser(nombre, apellido, rut, correo, contrasena);

    res.json({ success: true, message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error("Error en el registro:", error);

    // Maneja errores de correo duplicado
    if (error.code === "ER_DUP_ENTRY") {
      res
        .status(400)
        .json({ success: false, message: "El correo ya está registrado" });
    } else {
      res.status(500).json({ success: false, message: "Error en el servidor" });
    }
  }
});

app.get("/notifications", async (req, res) => {
  const { userId } = req.query; // Tomar el ID del usuario desde la URL
  console.log("Usuario solicitando notificaciones:", userId);

  if (!userId) {
    return res.status(400).json({ error: "El userId es requerido" });
  }

  try {
    // Función para obtener las notificaciones desde la base de datos
    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    res.status(500).json({ error: "Error obteniendo notificaciones" });
  }
});

app.put("/updatenotification/:id", async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  console.log("Actualizando notificación:", id, estado, req.body);

  try {
    // Actualiza el estado de la notificación en la base de datos
    const result = await updateNotificationState(id, estado);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.status(200).json({ message: "Notificación actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la notificación:", error);
    res.status(500).json({ error: "Error al actualizar la notificación" });
  }
});

app.put("/update-token", async (req, res) => {
  const { userId, token } = req.body;
  console.log("Actualizando token:", req.body);

  if (!userId || !token) {
    return res
      .status(400)
      .json({ error: "El userId y el token son requeridos" });
  }

  try {
    // Actualiza el token de notificación del usuario
    await updateUserToken(userId, token);
    res.json({ success: true, message: "Token actualizado correctamente" });
  } catch (error) {
    console.error("Error actualizando el token:", error);
    res.status(500).json({ error: "Error actualizando el token" });
  }
});

// Obtener el perfil fitness del usuario
app.get("/perfil-fitness", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "El userId es requerido" });
  }

  try {
    const perfil = await getProfileFitnessByUserId(userId);
    res.json(perfil || null);
  } catch (error) {
    console.error("Error obteniendo el perfil fitness:", error);
    res.status(500).json({ error: "Error obteniendo el perfil fitness" });
  }
});

// Obtener la última evaluación del perfil fitness
app.get("/ultima-evaluacion", async (req, res) => {
  const { perfilFitnessId } = req.query;

  if (!perfilFitnessId) {
    return res.status(400).json({ error: "El perfilFitnessId es requerido" });
  }

  try {
    const evaluacion = await getLastFitnessEvaluation(perfilFitnessId);
    res.json(evaluacion || null);
  } catch (error) {
    console.error("Error obteniendo la evaluación:", error);
    res.status(500).json({ error: "Error obteniendo la evaluación" });
  }
});

app.get("/rutinas", async (req, res) => {
  const { perfilFitnessId } = req.query;

  if (!perfilFitnessId) {
    return res.status(400).json({ error: "El perfilFitnessId es requerido" });
  }

  try {
    const rutinas = await getRoutinesByProfileId(perfilFitnessId);
    console.log("Rutinas:", rutinas);
    res.json(rutinas);
  } catch (error) {
    console.error("Error obteniendo rutinas:", error);
    res.status(500).json({ error: "Error obteniendo rutinas" });
  }
});

app.get("/actividadbloque", async (req, res) => {
  const { rut } = req.query;

  if (!rut) {
    return res.status(400).json({ error: "El rut es requerido" });
  }

  try {
    const actividad = await getActividadBloque(rut);
    console.log("Actividad bloque:", actividad);
    res.json(actividad);
  } catch (error) {
    console.error("Error obteniendo actividad:", error);
    res.status(500).json({ error: "Error obteniendo actividad" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
