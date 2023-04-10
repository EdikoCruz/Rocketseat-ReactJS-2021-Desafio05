/**
 * src/pages/posts/[slug.tsx]: Utilizar o método getByType para buscar todos os posts e o getByUID para buscar as informações do post específico.
 */

import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      alt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      {
        post
          ? <>
            <img
              className={styles.banner}
              src={post.data.banner.url}
              alt={post.data.banner.alt}
            />
            <article className={styles.container + " " + commonStyles.mainContainer}>
              <h1>{post.data.title}</h1>

              <div className={commonStyles.details}>
                <div>
                  <FiCalendar />
                  {
                    format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })
                  }
                </div>

                <div>
                  <FiUser />
                  {post.data.author}
                </div>

                <div>
                  <FiClock />
                  {
                    Math.ceil(post.data.content.reduce((length, item) => length + RichText.asText(item.body).length, 0) / 200)
                  } min
                </div>
              </div>

              {
                post.data.content.map(item => (
                  <section>
                    <h2>{item.heading}</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: RichText.asHtml(item.body) }}
                    />
                  </section>
                ))
              }
            </article>
          </>
          : <p>Carregando...</p>
      }
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getAllByType('posts');

  return {
    paths: posts.map((post) => ({ params: { slug: post.uid } })),
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps = async ({ params }: { params: { slug: string } }) => {
  const prismic = getPrismicClient({});
  const post = await prismic.getByUID("posts", params.slug);

  return {
    props: {
      post
    }
  }
};
