function Footer() {
  return (
    <footer className="bg-light text-center text-lg-start border-top py-3 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0 text-muted small">
          © {new Date().getFullYear()} <strong>ChotuLink | Ashish Karche</strong>. All Rights Reserved.
        </p>
        <div>
          <a
            href="https://github.com/ashishkarche/chotu-link"
            target="_blank"
            rel="noreferrer"
            className="text-muted me-3"
          >
            <i className="bi bi-github fs-5"></i>
          </a>

          <a
            href="https://www.linkedin.com/in/ashish-karche-1a422b317/"
            target="_blank"
            rel="noreferrer"
            className="text-muted"
          >
            <i className="bi bi-linkedin fs-5"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
