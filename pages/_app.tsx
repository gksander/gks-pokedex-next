import * as React from "react";
import "../styles/globals.css";
import "typeface-kalam";
import { AppProps } from "next/app";
import Link from "next/link";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { Pokeball } from "../components/Pokeball";
import { useRouter } from "next/router";
import { setBackgroundColor } from "../utils/setBackgroundColor";
import Head from "next/head";

const AppWrapper = ({ Component, pageProps, router }: AppProps) => {
  const { asPath } = useRouter();
  const shouldShowHeaderShadow = useShouldShowShadowHeader();
  useResetBgColorIfNecessary();

  return (
    <React.Fragment>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        style={{
          backgroundColor: "var(--background-color, white)",
        }}
        className="min-h-screen transition-colors duration-150"
      >
        <header
          className={classNames(
            "p-2 transition-all duration-150 sticky top-0 z-10",
            shouldShowHeaderShadow && ["shadow"],
          )}
          style={{
            backgroundColor: "var(--background-color, white)",
          }}
        >
          <div className="container max-w-2xl flex flex-row justify-between items-center">
            <Link href="/" passHref>
              <a
                className={classNames(
                  "text-primary-800 rounded border-2 border-transparent hover:border-primary-800 transition-colors duration-150 homeLink",
                  asPath === "/" && "border-primary-800",
                )}
              >
                <motion.div
                  className="flex items-center h-full w-full px-3 py-2 "
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <div className="w-6 mr-2">
                    <motion.div
                      variants={{
                        rest: {
                          rotate: 0,
                        },
                        hover: {
                          rotate: 180,
                        },
                      }}
                    >
                      <Pokeball />
                    </motion.div>
                  </div>
                  <span className="font-bold text-lg">Pokedex</span>
                </motion.div>
              </a>
            </Link>
            <div>
              {LINKS.map((link) => (
                <Link key={link.to} href={link.to} passHref>
                  <a
                    className={classNames(
                      "px-3 py-2 text-primary-800 font-bold rounded transition-colors duration-150 border-2 border-transparent hover:border-primary-800",
                      asPath === link.to && "border-primary-800",
                    )}
                  >
                    {link.title}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </header>
        <main className="py-6 px-2">
          <div className="container max-w-2xl">
            <AnimatePresence exitBeforeEnter>
              <Component {...pageProps} key={router.route} />
            </AnimatePresence>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
};

const LINKS = [
  {
    title: "Search",
    to: "/search",
  },
  {
    title: "Types",
    to: "/types/list",
  },
];

/**
 * Handle header shadow visibility
 */
const useShouldShowShadowHeader = () => {
  const [shouldShow, setShouldShow] = React.useState(false);

  React.useEffect(() => {
    const handler = () => setShouldShow(window.scrollY > 0);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  });

  return shouldShow;
};

/**
 * On path change, reset bg to white on certain pages
 */
const useResetBgColorIfNecessary = () => {
  const { asPath } = useRouter();

  React.useEffect(() => {
    if (
      ["/", "/search"].includes(asPath) ||
      asPath.startsWith("/types") ||
      /\/\d$/.test(asPath)
    ) {
      setBackgroundColor("white");
    }
  }, [asPath]);
};

export default AppWrapper;
