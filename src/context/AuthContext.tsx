import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";

export type DealerProfile = {
  uid: string;
  email: string;
  fullName: string;
  companyName: string;
  phone: string;
  taxNo?: string;
  city?: string;
  role: "dealer";
  approved: boolean;
  createdAt?: any;
};

type AuthContextValue = {
  user: User | null;
  profile: DealerProfile | null;
  loading: boolean;
  isDealer: boolean;
  isFirebaseReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
    phone: string;
    taxNo?: string;
    city?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<DealerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && db) {
        try {
          const snap = await getDoc(doc(db, "dealers", u.uid));
          if (snap.exists()) {
            setProfile(snap.data() as DealerProfile);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error("Profil yuklenemedi", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase yapilandirilmamis.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register: AuthContextValue["register"] = async (data) => {
    if (!auth || !db) throw new Error("Firebase yapilandirilmamis.");
    const cred = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );
    await updateProfile(cred.user, { displayName: data.fullName });
    const dealerDoc: DealerProfile = {
      uid: cred.user.uid,
      email: data.email,
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      taxNo: data.taxNo || "",
      city: data.city || "",
      role: "dealer",
      approved: true, // otomatik onay
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "dealers", cred.user.uid), dealerDoc);
    setProfile(dealerDoc);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
  };

  const isDealer = Boolean(user && profile?.role === "dealer" && profile.approved);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isDealer,
        isFirebaseReady: isFirebaseConfigured,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
