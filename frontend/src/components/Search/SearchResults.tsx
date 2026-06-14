import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import styles from './SearchBar.module.css'

interface SearchResultsProps {
    books: Book[]
}

const SearchResults = ({ books }: SearchResultsProps) => {
    return (
        <div className={styles.parent}>
            {books.length > 0 && (
                <div className={styles.center}>
                    <ul className={styles.list_style}>
                        {books.map((book) => (
                            <li key={book.work_id} className={styles.search_result_item}>
                                <Link className={styles.textDecoration} to={`/book/${book.work_id}`}>
                                    <div className={styles.cover_wrapper}>
                                        <img className={styles.image} src={`${book.cover_url}M.jpg`} alt={book.title} />
                                        <div className={styles.cover_tape_right}></div>
                                    </div>
                                    <div className={styles.details}>
                                        <h3 className={styles.title}>{book.title}</h3>
                                        <p className={styles.author}>{book.author}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    )
}

export default SearchResults;