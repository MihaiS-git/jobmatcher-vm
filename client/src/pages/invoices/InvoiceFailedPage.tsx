import PageContent from "@/components/PageContent";

const InvoiceFailedPage = () => {
  return (
    <PageContent className="pb-16">
      <section
        className="flex flex-col items-center justify-center p-0 pt-4 pb-16 w-full"
        aria-labelledby="invoices-list-heading"
      >
        <h2 className="mt-48 font-bold text-xl text-gray-800 dark:text-gray-200">
          Invoice payment failed!
        </h2>
      </section>
    </PageContent>
  );
};

export default InvoiceFailedPage;
