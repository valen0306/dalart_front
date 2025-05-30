import Footer from "./components/BottomNavigationBar"
import Header from "./components/Header";
import styles from "./route.module.css"

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <div>hello</div>
      <Footer />
    </div>
  );
}

