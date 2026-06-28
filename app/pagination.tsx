export function Pagination({
  dots,
  activeIndex,
  onExited,
}: {
  dots: { id: string; exiting: boolean }[];
  activeIndex: number;
  onExited: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {dots.map((dot, i) => (
        <div
          key={dot.id}
          className={dot.exiting ? "dot-exit" : "dot-enter"}
          onAnimationEnd={() => {
            if (dot.exiting) onExited(dot.id);
          }}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor:
              !dot.exiting && i === activeIndex ? "black" : "rgba(0,0,0,0.3)",
            transition: "background-color 300ms",
          }}
        />
      ))}
    </div>
  );
}
