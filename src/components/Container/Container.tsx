interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function Container(props: ContainerProps): JSX.Element {
  const { children, style, ...otherProps } = props;
  return (
    <div
      style={{
        margin: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        ...style,
      }}
      {...otherProps}
    >
      {children}
    </div>
  );
}

export { Container };
