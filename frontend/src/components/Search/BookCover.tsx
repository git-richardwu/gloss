import styles from './SearchBar.module.css';
import { useState, useEffect } from 'react';
import type { Book } from '../../types'

interface BookCoverProps {
  url: string | undefined;
  title: string | undefined;
}

const BookCover = ({ url, title }: BookCoverProps) => {
    const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        setImageStatus('loading');
        const img = new Image();
        img.src = `${url}M.jpg`;

        img.onload = () => {
            setImageSrc(img.src);
            setImageStatus('loaded');
        };

        img.onerror = () => {
            setImageStatus('error');
        };

        return () => {
            img.onload = null;
            img.onerror = null;
        }
    }, [url]);

    if (imageStatus === 'error') {
        return (
            <div className={styles.bookCoverWrapper}>
            <div className={styles.noCover}>
                <span className={styles.noCoverText}>
                    No cover found :(
                </span>
            </div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.bookCoverWrapper}>
            {imageStatus === 'loading' && (
                <div className={styles.loadingOverlay}>
                    <svg viewBox="0 0 100 100" className={styles.loadingSvg}>
                        <path
                            className={styles.loadingPath}
                            d="M20,50 Q30,20 50,50 T80,50"
                            fill="none"
                            stroke="#39392D"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>
            )}
            <img className={`${styles.image} ${imageStatus === 'loaded' ? styles.loaded : styles.loading}`} src={imageSrc ?? undefined} alt={title} />
        </div>
        </div>
    )
}


export default BookCover;
