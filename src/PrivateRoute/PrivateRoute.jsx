import { useAuth } from "@/Contexts/AuthProvider";
import { useRouter } from "next/navigation";

export default function PrivateRoute({ children }) {
  const { email } = useAuth();
  const router = useRouter();

  if (email.length !== 0) {
    return children;
  } else {
    console.log("You are not logged In");
    router.push("/login");
  }
}
