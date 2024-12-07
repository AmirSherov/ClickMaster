import style from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={style["loading-container"]}>
      <div className={style["loading-animation"]}>
        <div className={style["ring"]}></div>
        <div className={style["ring"]}></div>
        <div className={style["ring"]}></div>
        <span className={style["loading-text"]}>Loading...</span>
      </div>
    </div>
  );
}
