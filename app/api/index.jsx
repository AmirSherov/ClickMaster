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
  limit,
  getDoc
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
    vibration: false,
    click : 1
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
      console.error("Необходимо указать email или id для поиска пользователя.");
      return null;
    }

    let userQuery;
    if (email) {
      userQuery = query(usersCollection, where("email", "==", email));
    } else if (id) {
      userQuery = query(usersCollection, where("id", "==", parseInt(id)));
    }

    const querySnapshot = await getDocs(userQuery);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('Получены данные пользователя:', userData);
      return {
        ...userData,
        userBoosters: userData.userBoosters || [],
        equippedBoosters: userData.equippedBoosters || []
      };
    } else {
      console.error("Пользователь не найден!");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    return null;
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

export async function incrementCount(id, newCount) {
  try {
    const numericId = Number(id);
    const userQuery = query(usersCollection, where("id", "==", numericId));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "users", userDoc.id), {
        count: newCount
      });

      console.log(`Счётчик для пользователя ${numericId} обновлён: ${newCount}`);
      return newCount;
    } else {
      console.error("Пользователь не найден!");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при обновлении счётчика:", error);
    return null;
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

// Получить все доступные усилители в магазине
export async function getAvailableBoosters() {
  try {
    const boostsCollection = collection(db, "boosts");
    const querySnapshot = await getDocs(boostsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Ошибка при получении усилителей:", error);
    throw error;
  }
}

// Получить инвентарь усилителей пользователя
export async function getUserBoosters(userId) {
  try {
    // Получаем данные пользователя
    const userQuery = query(usersCollection, where("id", "==", parseInt(userId)));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log("Пользователь не найден");
      return {};
    }

    const userData = userSnapshot.docs[0].data();
    
    // Проверяем наличие поля userBoosters
    if (!userData.userBoosters || typeof userData.userBoosters !== 'object') {
      console.log("У пользователя нет бустов");
      return {};
    }

    return userData.userBoosters;
  } catch (error) {
    console.error("Ошибка при получении усилителей пользователя:", error);
    return {};
  }
}

// Купить усилитель
export async function buyBooster(userId, boosterId) {
  try {
    // Получаем данные пользователя
    const userQuery = query(usersCollection, where("id", "==", parseInt(userId)));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error("Пользователь не найден");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userRef = doc(db, "users", userDoc.id);

    // Проверяем, есть ли уже такой буст у пользователя
    const userBoosters = userData.userBoosters || {};
    if (boosterId in userBoosters) {
      throw new Error("Этот усилитель уже куплен");
    }

    // Получаем данные буста для проверки цены
    const boostRef = doc(db, "boosts", boosterId);
    const boostDoc = await getDoc(boostRef);
    
    if (!boostDoc.exists()) {
      throw new Error("Буст не найден");
    }

    const boostData = boostDoc.data();
    const boostPrice = boostData.basePrice || 0;

    // Проверяем, достаточно ли монет у пользователя
    const userCount = userData.count || 0;
    if (userCount < boostPrice) {
      throw new Error("Недостаточно монет для покупки");
    }

    // Обновляем данные пользователя: добавляем буст и уменьшаем количество монет
    await updateDoc(userRef, {
      userBoosters: {
        ...userBoosters,
        [boosterId]: false
      },
      count: userCount - boostPrice
    });

    return true;
  } catch (error) {
    console.error("Ошибка при покупке усилителя:", error);
    throw error;
  }
}

// Получить активные бусты пользователя с их эффектами
export async function getActiveBoosts(userId) {
  try {
    // Получаем данные пользователя
    const userQuery = query(usersCollection, where("id", "==", parseInt(userId)));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log("Пользователь не найден");
      return [];
    }

    const userData = userSnapshot.docs[0].data();
    const userBoosters = userData.userBoosters || {};

    // Получаем все бусты
    const boostsCollection = collection(db, "boosts");
    const boostsSnapshot = await getDocs(boostsCollection);
    const boostsData = {};
    boostsSnapshot.docs.forEach(doc => {
      boostsData[doc.id] = { id: doc.id, ...doc.data() };
    });

    // Фильтруем и получаем только активные бусты с их данными
    const activeBoosts = Object.entries(userBoosters)
      .filter(([_, isEquipped]) => isEquipped)
      .map(([boostId]) => boostsData[boostId])
      .filter(Boolean);

    console.log('Активные бусты:', activeBoosts);
    return activeBoosts;
  } catch (error) {
    console.error("Ошибка при получении активных бустов:", error);
    return [];
  }
}

// Рассчитать общий эффект от всех активных бустов
export function calculateTotalBoostEffect(activeBoosts) {
  let clickBoost = 0;
  let multiplier = 1;
  let criticalChance = 0;

  activeBoosts.forEach(boost => {
    if (boost.effect) {
      if (boost.effect.type === 'click') {
        clickBoost += boost.effect.value;
      } else if (boost.effect.type === 'multiply') {
        multiplier *= boost.effect.value;
      } else if (boost.effect.type === 'critical') {
        criticalChance += boost.effect.value;
      } else if (boost.effect.type === 'add') {
        // Для типа 'add' просто добавляем значение к базовому клику
        clickBoost += boost.effect.value;
      }
    }
  });

  // Сначала применяем бонусы к клику, потом умножаем на множитель
  const totalClickPower = (1 + clickBoost) * multiplier;

  return {
    clickBoost,
    multiplier,
    criticalChance,
    totalClickPower
  };
}

// Переключить экипировку буста с проверкой количества слотов
export async function toggleBoosterEquip(userId, boosterId) {
  try {
    const userQuery = query(usersCollection, where("id", "==", parseInt(userId)));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      throw new Error("Пользователь не найден");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();
    const userRef = doc(db, "users", userDoc.id);

    // Получаем текущие бусты
    const userBoosters = userData.userBoosters || {};
    
    if (!(boosterId in userBoosters)) {
      throw new Error("Буст не найден в инвентаре");
    }

    // Если пытаемся экипировать буст
    if (!userBoosters[boosterId]) {
      // Подсчитываем количество уже экипированных бустов
      const equippedCount = Object.values(userBoosters).filter(Boolean).length;
      
      if (equippedCount >= 3) {
        throw new Error("Нельзя экипировать больше 3 бустов одновременно");
      }
    }

    // Переключаем состояние экипировки
    await updateDoc(userRef, {
      userBoosters: {
        ...userBoosters,
        [boosterId]: !userBoosters[boosterId]
      }
    });

    return true;
  } catch (error) {
    console.error("Ошибка при переключении экипировки:", error);
    throw error;
  }
}

// Получить экипированные бусты пользователя
export async function getEquippedBoosters(userId) {
    try {
        // Получаем данные пользователя
        const userQuery = query(usersCollection, where("id", "==", parseInt(userId)));
        const userSnapshot = await getDocs(userQuery);
        
        if (userSnapshot.empty) {
            throw new Error("Пользователь не найден");
        }

        const userData = userSnapshot.docs[0].data();
        const userBoosters = userData.userBoosters || [];

        // Фильтруем только экипированные бусты
        const equippedBoosters = userBoosters.filter(booster => booster.equipped);

        // Получаем информацию о каждом экипированном бусте
        const boostsCollection = collection(db, "boosts");
        const boostersWithDetails = await Promise.all(
            equippedBoosters.map(async (userBooster) => {
                const boosterDoc = await getDoc(doc(boostsCollection, userBooster.boosterId));
                return {
                    ...userBooster,
                    ...boosterDoc.data()
                };
            })
        );

        return boostersWithDetails;
    } catch (error) {
        console.error("Ошибка при получении экипированных бустов:", error);
        throw error;
    }
}

export { db, analytics };
