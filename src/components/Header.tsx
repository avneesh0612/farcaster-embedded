import styles from "@/styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import SignIn from "./SignIn";
import useLocalStorage from "@/hooks/use-local-storage-state";
import { useApp } from "@/Context/AppContext";
import { UserInfo } from "@/types";

export const Header: FC = () => {
  const { userData } = useApp();
  const [user, _1, removeItem] = useLocalStorage<UserInfo>("user");

  const handleSignout = () => {
    removeItem();
    window.location.reload();
  };

  return (
    <nav className={styles.header}>
      <div style={{ width: "200px" }}>
        <Link href="/">
          <Image
            src="/thirdweb.svg"
            alt="thirdweb"
            width={52}
            height={32}
            className={styles.logo}
          />
        </Link>
      </div>

      <div className={styles.headerRight}>
        {userData?.displayName ? (
          <div className={styles.user}>
            <Link
              href={`/profile/${userData?.fid}`}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {userData?.pfp.url && (
                <Image
                  src={userData?.pfp.url}
                  alt="User profile picture"
                  width={32}
                  height={32}
                  className={styles.pfp}
                />
              )}
              <p className={styles.userDisplayName}>{userData?.displayName}</p>
            </Link>

            <button onClick={handleSignout}>
              <span>Sign out</span>
            </button>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </nav>
  );
};
