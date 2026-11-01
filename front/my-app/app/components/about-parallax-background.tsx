type AboutParallaxBackgroundProps = {
  src: string;
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export default function AboutParallaxBackground({
  src,
  alt,
  caption,
  hotspot,
}: AboutParallaxBackgroundProps) {
  const backgroundPosition = hotspot
    ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
    : "center";

  return (
    <>
      <div className="about-section__bg">
        <div
          className="about-section__bg-image"
          role={alt ? "img" : undefined}
          aria-label={alt}
          aria-hidden={alt ? undefined : true}
          style={{
            backgroundImage: `url("${src}")`,
            backgroundPosition,
          }}
        />
      </div>
      {caption ? <p className="about-section__caption">{caption}</p> : null}
    </>
  );
}
