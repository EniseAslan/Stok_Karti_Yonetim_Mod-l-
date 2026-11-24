import styles from "./Notification.module.scss";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

function Notification({ message, onClose }: NotificationProps) {
  return (
    <div className={`${styles.notification} ${styles.success}`}>
      <span>{message}</span>
      <button className={styles.close} onClick={onClose}>
        x
      </button>
    </div>
  );
}

export default Notification;
