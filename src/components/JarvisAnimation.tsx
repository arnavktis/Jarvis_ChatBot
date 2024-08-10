import React from 'react';
import styles from './JarvisAnimation.module.css';

const JarvisAnimation: React.FC = () => {
  return (
    <div className={styles.main}>
      <div className={styles.myCircle}>
        <div className={styles.mainCircle}>
          <div className={styles.circle}></div>
          <div className={styles.circle1}></div>
          <div className={styles.mainContent}>
            <h2 className={styles.mainText}>J</h2>
            <ul className={styles.bars}>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisAnimation;