
// Импорт необходимых функций
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; // Опционально для Analytics

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzZO-Qae4DiGb9T6DuzbgwitbnPZ8v6h0",
  authDomain: "click-master-58baa.firebaseapp.com",
  projectId: "click-master-58baa",
  storageBucket: "click-master-58baa.firebasestorage.app",
  messagingSenderId: "941713088544",
  appId: "1:941713088544:web:e95b970d46b996f2a55c45",
  measurementId: "G-2GFZ562Y47",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Опциональная инициализация Analytics
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Коллекция пользователей
const usersCollection = collection(db, "users");

// Функция для добавления нового пользователя
export async function addUser(email, username, password, id) {
  // Конвертация password и id в числа
  const parsedPassword = parseInt(password, 10);
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedPassword)) {
    throw new Error("Пароль должен быть числом");
  }

  if (isNaN(parsedId)) {
    throw new Error("ID должен быть числом");
  }

  const newUser = {
    email,
    username,
    password: parsedPassword,
    id: parsedId,
    count: 0, // Счётчик или другой параметр
  };

  try {
    await addDoc(usersCollection, newUser);
    console.log("Пользователь успешно добавлен!");
  } catch (error) {
    console.error("Ошибка при добавлении пользователя:", error);
  }
}


// Функция для увеличения счётчика пользователя
export async function incrementCount(id, count) {
  try {
    const userQuery = query(usersCollection, where("id", "==", id));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const currentCount = userDoc.data().count || 0;

      await updateDoc(doc(db, "users", userDoc.id), {
        count: currentCount + count,
      });

      console.log(
        `Счётчик для пользователя ${id} обновлён: ${currentCount + count}`
      );
    } else {
      console.error("Пользователь не найден!");
    }
  } catch (error) {
    console.error("Ошибка при обновлении счётчика:", error);
  }
}
export async function getUserByUsernameAndPassword(username, password) {
  try {
    const usersCollection = collection(db, "users");
    const q = query(
      usersCollection,
      where("username", "==", username),
      where("password", "==", parseInt(password))
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Возвращаем данные первого найденного пользователя
    }
    return null; // Если пользователь не найден
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}
// Функция для получения всех пользователей
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(usersCollection);
    const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Все пользователи:", users);
    return users;
  } catch (error) {
    console.error("Ошибка при получении всех пользователей:", error);
    return [];
  }
}

// Функция для удаления пользователя
export async function deleteUser(id) {
  try {
    const userQuery = query(usersCollection, where("id", "==", id));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "users", userDoc.id));
      console.log(`Пользователь с ID ${id} успешно удалён!`);
    } else {
      console.error("Пользователь не найден!");
    }
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
  }
}

// Функция для проверки существования пользователя по email
export async function userExistsByEmail(email) {
  try {
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    return !querySnapshot.empty; // true, если пользователь с таким email существует
  } catch (error) {
    console.error("Ошибка при проверке email пользователя:", error);
    return false;
  }
}

// Функция для регистрации пользователя
export async function registerUser(email, username, password, id) {
  try {
    const exists = await userExistsByEmail(email);
    if (exists) {
      console.error("Пользователь с таким email уже существует!");
      return false;
    }
    await addUser(email, username, password, id);
    console.log("Пользователь успешно зарегистрирован!");
    return true;
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    return false;
  }
}

// Экспорт базы данных и Analytics (если нужно)
export { db, analytics };
