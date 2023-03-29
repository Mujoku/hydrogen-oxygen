import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import tailwind from './styles/tailwind-build.css';
import favicon from '../public/favicon.svg';
import {Layout} from './components/Layout';

export const links = () => {
  return [
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context}) {
  const layout = await context.storefront.query(LAYOUT_QUERY);
  const menuLinks = await context.storefront.query(COLLECTIONS_QUERY);
  const headerAsideText = await context.storefront.query(HEADER_ASIDE_QUERY);
  return {layout, menuLinks, headerAsideText};
}

export default function App() {
  const data = useLoaderData();
  const {name} = data.layout.shop;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout title={name} logo={data.layout.shop.brand.logo.image}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
      brand {
        logo {
          image {
            id
            url
            altText
            width
            height
            __typename
            altText
        }
      }
      }
    }
  }
`;
const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
        metafield(namespace: "custom", key: "main_category") {
          value
        }
      }
    }
  }
`;

const HEADER_ASIDE_QUERY = `#graphql
  query headerAsideText {
	page(id:"gid://shopify/Page/113679335761"){
  	id
  	metafield(namespace:"custom",key:"top_header_aside"){
      value
    }
  }
}`;
