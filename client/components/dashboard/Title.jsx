// components/dashboard/DashboardTitle.js
import React from 'react';
import { FaTachometerAlt } from 'react-icons/fa';
import styles from '../../pages/styles/dashboard/Title.module.css';

const DashboardTitle = () => {
    return (
        <div className={styles.titleContainer}>
            <FaTachometerAlt className={styles.icon} />
            <h1 className={styles.title}>Dashboard</h1>
        </div>
    );
};

export default DashboardTitle;
