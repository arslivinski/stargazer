import { Badge } from '@mantine/core';

interface VisibilityProps {
  visibility?: string;
}

function Visibility(props: VisibilityProps): JSX.Element {
  const { visibility } = props;

  if (visibility == null) {
    return <></>;
  }

  return (
    <Badge variant="dot" color={visibility === 'public' ? 'green' : 'red'}>
      {visibility}
    </Badge>
  );
}

export { Visibility };
