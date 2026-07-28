import styles from './Chip.module.css';

const Chip = ({ label, selected, onClick }) => {
  return (
    <button 
      className={`${styles.chip} ${selected ? styles.selected : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Chip;
