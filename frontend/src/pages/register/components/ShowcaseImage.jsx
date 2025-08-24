import React from "react";
import { Carousel } from "antd";
import showcase1 from "@/assets/img/showcase1.jpg";
import showcase2 from "@/assets/img/showcase2.jpg";
import showcase3 from "@/assets/img/showcase3.jpg";
import showcase4 from "@/assets/img/showcase4.jpg";
import styles from "../index.module.less";
const ShowcaseImage = () => {
  const images = [showcase1, showcase2, showcase3, showcase4];

  return (
    <div className={styles.showcase_imgs}>
      <Carousel autoplay>
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`slide-${index}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ShowcaseImage;
