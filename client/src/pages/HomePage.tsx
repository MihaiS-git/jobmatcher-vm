import { motion } from "framer-motion";
import PageContent from "../components/PageContent";
import { useSEO } from "@/hooks/useSEO";
import SEO from "@/components/SEO";

const HomePage = () => {
  useSEO({
    title: "Job Matcher | The Freelancers Home Page",
    description:
      "Welcome to Job Matcher, your go-to platform for freelance jobs.",
    keywords: "freelance, jobs, job matcher, gigs, remote work",
    url: "https://jobmatcherclient.netlify.app",
  });

  return (
    <>
      <SEO
        title="Job Matcher | Home"
        description="Find freelance jobs and gigs easily."
      />
      <PageContent className="flex flex-col text-center items-center py-24">
        <div className="text-4xl font-extrabold text-center p-4 m-auto text-blue-600 dark:text-gray-300">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Job Matcher
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg font-extralight"
          >
            The Freelancer's Home Page
          </motion.h2>
        </div>
      </PageContent>
    </>
  );
};

export default HomePage;
