import { GetServerSideProps } from "next";
import * as React from "react";
import Head from "next/head";
import Link from "next/link";

interface Props {
  data: string;
}

const Slug = ({ data }: Props) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300 h-screen flex flex-col justify-center items-center">
      <Head>
        <title>404 - Not found</title>
        <meta name="description" content="Whoops! The item was not found" />
      </Head>

      <p className="text-4xl">{data}</p>
      <Link href="/">
        <a className="mt-8 p-2 px-4 bg-gray-600 text-white rounded-md">Return to home</a>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = encodeURIComponent(ctx.query.slug as string);
  const url = `${process.env.NEXT_PUBLIC_PROD_URL}/api/${slug}`;

  const res = await fetch(url).then((r) => r.json());

  // url was found
  if (res.status === "success") {
    ctx.res.setHeader("location", res.doc.url);
    ctx.res.statusCode = 301;
    ctx.res.end();
  }

  return {
    props: {
      data: res?.status === "error" ? res.error : res,
    },
  };
};

export default Slug;
