import { Badge } from '@mantine/core';

interface TopicsProps {
  topics?: string[];
}

function Topics(props: TopicsProps): JSX.Element {
  const { topics } = props;

  if (!Array.isArray(topics)) {
    return <></>;
  }

  return (
    <>
      {topics.map((topic) => (
        <Badge key={topic}>{topic}</Badge>
      ))}
    </>
  );
}

export { Topics };
