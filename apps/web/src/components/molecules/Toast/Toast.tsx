import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { clearToast } from "../../../reducers/toast/toastSlice";
import "./Toast.scss";

const TOAST_DURATION_MS = 3500;

const Toast: React.FC = () => {
  const toast = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div
      className={`m-toast m-toast--${toast.variant}`}
      role="status"
      aria-live="polite"
    >
      <p className="m-toast__message">{toast.message}</p>
    </div>
  );
};

export default Toast;
