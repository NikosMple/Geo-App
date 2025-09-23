// Firebase service functions for authentication and database operations
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import {} from "firebase/auth";

// ==================== AUTHENTICATION ====================

// Register new user with email and password
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user profile in Firestore
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      totalGames: 0,
      totalScore: 0,
      level: 1,
    });

    return user;
  } catch (error) {
    throw error;
  }
};
// Add this function to your AUTHENTICATION section
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user profile already exists
    const existingProfile = await getUserProfile(user.uid);

    if (!existingProfile) {
      // Create user profile for new Google user
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Google User",
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        totalGames: 0,
        totalScore: 0,
        level: 1,
        provider: "google",
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Sign in user with email and password
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign in anonymously (guest user)
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);

    // Create anonymous user profile
    await addDoc(collection(db, "users"), {
      uid: userCredential.user.uid,
      displayName: "Guest User",
      isAnonymous: true,
      createdAt: serverTimestamp(),
      totalGames: 0,
      totalScore: 0,
      level: 1,
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Sign out user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// ==================== USER PROFILE ====================

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userDocId, data) => {
  try {
    const userRef = doc(db, "users", userDocId);
    await updateDoc(userRef, data);
  } catch (error) {
    throw error;
  }
};

// ==================== GAME SESSIONS ====================

// Save game session result
export const saveGameSession = async (gameData) => {
  try {
    const sessionData = {
      userId: auth.currentUser.uid,
      gameType: gameData.gameType, // 'capitals' or 'flags'
      continent: gameData.continent,
      difficulty: gameData.difficulty,
      score: gameData.score,
      totalQuestions: gameData.totalQuestions,
      timeSpent: gameData.timeSpent, // in seconds
      completedAt: serverTimestamp(),
      correctAnswers: gameData.correctAnswers || [],
      wrongAnswers: gameData.wrongAnswers || [],
    };

    const docRef = await addDoc(collection(db, "gameSessions"), sessionData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

// Get user's game history
export const getUserGameHistory = async (uid, limitCount = 10) => {
  try {
    const q = query(
      collection(db, "gameSessions"),
      where("userId", "==", uid),
      orderBy("completedAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// ==================== LEADERBOARDS ====================

// Get top players (global leaderboard)
export const getGlobalLeaderboard = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("totalScore", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw error;
  }
};

// ==================== STATISTICS ====================

// Update user statistics after game
export const updateUserStats = async (userDocId, gameScore, gameType) => {
  try {
    const userRef = doc(db, "users", userDocId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentData = userDoc.data();
      const newTotalGames = (currentData.totalGames || 0) + 1;
      const newTotalScore = (currentData.totalScore || 0) + gameScore;

      await updateDoc(userRef, {
        totalGames: newTotalGames,
        totalScore: newTotalScore,
        lastPlayedAt: serverTimestamp(),
        lastGameType: gameType,
      });
    }
  } catch (error) {
    throw error;
  }
};
