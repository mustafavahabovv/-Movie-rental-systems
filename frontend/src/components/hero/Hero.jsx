import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "./Hero.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {

  const navigate = useNavigate()
  const [index, setIndex] = useState(0);
  const { t } = useTranslation(); // ✨ Burada olmalıdır
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="hero-section">
      <Carousel activeIndex={index} onSelect={handleSelect} fade>

        <Carousel.Item>
          <div
            className="media-wrapper"
            onClick={() => navigate(`/productdetail/67acc58eb6e1b30939755717`)}
          ></div>
          <img
            className="d-block"
            src="https://m.media-amazon.com/images/S/pv-target-images/7be1650e653b5dbd205efaaf66ef245246dff1df4a824a84e2635abc1be9f86c.png"
            alt="First slide"
            style={{
              width: "100%",
            }}
            onClick={() => navigate(`/productdetail/67acc58eb6e1b30939755717`)}
          />
          <Carousel.Caption>
            <h3>{t("discoverSeason")}</h3>
            <p>
              {t("ocallReturn")}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block "
            src="https://musicart.xboxlive.com/7/0c6b5100-0000-0000-0000-000000000002/504/image.jpg"
            alt="Second slide"
            style={{
              width: "100%",
            }}
            onClick={() => navigate(`/productdetail/67b35641dd84935e2b96a495`)}
          />
          <Carousel.Caption>
            <h3>{t("joinMission")}</h3>
            <p>{t("accountantStory")}</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block "
            src="https://m.media-amazon.com/images/S/pv-target-images/46687645eb140609071c198e4c5ff040acb5f1acd6d76fb44babb056c6be06ea.jpg"
            alt="Third slide"
            style={{
              width: "100%",
            }}
            onClick={() => navigate(`/productdetail/67b736ffd7397e80a84b8b23`)}
          />
          <Carousel.Caption>
            <h3>{t("roadLondon")}</h3>
            <p>
              {t("myFault")}
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default Hero;
