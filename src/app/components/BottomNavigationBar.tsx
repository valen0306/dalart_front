import styles from "./BottomNavigationBar.module.css";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.first}>
        <Image
          className={styles.homeaikon}
          src="ホームアイコン.svg"
          alt="ホームアイコン画像"
          width={35}
          height={35}
        />

        <Image
          className={styles.camaeraaikon}
          src="投稿画面アイコン.svg"
          alt="投稿画面アイコン画像"
          width={35}
          height={35}
        />

        <Image
          className={styles.aikon}
          src="アイコン.svg"
          alt="アイコン画像"
          width={35}
          height={35}
        />
      </div>
    </footer>
  );
};

export default Footer;
