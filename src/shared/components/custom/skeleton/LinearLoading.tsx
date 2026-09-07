import "./LinearLoading.css";

export type LinearLoadingProps = React.ComponentProps<"div">;

function LinearLoading(props: LinearLoadingProps) {
  return (
    <div {...props}>
      <div className="loader-line before:bg-(--primary)"></div>
    </div>
  );
}

export default LinearLoading;
