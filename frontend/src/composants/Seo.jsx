function Seo({ titre, description }) {
  return (
    <>
      <title>{titre}</title>
      <meta name="description" content={description} />
    </>
  );
}

export default Seo;
