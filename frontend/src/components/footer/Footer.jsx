import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  return (
    <div>
      <footer className="text-center text-lg-start bg-dark text-light " style={{ marginTop: "6rem" }}>
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>{t("getConnected")}</span>
          </div>

          <div>
            <a href="https://www.facebook.com/vcemd" target="_blank" className="me-4 text-reset">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/__mv7__/?source=omni_redirect" target="_blank" className="me-4 text-reset">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.linkedin.com/in/user-mustafa-307b37292/" target="_blank" className="me-4 text-reset">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://github.com/mustafavahabovv" target="_blank" className="me-4 text-reset">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </section>

        <section className="">
          <div className="container text-center text-md-start " >
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <i className="fas fa-gem me-3"></i>
                  <a href="/" className="text-uppercase fw-bold text-light">MustFlIX</a>

                </h6>
                <p>
                  {t("buySellDescription")}
                </p>
              </div>

              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">{t("categories")}</h6>
                <div className="row">
                  {/* 1-ci sütun */}
                  <div className="col-6 d-flex flex-column gap-2">
                    <p><a href="/allproduct?category=Romance" className="text-reset">{t("romance")}</a></p>
                    <p><a href="/allproduct?category=Fantasy" className="text-reset">{t("fantasy")}</a></p>
                    <p><a href="/allproduct?category=Horror" className="text-reset">{t("horror")}</a></p>
                    <p><a href="/allproduct?category=Mystery" className="text-reset">{t("mystery")}</a></p>
                  </div>

                  {/* 2-ci sütun */}
                  <div className="col-6 d-flex flex-column gap-2">
                    <p><a href="/allproduct?category=Action" className="text-reset">{t("action")}</a></p>
                    <p><a href="/allproduct?category=Drama" className="text-reset">{t("drama")}</a></p>
                    <p><a href="/allproduct?category=Comedy" className="text-reset">{t("comedy")}</a></p>
                    <p><a href="/allproduct?category=Sport" className="text-reset">{t("sport")}</a></p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">{t("")}Useful links</h6>
                <p>
                  <a href="/allproduct" className="text-reset">
                    {t("exploreMovies")}
                  </a>
                </p>
                <p>
                  <a href="/wishlist" className="text-reset">
                    {t("cineCart")}
                  </a>
                </p>
                <p>
                  <a href="/create" className="text-reset">
                    {t("startWriting")}
                  </a>
                </p>
                <p>
                  <a href="https://editorial.rottentomatoes.com/guide/popular-movies/" target="_blank" className="text-reset">
                    {t("movieRecommendations")}
                  </a>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">{t("contact")}</h6>
                <p>
                  <i className="fas fa-home me-3"></i> {t("address")}
                </p>
                <p>
                  <i className="fas fa-envelope me-3"></i>
                  mustafajv-af107@code.edu.az
                </p>
                <p>
                  <i className="fas fa-phone me-3"></i> + 994 77 590 35 45
                </p>

              </div>
            </div>
          </div>
        </section>

        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          © 2025 Copyright
          <a className="text-reset fw-bold mx-1" href="/">
            all rights reserved.
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
