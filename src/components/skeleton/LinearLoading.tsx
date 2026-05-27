import "./LinearLoading.css";

export type LinearLoadingProps = React.HTMLAttributes<HTMLDivElement>;

function LinearLoading(props: LinearLoadingProps) {
  return (
    <div {...props}>
      <div className="loader-line before:bg-(--primary)"></div>
    </div>
  );
}

export default LinearLoading;
