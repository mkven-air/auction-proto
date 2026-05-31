import { T } from "../theme";

export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        border: "none",
        padding: 0,
        cursor: "pointer",
        flexShrink: 0,
        background: checked ? T.brandPrimary : T.borderDefault,
        position: "relative",
        transition: "background .2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 17 : 3,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: checked ? T.textPrimary : T.neutralText,
          transition: "left .2s",
        }}
      />
    </button>
  );
}
