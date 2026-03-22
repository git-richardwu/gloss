import styles from './DeletedChapter.module.css'

interface DeletedChapterProps {
    onConfirmDelete: () => void;
    onCancel: () => void;
}

const DeletedChapter = ({ onConfirmDelete, onCancel }: DeletedChapterProps) => {
    return (
        <div className={styles.parentContainer}>
            <button type="button" onClick={onConfirmDelete}>confirm delete</button>
            <button type="button" onClick={onCancel}>cancel deletion</button>
        </div>
    ) 
}

export default DeletedChapter;