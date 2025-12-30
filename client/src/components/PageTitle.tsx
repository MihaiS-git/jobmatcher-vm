type Props = {
  id: string;
  title: string;
};

const PageTitle = ({id, title}: Props) => {
  return (
    <h1
      id={id}
      className="text-xl font-bold text-blue-600 dark:text-gray-200"
    >
      {title}
    </h1>
  );
};

export default PageTitle;
