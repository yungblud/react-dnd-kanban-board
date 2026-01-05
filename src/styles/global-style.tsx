import { Global, css } from '@emotion/react'

export default function GlobalStyle() {
  return (
    <Global
      styles={css`
        /* Box sizing */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* Remove default margin */
        body,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        figure,
        blockquote,
        dl,
        dd {
          margin: 0;
        }

        /* Set core body defaults */
        body {
          min-height: 100vh;
          text-rendering: optimizeSpeed;
          line-height: 1.5;
        }

        /* Remove list styles */
        ul,
        ol {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        /* Anchor defaults */
        a {
          text-decoration: none;
          color: inherit;
        }

        /* Images */
        img,
        picture {
          max-width: 100%;
          display: block;
        }

        /* Form elements inherit font */
        input,
        button,
        textarea,
        select {
          font: inherit;
        }

        /* Button reset */
        button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
      `}
    />
  )
}
