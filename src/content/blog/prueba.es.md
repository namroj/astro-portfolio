---
title: "Prueba"
description: "Artículo de prueba migrado de Next.js."
author: "Jorman Espinoza"
image: {"url": "/images/posts/prueba/nextjs.jpeg", "alt": "Next.js"}
pubDate: "2024-03-13"
tags: ["MDX", "Next.js"]
draft: true
lang: "es"
slug: "prueba"
---


# Prueba

## Introducción
This is some **bold** and _italics_ text.

## Contenido
This is a list in markdown:

### Subcontenido A
- One
- Two

### Subcontenido B
- Three

```js
// console.log('Hello World!');

const handleExample = () => {};
```

```java
String greeting = "Hello World";

System.out.println(greeting);
```

```bash
npm run dev
```

```js
// Muestra del componente -> Pages > Blog > [slug] > page.tsx
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypePrettyCode from 'rehype-pretty-code'

import Breadcrumbs, { Breadcrumb } from '@/components/main/breadcrumbs/Breadcrumbs'

import darkItalic from '@/assets/themes/dark-italic-color-theme.json'
import { FaKeyboard } from 'react-icons/fa6'
import { LuFileTerminal } from 'react-icons/lu'
import styles from './Page.module.scss'

interface PostProps {
  params: {
    slug: string
  }
}

const getMarkDownFileData = async (slug: string) => {
  try {
    const file = await readFile(`./app/_posts/${slug}.mdx`, 'utf8')
    return matter(file)
  } catch (error) {
    // console.error(error)
    return notFound()
  }
}

export default async function PostPage({ params }: Readonly<PostProps>) {
  if (params?.slug === undefined) {
    return notFound()
  }

  const postComponents = {}

  const { content, data } = await getMarkDownFileData(params.slug)

  const breadcrumbs: Breadcrumb[] = [
    { label: 'Blog', href: '/blog', icon: <FaKeyboard /> },
    { label: data.title, icon: <LuFileTerminal /> }
  ]

  return (
    <article className={styles.article}>
      <Breadcrumbs items={breadcrumbs} />

      <div className={styles.markdown}>
        <MDXRemote
          className={styles.markdown}
          source={content}
          components={{ ...postComponents }}
          options={{
            mdxOptions: {
              useDynamicImport: true,
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [
                  // @ts-expect-error
                  rehypePrettyCode,
                  {
                    theme: {
                      dark: darkItalic,
                      light: 'min-light'
                    }
                  }
                ],
                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                // @ts-expect-error
                rehypeHighlight
              ]
            }
          }}
        />
      </div>
    </article>

    /*
      Este es un comentario,
      la idea es probar
      el largo del código
    */
  )
}

export async function generateMetadata({ params }: Readonly<PostProps>) {
  const { data } = await getMarkDownFileData(params.slug)

  return {
    title: `${data.title} | Jorman Espinoza`,
    description: data.summary
  }
}
```

[First link](#one) \
[Second link](#two) \
[Third link](#three)
