import LockIcon from "@/components/ui/LockIcon";
import { css } from "~/styled-system/css";


export default function SignInText() {
  return (
    <div
      className={css({
        textAlign: "center",
        marginBottom: "32px",
      })}
    >
      <LockIcon />
      <h1
        className={css({
          fontSize: "30px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "8px",
        })}
      >
        Welcome Back
      </h1>
      <p
        className={css({
          color: "#6b7280",
        })}
      >
        Sign in to your Square account to continue
      </p>
    </div>
  );
}
