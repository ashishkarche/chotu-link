function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start border-top py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0 text-muted small">
          © {new Date().getFullYear()} <strong>ChotuLink</strong>. All Rights Reserved.
        </p>
        <div>
          <a href="https://twitter.com" className="text-muted me-3">
            <i className="bi bi-twitter fs-5"></i>
          </a>
          <a href="https://facebook.com" className="text-muted me-3">
            <i className="bi bi-facebook fs-5"></i>
          </a>
          <a href="https://linkedin.com" className="text-muted">
            <i className="bi bi-linkedin fs-5"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
