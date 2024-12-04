'use client';
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCzZO-Qae4DiGb9T6DuzbgwitbnPZ8v6h0",
  authDomain: "click-master-58baa.firebaseapp.com",
  projectId: "click-master-58baa",
  storageBucket: "click-master-58baa.firebasestorage.app",
  messagingSenderId: "941713088544",
  appId: "1:941713088544:web:e95b970d46b996f2a55c45",
  measurementId: "G-2GFZ562Y47",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let analytics;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const usersCollection = collection(db, "users");

export async function addUser(email, username, password, id, currentDate) {
  const newUser = {
    email,
    username,
    password,
    id: parseInt(id, 10),
    count: 0,
    date: currentDate,
    vibration: false
  };

  try {
    await addDoc(usersCollection, newUser);
  } catch (error) {
    console.error("Ошибка при добавлении пользователя:", error);
  }
}
export async function updateUserFieldById(id, field, value) {
  try {
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection, where("id", "==", id));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDocRef = doc(db, "users", userDoc.id);

  
      await updateDoc(userDocRef, { [field]: value });
      console.log(`Поле "${field}" успешно обновлено для пользователя с ID: ${id}`);
    } else {
      console.error("Пользователь с таким ID не найден!");
    }
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
  }
}

export async function getUserDataByEmailOrId(email = null, id = null) {
  try {
    if (!email && !id) {
      throw new Error("Необходимо указать email или id для поиска пользователя.");
    }
    let userQuery;
    if (email) {
      userQuery = query(usersCollection, where("email", "==", email));
    } else if (id) {
      userQuery = query(usersCollection, where("id", "==", parseInt(id, 10)));
    }

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.error("Пользователь не найден!");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    throw error;
  }
}
export async function getTopUsers() {
  try {
    const q = query(
      usersCollection,
      orderBy("count", "desc"),
      limit(100)
    );

    const querySnapshot = await getDocs(q);
    const topUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      username: doc.data().username,
      count: doc.data().count,
      email: doc.data().email
    }));

    return topUsers;
  } catch (error) {
    console.error("Ошибка при получении топ 100 пользователей:", error);
    return [];
  }
}

export async function incrementCount(id, count) {
  try {
    const numericId = Number(id);
    const userQuery = query(usersCollection, where("id", "==", numericId));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const currentCount = userDoc.data().count || 0;
      await updateDoc(doc(db, "users", userDoc.id), {
        count: currentCount + count,
      });

      console.log(`Счётчик для пользователя ${numericId} обновлён: ${currentCount + count}`);
    } else {
      console.error("Пользователь не найден!");
    }
  } catch (error) {
    console.error("Ошибка при обновлении счётчика:", error);
  }
}

export async function getUserByUsernameAndPassword(email, password) {
  try {
    const q = query(
      usersCollection,
      where("email", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

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

export async function userExistsByEmailOrUsername(email, username) {
  try {
    const userQueryByEmail = query(usersCollection, where("email", "==", email));
    const userQueryByUsername = query(usersCollection, where("username", "==", username));
    const querySnapshotByEmail = await getDocs(userQueryByEmail);
    const querySnapshotByUsername = await getDocs(userQueryByUsername);
    return !querySnapshotByEmail.empty || !querySnapshotByUsername.empty;
  } catch (error) {
    console.log("Ошибка при проверке email/username пользователя:", error);
    return false;
  }
}

export async function registerUser(email, username, password, id, currentDate) {
  try {
    const exists = await userExistsByEmailOrUsername(email, username);
    if (exists) {
      console.log("Пользователь с таким email или именем пользователя уже существует!");
      return false;
    }
    await addUser(email, username, password, id, currentDate);
    console.log("Пользователь успешно зарегистрирован!");
    return true;
  } catch (error) {
    console.error("Ошибка при регистрации пользователя:", error);
    return false;
  }
}
export { db, analytics };
