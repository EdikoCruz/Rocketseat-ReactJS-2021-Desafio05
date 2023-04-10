/**
 * src/pages/index.tsx: Utilizar o método getByType  para retornar todos os posts já com paginação. Por padrão, a paginação vem configurada como 20. Portanto se quiser testar sem ter que criar mais de 20 posts, altere a opção pageSize para o valor que deseja.
 */

import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  let { results, next_page } = postsPagination;
  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  function handleLoadPost() {
    fetch(nextPage)
      .then(r => r.json())
      .then(r => {
        setPosts([...posts, ...r.results])
        setNextPage(r.next_page)
      })
  }

  return (
    <div className={commonStyles.mainContainer}>
      {
        posts.map(post => (
          <div key={post.uid} className={styles.post}>
            <Link href={`/post/${post.uid}`}>
              <h2>{post.data.title}</h2>
            </Link>
            <p>{post.data.subtitle}</p>

            <div className={commonStyles.details}>
              <div>
                <FiCalendar />
                {post.first_publication_date}
              </div>

              <div>
                <FiUser />
                {post.data.author}
              </div>
            </div>
          </div>
        ))
      }

      {
        nextPage
          ? <a className={styles.nextPage} onClick={handleLoadPost}>Carregar mais posts</a>
          : <></>
      }
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('posts', { pageSize: 1 });

  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: response.results
      }
    },
  };
};
