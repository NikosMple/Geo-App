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
} from "firebase/firestore";
import { auth, db } from "./firebase";

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

// Login with Google using popup (more reliable)
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Configure provider
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    provider.addScope('profile');
    provider.addScope('email');
    
    console.log('🚀 Attempting Google popup authentication...');
    
    // Use popup method
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Google popup login successful:', user.email);
    
    // Handle user profile creation
    const existingProfile = await getUserProfile(user.uid);
    if (!existingProfile) {
      console.log('📝 Creating new user profile for Google user...');
      const docRef = await addDoc(collection(db, "users"), {
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
      console.log('✅ New user profile created with ID:', docRef.id);
    } else {
      console.log('✅ Existing user profile found:', existingProfile.displayName);
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error in loginWithGoogle:', error);
    
    // Provide more helpful error messages
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.');
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google sign-in. Please contact support.');
    }
    
    throw error;
  }
};

// Handle the redirect result - keeping for compatibility but not actively used
export const handleGoogleRedirectResult = async () => {
  try {
    console.log('🔍 Getting redirect result...');
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('🎉 Redirect result found for user:', result.user.email);
      return result.user;
    } else {
      console.log('ℹ️ No redirect result found');
    }
    return null;
  } catch (error) {
    console.error('❌ Error in handleGoogleRedirectResult:', error);
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
    console.log('🔍 Searching for user profile with UID:', uid);
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    console.log('📊 Query results:', querySnapshot.size, 'documents found');
    
    if (!querySnapshot.empty) {
      const profile = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      console.log('✅ User profile found:', profile.displayName, 'with doc ID:', profile.id);
      return profile;
    } else {
      console.log('❌ No user profile found for UID:', uid);
      return null;
    }
  } catch (error) {
    console.error('❌ Error in getUserProfile:', error);
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