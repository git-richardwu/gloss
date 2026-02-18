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
                            <Link className={styles.textDecoration} to={`/book/${book.work_id}`}>
                            <li key={book.work_id} className={styles.search_result_item}>
                                <img className={styles.image} src={`${book.cover_url}` + 'M.jpg'} />
                                <div className={styles.details}>
                                    <h3 className={styles.title}>{book.title}</h3>
                                    <p className={styles.author}>{book.author}</p>
                                </div>
                            </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>

    )
}

export default SearchResults;