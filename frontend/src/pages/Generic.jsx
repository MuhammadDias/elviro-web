export default function Generic({ title, content }) {
  return (
    <div className="container my-5 py-5 text-center">
      <h1 className="fw-bold text-elviro-blue mb-4">{title}</h1>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <p className="lead text-muted">{content}</p>
          <a href="/" className="btn btn-outline-dark mt-4">
            Kembali ke Home
          </a>
        </div>
      </div>
    </div>
  );
}
