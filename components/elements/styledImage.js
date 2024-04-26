export default function StyledImage({ src, alt, border }) {
  const style = {
    border: border,
  };

  return <img src={src} alt={alt} style={style} />;
}
