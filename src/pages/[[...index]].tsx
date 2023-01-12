import { type NextPage } from "next";
import Head from "next/head";
import { useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import type { CategoriesEnum } from "../components/SelectCategory";
import { SelectCategory } from "../components/SelectCategory";
import { DialogNewPost } from "../components/DialogNewPost";
import { useRouter } from "next/router";
import { Loader } from "../components/Loader";
import { SignInButton } from "../components/SignInButton";
import { LogOutButton } from "../components/LogOutButton";
import { Post } from "../components/Post";

const Home: NextPage = () => {
  const router = useRouter();
  const session = useSession();
  const query = router.query.index
    ? router.query.index[0]?.toUpperCase() ?? null
    : null;
  const [postsList] = trpc.useQueries((t) => [t.posts.list(query)]);

  function handleSelectChange(v: CategoriesEnum) {
    if (v === "ALL") {
      router.push(`/`);
    } else {
      router.push(`/${v.toLowerCase()}`);
    }
  }

  return (
    <>
      <Head>
        <title>How to web-dev</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex max-w-3xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            How to{" "}
            <span className="bg-gradient-to-r from-purple-700 to-pink-400 bg-clip-text  font-extrabold text-transparent">
              web-dev
            </span>
          </h1>
          <h2 className="text-sm font-extrabold leading-10 tracking-tight text-white sm:text-[1.7rem]">
            Share with other the knowledge you come across
          </h2>
          <div className="flex w-1/2  justify-between sm:w-full">
            <SelectCategory onValueChange={handleSelectChange} />
            {session.data?.user ? (
              <div>
                <DialogNewPost /> <LogOutButton />
              </div>
            ) : (
              <SignInButton />
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-2 ">
            {postsList.data ? (
              postsList.data.length > 0 ? (
                postsList.data.map((i) => <Post key={i.id} post={i} />)
              ) : (
                <EmptyState />
              )
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

function EmptyState() {
  return (
    <div className="item-center flex w-full justify-between rounded-lg border border-gray-800 bg-slate-900 p-4 text-white">
      <div className="w-full text-center">
        <span>There are still no entries for this filter!</span>
      </div>
    </div>
  );
}
