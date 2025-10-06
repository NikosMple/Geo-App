import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getRedirectResult,
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
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/services/FirebaseInit";

// ==================== AUTHENTICATION ====================


// ------------- Create new user with email and password --------------------------------//
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: displayName || null,
        createdAt: serverTimestamp(),
        totalGames: 0,
        totalScore: 0,
        level: 1,
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    throw error;
  }
};

// -------------------------- Login with Google -------------------------------//
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    provider.addScope("profile");
    provider.addScope("email");

    console.log("Attempting Google popup authentication...");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google popup login successful:", user.email);

    // Ensure single user doc keyed by UID
    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || "Google User",
        photoURL: user.photoURL || null,
        provider: "google",
        createdAt: serverTimestamp(),
        totalGames: 0,
        totalScore: 0,
        level: 1,
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error("Error in loginWithGoogle:", error);

    if (error.code === "auth/popup-blocked") {
      throw new Error(
        "Popup was blocked by your browser. Please allow popups for this site and try again."
      );
    } else if (error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled. Please try again.");
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error(
        "This domain is not authorized for Google sign-in. Please check your Firebase Console (Authorized domains)."
      );
    }

    throw error;
  }
};

// ----------------- Login user with email & password --------------------------//
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user document exists, create if not
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("User document missing, creating...");
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        createdAt: serverTimestamp(),
        totalGames: 0,
        totalScore: 0,
        level: 1,
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};  

// ----------------- Login Anonumously --------------------------//
export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);

    // Write a single anonymous user doc keyed by uid
    await setDoc(
      doc(db, "users", userCredential.user.uid),
      {
        uid: userCredential.user.uid,
        displayName: "Guest User",
        isAnonymous: true,
        createdAt: serverTimestamp(),
        totalGames: 0,
        totalScore: 0,
        level: 1,
      },
      { merge: true }
    );

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// ----------------- Logout --------------------------//
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// ----------------- ? --------------------------//

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ----------------- Send email for password reset --------------------------//
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// ==================== USER PROFILE ====================


// -----------------Take the userID --------------------------//
export const getUserProfile = async (uid) => {
  try {
    console.log("getUserProfile for UID:", uid);

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const profile = { id: userDoc.id, ...userDoc.data() };
      console.log("User profile found:", profile.displayName);
      return profile;
    } else {
      console.log("No user profile found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

// ----------------- Update doc --------------------------//
export const updateUserProfile = async (userDocId, data) => {
  try {
    const userRef = doc(db, "users", userDocId);
    await updateDoc(userRef, data);
  } catch (error) {
    throw error;
  }
};

// Remaining game/session/leaderboard helpers left unchanged (copy from your original file)

export const saveGameSession = async (gameData) => {
  try {
    const sessionData = {
      userId: auth.currentUser.uid,
      gameType: gameData.gameType,
      continent: gameData.continent,
      difficulty: gameData.difficulty,
      score: gameData.score,
      totalQuestions: gameData.totalQuestions,
      timeSpent: gameData.timeSpent,
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
