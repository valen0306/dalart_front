import Footer from "./components/BottomNavigationBar"
import Header from "./components/Header"
import styles from "./route.module.css"
import UserIcon from './components/user-icon'
import OutfitImage from "./components/FashionDisplay"

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <UserIcon size={80} />
      <OutfitImage ID="投稿画像" />
      {/* <OutfitImage ID="投稿画像" BackscreenMode={true} /> */}
      <Footer />
    </div>
  );
}

