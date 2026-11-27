import styles from './Notification.module.scss';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

function Notification({
  message,
  type = 'success',
  onClose,
}: NotificationProps) {
  return (
    <div
      className={`${styles.notification} ${
        type === 'error' ? styles.error : styles.success
      }`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <span>{message}</span>
      <button className={styles.close} onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default Notification;